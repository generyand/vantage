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
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-600 rounded-sm"></div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Most Commonly Failed Indicators
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Systemic weaknesses requiring municipal-level training
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {criticalIssues}
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Critical Issues
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {criticalIssues > 0 && (
            <div className="bg-gradient-to-r from-orange-50/80 to-red-50/60 border border-orange-200/60 rounded-sm p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-sm flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm text-orange-800 font-medium">
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
                  indicator.percentage >= 30 && 'bg-gradient-to-r from-red-50/80 to-pink-50/60 border-red-200/60',
                  indicator.percentage >= 15 && indicator.percentage < 30 && 'bg-gradient-to-r from-orange-50/80 to-yellow-50/60 border-orange-200/60',
                  indicator.percentage < 15 && 'bg-white/60 backdrop-blur-sm border-gray-200/50 hover:border-gray-300/80'
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
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-sm">
                        {indicator.code}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 leading-relaxed">
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
                    <div className="text-xs text-gray-600">
                      of {totalBarangays}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">Failure Rate</span>
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
                      className="h-2 bg-gray-200/60"
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
                  <div className="mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-sm border border-red-200/60">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 text-sm">🎯</span>
                      <p className="text-xs text-red-800 leading-relaxed">
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
            <div className="text-center py-3 bg-gray-50/50 rounded-sm">
              <p className="text-sm text-gray-600">
                Showing top 8 indicators • <span className="font-semibold">{data.length - 8}</span> more indicators available
              </p>
            </div>
          )}
          
          <div className="bg-gray-50/50 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Total Failures: {totalFailures}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 