
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Calendar,
  Plus,
  MoreHorizontal,
  Save,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SettingsSkeleton } from "@/components/features/settings/SettingsSkeleton";

export default function AdminSettingsPage() {
  const { isAuthenticated } = useAuthStore();
  
  // Mock loading state - in real app this would come from API
  const [isLoading] = useState(false);

  // State for deadlines
  const [blguDeadline, setBlguDeadline] = useState("April 1st, 2024");
  const [reworkDeadline, setReworkDeadline] = useState("May 1st, 2024");

  // Mock data matching the design from the image
  const assessmentPeriods: AssessmentPeriod[] = [
    {
      id: 1,
      performanceYear: 2023,
      assessmentYear: 2024,
      status: "Active",
      statusColor: "green",
    },
    {
      id: 2,
      performanceYear: 2022,
      assessmentYear: 2023,
      status: "Archived",
      statusColor: "gray",
    },
    {
      id: 3,
      performanceYear: 2024,
      assessmentYear: 2025,
      status: "Upcoming",
      statusColor: "blue",
    },
  ];

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      Active: { 
        bgColor: 'var(--analytics-success-bg)', 
        textColor: 'var(--analytics-success-text)'
      },
      Archived: { 
        bgColor: 'var(--analytics-neutral-bg)', 
        textColor: 'var(--analytics-neutral-text)'
      },
      Upcoming: { 
        bgColor: 'var(--kpi-blue-from)', 
        textColor: 'var(--kpi-blue-text)'
      },
    };
    return configs[status as keyof typeof configs] || configs["Archived"];
  };

  const handleCreateNewPeriod = () => {
    toast.success("Create New Assessment Period functionality coming soon");
  };

  const handleSaveDeadlines = () => {
    toast.success("Deadlines saved successfully");
  };

  interface AssessmentPeriod {
    id: number;
    performanceYear: number;
    assessmentYear: number;
    status: string;
    statusColor: string;
  }

  const handlePeriodAction = (action: string, period: AssessmentPeriod) => {
    toast.success(
      `${action} action for ${period.performanceYear}/${period.assessmentYear} period`
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Assessment Periods Card */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[var(--foreground)]">
                  Assessment Periods
                </CardTitle>
                <Button
                  onClick={handleCreateNewPeriod}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Assessment Period
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--hover)] border-b border-[var(--border)]">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                          Performance Year
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                          Assessment Year
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {assessmentPeriods.map((period) => {
                      const statusConfig = getStatusConfig(period.status);

                      return (
                        <tr
                          key={period.id}
                          className="hover:bg-[var(--hover)] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {period.performanceYear}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {period.assessmentYear}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium"
                              style={{
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.textColor
                              }}
                            >
                              {period.status}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePeriodAction("Edit", period)
                                  }
                                  className="text-[var(--foreground)] hover:bg-[var(--kpi-blue-from)] cursor-pointer px-3 py-2"
                                >
                                  Edit Period
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePeriodAction("Activate", period)
                                  }
                                  className="text-[var(--foreground)] hover:bg-[var(--kpi-blue-from)] cursor-pointer px-3 py-2"
                                >
                                  Activate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePeriodAction("Archive", period)
                                  }
                                  className="text-[var(--foreground)] hover:bg-[var(--kpi-blue-from)] cursor-pointer px-3 py-2"
                                >
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePeriodAction("Delete", period)
                                  }
                                  className="cursor-pointer px-3 py-2"
                                  style={{
                                    color: 'var(--analytics-danger-text-light)'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--analytics-danger-bg)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Active Period Deadlines Card */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-[var(--foreground)]">
                <div 
                  className="w-8 h-8 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: 'var(--kpi-blue-from)' }}
                >
                  <Calendar className="h-5 w-5" style={{ color: 'var(--kpi-blue-text)' }} />
                </div>
                Active Period Deadlines (SGLGB 2024)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* BLGU Submission Deadline */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[var(--foreground)]">
                    BLGU Submission Deadline
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <Input
                      type="text"
                      value={blguDeadline}
                      onChange={(e) => setBlguDeadline(e.target.value)}
                      className="pl-10 h-12 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Select deadline date"
                    />
                  </div>
                </div>

                {/* Rework Completion Deadline */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[var(--foreground)]">
                    Rework Completion Deadline
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <Input
                      type="text"
                      value={reworkDeadline}
                      onChange={(e) => setReworkDeadline(e.target.value)}
                      className="pl-10 h-12 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Select deadline date"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveDeadlines}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-8 h-12"
                >
                  <Save className="h-4 w-4" />
                  Save Deadlines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
