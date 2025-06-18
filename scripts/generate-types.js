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
  
  // Create main barrel export file for tag-split organized code
  const indexContent = `// 🚀 Auto-generated API types and hooks by Orval (Tag-Split Mode)
// 🔄 Do not edit manually - regenerate with: pnpm generate-types
// 📁 Organized by FastAPI tags for maximum maintainability
// 
// 🎯 Professional API client structure:
// - endpoints/auth/     → Authentication hooks (useLogin, useLogout)
// - endpoints/projects/ → Project management hooks (useGetProjects, useCreateProject)
// - endpoints/system/   → System hooks (useGetRoot, useGetHealthCheck, useGetHello)
// - endpoints/users/    → User hooks (useGetCurrentUser)
// - schemas/           → All TypeScript types organized by schema

// 📦 Export all endpoint hooks organized by feature
export * from './endpoints/auth/auth';
export * from './endpoints/projects/projects';
export * from './endpoints/system/system';
export * from './endpoints/users/users';

// 📝 Export all TypeScript types
export * from './schemas';

// 🔄 Common re-exports for convenience
export type {
  // User & Auth types
  User,
  AuthToken,
  LoginRequest,
  
  // Project types  
  Project,
  ProjectCreate,
  ProjectList,
  
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