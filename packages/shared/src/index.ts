// Shared types and utilities for Vantage applications

export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  status: 'success' | 'error';
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
  HELLO: '/api/hello',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]; 