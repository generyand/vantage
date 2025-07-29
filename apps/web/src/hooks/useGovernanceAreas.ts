import { useQuery } from '@tanstack/react-query';

/**
 * Interface for governance area data
 */
export interface GovernanceArea {
  id: number;
  name: string;
  area_type: 'Core' | 'Essential';
}

/**
 * Custom hook to fetch governance areas for the user management interface.
 * TEMPORARILY using mock data while backend API is being debugged.
 *
 * @param options - Optional react-query options
 */
export function useGovernanceAreas(options?: Parameters<typeof useQuery<GovernanceArea[]>>[0]) {
  // TODO: Replace with actual API call when backend endpoint is fixed
  // For now, return mock data based on the seeded governance areas
  const mockGovernanceAreas: GovernanceArea[] = [
    { id: 1, name: "Financial Administration and Sustainability", area_type: "Core" },
    { id: 2, name: "Disaster Preparedness", area_type: "Core" },
    { id: 3, name: "Safety, Peace and Order", area_type: "Core" },
    { id: 4, name: "Social Protection and Sensitivity", area_type: "Essential" },
    { id: 5, name: "Business-Friendliness and Competitiveness", area_type: "Essential" },
    { id: 6, name: "Environmental Management", area_type: "Essential" },
  ];

  return useQuery<GovernanceArea[]>({
    queryKey: ['governance-areas'],
    queryFn: () => Promise.resolve(mockGovernanceAreas),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 