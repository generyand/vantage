'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp } from 'lucide-react';
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
  if (percentage >= 50) return 'text-red-600 bg-red-50';
  if (percentage >= 30) return 'text-orange-600 bg-orange-50';
  if (percentage >= 15) return 'text-yellow-600 bg-yellow-50';
  return 'text-gray-600 bg-gray-50';
};

const getGovernanceAreaColor = (area: string) => {
  const colors = {
    'Environmental Management': 'text-green-600 bg-green-50',
    'Financial Administration': 'text-blue-600 bg-blue-50',
    'Disaster Preparedness': 'text-purple-600 bg-purple-50',
    'Social Protection': 'text-pink-600 bg-pink-50',
    'Safety, Peace and Order': 'text-red-600 bg-red-50',
    'Business-Friendliness': 'text-indigo-600 bg-indigo-50',
  };
  return colors[area as keyof typeof colors] || 'text-gray-600 bg-gray-50';
};

export function FailedIndicators({ data, totalBarangays }: FailedIndicatorsProps) {
  const criticalIssues = data.filter(item => item.percentage >= 30).length;
  const totalFailures = data.reduce((sum, item) => sum + item.failedCount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Most Commonly Failed Indicators
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Systemic weaknesses requiring municipal-level training
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {criticalIssues}
            </div>
            <div className="text-xs text-muted-foreground">
              Critical Issues
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criticalIssues > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-orange-700">
                  {criticalIssues} indicator{criticalIssues > 1 ? 's' : ''} with 30%+ failure rate 
                  - consider organizing focused training sessions
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {data.slice(0, 8).map((indicator, index) => (
              <div 
                key={indicator.id}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  indicator.percentage >= 30 && 'bg-red-50 border-red-200',
                  indicator.percentage >= 15 && indicator.percentage < 30 && 'bg-orange-50 border-orange-200',
                  indicator.percentage < 15 && 'bg-gray-50 border-gray-200'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={cn('text-xs', getGovernanceAreaColor(indicator.governanceArea))}
                      >
                        {indicator.governanceArea}
                      </Badge>
                      <span className="text-sm font-mono text-muted-foreground">
                        {indicator.code}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm text-foreground">
                      {indicator.name}
                    </h4>
                  </div>
                  <div className="text-right ml-4">
                    <div className={cn(
                      'text-lg font-bold',
                      getSeverityColor(indicator.percentage).split(' ')[0]
                    )}>
                      {indicator.failedCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {totalBarangays}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Failure Rate</span>
                    <span className={cn(
                      'font-medium',
                      getSeverityColor(indicator.percentage).split(' ')[0]
                    )}>
                      {indicator.percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={indicator.percentage} 
                    className="h-1.5"
                  />
                </div>
                
                {indicator.percentage >= 30 && (
                  <div className="mt-2 p-2 bg-white rounded border border-red-200">
                    <p className="text-xs text-red-700">
                      🎯 Priority: High failure rate suggests need for municipal-level 
                      training on {indicator.name.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {data.length > 8 && (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Showing top 8 indicators • {data.length - 8} more indicators available
              </p>
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total Failures: {totalFailures}</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 