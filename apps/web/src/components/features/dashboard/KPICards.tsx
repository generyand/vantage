'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck,
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  showProgress?: boolean;
}

const KPICard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = 'default',
  progress,
  showProgress = false 
}: KPICardProps) => {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-orange-50 text-orange-600',
    danger: 'bg-red-50 text-red-600'
  };

  const progressColors = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    danger: 'bg-red-600'
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn('p-2 rounded-lg', variantStyles[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          {showProgress && progress !== undefined && (
            <div className="space-y-1">
              <Progress 
                value={progress} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface KPICardsProps {
  data: {
    barangaySubmissions: { current: number; total: number };
    awaitingReview: number;
    inRework: number;
    validatedReady: number;
  };
}

export function KPICards({ data }: KPICardsProps) {
  const submissionProgress = Math.round((data.barangaySubmissions.current / data.barangaySubmissions.total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Barangay Submissions"
        value={`${data.barangaySubmissions.current} / ${data.barangaySubmissions.total}`}
        description="Total submissions received"
        icon={TrendingUp}
        variant="default"
        progress={submissionProgress}
        showProgress={true}
      />
      
      <KPICard
        title="Awaiting Assessor Review"
        value={data.awaitingReview.toString()}
        description="Submissions waiting for validation"
        icon={Clock}
        variant="warning"
      />
      
      <KPICard
        title="Barangays in Rework"
        value={data.inRework.toString()}
        description="Currently fixing issues"
        icon={AlertTriangle}
        variant="warning"
      />
      
      <KPICard
        title="Validated & Ready"
        value={data.validatedReady.toString()}
        description="Ready for offline validation"
        icon={CheckCircle2}
        variant="success"
      />
    </div>
  );
} 