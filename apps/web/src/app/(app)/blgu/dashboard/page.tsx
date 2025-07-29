'use client';

import { useEffect } from 'react';
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Barangay <span className="text-blue-600">{data.barangayName}</span>'s SGLGB Dashboard
        </h1>
        <h3 className="text-lg text-gray-600">
          Performance Year: {data.performanceYear} | Assessment Year: {data.assessmentYear}
        </h3>
      </div>

      {/* Primary Status Card */}
      <StatusCard status={data.status} progress={data.progress} />

      {/* Action Required: Rework Section - Temporarily always show for debugging */}
      {/* TODO: Add conditional rendering back when real API data is available */}
      <FeedbackSection feedback={data.feedback} />

      {/* Governance Area Navigation */}
      <GovernanceAreasGrid areas={data.governanceAreas} />
    </div>
  );
} 