import { useQuery } from '@tanstack/react-query';

// Types for the administrator dashboard
export interface AdminDashboardData {
  kpiData: {
    barangaySubmissions: { current: number; total: number };
    awaitingReview: number;
    inRework: number;
    validatedReady: number;
  };
  municipalProgress: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
    bgColor: string;
  }>;
  assessorQueue: Array<{
    id: string;
    name: string;
    governanceArea: string;
    pendingReviews: number;
    averageReviewTime: string;
    status: 'active' | 'overloaded' | 'available';
  }>;
  failedIndicators: Array<{
    id: string;
    code: string;
    name: string;
    failedCount: number;
    totalBarangays: number;
    percentage: number;
    governanceArea: string;
  }>;
  municipality: string;
  performanceYear: string;
  assessmentYear: string;
  totalBarangays: number;
}

// Mock data for development
const mockAdminDashboardData: AdminDashboardData = {
  kpiData: {
    barangaySubmissions: { current: 18, total: 25 },
    awaitingReview: 7,
    inRework: 4,
    validatedReady: 7,
  },
  municipalProgress: [
    {
      status: 'Validated',
      count: 7,
      percentage: 28,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      status: 'Submitted for Review',
      count: 7,
      percentage: 28,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      status: 'In Rework',
      count: 4,
      percentage: 16,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      status: 'In Progress',
      count: 4,
      percentage: 16,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      status: 'Not Started',
      count: 3,
      percentage: 12,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ],
  assessorQueue: [
    {
      id: '1',
      name: 'Maria Santos',
      governanceArea: 'Environmental Management',
      pendingReviews: 8,
      averageReviewTime: '2.3 days',
      status: 'overloaded',
    },
    {
      id: '2',
      name: 'Juan Dela Cruz',
      governanceArea: 'Financial Administration',
      pendingReviews: 5,
      averageReviewTime: '1.8 days',
      status: 'active',
    },
    {
      id: '3',
      name: 'Ana Reyes',
      governanceArea: 'Disaster Preparedness',
      pendingReviews: 3,
      averageReviewTime: '2.1 days',
      status: 'active',
    },
    {
      id: '4',
      name: 'Pedro Martinez',
      governanceArea: 'Social Protection',
      pendingReviews: 0,
      averageReviewTime: '1.5 days',
      status: 'available',
    },
    {
      id: '5',
      name: 'Carmen Lopez',
      governanceArea: 'Safety, Peace and Order',
      pendingReviews: 6,
      averageReviewTime: '2.7 days',
      status: 'overloaded',
    },
  ],
  failedIndicators: [
    {
      id: '1',
      code: '3.1.5',
      name: 'Formulation of BADAC Plan of Action',
      failedCount: 12,
      totalBarangays: 25,
      percentage: 48,
      governanceArea: 'Safety, Peace and Order',
    },
    {
      id: '2',
      code: '2.1.3',
      name: 'Environmental Compliance Certificate',
      failedCount: 10,
      totalBarangays: 25,
      percentage: 40,
      governanceArea: 'Environmental Management',
    },
    {
      id: '3',
      code: '1.2.1',
      name: 'Annual Budget Preparation',
      failedCount: 8,
      totalBarangays: 25,
      percentage: 32,
      governanceArea: 'Financial Administration',
    },
    {
      id: '4',
      code: '4.1.2',
      name: 'Disaster Risk Reduction Plan',
      failedCount: 7,
      totalBarangays: 25,
      percentage: 28,
      governanceArea: 'Disaster Preparedness',
    },
    {
      id: '5',
      code: '5.1.1',
      name: 'Social Welfare Programs Implementation',
      failedCount: 6,
      totalBarangays: 25,
      percentage: 24,
      governanceArea: 'Social Protection',
    },
    {
      id: '6',
      code: '6.1.3',
      name: 'Business Registration Process',
      failedCount: 5,
      totalBarangays: 25,
      percentage: 20,
      governanceArea: 'Business-Friendliness',
    },
    {
      id: '7',
      code: '2.2.1',
      name: 'Waste Management System',
      failedCount: 4,
      totalBarangays: 25,
      percentage: 16,
      governanceArea: 'Environmental Management',
    },
    {
      id: '8',
      code: '1.1.2',
      name: 'Financial Reports Submission',
      failedCount: 3,
      totalBarangays: 25,
      percentage: 12,
      governanceArea: 'Financial Administration',
    },
  ],
  municipality: 'Municipality of Sulop',
  performanceYear: '2023',
  assessmentYear: '2024',
  totalBarangays: 25,
};

// Query keys for the admin dashboard
const adminDashboardKeys = {
  all: ['admin-dashboard'] as const,
  data: (year?: string) => [...adminDashboardKeys.all, 'data', year] as const,
};

// Mock API function - replace with actual API call
const fetchAdminDashboardData = async (year?: string): Promise<AdminDashboardData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would be:
  // return adminDashboard.adminDashboardGetData({ year });
  
  return {
    ...mockAdminDashboardData,
    assessmentYear: year || mockAdminDashboardData.assessmentYear,
  };
};

export function useAdminDashboard(year?: string) {
  return useQuery({
    queryKey: adminDashboardKeys.data(year),
    queryFn: () => fetchAdminDashboardData(year),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
} 