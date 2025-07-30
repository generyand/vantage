"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function BLGUAssessmentsPage() {
  const { isAuthenticated } = useAuthStore();

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
      <div className="bg-white rounded-sm shadow p-6">
        <p className="text-gray-500 text-center">
          Assessments content will be implemented here.
        </p>
      </div>
    </div>
  );
}
