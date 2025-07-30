'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/shared';
import { SubmissionsFilters, SubmissionsTable } from '@/components/features/submissions';
import { useSubmissions } from '@/hooks/useSubmissions';
import { Submission } from '@/types/submissions';
import { toast } from 'sonner';

export default function AdminSubmissionsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const {
    submissions,
    filters,
    updateFilters,
    resetFilters,
    loading,
    governanceAreas,
    assessors,
  } = useSubmissions();

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

  const handleViewDetails = (submission: Submission) => {
    router.push(`/admin/submissions/${submission.id}`);
  };

  const handleSendReminder = (submission: Submission) => {
    // TODO: Implement reminder functionality
    console.log('Send reminder for:', submission.barangayName);
    toast.success(`Reminder sent to ${submission.barangayName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Submissions Queue"
          description="Live Pre-Assessment Status for All 25 Barangays"
        />
        
        <div className="mt-8">
          <SubmissionsFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            governanceAreas={governanceAreas}
            assessors={assessors}
          />

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600">
                {loading ? 'Loading...' : 'Ready'}
              </div>
            </div>
          </div>

          <SubmissionsTable
            submissions={submissions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onSendReminder={handleSendReminder}
          />
        </div>
      </div>
    </div>
  );
} 