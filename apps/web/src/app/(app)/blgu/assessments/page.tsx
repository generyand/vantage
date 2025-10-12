"use client";

import {
  AssessmentHeader,
  AssessmentLockedBanner,
  AssessmentSkeleton,
  AssessmentTabs,
} from "@/components/features/assessments";
import {
  useAssessmentValidation,
  useCurrentAssessment,
} from "@/hooks/useAssessment";
import { useAuthStore } from "@/store/useAuthStore";

export default function BLGUAssessmentsPage() {
  const { isAuthenticated, user, token } = useAuthStore();
  const {
    data: assessment,
    updateAssessmentData,
    isLoading,
    error,
  } = useCurrentAssessment();
  const validation = useAssessmentValidation(assessment);

  // Show loading if not authenticated or if auth state is still loading
  if (!isAuthenticated || !user || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--cityscape-yellow)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <AssessmentSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center bg-[var(--card)] backdrop-blur-sm rounded-sm p-8 shadow-lg border border-[var(--border)]">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Error Loading Assessment
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show error if no assessment data
  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center bg-[var(--card)] backdrop-blur-sm rounded-sm p-8 shadow-lg border border-[var(--border)]">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            No Assessment Data Found
          </h3>
          <p className="text-amber-600 mb-4">
            Please try refreshing the page or contact support
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-600 text-white rounded-sm hover:bg-amber-700 transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show locked banner if assessment is not editable
  const isLocked =
    assessment.status === "submitted" ||
    assessment.status === "validated" ||
    assessment.status === "finalized";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Enhanced Locked Banner */}
      {isLocked && <AssessmentLockedBanner status={assessment.status} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Enhanced Header */}
          <AssessmentHeader assessment={assessment} validation={validation} />

          {/* Enhanced Assessment Tabs */}
          <AssessmentTabs
            assessment={assessment}
            isLocked={isLocked}
            updateAssessmentData={updateAssessmentData}
          />
        </div>
      </div>
    </div>
  );
}
