"use client";

import { AssessorData } from "./AssessorAnalyticsTypes";

interface WorkflowMetricsWidgetProps {
  data: AssessorData;
}

export function WorkflowMetricsWidget({ data }: WorkflowMetricsWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Your Assessment Workflow Metrics
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>Performance Overview</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Enhanced Efficiency Metrics */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Efficiency Metrics
          </h4>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-sm p-4 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Avg. Time to First Review
                  </span>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Response efficiency
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {data.workflowMetrics.avgTimeToFirstReview}
                  </span>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Days</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-sm p-4 border border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-orange-700 dark:text-orange-300 font-medium">
                    Avg. Rework Cycle Time
                  </span>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Revision turnaround
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {data.workflowMetrics.avgReworkCycleTime}
                  </span>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Outcomes */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Outcomes
          </h4>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-sm p-4 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Total Submissions Reviewed
                  </span>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Completion progress
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {data.workflowMetrics.totalReviewed}
                  </span>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    of {data.assignedBarangays}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-sm p-4 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-purple-700 dark:text-purple-300 font-medium">
                    Rework Rate
                  </span>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Quality indicator
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {data.workflowMetrics.reworkRate}%
                  </span>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    Required Rework
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 