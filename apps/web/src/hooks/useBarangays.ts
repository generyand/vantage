import { useQuery } from '@tanstack/react-query';

/**
 * Interface for barangay data
 */
export interface Barangay {
  id: number;
  name: string;
}

/**
 * Custom hook to fetch barangays for the user management interface.
 * Uses the real API endpoint from the backend.
 *
 * @param options - Optional react-query options
 */
export function useBarangays(options?: Parameters<typeof useQuery<Barangay[]>>[0]) {
  return useQuery<Barangay[]>({
    queryKey: ['barangays'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/v1/lookups/barangays', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch barangays: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 