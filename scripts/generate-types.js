#!/usr/bin/env node

import { generate } from 'orval';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8000/openapi.json';
const OUTPUT_DIR = 'packages/shared/src/generated';
const SCHEMAS_DIR = path.join(OUTPUT_DIR, 'schemas');

console.log('🚀 Generating TypeScript types with Orval + React Query...');

async function fetchOpenAPISpec() {
  console.log('📡 Fetching OpenAPI spec to extract tags...');
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const spec = await response.json();
    return spec;
  } catch (error) {
    console.warn('⚠️  Could not fetch OpenAPI spec for tag extraction:', error.message);
    console.log('🔄 Falling back to auto-detection...');
    return null;
  }
}

function extractTagsFromOpenAPI(openAPISpec) {
  if (!openAPISpec) return null;
  
  console.log('🏷️  Extracting FastAPI tags from OpenAPI spec...');
  
  // Get tags defined in the spec
  const definedTags = openAPISpec.tags?.map(tag => ({
    name: tag.name.toLowerCase(),
    description: tag.description,
    originalName: tag.name
  })) || [];
  
  // Also scan paths to find any tags used in operations
  const usedTags = new Set();
  Object.values(openAPISpec.paths || {}).forEach(pathItem => {
    Object.values(pathItem).forEach(operation => {
      if (operation.tags) {
        operation.tags.forEach(tag => usedTags.add(tag.toLowerCase()));
      }
    });
  });
  
  // Combine defined and used tags
  const allTags = [...new Set([
    ...definedTags.map(t => t.name),
    ...Array.from(usedTags)
  ])];
  
  console.log(`📊 Found FastAPI tags: ${allTags.join(', ')}`);
  
  return {
    tags: allTags,
    tagDetails: definedTags
  };
}

function mapSchemasToTags(schemaNames, tagInfo) {
  if (!tagInfo) {
    console.log('🔄 No tag info available, using smart auto-detection...');
    return autoDetectGroups(schemaNames);
  }
  
  const { tags } = tagInfo;
  const groups = {};
  const processed = new Set();
  
  console.log('🎯 Mapping schemas to FastAPI tags...');
  
  // Map schemas to tags based on naming patterns
  tags.forEach(tag => {
    const tagSchemas = schemaNames.filter(schemaName => {
      // Check if schema name contains the tag name
      const schemaLower = schemaName.toLowerCase();
      const tagLower = tag.toLowerCase();
      
      // Handle plural/singular variations (projects <-> project)
      const tagSingular = tagLower.endsWith('s') ? tagLower.slice(0, -1) : tagLower;
      const tagPlural = tagLower.endsWith('s') ? tagLower : tagLower + 's';
      
      // Direct match, contains, starts with, or base name match (with plural/singular)
      return schemaLower.includes(tagLower) || 
             schemaLower.includes(tagSingular) ||
             schemaLower.includes(tagPlural) ||
             extractBaseName(schemaName).toLowerCase() === tagLower ||
             extractBaseName(schemaName).toLowerCase() === tagSingular ||
             schemaLower.startsWith(tagLower) ||
             schemaLower.startsWith(tagSingular);
    });
    
    if (tagSchemas.length > 0) {
      groups[tag] = tagSchemas;
      tagSchemas.forEach(schema => processed.add(schema));
      console.log(`  📁 ${tag}: ${tagSchemas.join(', ')}`);
    }
  });
  
  // Handle unmatched schemas
  const unmatched = schemaNames.filter(name => !processed.has(name));
  if (unmatched.length > 0) {
    // Try to group unmatched schemas by base name
    const unmatchedGroups = autoDetectGroups(unmatched);
    
    // Merge groups with the same name instead of overwriting
    Object.entries(unmatchedGroups).forEach(([groupName, schemas]) => {
      if (groups[groupName]) {
        // Merge with existing group
        groups[groupName] = [...groups[groupName], ...schemas];
      } else {
        // Create new group
        groups[groupName] = schemas;
      }
    });
    
    console.log('📦 Auto-grouped unmatched schemas:');
    Object.entries(unmatchedGroups).forEach(([group, schemas]) => {
      console.log(`  📁 ${group}: ${schemas.join(', ')}`);
    });
  }
  
  return groups;
}

function autoDetectGroups(schemaNames) {
  const groups = {};
  const processed = new Set();
  
  // Step 1: Group by exact base name matches
  schemaNames.forEach(schemaName => {
    if (processed.has(schemaName)) return;
    
    // Extract the base name (remove common suffixes)
    const baseName = extractBaseName(schemaName);
    
    // Find all schemas that share this base name
    const relatedSchemas = schemaNames.filter(name => {
      const nameBase = extractBaseName(name);
      return nameBase.toLowerCase() === baseName.toLowerCase() && !processed.has(name);
    });
    
    if (relatedSchemas.length > 1) {
      // Use the base name as group key (lowercase)
      const groupKey = baseName.toLowerCase();
      groups[groupKey] = relatedSchemas;
      relatedSchemas.forEach(name => processed.add(name));
    }
  });
  
  // Step 2: Group remaining schemas by common patterns
  const commonPatterns = {
    auth: ['Auth', 'Token', 'Login', 'Logout', 'Credential'],
    system: ['Health', 'Api', 'Response', 'Meta', 'Config'],
    error: ['Error', 'Validation', 'Exception', 'HTTP'],
  };
  
  schemaNames.forEach(schemaName => {
    if (processed.has(schemaName)) return;
    
    for (const [domain, patterns] of Object.entries(commonPatterns)) {
      const matches = patterns.some(pattern => 
        schemaName.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (matches) {
        if (!groups[domain]) groups[domain] = [];
        groups[domain].push(schemaName);
        processed.add(schemaName);
        break;
      }
    }
  });
  
  // Step 3: Put remaining schemas in a 'common' group
  const remaining = schemaNames.filter(name => !processed.has(name));
  if (remaining.length > 0) {
    groups.common = remaining;
  }
  
  return groups;
}

function extractBaseName(schemaName) {
  // Remove common suffixes to find the base entity name
  const suffixes = [
    'Create', 'Update', 'Delete', 'List', 'Response', 'Request', 
    'Input', 'Output', 'Data', 'Info', 'Details', 'Summary',
    'Description', 'Meta', 'Params', 'Query', 'Body'
  ];
  
  let baseName = schemaName;
  
  // Try to remove suffixes to find the core entity name
  for (const suffix of suffixes) {
    if (baseName.endsWith(suffix) && baseName !== suffix) {
      const withoutSuffix = baseName.slice(0, -suffix.length);
      // Only use it if we still have a meaningful name
      if (withoutSuffix.length > 0) {
        baseName = withoutSuffix;
        break;
      }
    }
  }
  
  return baseName;
}

async function analyzeSchemaRelationships() {
  console.log('🔍 Analyzing schemas with FastAPI tag information...');
  
  // Fetch OpenAPI spec to get tag information
  const openAPISpec = await fetchOpenAPISpec();
  const tagInfo = extractTagsFromOpenAPI(openAPISpec);
  
  // Read all generated schema files
  const schemaFiles = fs.readdirSync(SCHEMAS_DIR)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  const allSchemas = {};
  
  // Read content of each schema file and extract info
  schemaFiles.forEach(file => {
    const filePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const schemaName = path.basename(file, '.ts');
    
    // Convert filename back to PascalCase for matching
    const pascalCaseName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1);
    
    // Extract imports to understand relationships
    const imports = [];
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('import type {') && line.includes('./')) {
        const importMatch = line.match(/import type { (.+) } from '\.\/(.+)'/);
        if (importMatch) {
          imports.push(importMatch[1]);
        }
      }
    });
    
    allSchemas[pascalCaseName] = {
      content,
      fileName: file,
      filePath,
      imports,
      originalName: schemaName
    };
  });
  
  // Map schemas to FastAPI tags or auto-detect groups
  const detectedGroups = mapSchemasToTags(Object.keys(allSchemas), tagInfo);
  
  return { allSchemas, groups: detectedGroups, tagInfo };
}

function groupSchemas() {
  console.log('📦 Grouping schemas by FastAPI tags...');
  
  return analyzeSchemaRelationships().then(({ allSchemas, groups, tagInfo }) => {
    // Create grouped files
    Object.entries(groups).forEach(([groupName, schemaNames]) => {
      const groupSchemas = schemaNames.filter(name => allSchemas[name]);
      
      if (groupSchemas.length === 0) return;
      
      console.log(`  📄 Creating ${groupName}.ts with ${groupSchemas.length} types`);
      
      // Build grouped file content
      let groupedContent = `// 🚀 Auto-generated by Orval (Grouped by FastAPI Tags)
// 🔄 Do not edit manually - regenerate with: pnpm generate-types
// 📁 ${groupName.charAt(0).toUpperCase() + groupName.slice(1)}-related types
// 🏷️  Based on FastAPI tag: "${groupName}"

`;
      
      // Collect all imports needed
      const imports = new Set();
      const typeDefinitions = [];
      
      groupSchemas.forEach(schemaName => {
        const schema = allSchemas[schemaName];
        const lines = schema.content.split('\n');
        
        // Extract imports
        lines.forEach(line => {
          if (line.startsWith('import type {') && line.includes('./')) {
            const importMatch = line.match(/import type { (.+) } from '\.\/(.+)'/);
            if (importMatch) {
              const [, importedType, importFile] = importMatch;
              // Only add imports for types not in current group
              if (!groupSchemas.includes(importedType)) {
                imports.add(`import type { ${importedType} } from './${importFile}';`);
              }
            }
          }
        });
        
        // Extract type definition (skip header comments and imports)
        const definitionStart = lines.findIndex(line => 
          line.includes('export interface') || line.includes('export type')
        );
        
        if (definitionStart !== -1) {
          const definition = lines.slice(definitionStart).join('\n');
          typeDefinitions.push(`/**
 * ${schemaName}
 */
${definition}`);
        }
      });
      
      // Add imports if any
      if (imports.size > 0) {
        groupedContent += Array.from(imports).join('\n') + '\n\n';
      }
      
      // Add all type definitions
      groupedContent += typeDefinitions.join('\n\n');
      
      // Write grouped file
      const groupedFilePath = path.join(SCHEMAS_DIR, `${groupName}.ts`);
      fs.writeFileSync(groupedFilePath, groupedContent);
      
      // Remove individual files that were grouped
      groupSchemas.forEach(schemaName => {
        const schema = allSchemas[schemaName];
        if (fs.existsSync(schema.filePath)) {
          fs.unlinkSync(schema.filePath);
        }
      });
    });
    
    // Update index.ts to export grouped files
    const groupNames = Object.keys(groups);
    const tagSource = tagInfo ? 'FastAPI tags' : 'auto-detection';
    
    const newIndexContent = `// 🚀 Auto-generated by Orval (Grouped by ${tagSource})
// 🔄 Do not edit manually - regenerate with: pnpm generate-types
// 📁 Organized by FastAPI tags for maximum maintainability
// 🏷️  Groups: ${groupNames.join(', ')}

// Export all grouped schemas
${groupNames.map(group => `export * from './${group}';`).join('\n')}
`;
    
    fs.writeFileSync(path.join(SCHEMAS_DIR, 'index.ts'), newIndexContent);
    
    console.log('✅ Schema grouping completed!');
    console.log(`📁 Created ${groupNames.length} schema groups: ${groupNames.join(', ')}`);
    console.log(`🏷️  Source: ${tagSource}`);
  });
}

try {
  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('📡 Fetching OpenAPI schema from:', API_URL);
  
  // Generate types with Orval
  await generate('orval.config.ts');
  
  // Group related schemas by FastAPI tags
  await groupSchemas();
  
  // Create main barrel export file for tag-split organized code
  const indexContent = `// 🚀 Auto-generated API types and hooks by Orval (Tag-Split Mode)
// 🔄 Do not edit manually - regenerate with: pnpm generate-types
// 📁 Organized by FastAPI tags for maximum maintainability
// 
// 🎯 Professional API client structure:
// - endpoints/{tag}/     → Hooks organized by FastAPI tags
// - schemas/            → Types grouped by FastAPI tags

// 📦 Export all endpoint hooks organized by FastAPI tags
export * from './endpoints/auth/auth';
export * from './endpoints/system/system';
export * from './endpoints/users/users';

// 📝 Export all TypeScript types (grouped by FastAPI tags)
export * from './schemas';

// 🔄 Common re-exports for convenience  
export type {
  // User & Auth types
  User,
  AuthToken,
  LoginRequest,
  
  // System types
  ApiResponse,
  HealthCheck,
  
  // Error types
  HTTPValidationError,
} from './schemas';
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  
  console.log('✅ Types and React Query hooks generated successfully!');
  console.log(`📁 Generated files saved to: ${OUTPUT_DIR}`);
  console.log('📋 New features:');
  console.log('  - 🪝 Auto-generated React Query hooks');
  console.log('  - 🏷️  Schema grouping based on FastAPI tags');
  console.log('  - 🎯 Type-safe API calls with automatic caching');
  console.log('  - 🔧 Zero manual configuration - follows your API structure');
  
} catch (error) {
  console.error('❌ Error generating types:');
  console.error(error.message);
  console.error('\nMake sure the FastAPI server is running on http://localhost:8000');
  console.error('Run: pnpm dev:api');
  process.exit(1);
} 