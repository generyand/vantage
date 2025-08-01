'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

interface MunicipalProgressChartProps {
  data: StatusData[];
  totalBarangays: number;
}

const statusConfig = {
  'Validated': { color: 'text-green-600', bgColor: 'bg-green-100' },
  'Submitted for Review': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'In Rework': { color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'In Progress': { color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'Not Started': { color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

export function MunicipalProgressChart({ data, totalBarangays }: MunicipalProgressChartProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm"></div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Live Status of All Barangays
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Distribution of {totalBarangays} barangays across assessment stages
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const config = statusConfig[item.status as keyof typeof statusConfig] || 
                          { color: 'text-gray-600', bgColor: 'bg-gray-100' };
            
            return (
              <TooltipProvider key={item.status}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer p-4 rounded-sm bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="secondary" 
                            className={cn('text-xs font-semibold px-3 py-1 rounded-sm', config.bgColor, config.color)}
                          >
                            {item.status}
                          </Badge>
                          <span className="text-lg font-bold text-gray-900">
                            {item.count}
                          </span>
                          <span className="text-sm text-gray-600">barangays</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-gray-900">
                            {item.percentage}%
                          </span>
                          <div className="text-xs text-gray-500">of total</div>
                        </div>
                      </div>
                      
                      <div className="relative w-full h-3 bg-gray-200/80 rounded-sm overflow-hidden shadow-inner">
                        <div
                          className={cn(
                            'h-full transition-all duration-1000 ease-out rounded-sm',
                            config.bgColor
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                    <div className="text-center p-2">
                      <p className="font-semibold text-gray-900">{item.status}</p>
                      <p className="text-sm text-gray-600">
                        {item.count} Barangays ({item.percentage}%)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200/60">
          <div className="flex items-center justify-between bg-gray-50/50 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Total Barangays: {totalBarangays}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 