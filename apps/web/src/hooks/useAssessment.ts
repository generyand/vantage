import { Assessment } from "@/types/assessment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssessmentResponseUpdate,
  AssessmentStatus,
  MOVCreate,
  deleteAssessmentsMovs$MovId,
  postAssessmentsResponses$ResponseIdMovs,
  postAssessmentsSubmit,
  putAssessmentsResponses$ResponseId,
  useGetAssessmentsMyAssessment,
} from "@vantage/shared";
import { useEffect, useMemo } from "react";
// Custom debounce implementation
function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  wait: number,
  options = { maxWait: undefined as number | undefined }
): ((...args: TArgs) => TReturn) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | undefined;
  let maxTimeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;

  let lastArgs: TArgs | undefined;
  let result: TReturn;

  const debounced = ((...args: TArgs) => {
    const time = Date.now();
    lastArgs = args;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!lastCallTime && options.maxWait) {
      maxTimeoutId = setTimeout(() => {
        if (lastArgs) {
          lastArgs = undefined;
          lastCallTime = time;
          result = func(...args);
        }
      }, options.maxWait);
    }

    timeoutId = setTimeout(() => {
      if (lastArgs) {
        lastArgs = undefined;
        lastCallTime = time;
        result = func(...args);
      }
    }, wait);

    return result;
  }) as ((...args: TArgs) => TReturn) & { cancel: () => void };

  debounced.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastArgs = undefined;
  };

  return debounced;
}

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

  // Transform API response to match frontend expectations
  interface APIAssessment {
    assessment: {
      id: number;
      status: string;
      created_at: string;
      updated_at: string;
      submitted_at?: string;
    };
    governance_areas: Array<{
      id: number;
      name: string;
      area_type: string;
      indicators: Array<{
        id: number;
        name: string;
        description: string;
        response?: {
          response_data: {
            has_budget_plan?: boolean;
          };
        };
        movs?: Array<{
          id: string;
          name: string;
          size: number;
          url: string;
        }>;
        feedback_comments?: Array<{
          comment: string;
        }>;
      }>;
    }>;
  }

  const transformedData = assessmentData
    ? {
        id: (
          assessmentData as unknown as APIAssessment
        ).assessment.id.toString(),
        barangayId: "1", // TODO: Get from user context
        barangayName: "New Cebu", // TODO: Get from user context
        status: (assessmentData as unknown as APIAssessment).assessment.status
          .toLowerCase()
          .replace("_", "-") as AssessmentStatus,
        createdAt: (assessmentData as unknown as APIAssessment).assessment
          .created_at,
        updatedAt: (assessmentData as unknown as APIAssessment).assessment
          .updated_at,
        submittedAt: (assessmentData as unknown as APIAssessment).assessment
          .submitted_at,
        governanceAreas: (
          assessmentData as unknown as APIAssessment
        ).governance_areas.map((area) => ({
          id: area.id.toString(),
          name: area.name,
          code: area.name.substring(0, 2).toUpperCase(),
          description: `${area.name} governance area`,
          isCore: area.area_type === "Core",
          indicators: area.indicators.map((indicator) => ({
            id: indicator.id.toString(),
            code: `${area.id}.${indicator.id}.1`, // Generate code
            name: indicator.name,
            description: indicator.description,
            technicalNotes: "See form schema for requirements",
            governanceAreaId: area.id.toString(),
            status: indicator.response
              ? ("completed" as const)
              : ("not_started" as const),
            complianceAnswer: indicator.response?.response_data?.has_budget_plan
              ? ("yes" as const)
              : ("no" as const),
            movFiles: indicator.movs || [],
            assessorComment: indicator.feedback_comments?.[0]?.comment,
            formSchema: {
              properties: {
                compliance: {
                  type: "string" as const,
                  title: "Compliance",
                  description: "Is this indicator compliant?",
                  required: true,
                  enum: ["yes", "no", "na"],
                },
              },
            },
            responseData: indicator.response?.response_data || {},
          })),
        })),
        totalIndicators: (
          assessmentData as unknown as APIAssessment
        ).governance_areas.reduce(
          (total, area) => total + area.indicators.length,
          0
        ),
        completedIndicators: (
          assessmentData as unknown as APIAssessment
        ).governance_areas.reduce(
          (total, area) =>
            total + area.indicators.filter((ind) => ind.response).length,
          0
        ),
        needsReworkIndicators: (
          assessmentData as unknown as APIAssessment
        ).governance_areas.reduce(
          (total, area) =>
            total +
            area.indicators.filter(
              (ind) => (ind.feedback_comments || []).length > 0
            ).length,
          0
        ),
      }
    : null;

  return {
    data: transformedData,
    isLoading,
    error,
    refetch,
    updateAssessmentData: () => {}, // Placeholder for update function
  };
}

/**
 * Hook to validate assessment completion
 */
export function useAssessmentValidation(assessment: Assessment | null) {
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
      assessment.governanceAreas.forEach((area) => {
        if (area.indicators) {
          area.indicators.forEach((indicator) => {
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
    const canSubmit = isComplete && assessment.status === "Draft";

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
          const indicator = area.indicators.find((i) => i.id === indicatorId);
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
      assessment.governanceAreas.find((area) => area.id === areaId) || null
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
