'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/shared';
import { AssessmentPeriodsCard, DeadlinesCard } from '@/components/features/system-settings';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { isAuthenticated } = useAuthStore();
  const {
    periods,
    deadlines,
    isLoading,
    createAssessmentPeriod,
    activateAssessmentPeriod,
    archiveAssessmentPeriod,
    deleteAssessmentPeriod,
    saveDeadlines,
    getActivePeriod,
  } = useSystemSettings();

  const activePeriod = getActivePeriod();

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

  const handleCreatePeriod = async (data: { performanceYear: number; assessmentYear: number }) => {
    try {
      await createAssessmentPeriod(data);
      toast.success('Assessment period created successfully');
    } catch {
      toast.error('Failed to create assessment period');
    }
  };

  const handleActivatePeriod = async (periodId: string) => {
    try {
      await activateAssessmentPeriod(periodId);
      toast.success('Assessment period activated successfully');
    } catch {
      toast.error('Failed to activate assessment period');
    }
  };

  const handleArchivePeriod = async (periodId: string) => {
    try {
      await archiveAssessmentPeriod(periodId);
      toast.success('Assessment period archived successfully');
    } catch {
      toast.error('Failed to archive assessment period');
    }
  };

  const handleDeletePeriod = async (periodId: string) => {
    try {
      await deleteAssessmentPeriod(periodId);
      toast.success('Assessment period deleted successfully');
    } catch {
      toast.error('Failed to delete assessment period');
    }
  };

  const handleViewPeriod = (periodId: string) => {
    // TODO: Navigate to archived period view
    console.log('View period:', periodId);
    toast.info('View functionality coming soon');
  };

  const handleSaveDeadlines = async (data: { blguSubmissionDeadline: string; reworkCompletionDeadline: string }) => {
    try {
      await saveDeadlines(data);
      toast.success('Deadlines saved successfully');
    } catch {
      toast.error('Failed to save deadlines');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="System Settings"
          description="Manage core operational parameters for the VANTAGE application."
        />
        
        <div className="mt-8 space-y-6">
          <AssessmentPeriodsCard
            periods={periods}
            onCreatePeriod={handleCreatePeriod}
            onActivatePeriod={handleActivatePeriod}
            onArchivePeriod={handleArchivePeriod}
            onDeletePeriod={handleDeletePeriod}
            onViewPeriod={handleViewPeriod}
            isLoading={isLoading}
          />

          <DeadlinesCard
            deadlines={deadlines}
            activePeriodYear={activePeriod?.assessmentYear}
            onSaveDeadlines={handleSaveDeadlines}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
} 