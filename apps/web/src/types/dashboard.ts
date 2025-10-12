// TODO: These types should match the real API response structure
// Expected API endpoints:
// - GET /api/v1/assessments/dashboard/{barangay_id} -> DashboardData
// - GET /api/v1/assessments/{assessment_id}/progress -> AssessmentProgress
// - GET /api/v1/assessments/{assessment_id}/feedback -> AssessorFeedback[]

export type AssessmentStatus =
  | "in-progress"
  | "needs-rework"
  | "submitted"
  | "validated";

export interface AssessmentProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface GovernanceAreaProgress {
  id: string;
  name: string;
  current: number;
  total: number;
  percentage: number;
  status: "completed" | "in-progress" | "needs-rework" | "not-started";
}

export interface AssessorFeedback {
  id: string;
  indicator: string;
  comment: string;
  governanceArea: string;
  createdAt: string;
}

export interface DashboardData {
  barangayName: string;
  performanceYear: string;
  assessmentYear: string;
  status: AssessmentStatus;
  progress: AssessmentProgress;
  governanceAreas: GovernanceAreaProgress[];
  feedback: AssessorFeedback[];
}
