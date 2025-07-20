// API utilities for file uploads and other operations
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand store persists there)
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.warn('Failed to parse auth data from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth-storage');
      // Redirect to login (only in browser)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Mutator function for Orval-generated API client
 * This is the main function that handles all API requests
 */
export const mutator = async <T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    // Re-throw the error for React Query to handle
    throw error;
  }
};

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadWithProgressOptions {
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

export async function uploadWithProgress(
  url: string,
  file: File,
  options: UploadWithProgressOptions = {}
): Promise<Response> {
  const { onProgress, signal } = options;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Handle progress updates
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100)
        };
        onProgress(progress);
      }
    });
    
    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText
        }));
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    });
    
    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });
    
    // Handle abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });
    
    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Send the request
    xhr.open('POST', url);
    xhr.send(formData);
  });
}

// Additional API utilities can be added here
export const apiClient = {
  uploadWithProgress,
  
  // Base fetch wrapper
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response;
  },
  
  // GET request
  async get<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, { ...options, method: 'GET' });
    return response.json();
  },
  
  // POST request
  async post<T = unknown>(url: string, data: unknown, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // PUT request
  async put<T = unknown>(url: string, data: unknown, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // DELETE request
  async delete<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, { ...options, method: 'DELETE' });
    return response.json();
  },
}; 