import { useAuthStore } from '@/store/useAuthStore';
import { useGovernanceAreas } from './useGovernanceAreas';
import { useEffect } from 'react';
import { GovernanceArea } from '@vantage/shared';

/**
 * Custom hook to get the assigned governance area for Area Assessors.
 * This is similar to useUserBarangay but for assessors.
 */
export function useAssessorGovernanceArea() {
  const { user } = useAuthStore();
  const { data: governanceAreasData, isLoading, error } = useGovernanceAreas();

  // Debug logging
  useEffect(() => {
    console.log('useAssessorGovernanceArea Debug:');
    console.log('User:', user);
    console.log('User governance_area_id:', user?.governance_area_id);
    console.log('Governance areas data:', governanceAreasData);
    console.log('Governance areas loading:', isLoading);
    console.log('Governance areas error:', error);
  }, [user, governanceAreasData, isLoading, error]);

  const getAssessorGovernanceArea = () => {
    if (!user || user.role !== 'AREA_ASSESSOR') {
      console.log('getAssessorGovernanceArea: Not an assessor or no user', { 
        userRole: user?.role 
      });
      return null;
    }

    if (!user.governance_area_id || !governanceAreasData) {
      console.log('getAssessorGovernanceArea: Missing data', { 
        userGovernanceAreaId: user?.governance_area_id, 
        governanceAreasData: !!governanceAreasData 
      });
      return 'Unknown Governance Area';
    }

    const governanceArea = (governanceAreasData as GovernanceArea[]).find(
      (ga: GovernanceArea) => ga.id === user.governance_area_id
    );

    console.log('getAssessorGovernanceArea: Found governance area', { 
      userGovernanceAreaId: user.governance_area_id, 
      foundGovernanceArea: governanceArea 
    });

    return governanceArea?.name || 'Unknown Governance Area';
  };

  return {
    governanceAreaName: getAssessorGovernanceArea(),
    isLoading,
    error,
    governanceAreaId: user?.governance_area_id
  };
} 