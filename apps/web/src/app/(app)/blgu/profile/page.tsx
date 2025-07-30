'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { ProfileForm } from '@/components/features/profile/ProfileForm';

export default function BLGUProfilePage() {
  const { isAuthenticated, user } = useAuthStore();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <ProfileForm user={user} />
    </div>
  );
} 