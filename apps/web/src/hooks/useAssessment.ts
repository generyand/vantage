/**
 * Assessment hooks for BLGU pre-assessment workflow
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Assessment, 
  ComplianceAnswer, 
  AssessmentValidation,
  MOCK_ASSESSMENT 
} from '@/types/assessment';

// Query keys for assessment data
const assessmentKeys = {
  all: ['assessment'] as const,
  current: () => [...assessmentKeys.all, 'current'] as const,
  validation: () => [...assessmentKeys.all, 'validation'] as const,
};

/**
 * Hook to fetch the current assessment data
 */
export function useCurrentAssessment() {
  return useQuery({
    queryKey: assessmentKeys.current(),
    queryFn: async (): Promise<Assessment> => {
      // TODO: Replace with actual API call
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return MOCK_ASSESSMENT;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to validate assessment completion
 */
export function useAssessmentValidation(assessment: Assessment | undefined) {
  return useMemo((): AssessmentValidation => {
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
    assessment.governanceAreas.forEach(area => {
      area.indicators.forEach(indicator => {
        if (!indicator.complianceAnswer) {
          missingIndicators.push(`${indicator.code} - ${indicator.name}`);
        } else if (indicator.complianceAnswer === 'yes' && indicator.movFiles.length === 0) {
          missingMOVs.push(`${indicator.code} - ${indicator.name}`);
        }
      });
    });

    const isComplete = missingIndicators.length === 0 && missingMOVs.length === 0;
    const canSubmit = isComplete && assessment.status === 'in_progress';

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
      indicatorId, 
      answer 
    }: { 
      indicatorId: string; 
      answer: ComplianceAnswer;
    }): Promise<void> => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state for now
      queryClient.setQueryData(assessmentKeys.current(), (oldData: Assessment | undefined) => {
        if (!oldData) return oldData;
        
        const updatedAssessment = {
          ...oldData,
          governanceAreas: oldData.governanceAreas.map(area => ({
            ...area,
            indicators: area.indicators.map(indicator => {
              if (indicator.id === indicatorId) {
                const newStatus = answer ? 'completed' : 'not_started';
                return {
                  ...indicator,
                  complianceAnswer: answer,
                  status: newStatus,
                  // Clear MOV files if answer is not 'yes'
                  movFiles: answer === 'yes' ? indicator.movFiles : [],
                };
              }
              return indicator;
            }),
          })),
        };

        // Update completion counts
        const totalIndicators = updatedAssessment.governanceAreas.reduce(
          (sum, area) => sum + area.indicators.length, 0
        );
        const completedIndicators = updatedAssessment.governanceAreas.reduce(
          (sum, area) => sum + area.indicators.filter(i => i.status === 'completed').length, 0
        );

        return {
          ...updatedAssessment,
          totalIndicators,
          completedIndicators,
        };
      });
    },
    onSuccess: () => {
      // Invalidate validation query to recalculate completion status
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
      indicatorId, 
      file 
    }: { 
      indicatorId: string; 
      file: File;
    }): Promise<void> => {
      // TODO: Replace with actual file upload API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate file upload response
      const mockFile = {
        id: `mov-${Date.now()}`,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
      };

      // Update local state
      queryClient.setQueryData(assessmentKeys.current(), (oldData: Assessment | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          governanceAreas: oldData.governanceAreas.map(area => ({
            ...area,
            indicators: area.indicators.map(indicator => {
              if (indicator.id === indicatorId) {
                return {
                  ...indicator,
                  movFiles: [...indicator.movFiles, mockFile],
                };
              }
              return indicator;
            }),
          })),
        };
      });
    },
    onSuccess: () => {
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
    mutationFn: async ({ 
      indicatorId, 
      fileId 
    }: { 
      indicatorId: string; 
      fileId: string;
    }): Promise<void> => {
      // TODO: Replace with actual file deletion API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      queryClient.setQueryData(assessmentKeys.current(), (oldData: Assessment | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          governanceAreas: oldData.governanceAreas.map(area => ({
            ...area,
            indicators: area.indicators.map(indicator => {
              if (indicator.id === indicatorId) {
                return {
                  ...indicator,
                  movFiles: indicator.movFiles.filter(file => file.id !== fileId),
                };
              }
              return indicator;
            }),
          })),
        };
      });
    },
    onSuccess: () => {
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
    mutationFn: async (): Promise<void> => {
      // TODO: Replace with actual submission API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state to mark as submitted
      queryClient.setQueryData(assessmentKeys.current(), (oldData: Assessment | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        };
      });
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
    
    for (const area of assessment.governanceAreas) {
      const indicator = area.indicators.find(i => i.id === indicatorId);
      if (indicator) return indicator;
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
    if (!assessment) return null;
    
    return assessment.governanceAreas.find(area => area.id === areaId) || null;
  }, [assessment, areaId]);
} 