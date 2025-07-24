// 🚀 Auto-generated API types and hooks by Orval (Tag-Split Mode)
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
