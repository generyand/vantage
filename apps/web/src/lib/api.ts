// API utilities for file uploads and other operations
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token directly from Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Don't redirect if we're already on the login page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        // Clear auth data using the store
        useAuthStore.getState().logout();
        // Redirect to login
        window.location.href = "/login";
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
  config: AxiosRequestConfig<D>,
  options?: AxiosRequestConfig<D>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      ...config,
      ...options,
    });
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
): Promise<{ url: string; name: string; size: number }> {
  const { onProgress, signal } = options;

  // For now, simulate file upload since we don't have storage service configured
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress({
          loaded: progress,
          total: 100,
          percentage: progress,
        });
      }
      if (progress >= 100) {
        clearInterval(interval);
        // Return mock file data
        resolve({
          url: URL.createObjectURL(file), // Create temporary URL for demo
          name: file.name,
          size: file.size,
        });
      }
    }, 200);

    // Handle abort signal
    if (signal) {
      signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    }
  });
}

/**
 * Decode a JWT token (without verification) to extract the payload.
 * Used for server-side role checks in Next.js server components.
 */
export function decodeJwtPayload(
  token: string
): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // Use atob if available (browser/edge), otherwise Buffer (Node.js)
    let decoded: string;
    if (typeof atob === "function") {
      decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    } else {
      // Node.js polyfill
      decoded = Buffer.from(payload, "base64").toString("utf-8");
    }
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Additional API utilities can be added here
export const apiClient = {
  uploadWithProgress,

  // Base fetch wrapper
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response;
  },

  // GET request
  async get<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, { ...options, method: "GET" });
    return response.json();
  },

  // POST request
  async post<T = unknown>(
    url: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // PUT request
  async put<T = unknown>(
    url: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // DELETE request
  async delete<T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.fetch(url, { ...options, method: "DELETE" });
    return response.json();
  },
};
