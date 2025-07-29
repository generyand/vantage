import { useState, useEffect } from 'react';
import { DashboardData } from '@/types/dashboard';

// TODO: Replace with real API endpoint when available
// Expected endpoint: GET /api/v1/assessments/dashboard/{barangay_id}
// Expected response: DashboardData interface
const createMockDashboardData = (barangayName: string): DashboardData => ({
  barangayName,
  performanceYear: '2023',
  assessmentYear: '2024',
  status: 'needs-rework', // Changed to show feedback section
  progress: {
    current: 75,
    total: 120,
    percentage: 62.5
  },
  governanceAreas: [
    {
      id: '1',
      name: 'Financial Administration and Sustainability',
      current: 8,
      total: 15,
      percentage: 53.3,
      status: 'in-progress'
    },
    {
      id: '2',
      name: 'Disaster Preparedness and Climate Change Action',
      current: 12,
      total: 18,
      percentage: 66.7,
      status: 'in-progress'
    },
    {
      id: '3',
      name: 'Safety, Peace and Order',
      current: 6,
      total: 12,
      percentage: 50,
      status: 'needs-rework'
    },
    {
      id: '4',
      name: 'Social Protection and Sensitivity',
      current: 14,
      total: 20,
      percentage: 70,
      status: 'in-progress'
    },
    {
      id: '5',
      name: 'Business Friendliness and Competitiveness',
      current: 10,
      total: 16,
      percentage: 62.5,
      status: 'in-progress'
    },
    {
      id: '6',
      name: 'Environmental Management',
      current: 25,
      total: 39,
      percentage: 64.1,
      status: 'in-progress'
    }
  ],
  feedback: [
    {
      id: '1',
      indicator: '3.1.5',
      comment: 'Submitted plan lacks specific budget allocation for disaster preparedness activities...',
      governanceArea: 'Safety, Peace and Order',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      indicator: '2.2.3',
      comment: 'Financial records show discrepancies in quarterly reporting format...',
      governanceArea: 'Financial Administration and Sustainability',
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      indicator: '4.1.2',
      comment: 'Community engagement documentation needs more detailed participation records...',
      governanceArea: 'Social Protection and Sensitivity',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ]
});

export function useDashboard(barangayName?: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with real API call when assessment dashboard endpoint is available
    // Expected: const response = await fetch(`/api/v1/assessments/dashboard/${barangayId}`);
    // Expected: const dashboardData = await response.json();
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = createMockDashboardData(barangayName || 'San Roque');
        setData(mockData);
        setError(null);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [barangayName]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // TODO: Replace with real API call when assessment dashboard endpoint is available
      setTimeout(() => {
        const mockData = createMockDashboardData(barangayName || 'San Roque');
        setData(mockData);
        setLoading(false);
      }, 500);
    }
  };
}