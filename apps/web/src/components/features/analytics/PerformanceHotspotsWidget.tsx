"use client";

import { AssessorData, SystemicWeakness } from "./AssessorAnalyticsTypes";
import { getSeverityLevel, calculateImpactPercentage } from "./AssessorAnalyticsUtils";

interface PerformanceHotspotsWidgetProps {
  data: AssessorData;
  onWeaknessClick: (weakness: SystemicWeakness) => void;
}

export function PerformanceHotspotsWidget({ data, onWeaknessClick }: PerformanceHotspotsWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Common Performance Hotspots in {data.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

          return (
            <div
              key={index}
              className="group bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-sm p-5 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md"
              onClick={() => onWeaknessClick(weakness)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full bg-${severity.color}-500`}></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severity.color}-100 dark:bg-${severity.color}-900/50 text-${severity.color}-700 dark:text-${severity.color}-300`}>
                      {severity.level}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-purple-900 dark:group-hover:text-purple-300 transition-colors">
                    {weakness.indicator}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Failed by {weakness.failedCount} of{" "}
                    {data.assignedBarangays} barangays
                  </p>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {/* Enhanced Progress Bar */}
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Impact
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {impactPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 bg-${severity.color}-500`}
                        style={{
                          width: `${impactPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {weakness.failedCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      failures
                    </div>
                  </div>

                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
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