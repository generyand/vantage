// 🚀 Modern component with logout functionality
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, useUser } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export default function UserNav() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const user = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
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
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-gray-700 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 