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
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Official Performance in {data.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                className="text-gray-200 dark:text-gray-700"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Passed segment */}
              <path
                className="text-emerald-500"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={`${passedPercentage} ${100 - passedPercentage}`}
                strokeDashoffset="25"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Failed segment */}
              <path
                className="text-red-500"
                stroke="currentColor"
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
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {performance.passed} / {performance.totalAssessed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Passers</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Passed ({performance.passed})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Failed ({performance.failed})
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Key Data Points */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-sm p-4 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Total Barangays Assessed
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {performance.totalAssessed}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-sm p-4 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                Pass Rate for this Area
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                  {performance.passRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-sm p-4 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <span className="text-red-700 dark:text-red-300 font-medium">
                Failed Barangays
              </span>
              <span className="text-2xl font-bold text-red-800 dark:text-red-200">
                {performance.failed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 