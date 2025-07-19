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
      <div className="text-gray-500 p-4">
        No user data available
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