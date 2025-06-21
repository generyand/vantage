// 🚀 Modern component using auto-generated React Query hooks
'use client';

import { useGetCurrentUser } from '@vantage/shared';

export default function UserNav() {
  // ✨ Auto-generated hook with caching, loading states, and error handling
  const { data: user, isLoading, error } = useGetCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading user...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600 font-medium">Error loading user</div>
        <div className="text-red-500 text-sm mt-1">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-gray-500 p-4">
        No user data available
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
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
            Member since {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 