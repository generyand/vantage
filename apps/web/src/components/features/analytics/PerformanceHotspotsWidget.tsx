"use client";

import { AssessorData, SystemicWeakness } from "./AssessorAnalyticsTypes";
import { getSeverityLevel, calculateImpactPercentage } from "./AssessorAnalyticsUtils";

interface PerformanceHotspotsWidgetProps {
  data: AssessorData;
  onWeaknessClick: (weakness: SystemicWeakness) => void;
}

export function PerformanceHotspotsWidget({ data, onWeaknessClick }: PerformanceHotspotsWidgetProps) {
  return (
    <div className="bg-[var(--card)] rounded-sm border border-[var(--border)] p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--foreground)]">
          Common Performance Hotspots in {data.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Click for details</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.systemicWeaknesses.map((weakness, index) => {
          const severity = getSeverityLevel(weakness.failedCount);
          const impactPercentage = calculateImpactPercentage(weakness.failedCount, data.assignedBarangays);

          const getSeverityColors = (color: string) => {
            switch (color) {
              case 'red':
                return {
                  indicator: 'var(--analytics-danger)',
                  badgeBg: 'var(--analytics-danger-bg)',
                  badgeText: 'var(--analytics-danger-text)',
                  progressBar: 'var(--analytics-danger)'
                };
              case 'orange':
                return {
                  indicator: 'var(--analytics-warning)',
                  badgeBg: 'var(--analytics-warning-bg)',
                  badgeText: 'var(--analytics-warning-text)',
                  progressBar: 'var(--analytics-warning)'
                };
              case 'yellow':
                return {
                  indicator: 'var(--analytics-warning)',
                  badgeBg: 'var(--analytics-warning-bg)',
                  badgeText: 'var(--analytics-warning-text)',
                  progressBar: 'var(--analytics-warning)'
                };
              default:
                return {
                  indicator: 'var(--analytics-neutral)',
                  badgeBg: 'var(--analytics-neutral-bg)',
                  badgeText: 'var(--analytics-neutral-text)',
                  progressBar: 'var(--analytics-neutral)'
                };
            }
          };
          
          const colors = getSeverityColors(severity.color);

          return (
            <div
              key={index}
              className="group rounded-sm p-5 cursor-pointer border hover:shadow-md transition-all duration-200"
              style={{
                backgroundColor: 'var(--analytics-neutral-bg)',
                borderColor: 'var(--analytics-neutral-border)'
              }}
              onClick={() => onWeaknessClick(weakness)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.indicator }}
                    ></div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: colors.badgeBg,
                        color: colors.badgeText
                      }}
                    >
                      {severity.level}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-1 transition-colors text-[var(--foreground)]">
                    {weakness.indicator}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Failed by {weakness.failedCount} of{" "}
                    {data.assignedBarangays} barangays
                  </p>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {/* Enhanced Progress Bar */}
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--text-muted)]">
                        Impact
                      </span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {impactPercentage}%
                      </span>
                    </div>
                    <div 
                      className="w-full rounded-full h-2.5"
                      style={{ backgroundColor: 'var(--analytics-neutral-border)' }}
                    >
                      <div
                        className="h-2.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: colors.progressBar,
                          width: `${impactPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--foreground)]">
                      {weakness.failedCount}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      failures
                    </div>
                  </div>

                  <svg
                    className="w-5 h-5 text-[var(--text-muted)] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 