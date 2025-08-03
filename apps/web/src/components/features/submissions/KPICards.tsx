'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionsKPI } from '@/types/submissions';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface KPICardsProps {
  kpi: SubmissionsKPI;
}

export function KPICards({ kpi }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Awaiting Review */}
      <Card className="border-[var(--border)] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 hover:shadow-md transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Awaiting Your Review
          </CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            {kpi.awaitingReview}
          </div>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
            Submissions ready for assessment
          </p>
          {kpi.awaitingReview > 0 && (
            <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((kpi.awaitingReview / 25) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In Rework */}
      <Card className="border-[var(--border)] bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 hover:shadow-md transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            Barangays in Rework
          </CardTitle>
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-1">
            {kpi.inRework}
          </div>
          <p className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
            Addressing feedback
          </p>
          {kpi.inRework > 0 && (
            <div className="mt-2 w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1">
              <div 
                className="bg-orange-600 dark:bg-orange-400 h-1 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((kpi.inRework / 25) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validated */}
      <Card className="border-[var(--border)] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 hover:shadow-md transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">
            Validated by You
          </CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
            {kpi.validated}
          </div>
          <p className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
            Successfully completed
          </p>
          {kpi.validated > 0 && (
            <div className="mt-2 w-full bg-green-200 dark:bg-green-800 rounded-full h-1">
              <div 
                className="bg-green-600 dark:bg-green-400 h-1 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((kpi.validated / 25) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Average Review Time */}
      <Card className="border-[var(--border)] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 hover:shadow-md transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            Average Review Time
          </CardTitle>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
            {kpi.avgReviewTime}
          </div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">
            Days per submission
          </p>
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-600/70 dark:text-purple-400/70">Real-time metric</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 