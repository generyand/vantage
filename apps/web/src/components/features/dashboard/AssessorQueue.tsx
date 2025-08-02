'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssessorData {
  id: string;
  name: string;
  governanceArea: string;
  pendingReviews: number;
  averageReviewTime: string;
  status: 'active' | 'overloaded' | 'available';
}

interface AssessorQueueProps {
  data: AssessorData[];
}

const getStatusConfig = (status: AssessorData['status']) => {
  switch (status) {
    case 'overloaded':
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        label: 'Overloaded'
      };
    case 'active':
      return {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        label: 'Active'
      };
    case 'available':
      return {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        label: 'Available'
      };
    default:
      return {
        color: 'text-gray-600 dark:text-gray-300',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        label: 'Unknown'
      };
  }
};

export function AssessorQueue({ data }: AssessorQueueProps) {
  const totalPending = data.reduce((sum, assessor) => sum + assessor.pendingReviews, 0);
  const overloadedAssessors = data.filter(a => a.status === 'overloaded').length;

  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-600 rounded-sm"></div>
            <div>
              <CardTitle className="text-xl font-bold text-[var(--foreground)]">
                Assessor Queue
              </CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Current workload and performance metrics
              </p>
            </div>
          </div>
          <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm border border-[var(--border)]">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {totalPending}
            </div>
            <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              Total Pending
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {overloadedAssessors > 0 && (
            <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/60 rounded-sm p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-sm flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
                </div>
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  {overloadedAssessors} assessor{overloadedAssessors > 1 ? 's' : ''} 
                  {overloadedAssessors > 1 ? ' are' : ' is'} overloaded and may need assistance
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {data.map((assessor) => {
              const statusConfig = getStatusConfig(assessor.status);
              const isOverloaded = assessor.pendingReviews > 5;
              
              return (
                <div 
                  key={assessor.id}
                  className={cn(
                    'p-4 rounded-sm border transition-all duration-200 hover:shadow-md',
                    isOverloaded 
                      ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200/60 dark:border-red-800/60' 
                      : assessor.pendingReviews === 0
                      ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200/60 dark:border-green-800/60 opacity-80'
                      : 'bg-[var(--hover)] backdrop-blur-sm border-[var(--border)] hover:border-[var(--border)]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    {/* Assessor Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-[var(--foreground)]">
                          {assessor.name}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs font-medium rounded-sm', statusConfig.bgColor, statusConfig.color)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {assessor.governanceArea}
                      </p>
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={cn(
                          'text-2xl font-bold',
                          assessor.pendingReviews > 5 && 'text-red-600',
                          assessor.pendingReviews > 0 && assessor.pendingReviews <= 5 && 'text-orange-600',
                          assessor.pendingReviews === 0 && 'text-green-600'
                        )}>
                          {assessor.pendingReviews}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-[var(--foreground)]">
                          {assessor.averageReviewTime}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">Avg. Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-[var(--hover)] rounded-sm p-4 space-y-2">
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Performance Insights</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span>High pending reviews (&gt;5) indicate potential bottlenecks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Average review time helps identify performance patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Consider redistributing workload for overloaded assessors</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 