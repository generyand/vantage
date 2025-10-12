import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssessmentResponseUpdate,
  deleteAssessmentsMovs$MovId,
  MOVCreate,
  postAssessmentsResponses$ResponseIdMovs,
  postAssessmentsSubmit,
  putAssessmentsResponses$ResponseId,
  useGetAssessmentsMyAssessment,
} from "@vantage/shared";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";

// Query keys for assessment data
const assessmentKeys = {
  all: ["assessment"] as const,
  current: () => [...assessmentKeys.all, "current"] as const,
  validation: () => [...assessmentKeys.all, "validation"] as const,
};

/**
 * Hook to fetch the current assessment data
 */
export function useCurrentAssessment() {
  const {
    data: assessmentData,
    isLoading,
    error,
    refetch,
  } = useGetAssessmentsMyAssessment();

  // Calculate progress based on completed indicators
  return {
    data: assessmentData,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to validate assessment completion
 */
export function useAssessmentValidation(assessment: any) {
  return useMemo(() => {
    if (!assessment) {
      return {
        isComplete: false,
        missingIndicators: [],
        missingMOVs: [],
        canSubmit: false,
      };
    }

    const missingIndicators: string[] = [];
    const missingMOVs: string[] = [];

    // Check all indicators across all governance areas
    if (assessment.governanceAreas) {
      assessment.governanceAreas.forEach((area: any) => {
        if (area.indicators) {
          area.indicators.forEach((indicator: any) => {
            if (!indicator.complianceAnswer) {
              missingIndicators.push(`${indicator.code} - ${indicator.name}`);
            } else if (
              indicator.complianceAnswer === "yes" &&
              indicator.movFiles?.length === 0
            ) {
              missingMOVs.push(`${indicator.code} - ${indicator.name}`);
            }
          });
        }
      });
    }

    const isComplete =
      missingIndicators.length === 0 && missingMOVs.length === 0;
    const canSubmit = isComplete && assessment.status === "in_progress";

    return {
      isComplete,
      missingIndicators,
      missingMOVs,
      canSubmit,
    };
  }, [assessment]);
}

/**
 * Hook to update indicator compliance answer
 */
export function useUpdateIndicatorAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      responseId,
      data,
    }: {
      responseId: number;
      data: AssessmentResponseUpdate;
    }) => {
      return putAssessmentsResponses$ResponseId(responseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.current() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.validation() });
    },
  });
}

/**
 * Hook to upload MOV files
 */
export function useUploadMOV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      responseId,
      data,
    }: {
      responseId: number;
      data: MOVCreate;
    }) => {
      return postAssessmentsResponses$ResponseIdMovs(responseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.current() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.validation() });
    },
  });
}

/**
 * Hook to delete MOV files
 */
export function useDeleteMOV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movId }: { movId: number }) => {
      return deleteAssessmentsMovs$MovId(movId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.current() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.validation() });
    },
  });
}

/**
 * Hook to submit assessment for review
 */
export function useSubmitAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return postAssessmentsSubmit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.current() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.validation() });
    },
  });
}

/**
 * Hook to get indicator by ID
 */
export function useIndicator(indicatorId: string) {
  const { data: assessment } = useCurrentAssessment();

  return useMemo(() => {
    if (!assessment) return null;

    if (
      assessment.governanceAreas &&
      Array.isArray(assessment.governanceAreas)
    ) {
      for (const area of assessment.governanceAreas) {
        if (area.indicators && Array.isArray(area.indicators)) {
          const indicator = area.indicators.find(
            (i: any) => i.id === indicatorId
          );
          if (indicator) return indicator;
        }
      }
    }

    return null;
  }, [assessment, indicatorId]);
}

/**
 * Hook to get governance area by ID
 */
export function useGovernanceArea(areaId: string) {
  const { data: assessment } = useCurrentAssessment();

  return useMemo(() => {
    if (
      !assessment ||
      !assessment.governanceAreas ||
      !Array.isArray(assessment.governanceAreas)
    )
      return null;

    return (
      (assessment.governanceAreas as any[]).find(
        (area: any) => area.id === areaId
      ) || null
    );
  }, [assessment, areaId]);
}

/**
 * Hook to update indicator response data with debouncing
 */
export function useUpdateResponse() {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async ({
      responseId,
      data,
    }: {
      responseId: number;
      data: AssessmentResponseUpdate;
    }) => {
      return putAssessmentsResponses$ResponseId(responseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.current() });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.validation() });
    },
  });

  // Create a debounced version of the mutation
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (responseId: number, data: AssessmentResponseUpdate) => {
          updateMutation.mutate({ responseId, data });
        },
        1000, // 1 second delay
        { maxWait: 5000 } // Maximum 5 seconds wait
      ),
    [updateMutation]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return {
    updateResponse: debouncedUpdate,
    isLoading: updateMutation.isPending,
    error: updateMutation.error,
  };
}
