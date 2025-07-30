'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  municipality: string;
  performanceYear: string;
  assessmentYear: string;
  onAssessmentYearChange?: (year: string) => void;
  availableYears?: string[];
}

export function DashboardHeader({ 
  municipality, 
  performanceYear, 
  assessmentYear, 
  onAssessmentYearChange,
  availableYears = ['2024', '2023', '2022']
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Municipal SGLGB Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <span className="text-lg">
            {municipality} | Performance Year {performanceYear}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Assessment Year:</span>
        </div>
        <Select 
          value={assessmentYear} 
          onValueChange={onAssessmentYearChange}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 