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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                 <div className="space-y-8">
           {/* Profile Form */}
           <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
} 