'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Assessor Queue
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current workload and performance metrics
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {totalPending}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Pending
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {overloadedAssessors > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                ⚠️ {overloadedAssessors} assessor{overloadedAssessors > 1 ? 's' : ''} 
                {overloadedAssessors > 1 ? ' are' : ' is'} overloaded and may need assistance
              </p>
            </div>
          )}
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Assessor Name</TableHead>
                  <TableHead className="font-medium">Governance Area</TableHead>
                  <TableHead className="font-medium text-center">Pending Reviews</TableHead>
                  <TableHead className="font-medium text-center">Avg. Review Time</TableHead>
                  <TableHead className="font-medium text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((assessor) => {
                  const statusConfig = getStatusConfig(assessor.status);
                  const isOverloaded = assessor.pendingReviews > 5;
                  
                  return (
                    <TableRow 
                      key={assessor.id}
                      className={cn(
                        isOverloaded && 'bg-orange-50/50',
                        assessor.pendingReviews === 0 && 'opacity-60'
                      )}
                    >
                      <TableCell className="font-medium">
                        {assessor.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {assessor.governanceArea}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          'font-semibold',
                          assessor.pendingReviews > 5 && 'text-red-600',
                          assessor.pendingReviews > 0 && assessor.pendingReviews <= 5 && 'text-orange-600'
                        )}>
                          {assessor.pendingReviews}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {assessor.averageReviewTime}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs', statusConfig.bgColor, statusConfig.color)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• High pending reviews (>5) indicate potential bottlenecks</p>
            <p>• Average review time helps identify performance patterns</p>
            <p>• Consider redistributing workload for overloaded assessors</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 