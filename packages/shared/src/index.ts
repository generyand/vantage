// Shared types and utilities for Vantage applications

// Re-export auto-generated types (organized by tags)
// This will be available after running: pnpm generate-types
export * from './generated';

// Manual shared constants and utilities
export const API_ENDPOINTS = {
  // System endpoints
  ROOT: '/',
  HEALTH: '/health',
  HELLO: '/api/hello',
  
  // User endpoints
  USER_ME: '/api/users/me',
  
  // Auth endpoints
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  
  // Project endpoints
  PROJECTS: '/api/projects',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

// Utility function for API calls
export const createApiUrl = (endpoint: string, baseUrl: string = 'http://localhost:8000') => {
  return `${baseUrl}${endpoint}`;
}; 