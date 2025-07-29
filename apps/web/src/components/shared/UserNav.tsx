// 🚀 Modern component using auto-generated React Query hooks
"use client";

import { usePostAuthLogout } from "@vantage/shared";
import { useAuthStore } from "@/store/useAuthStore";
import { User, LogOut, Loader2 } from "lucide-react";

/**
 * User navigation component with logout functionality
 *
 * Displays current user information and provides logout functionality.
 * Uses the Zustand auth store for user data and the auto-generated
 * usePostAuthLogout hook for logout operations.
 */
export default function UserNav() {
  // Get user data and logout function from auth store
  const { user, logout } = useAuthStore();

  // Debug: Log the user data
  console.log("UserNav - User data:", user);

  // Auto-generated logout mutation hook
  const logoutMutation = usePostAuthLogout({
    mutation: {
      onSuccess: () => {
        console.log("Logout successful");
        // Clear auth store and force page reload to clear all state
        logout();
        // Force a page reload to clear any in-memory state
        window.location.href = '/login';
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Even if logout fails on server, clear local auth state
        logout();
        // Force a page reload to clear any in-memory state
        window.location.href = '/login';
      },
    },
  });

  const handleLogout = () => {
    // Trigger the logout mutation
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">No user data</p>
            <p className="text-xs text-gray-500">Please log in</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* User Info Section */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#dc2626] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{user.name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            <div className="mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-2 py-2">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#b91c1c] hover:bg-red-50 rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group border border-gray-100 hover:border-red-100"
        >
          {logoutMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#b91c1c]" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2 text-gray-500 group-hover:text-[#b91c1c] transition-colors duration-200" />
              Sign out
            </>
          )}
        </button>
      </div>
    </>
  );
}
