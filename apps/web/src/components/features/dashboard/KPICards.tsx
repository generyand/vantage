'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
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
    default: {
      bgGradient: 'from-blue-50/80 via-indigo-50/60 to-purple-50/40',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      accentColor: 'text-blue-600'
    },
    success: {
      bgGradient: 'from-emerald-50/80 via-green-50/60 to-teal-50/40',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      accentColor: 'text-green-600'
    },
    warning: {
      bgGradient: 'from-amber-50/80 via-orange-50/60 to-red-50/40',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      accentColor: 'text-orange-600'
    },
    danger: {
      bgGradient: 'from-red-50/80 via-pink-50/60 to-rose-50/40',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      accentColor: 'text-red-600'
    }
  };

  const config = variantStyles[variant];

  return (
    <Card className={`relative overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 dark:bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 dark:bg-white/3 rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </CardTitle>
          <div className={cn('p-3 rounded-sm shadow-sm', config.iconBg)}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="text-3xl font-bold text-[var(--foreground)]">
            {value}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            {description}
          </p>
          {showProgress && progress !== undefined && (
            <div className="space-y-2 bg-[var(--hover)] backdrop-blur-sm rounded-sm p-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[var(--foreground)]">Progress</span>
                <span className={cn('text-xs font-bold', config.accentColor)}>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-[var(--border)]"
              />
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