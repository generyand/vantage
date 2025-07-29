'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetUsersMe } from '@vantage/shared';
import { useDashboard } from '@/hooks/useDashboard';
import { useUserBarangay } from '@/hooks/useUserBarangay';
import { 
  StatusCard, 
  FeedbackSection, 
  GovernanceAreasGrid, 
  DashboardSkeleton 
} from '@/components/features/dashboard';

export default function BLGUDashboardPage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { barangayName, isLoading: barangayLoading } = useUserBarangay();
  const { data, loading, error } = useDashboard(barangayName);

  // Auto-generated hook to fetch current user data
  const userQuery = useGetUsersMe();

  // Handle user data fetch success
  useEffect(() => {
    if (userQuery.data && !user) {
      console.log('User data fetched in BLGU dashboard:', userQuery.data);
      setUser(userQuery.data);
    }
  }, [userQuery.data, user, setUser]);

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log('Dashboard data loaded:', data);
      console.log('Status:', data.status);
      console.log('Feedback length:', data.feedback.length);
      console.log('Should show feedback:', data.status === 'needs-rework');
      console.log('User barangay:', barangayName);
    }
  }, [data, barangayName]);

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

  // Show loading skeleton while dashboard data is loading
  if (loading || barangayLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 rounded-sm shadow-lg border-0 p-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-indigo-100/20 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/30 to-pink-100/20 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm"></div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Barangay <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{data.barangayName}</span>&apos;s SGLGB Dashboard
                    </h1>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                      <span className="font-medium text-gray-700">Performance Year:</span> 
                      <span className="font-semibold text-gray-900">{data.performanceYear}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                      <span className="font-medium text-gray-700">Assessment Year:</span> 
                      <span className="font-semibold text-gray-900">{data.assessmentYear}</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Quick Stats */}
                <div className="flex items-center gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{data.progress.current}</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Compliant</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-gray-900">{data.progress.total}</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{Math.round(data.progress.percentage)}%</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid with enhanced layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Status and Feedback (3/4 width) */}
            <div className="xl:col-span-3 space-y-8">
              {/* Primary Status Card */}
              <StatusCard status={data.status} progress={data.progress} />

              {/* Action Required: Rework Section */}
              <FeedbackSection feedback={data.feedback} />
            </div>

            {/* Right Column - Enhanced Sidebar (1/4 width) */}
            <div className="space-y-6">
              {/* Quick Actions Card with enhanced design */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/blgu/assessments')}
                    className="group w-full text-left p-4 rounded-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-blue-900">Continue Assessment</div>
                    <div className="text-sm text-gray-600 group-hover:text-blue-700">Resume your current progress</div>
                  </button>
                  <button 
                    onClick={() => router.push('/blgu/reports')}
                    className="group w-full text-left p-4 rounded-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-green-900">View Reports</div>
                    <div className="text-sm text-gray-600 group-hover:text-green-700">Access detailed reports</div>
                  </button>
                </div>
              </div>

              {/* Enhanced Assessment Summary */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-sm"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Summary</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">Total Areas</span>
                    <span className="text-xl font-bold text-gray-900">{data.governanceAreas.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">Completed Areas</span>
                    <span className="text-xl font-bold text-green-600">
                      {data.governanceAreas.filter(area => area.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">In Progress</span>
                    <span className="text-xl font-bold text-blue-600">
                      {data.governanceAreas.filter(area => area.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">Need Rework</span>
                    <span className="text-xl font-bold text-amber-600">
                      {data.governanceAreas.filter(area => area.status === 'needs-rework').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* New: Recent Activity Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-sm"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm text-gray-700">Assessment updated</div>
                    <div className="text-xs text-gray-500 ml-auto">2h ago</div>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm text-gray-700">Progress synced</div>
                    <div className="text-xs text-gray-500 ml-auto">1d ago</div>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div className="text-sm text-gray-700">Feedback received</div>
                    <div className="text-xs text-gray-500 ml-auto">3d ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Areas Grid - Full Width with enhanced spacing */}
          <div className="mt-12">
            <GovernanceAreasGrid areas={data.governanceAreas} />
          </div>
        </div>
      </div>
    </div>
  );
} 