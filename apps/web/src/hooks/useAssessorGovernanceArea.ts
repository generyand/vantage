import { useAuthStore } from '@/store/useAuthStore';
import { useGovernanceAreas } from './useGovernanceAreas';
import { GovernanceArea } from '@vantage/shared';

/**
 * Custom hook to get the assigned governance area for Area Assessors.
 * This is similar to useUserBarangay but for assessors.
 */
export function useAssessorGovernanceArea() {
  const { user } = useAuthStore();
  const { data: governanceAreasData, isLoading, error } = useGovernanceAreas();

  const getAssessorGovernanceArea = () => {
    if (!user || user.role !== 'AREA_ASSESSOR') {
      return null;
    }

    if (!user.governance_area_id || !governanceAreasData) {
      return 'Unknown Governance Area';
    }

    const governanceArea = (governanceAreasData as GovernanceArea[]).find(
      (ga: GovernanceArea) => ga.id === user.governance_area_id
    );

    return governanceArea?.name || 'Unknown Governance Area';
  };

  return {
    governanceAreaName: getAssessorGovernanceArea(),
    isLoading,
    error,
    governanceAreaId: user?.governance_area_id
  };
} 