'use client';

import { useAuthStore } from '@/store/useAuthStore';

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assessments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and complete your SGLGB assessments
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors">
          Start New Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assessment Cards */}
        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Peace and Order</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          </div>
          <p className="text-gray-600 mb-4">Assessment of peace and order initiatives in your barangay.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Score: 85%</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Environmental Management</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          </div>
          <p className="text-gray-600 mb-4">Evaluation of environmental programs and waste management.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Due: July 30, 2024</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Start Assessment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial Administration</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          </div>
          <p className="text-gray-600 mb-4">Review of financial management and transparency practices.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Score: 92%</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 