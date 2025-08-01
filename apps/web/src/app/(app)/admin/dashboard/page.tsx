'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetUsersMe } from '@vantage/shared';
import { 
  DashboardHeader,
  KPICards,
  MunicipalProgressChart,
  AssessorQueue,
  FailedIndicators,
  AdminDashboardSkeleton
} from '@/components/features/dashboard';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [assessmentYear, setAssessmentYear] = useState('2024');

  // Auto-generated hook to fetch current user data
  const userQuery = useGetUsersMe();
  
  // Admin dashboard data hook
  const dashboardQuery = useAdminDashboard(assessmentYear);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Handle user data fetch success
  useEffect(() => {
    if (userQuery.data && !user) {
      console.log('User data fetched in dashboard:', userQuery.data);
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

  // Show loading skeleton while dashboard data is loading
  if (dashboardQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminDashboardSkeleton />
      </div>
    );
  }

  // Show error state
  if (dashboardQuery.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => dashboardQuery.refetch()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardQuery.data;

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <DashboardHeader
            municipality={dashboardData.municipality}
            performanceYear={dashboardData.performanceYear}
            assessmentYear={dashboardData.assessmentYear}
            onAssessmentYearChange={setAssessmentYear}
          />

          {/* Enhanced KPI Cards */}
          <KPICards data={dashboardData.kpiData} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Municipal Progress (2/3 width) */}
            <div className="xl:col-span-2">
              <MunicipalProgressChart 
                data={dashboardData.municipalProgress}
                totalBarangays={dashboardData.totalBarangays}
              />
            </div>

            {/* Right Column - Quick Stats (1/3 width) */}
            <div className="space-y-6">
              {/* Real-time Status Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-sm"></div>
                  <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Live Data</span>
                    </div>
                    <span className="text-xs text-green-600 font-semibold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <span className="text-xs text-gray-600">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-sm">
                    <span className="text-sm font-medium text-gray-700">Auto-refresh</span>
                    <span className="text-xs text-purple-600 font-semibold">30s</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/admin/submissions')}
                    className="group w-full text-left p-4 rounded-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-blue-900">Review Submissions</div>
                    <div className="text-sm text-gray-600 group-hover:text-blue-700">Check pending assessments</div>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/reports')}
                    className="group w-full text-left p-4 rounded-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-green-900">Generate Reports</div>
                    <div className="text-sm text-gray-600 group-hover:text-green-700">View analytics & insights</div>
                  </button>
                  <button 
                    onClick={() => router.push('/user-management')}
                    className="group w-full text-left p-4 rounded-sm bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50 hover:from-purple-100 hover:to-violet-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-purple-900">Manage Users</div>
                    <div className="text-sm text-gray-600 group-hover:text-purple-700">User accounts & permissions</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Actionable Intelligence Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Assessor Queue */}
            <AssessorQueue data={dashboardData.assessorQueue} />
            
            {/* Failed Indicators */}
            <FailedIndicators 
              data={dashboardData.failedIndicators}
              totalBarangays={dashboardData.totalBarangays}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 