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
 * This is a placeholder that will be updated when the backend API endpoint is available.
 *
 * @param options - Optional react-query options
 */
export function useBarangays(options?: Parameters<typeof useQuery<Barangay[]>>[0]) {
  // TODO: Replace with actual API call when backend endpoint is available
  // For now, return mock data based on the seeded barangays
  const mockBarangays: Barangay[] = [
    { id: 1, name: "Balasinon" },
    { id: 2, name: "Buguis" },
    { id: 3, name: "Carre" },
    { id: 4, name: "Clib" },
    { id: 5, name: "Harada Butai" },
    { id: 6, name: "Katipunan" },
    { id: 7, name: "Kiblagon" },
    { id: 8, name: "Labon" },
    { id: 9, name: "Laperas" },
    { id: 10, name: "Lapla" },
    { id: 11, name: "Litos" },
    { id: 12, name: "Luparan" },
    { id: 13, name: "Mckinley" },
    { id: 14, name: "New Cebu" },
    { id: 15, name: "Osmeña" },
    { id: 16, name: "Palili" },
    { id: 17, name: "Parame" },
    { id: 18, name: "Poblacion" },
    { id: 19, name: "Roxas" },
    { id: 20, name: "Solongvale" },
    { id: 21, name: "Tagolilong" },
    { id: 22, name: "Tala-o" },
    { id: 23, name: "Talas" },
    { id: 24, name: "Tanwalang" },
    { id: 25, name: "Waterfall" },
  ];

  return useQuery<Barangay[]>({
    queryKey: ['barangays'],
    queryFn: () => Promise.resolve(mockBarangays),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 