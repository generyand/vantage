'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function BLGUReportsPage() {
  const router = useRouter();
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
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and download your assessment reports
          </p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report Cards */}
        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">SGLGB 2024 Report</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Complete
            </span>
          </div>
          <p className="text-gray-600 mb-4">Comprehensive report for the 2024 SGLGB assessment cycle.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Generated: July 25, 2024</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Download PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Peace and Order Report</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Available
            </span>
          </div>
          <p className="text-gray-600 mb-4">Detailed analysis of peace and order initiatives and outcomes.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Updated: July 20, 2024</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial Report</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Complete
            </span>
          </div>
          <p className="text-gray-600 mb-4">Financial administration and transparency assessment results.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Generated: July 15, 2024</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-sm shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
} 