// 🚀 Modern component using auto-generated React Query hooks
'use client';

import { useRouter } from 'next/navigation';
import { usePostAuthLogout } from '@vantage/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * User navigation component with logout functionality
 * 
 * Displays current user information and provides logout functionality.
 * Uses the Zustand auth store for user data and the auto-generated
 * usePostAuthLogout hook for logout operations.
 */
export default function UserNav() {
  const router = useRouter();
  
  // Get user data and logout function from auth store
  const { user, logout } = useAuthStore();
  
  // Debug: Log the user data
  console.log('UserNav - User data:', user);

  // Auto-generated logout mutation hook
  const logoutMutation = usePostAuthLogout({
    mutation: {
      onSuccess: () => {
        console.log('Logout successful');
        // Clear auth store (this will also clear cookies)
        logout();
        // Redirect to login page
        router.push('/login');
      },
      onError: (error) => {
        console.error('Logout failed:', error);
        // Even if logout fails on server, clear local auth state
        logout();
        router.push('/login');
      }
    }
  });

  const handleLogout = () => {
    // Trigger the logout mutation
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="py-2">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">No user data</p>
              <p className="text-xs text-gray-500">Please log in</p>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="px-2 py-1">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Role: {user.role}
            </p>
            <p className="text-sm text-gray-500">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="flex flex-col items-end space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {logoutMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 