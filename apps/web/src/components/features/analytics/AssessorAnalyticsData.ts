import { AssessorData } from './AssessorAnalyticsTypes';

// Mock data for the MENRO (Environmental Management) assessor
export const mockAssessorData: AssessorData = {
  name: "Environmental Management",
  assignedBarangays: 25,
  assessmentPeriod: "SGLGB 2024",
  performance: {
    totalAssessed: 25,
    passed: 15,
    failed: 10,
    passRate: 60,
  },
  systemicWeaknesses: [
    {
      indicator: "6.1.1: Organized BESWMC",
      failedCount: 18,
      barangays: [
        "Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E",
        "Barangay F", "Barangay G", "Barangay H", "Barangay I", "Barangay J",
        "Barangay K", "Barangay L", "Barangay M", "Barangay N", "Barangay O",
        "Barangay P", "Barangay Q", "Barangay R",
      ],
    },
    {
      indicator: "6.2.1: Presence of a Materials Recovery Facility",
      failedCount: 15,
      barangays: [
        "Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E",
        "Barangay F", "Barangay G", "Barangay H", "Barangay I", "Barangay J",
        "Barangay K", "Barangay L", "Barangay M", "Barangay N", "Barangay O",
      ],
    },
    {
      indicator: "6.3.1: Implementation of Solid Waste Management",
      failedCount: 12,
      barangays: [
        "Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E",
        "Barangay F", "Barangay G", "Barangay H", "Barangay I", "Barangay J",
        "Barangay K", "Barangay L",
      ],
    },
    {
      indicator: "6.4.1: Tree Planting and Greening Programs",
      failedCount: 8,
      barangays: [
        "Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E",
        "Barangay F", "Barangay G", "Barangay H",
      ],
    },
    {
      indicator: "6.5.1: Environmental Protection Initiatives",
      failedCount: 5,
      barangays: [
        "Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E",
      ],
    },
  ],
  workflowMetrics: {
    avgTimeToFirstReview: 1.8,
    avgReworkCycleTime: 4.2,
    totalReviewed: 25,
    reworkRate: 60,
  },
}; 