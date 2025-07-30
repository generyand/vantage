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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Live Status of All Barangays
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of {totalBarangays} barangays across assessment stages
        </p>
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
                    <div className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={cn('text-xs font-medium', config.bgColor, config.color)}
                          >
                            {item.status}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {item.count}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.percentage}%
                        </span>
                      </div>
                      
                      <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-500 ease-out rounded-lg',
                            config.bgColor
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-foreground">
                            {item.count} Barangays
                          </span>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">{item.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} Barangays ({item.percentage}%)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Barangays: {totalBarangays}</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 