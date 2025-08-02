"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Calendar, BarChart3 } from "lucide-react";

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
  availableYears = ["2024", "2023", "2022"],
}: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg p-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/20 dark:bg-blue-900/20 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100/20 dark:bg-purple-900/20 rounded-full translate-y-16 -translate-x-16"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left side - Title and Municipality */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                Municipal{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SGLGB
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-[var(--card)]/60 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-[var(--border)]">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-[var(--muted-foreground)]">
                  Municipality:
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {municipality}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--card)]/60 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-[var(--border)]">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-[var(--muted-foreground)]">
                  Performance Year:
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {performanceYear}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Assessment Year Selector */}
          <div className="flex items-center gap-4">
            <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-sm p-4 shadow-sm border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                    Assessment Year
                  </span>
                  <Select
                    value={assessmentYear}
                    onValueChange={onAssessmentYearChange}
                  >
                    <SelectTrigger className="w-20 h-8 text-sm font-semibold border-0 bg-transparent p-0 focus:ring-0">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
