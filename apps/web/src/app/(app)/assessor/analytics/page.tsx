"use client";

import { PageHeader } from "@/components/shared";
import { useState, useEffect } from "react";
import { SystemicWeakness } from "@/components/features/analytics/AssessorAnalyticsTypes";
import { mockAssessorData } from "@/components/features/analytics/AssessorAnalyticsData";
import {
  GlobalFilter,
  PerformanceOverviewWidget,
  PerformanceHotspotsWidget,
  WorkflowMetricsWidget,
  WeaknessDetailModal,
  AnalyticsSkeleton,
} from "@/components/features/analytics";

export default function AssessorAnalyticsPage() {
  const [selectedWeakness, setSelectedWeakness] = useState<SystemicWeakness | null>(null);
  const [showWeaknessModal, setShowWeaknessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleWeaknessClick = (weakness: SystemicWeakness) => {
    setSelectedWeakness(weakness);
    setShowWeaknessModal(true);
  };

  const handleCloseModal = () => {
    setShowWeaknessModal(false);
    setSelectedWeakness(null);
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Area: ${mockAssessorData.name}`}
        description={`Performance trends for all ${mockAssessorData.assignedBarangays} barangays in your assigned area.`}
      />

      <GlobalFilter data={mockAssessorData} />

      <div className="mt-6 space-y-6">
        <PerformanceOverviewWidget data={mockAssessorData} />
        <PerformanceHotspotsWidget data={mockAssessorData} onWeaknessClick={handleWeaknessClick} />
        <WorkflowMetricsWidget data={mockAssessorData} />
      </div>

      <WeaknessDetailModal
        weakness={selectedWeakness}
        data={mockAssessorData}
        isOpen={showWeaknessModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
