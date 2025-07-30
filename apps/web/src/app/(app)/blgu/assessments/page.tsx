"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AssessmentHeader } from "@/components/features/assessments/AssessmentHeader";
import { AssessmentTabs } from "@/components/features/assessments/AssessmentTabs";
import { AssessmentLockedBanner } from "@/components/features/assessments/AssessmentLockedBanner";
import { useCurrentAssessment, useAssessmentValidation } from "@/hooks/useAssessment";

export default function BLGUAssessmentsPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: assessment, isLoading, error } = useCurrentAssessment();
  const validation = useAssessmentValidation(assessment);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading assessment</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Show error if no assessment data
  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">No assessment data found</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Show locked banner if assessment is not editable
  const isLocked = assessment.status === 'submitted' || 
                   assessment.status === 'validated' || 
                   assessment.status === 'finalized';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Locked Banner */}
      {isLocked && <AssessmentLockedBanner status={assessment.status} />}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AssessmentHeader 
          assessment={assessment}
          validation={validation}
        />
        
        {/* Assessment Tabs */}
        <div className="mt-8">
          <AssessmentTabs 
            assessment={assessment}
            isLocked={isLocked}
          />
        </div>
      </div>
    </div>
  );
}
