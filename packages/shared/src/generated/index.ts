// 🚀 Auto-generated API types and hooks by Orval (Tag-Split Mode)
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
