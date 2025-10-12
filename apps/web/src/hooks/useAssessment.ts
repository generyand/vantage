import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssessmentResponseUpdate,
  deleteAssessmentsMovs$MovId,
  MOVCreate,
  postAssessmentsResponses$ResponseIdMovs,
  postAssessmentsSubmit,
  putAssessmentsResponses$ResponseId,
} from "@vantage/shared";
import { debounce } from "lodash";
import React, { useEffect, useMemo } from "react";

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
  // For now, return mock data until the API is properly implemented
  const [assessmentData, setAssessmentData] = React.useState({
    id: 1,
    status: "in_progress",
    totalIndicators: 12,
    completedIndicators: 6,
    governanceAreas: [
      {
        id: "1",
        name: "Financial Administration and Sustainability",
        code: "1",
        isCore: true,
        indicators: [
          {
            id: "1.1",
            code: "1.1",
            name: "Financial Planning and Budgeting",
            description:
              "The barangay has a comprehensive financial plan that includes annual budget preparation, revenue projections, and expenditure planning.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay have a comprehensive financial plan?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "Additional notes or comments",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "Annual budget and financial plan in place",
            },
          },
          {
            id: "1.2",
            code: "1.2",
            name: "Revenue Generation",
            description:
              "The barangay implements various revenue generation activities and programs to increase local income.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay implement revenue generation activities?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the revenue generation activities",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "Regular tax collection and business permit fees",
            },
          },
        ],
      },
      {
        id: "2",
        name: "Disaster Preparedness and Climate Change Action",
        code: "2",
        isCore: true,
        indicators: [
          {
            id: "2.1",
            code: "2.1",
            name: "Disaster Risk Reduction Plan",
            description:
              "The barangay has developed and implemented a comprehensive disaster risk reduction and management plan.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay have a disaster risk reduction plan?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "Details about the disaster risk reduction plan",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "DRRM plan updated annually with regular drills",
            },
          },
          {
            id: "2.2",
            code: "2.2",
            name: "Climate Change Adaptation",
            description:
              "The barangay implements climate change adaptation measures and environmental protection programs.",
            complianceAnswer: null,
            movFiles: [],
            status: "not_started",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay implement climate change adaptation measures?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the climate change adaptation measures",
                },
              },
            },
            responseData: null,
          },
        ],
      },
      {
        id: "3",
        name: "Safety, Peace and Order",
        code: "3",
        isCore: true,
        indicators: [
          {
            id: "3.1",
            code: "3.1",
            name: "Peace and Order Program",
            description:
              "The barangay implements programs to maintain peace and order in the community.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay implement peace and order programs?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the peace and order programs",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "Regular patrols and community watch programs",
            },
          },
          {
            id: "3.2",
            code: "3.2",
            name: "Crime Prevention",
            description:
              "The barangay has crime prevention programs and community safety initiatives.",
            complianceAnswer: null,
            movFiles: [],
            status: "not_started",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title: "Does the barangay have crime prevention programs?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the crime prevention programs",
                },
              },
            },
            responseData: null,
          },
        ],
      },
      {
        id: "4",
        name: "Social Protection and Sensitivity",
        code: "4",
        isCore: false,
        indicators: [
          {
            id: "4.1",
            code: "4.1",
            name: "Social Services Program",
            description:
              "The barangay provides social services and assistance to vulnerable sectors.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title: "Does the barangay provide social services?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the social services provided",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "Regular assistance to elderly and PWDs",
            },
          },
        ],
      },
      {
        id: "5",
        name: "Business Friendliness and Competitiveness",
        code: "5",
        isCore: false,
        indicators: [
          {
            id: "5.1",
            code: "5.1",
            name: "Business Support Services",
            description:
              "The barangay provides support services to local businesses and entrepreneurs.",
            complianceAnswer: null,
            movFiles: [],
            status: "not_started",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title: "Does the barangay provide business support services?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the business support services",
                },
              },
            },
            responseData: null,
          },
        ],
      },
      {
        id: "6",
        name: "Environmental Management",
        code: "6",
        isCore: false,
        indicators: [
          {
            id: "6.1",
            code: "6.1",
            name: "Waste Management Program",
            description:
              "The barangay implements comprehensive waste management and environmental protection programs.",
            complianceAnswer: "yes",
            movFiles: [],
            status: "completed",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title: "Does the barangay have a waste management program?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the waste management activities",
                },
              },
            },
            responseData: {
              compliance: "yes",
              remarks: "Regular waste collection and segregation program",
            },
          },
          {
            id: "6.2",
            code: "6.2",
            name: "Environmental Protection",
            description:
              "The barangay has programs for environmental protection and conservation.",
            complianceAnswer: null,
            movFiles: [],
            status: "not_started",
            formSchema: {
              type: "object",
              properties: {
                compliance: {
                  type: "string",
                  title:
                    "Does the barangay have environmental protection programs?",
                  enum: ["yes", "no"],
                  required: true,
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  description: "List the environmental protection programs",
                },
              },
            },
            responseData: null,
          },
        ],
      },
    ],
  });

  // Calculate progress based on completed indicators
  const completedCount = assessmentData.governanceAreas.reduce(
    (total, area) => {
      return (
        total +
        area.indicators.filter(
          (indicator) =>
            indicator.complianceAnswer === "yes" ||
            indicator.complianceAnswer === "no"
        ).length
      );
    },
    0
  );

  const totalCount = assessmentData.governanceAreas.reduce((total, area) => {
    return total + area.indicators.length;
  }, 0);

  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Create a function to update assessment data
  const updateAssessmentData = React.useCallback(
    (updater: (data: any) => any) => {
      setAssessmentData((prevData) => {
        const updatedData = updater(prevData);
        return updatedData;
      });
    },
    []
  );

  return {
    data: {
      ...assessmentData,
      completedIndicators: completedCount,
      totalIndicators: totalCount,
      progressPercentage,
    },
    updateAssessmentData,
    isLoading: false,
    error: null,
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
      // For now, just simulate the API call since we're using mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 100);
      });
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
