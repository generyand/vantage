"use client";

import { AssessorData } from "./AssessorAnalyticsTypes";

interface PerformanceOverviewWidgetProps {
  data: AssessorData;
}

export function PerformanceOverviewWidget({ data }: PerformanceOverviewWidgetProps) {
  const { performance } = data;
  const passedPercentage = (performance.passed / performance.totalAssessed) * 100;
  const failedPercentage = (performance.failed / performance.totalAssessed) * 100;

  return (
    <div className="bg-[var(--card)] rounded-sm border border-[var(--border)] p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--foreground)]">
          Official Performance in {data.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: 'var(--analytics-success)' }}
          ></div>
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Donut Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 mb-6">
            <svg
              className="w-56 h-56 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              {/* Background circle */}
              <path
                stroke="var(--analytics-neutral-border)"
                strokeWidth="2.5"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Passed segment */}
              <path
                stroke="var(--analytics-success)"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={`${passedPercentage} ${100 - passedPercentage}`}
                strokeDashoffset="25"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Failed segment */}
              <path
                stroke="var(--analytics-danger)"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={`${failedPercentage} ${100 - failedPercentage}`}
                strokeDashoffset={`${25 - passedPercentage}`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
                  {performance.passed} / {performance.totalAssessed}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Passers</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: 'var(--analytics-success)' }}
              ></div>
              <span className="text-sm text-[var(--text-primary)]">
                Passed ({performance.passed})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: 'var(--analytics-danger)' }}
              ></div>
              <span className="text-sm text-[var(--text-primary)]">
                Failed ({performance.failed})
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Key Data Points */}
        <div className="space-y-4">
          <div 
            className="rounded-sm p-4 border hover:opacity-90 transition-all duration-200"
            style={{
              backgroundColor: 'var(--analytics-neutral-bg)',
              borderColor: 'var(--analytics-neutral-border)'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: 'var(--analytics-neutral-text)' }}>
                Total Barangays Assessed
              </span>
              <span className="text-2xl font-bold text-[var(--foreground)]">
                {performance.totalAssessed}
              </span>
            </div>
          </div>

          <div 
            className="rounded-sm p-4 border hover:opacity-90 transition-all duration-200"
            style={{
              backgroundColor: 'var(--analytics-success-bg)',
              borderColor: 'var(--analytics-success-border)'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: 'var(--analytics-success-text)' }}>
                Pass Rate for this Area
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: 'var(--analytics-success-text-light)' }}>
                  {performance.passRate}%
                </span>
              </div>
            </div>
          </div>

          <div 
            className="rounded-sm p-4 border hover:opacity-90 transition-all duration-200"
            style={{
              backgroundColor: 'var(--analytics-danger-bg)',
              borderColor: 'var(--analytics-danger-border)'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: 'var(--analytics-danger-text)' }}>
                Failed Barangays
              </span>
              <span className="text-2xl font-bold" style={{ color: 'var(--analytics-danger-text-light)' }}>
                {performance.failed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 