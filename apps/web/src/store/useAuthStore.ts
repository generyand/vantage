import { create } from 'zustand';
import { User } from '@vantage/shared';

/**
 * Authentication state interface for the global auth store
 */
interface AuthState {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** JWT access token or null if not authenticated */
  token: string | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Whether the user must change their password on next login */
  mustChangePassword: boolean;
  /** Set the current user and mark as authenticated */
  setUser: (user: User) => void;
  /** Set the JWT access token */
  setToken: (token: string) => void;
  /** Set the must change password flag */
  setMustChangePassword: (mustChange: boolean) => void;
  /** Clear all authentication data and mark as not authenticated */
  logout: () => void;
  /** Initialize auth state from stored data (for persistence) */
  initialize: (user: User | null, token: string | null) => void;
}

/**
 * Set auth token in cookies for middleware access
 */
const setAuthCookie = (token: string | null) => {
  if (typeof window === 'undefined') return; // Server-side check
  
  if (token) {
    // Set cookie with token (expires in 7 days)
    document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  } else {
    // Remove cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

/**
 * Zustand store for managing global authentication state
 * 
 * This store holds the current user, JWT token, and authentication status.
 * It provides actions for login, logout, and managing the forced password change flow.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  mustChangePassword: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: true,
    mustChangePassword: user.must_change_password 
  }),

  setToken: (token) => {
    // Set cookie for middleware access
    setAuthCookie(token);
    set({ token });
  },

  setMustChangePassword: (mustChange) => set({ mustChangePassword: mustChange }),

  logout: () => {
    // Clear cookie
    setAuthCookie(null);
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      mustChangePassword: false 
    });
  },

  initialize: (user, token) => {
    // Set cookie if token exists
    setAuthCookie(token);
    set({
      user,
      token,
      isAuthenticated: !!user && !!token,
      mustChangePassword: user?.must_change_password || false
    });
  },
})); 