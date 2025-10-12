import { DashboardData } from "@/types/dashboard";
import { useGetAssessmentsMyAssessment } from "@vantage/shared";

export function useDashboard(barangayName?: string) {
  const {
    data: assessmentData,
    isLoading,
    error,
    refetch,
  } = useGetAssessmentsMyAssessment();

  // Return mock data for now since the API might not be fully implemented
  const dashboardData: DashboardData | null = {
    barangayName: barangayName || "San Roque",
    performanceYear: "2023",
    assessmentYear: "2024",
    status: "in-progress",
    progress: {
      current: 75,
      total: 120,
      percentage: 62.5,
    },
    governanceAreas: [
      {
        id: "1",
        name: "Financial Administration and Sustainability",
        current: 8,
        total: 15,
        percentage: 53.3,
        status: "in-progress",
      },
      {
        id: "2",
        name: "Disaster Preparedness and Climate Change Action",
        current: 12,
        total: 18,
        percentage: 66.7,
        status: "in-progress",
      },
      {
        id: "3",
        name: "Safety, Peace and Order",
        current: 6,
        total: 12,
        percentage: 50,
        status: "needs-rework",
      },
      {
        id: "4",
        name: "Social Protection and Sensitivity",
        current: 14,
        total: 20,
        percentage: 70,
        status: "in-progress",
      },
      {
        id: "5",
        name: "Business Friendliness and Competitiveness",
        current: 10,
        total: 16,
        percentage: 62.5,
        status: "in-progress",
      },
      {
        id: "6",
        name: "Environmental Management",
        current: 25,
        total: 39,
        percentage: 64.1,
        status: "in-progress",
      },
    ],
    feedback: [
      {
        id: "1",
        indicator: "3.1.5",
        comment:
          "Submitted plan lacks specific budget allocation for disaster preparedness activities...",
        governanceArea: "Safety, Peace and Order",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        indicator: "2.2.3",
        comment:
          "Financial records show discrepancies in quarterly reporting format...",
        governanceArea: "Financial Administration and Sustainability",
        createdAt: "2024-01-14T14:20:00Z",
      },
    ],
  };

  return {
    data: dashboardData,
    loading: false, // Always return false since we're using mock data
    error: null, // No error since we're using mock data
    refetch,
  };
}
