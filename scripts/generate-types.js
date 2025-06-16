#!/usr/bin/env node

import { generate } from 'openapi-typescript-codegen';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8000/openapi.json';
const OUTPUT_DIR = 'packages/shared/src/generated';

console.log('🔄 Generating TypeScript types from FastAPI with tag-based splitting...');

try {
  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('📡 Fetching OpenAPI schema from:', API_URL);
  
  // Generate types with modular structure
  await generate({
    input: API_URL,
    output: OUTPUT_DIR,
    httpClient: 'fetch',
    clientName: 'ApiClient',
    useOptions: true,
    useUnionTypes: true,
    exportCore: true,
    exportSchemas: true,
    exportModels: true,
    exportServices: true,
  });
  
  // Create barrel export files for models and services
  const modelsDir = path.join(OUTPUT_DIR, 'models');
  const servicesDir = path.join(OUTPUT_DIR, 'services');
  
  // Create models index
  if (fs.existsSync(modelsDir)) {
    const modelFiles = fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => file.replace('.ts', ''));
    
    const modelsIndex = `// Auto-generated model exports
${modelFiles.map(file => `export * from './${file}';`).join('\n')}`;
    
    fs.writeFileSync(path.join(modelsDir, 'index.ts'), modelsIndex);
  }
  
  // Create services index
  if (fs.existsSync(servicesDir)) {
    const serviceFiles = fs.readdirSync(servicesDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => file.replace('.ts', ''));
    
    const servicesIndex = `// Auto-generated service exports
${serviceFiles.map(file => `export * from './${file}';`).join('\n')}`;
    
    fs.writeFileSync(path.join(servicesDir, 'index.ts'), servicesIndex);
  }

  // Create main barrel export file
  const indexContent = `// Auto-generated API types - organized by tags
// Do not edit manually - regenerate with: pnpm generate-types

export * from './models';
export * from './services';
export * from './core/ApiError';
export * from './core/CancelablePromise';
export { ApiClient } from './ApiClient';

// Re-export specific types for convenience
export type {
  User,
  ApiResponse,
  HealthCheck,
  AuthToken,
  LoginRequest,
  Project,
  ProjectCreate,
  ProjectList,
} from './models';
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  
  console.log('✅ Types generated successfully with tag-based organization!');
  console.log(`📁 Generated files saved to: ${OUTPUT_DIR}`);
  console.log('📋 Structure:');
  console.log('  - models/     → Data models organized by tags');
  console.log('  - services/   → API services organized by tags'); 
  console.log('  - core/       → Core utilities and types');
  console.log('  - index.ts    → Barrel export file');
  
} catch (error) {
  console.error('❌ Error generating types:');
  console.error(error.message);
  console.error('\nMake sure the FastAPI server is running on http://localhost:8000');
  console.error('Run: pnpm dev:api');
  process.exit(1);
} 