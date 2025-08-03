"use client";

import { PageHeader } from "@/components/shared";
import { useState, useEffect } from "react";
import { SystemicWeakness } from "@/components/features/analytics/AssessorAnalyticsTypes";
import { generateAssessorData } from "@/components/features/analytics/AssessorAnalyticsData";
import { useAssessorGovernanceArea } from "@/hooks/useAssessorGovernanceArea";
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
  
  const { governanceAreaName, isLoading: governanceAreaLoading } = useAssessorGovernanceArea();

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

  // Show loading if either the page is loading or governance area is loading
  if (isLoading || governanceAreaLoading) {
    return <AnalyticsSkeleton />;
  }

  // Use real governance area name or fallback to Environmental Management
  const areaName = governanceAreaName || "Environmental Management";
  
  // Generate data based on the real governance area
  const assessorData = generateAssessorData(areaName);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Area: ${areaName}`}
        description={`Performance trends for all ${assessorData.assignedBarangays} barangays in your assigned area.`}
      />

      <GlobalFilter data={assessorData} />

      <div className="mt-6 space-y-6">
        <PerformanceOverviewWidget data={assessorData} />
        <PerformanceHotspotsWidget data={assessorData} onWeaknessClick={handleWeaknessClick} />
        <WorkflowMetricsWidget data={assessorData} />
      </div>

      <WeaknessDetailModal
        weakness={selectedWeakness}
        data={assessorData}
        isOpen={showWeaknessModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
