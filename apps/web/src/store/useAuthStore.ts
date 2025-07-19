// 🔐 Authentication store using Zustand
// Manages user authentication state, token, and user information

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@vantage/shared/src/generated/schemas';
import type { AuthToken } from '@vantage/shared/src/generated/schemas';

// Define the shape of our auth store
interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  token: string | null;
  tokenExpiry: number | null;
  
  // User information
  user: User | null;
  
  // Actions
  setAuth: (token: AuthToken, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      tokenExpiry: null,
      user: null,
      
      // Set authentication data after successful login
      setAuth: (token: AuthToken, user: User) => set({
        isAuthenticated: true,
        token: token.access_token,
        tokenExpiry: Date.now() + (token.expires_in * 1000), // Convert seconds to milliseconds
        user,
      }),
      
      // Clear authentication data on logout
      clearAuth: () => set({
        isAuthenticated: false,
        token: null,
        tokenExpiry: null,
        user: null,
      }),
      
      // Update user information (e.g., after profile update)
      updateUser: (updatedUser: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
    }),
    {
      name: 'vantage-auth-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

// Helper function to check if the token is expired
export const isTokenExpired = (): boolean => {
  const tokenExpiry = useAuthStore.getState().tokenExpiry;
  if (!tokenExpiry) return true;
  
  // Return true if current time is past expiry time
  return Date.now() > tokenExpiry;
};

// Helper function to get the auth token with expiry check
export const getAuthToken = (): string | null => {
  const { token } = useAuthStore.getState();
  
  // Return null if token is expired or doesn't exist
  if (!token || isTokenExpired()) {
    return null;
  }
  
  return token;
};