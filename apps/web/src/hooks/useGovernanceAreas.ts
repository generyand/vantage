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
 * Uses the real API endpoint from the backend.
 *
 * @param options - Optional react-query options
 */
export function useGovernanceAreas(options?: Parameters<typeof useQuery<GovernanceArea[]>>[0]) {
  return useQuery<GovernanceArea[]>({
    queryKey: ['governance-areas'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/v1/lookups/governance-areas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch governance areas: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 