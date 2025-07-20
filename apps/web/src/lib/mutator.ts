import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom axios mutator function for the Orval-generated API client
 * This function is used by the auto-generated API client to make requests
 * It automatically adds the auth token to requests and handles errors
 */
export const mutator = async <T>(
  config: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    data?: unknown;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
  },
  options?: {
    headers?: Record<string, string>;
  }
): Promise<T> => {
  const token = useAuthStore.getState().token;
  
  const headers = {
    ...(config.headers || {}),
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(config.url, {
    method: config.method,
    headers,
    body: config.data ? JSON.stringify(config.data) : undefined,
    signal: config.signal
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - clear auth state and redirect to login
    if (response.status === 401) {
      useAuthStore.getState().logout();
      // In a real app, you might want to redirect to login here
    }
    
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as T;
};