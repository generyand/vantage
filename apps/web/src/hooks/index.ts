// 🎯 Custom Hooks - Reusable state logic and data management

// Theme hooks
export { useThemeToggle } from './useThemeToggle';

// User management hooks
export { useUsers } from './useUsers';

// Assessment hooks
export { 
  useCurrentAssessment, 
  useAssessmentValidation,
  useUpdateIndicatorAnswer,
  useUploadMOV,
  useDeleteMOV,
  useSubmitAssessment,
  useIndicator,
  useGovernanceArea
} from './useAssessment';

// Submissions hooks
export { useSubmissions } from './useSubmissions';

// Analytics hooks
export { 
  useOfficialPerformance,
  useCrossMatching,
  useSystemicWeakness,
  useBarangays as useAnalyticsBarangays
} from './useAnalytics';

// Dashboard hooks
export { useDashboard } from './useDashboard';
export { useAdminDashboard } from './useAdminDashboard';

// Lookup data hooks
export { useGovernanceAreas } from './useGovernanceAreas';
export { useAssessorGovernanceArea } from './useAssessorGovernanceArea';
export { useBarangays } from './useBarangays';
export { useUserBarangay } from './useUserBarangay';

// System settings hooks
export { useSystemSettings } from './useSystemSettings';
