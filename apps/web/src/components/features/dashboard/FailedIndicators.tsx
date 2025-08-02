'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FailedIndicator {
  id: string;
  code: string;
  name: string;
  failedCount: number;
  totalBarangays: number;
  percentage: number;
  governanceArea: string;
}

interface FailedIndicatorsProps {
  data: FailedIndicator[];
  totalBarangays: number;
}

const getSeverityColor = (percentage: number) => {
  if (percentage >= 50) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  if (percentage >= 30) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
  if (percentage >= 15) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
  return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/20';
};

const getGovernanceAreaColor = (area: string) => {
  const colors = {
    'Environmental Management': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    'Financial Administration': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    'Disaster Preparedness': 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
    'Social Protection': 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
    'Safety, Peace and Order': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    'Business-Friendliness': 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
  };
  return colors[area as keyof typeof colors] || 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/20';
};

export function FailedIndicators({ data, totalBarangays }: FailedIndicatorsProps) {
  const criticalIssues = data.filter(item => item.percentage >= 30).length;
  const totalFailures = data.reduce((sum, item) => sum + item.failedCount, 0);

  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-600 rounded-sm"></div>
            <div>

              <CardTitle className="text-xl font-bold text-[var(--foreground)]">
                Most Commonly Failed Indicators
              </CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Systemic weaknesses requiring municipal-level training
              </p>
            </div>
          </div>
          <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm border border-[var(--border)]">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {criticalIssues}
            </div>
            <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              Critical Issues
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {criticalIssues > 0 && (
            <div className="bg-orange-50/80 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-800/60 rounded-sm p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-sm flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                  {criticalIssues} indicator{criticalIssues > 1 ? 's' : ''} with 30%+ failure rate 
                  - consider organizing focused training sessions
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
                         {data.slice(0, 8).map((indicator) => (
              <div 
                key={indicator.id}
                className={cn(
                  'p-4 rounded-sm border transition-all duration-200 hover:shadow-md',
                  indicator.percentage >= 30 && 'bg-red-50/80 dark:bg-red-900/20 border-red-200/60 dark:border-red-800/60',
                  indicator.percentage >= 15 && indicator.percentage < 30 && 'bg-orange-50/80 dark:bg-orange-900/20 border-orange-200/60 dark:border-orange-800/60',
                  indicator.percentage < 15 && 'bg-[var(--hover)] backdrop-blur-sm border-[var(--border)] hover:border-[var(--border)]'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge 
                        variant="secondary" 
                        className={cn('text-xs font-medium rounded-sm', getGovernanceAreaColor(indicator.governanceArea))}
                      >
                        {indicator.governanceArea}
                      </Badge>
                      <span className="text-xs font-mono text-[var(--muted-foreground)] bg-[var(--hover)] px-2 py-1 rounded-sm">
                        {indicator.code}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-[var(--foreground)] leading-relaxed">
                      {indicator.name}
                    </h4>
                  </div>
                  <div className="text-right ml-4">
                    <div className={cn(
                      'text-2xl font-bold',
                      getSeverityColor(indicator.percentage).split(' ')[0]
                    )}>
                      {indicator.failedCount}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      of {totalBarangays}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">Failure Rate</span>
                    <span className={cn(
                      'font-bold text-sm',
                      getSeverityColor(indicator.percentage).split(' ')[0]
                    )}>
                      {indicator.percentage}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={indicator.percentage} 
                      className="h-2 bg-[var(--border)]"
                    />
                    <div 
                      className={cn(
                        'absolute top-0 left-0 h-2 rounded-sm transition-all duration-500',
                        indicator.percentage >= 50 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        indicator.percentage >= 30 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        indicator.percentage >= 15 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-gray-400 to-gray-500'
                      )}
                      style={{ width: `${indicator.percentage}%` }}
                    />
                  </div>
                </div>
                
                {indicator.percentage >= 30 && (
                  <div className="mt-3 p-3 bg-[var(--hover)] backdrop-blur-sm rounded-sm border border-red-200/60 dark:border-red-800/60">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 text-sm">🎯</span>
                      <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                        <span className="font-semibold">Priority:</span> High failure rate suggests need for municipal-level 
                        training on {indicator.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {data.length > 8 && (
            <div className="text-center py-3 bg-[var(--hover)] rounded-sm">
              <p className="text-sm text-[var(--muted-foreground)]">
                Showing top 8 indicators • <span className="font-semibold">{data.length - 8}</span> more indicators available
              </p>
            </div>
          )}
          
          <div className="bg-[var(--hover)] rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-[var(--foreground)]">Total Failures: {totalFailures}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[var(--muted-foreground)]">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 