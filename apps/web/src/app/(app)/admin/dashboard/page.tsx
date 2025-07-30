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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <DashboardHeader
        municipality={dashboardData.municipality}
        performanceYear={dashboardData.performanceYear}
        assessmentYear={dashboardData.assessmentYear}
        onAssessmentYearChange={setAssessmentYear}
      />

      {/* Key Performance Indicator (KPI) Row */}
      <KPICards data={dashboardData.kpiData} />

      {/* Municipal Progress Visualization */}
      <MunicipalProgressChart 
        data={dashboardData.municipalProgress}
        totalBarangays={dashboardData.totalBarangays}
      />

      {/* Actionable Intelligence Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessor Queue */}
        <AssessorQueue data={dashboardData.assessorQueue} />
        
        {/* Failed Indicators */}
        <FailedIndicators 
          data={dashboardData.failedIndicators}
          totalBarangays={dashboardData.totalBarangays}
        />
      </div>

      {/* Real-time Status Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Dashboard last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>Auto-refresh every 30 seconds</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
} 