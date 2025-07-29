'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetUsersMe } from '@vantage/shared';

export default function BLGUDashboardPage() {
  const { user, setUser, isAuthenticated } = useAuthStore();

  // Auto-generated hook to fetch current user data
  const userQuery = useGetUsersMe();

  // Handle user data fetch success
  useEffect(() => {
    if (userQuery.data && !user) {
      console.log('User data fetched in BLGU dashboard:', userQuery.data);
      setUser(userQuery.data);
    }
  }, [userQuery.data, user, setUser]);

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Empty dashboard content */}
      <div className="bg-white rounded-sm shadow p-6">
        <div className="text-center text-gray-500">
          <p>Dashboard content will be added here.</p>
        </div>
      </div>
    </div>
  );
} 