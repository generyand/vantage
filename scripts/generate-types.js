#!/usr/bin/env node

import { generate } from 'orval';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8000/openapi.json';
const OUTPUT_DIR = 'packages/shared/src/generated';

console.log('🚀 Generating TypeScript types with Orval + React Query...');

try {
  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('📡 Fetching OpenAPI schema from:', API_URL);
  
  // Generate types with Orval
  await generate('orval.config.ts');
  
  // Create main barrel export file for Orval-generated code
  const generatedFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts' && file !== 'custom-client.ts')
    .map(file => file.replace('.ts', ''));

  const indexContent = `// 🚀 Auto-generated API types and hooks by Orval
// 🔄 Do not edit manually - regenerate with: pnpm generate-types
// 📚 Includes React Query hooks for all endpoints

// Export all generated types and hooks
${generatedFiles.map(file => `export * from './${file}';`).join('\n')}

// Export custom client utilities
export * from './custom-client';

// Common type re-exports for convenience
// Note: Update these based on your actual generated types
export type {
  ApiError,
  CustomApiError,
} from './custom-client';
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  
  console.log('✅ Types and React Query hooks generated successfully!');
  console.log(`📁 Generated files saved to: ${OUTPUT_DIR}`);
  console.log('📋 New features:');
  console.log('  - 🪝 Auto-generated React Query hooks');
  console.log('  - 🔧 Custom HTTP client with auth & error handling'); 
  console.log('  - 📦 Smaller bundle size with better tree-shaking');
  console.log('  - 🎯 Type-safe API calls with automatic caching');
  
} catch (error) {
  console.error('❌ Error generating types:');
  console.error(error.message);
  console.error('\nMake sure the FastAPI server is running on http://localhost:8000');
  console.error('Run: pnpm dev:api');
  process.exit(1);
} 