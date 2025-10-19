"use client";

import { useGetAssessorAssessmentsAssessmentId, useGetAssessorQueue, usePostAssessorAssessmentResponsesResponseIdMovs, usePostAssessorAssessmentResponsesResponseIdValidate } from "@vantage/shared";

const assessorKeys = {
  all: ["assessor"] as const,
  queue: () => [...assessorKeys.all, "queue"] as const,
  assessmentDetails: (id: string) => [...assessorKeys.all, "assessment", id] as const,
};

export function useAssessorQueue() {
  return useGetAssessorQueue();
}

export function useAssessorAssessmentDetails(assessmentId: string) {
  return useGetAssessorAssessmentsAssessmentId(parseInt(assessmentId));
}

export function useAssessorValidationMutation(assessmentId: string) {
  return usePostAssessorAssessmentResponsesResponseIdValidate({
    mutation: {
      onSuccess: () => {
        // Invalidate the assessment details query to refresh the data
        // This will be handled by the component using the mutation
      },
    },
  });
}

export function useAssessorMOVUploadMutation(assessmentId: string) {
  return usePostAssessorAssessmentResponsesResponseIdMovs({
    mutation: {
      onSuccess: () => {
        // Invalidate the assessment details query to refresh the data
        // This will be handled by the component using the mutation
      },
    },
  });
}
