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
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: 'Overloaded'
      };
    case 'active':
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        label: 'Active'
      };
    case 'available':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: 'Available'
      };
    default:
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        label: 'Unknown'
      };
  }
};

export function AssessorQueue({ data }: AssessorQueueProps) {
  const totalPending = data.reduce((sum, assessor) => sum + assessor.pendingReviews, 0);
  const overloadedAssessors = data.filter(a => a.status === 'overloaded').length;

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-600 rounded-sm"></div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Assessor Queue
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Current workload and performance metrics
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {totalPending}
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Total Pending
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {overloadedAssessors > 0 && (
            <div className="bg-gradient-to-r from-red-50/80 to-orange-50/60 border border-red-200/60 rounded-sm p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-sm flex items-center justify-center">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
                <p className="text-sm text-red-800 font-medium">
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
                      ? 'bg-gradient-to-r from-red-50/80 to-orange-50/60 border-red-200/60' 
                      : assessor.pendingReviews === 0
                      ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/60 border-green-200/60 opacity-80'
                      : 'bg-white/60 backdrop-blur-sm border-gray-200/50 hover:border-gray-300/80'
                  )}
                >
                  <div className="flex items-center justify-between">
                    {/* Assessor Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {assessor.name}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs font-medium rounded-sm', statusConfig.bgColor, statusConfig.color)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
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
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {assessor.averageReviewTime}
                        </div>
                        <div className="text-xs text-gray-600">Avg. Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gray-50/50 rounded-sm p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Performance Insights</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
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