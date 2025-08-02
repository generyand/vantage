"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Filter,
  Search,
  ChevronDown,
  Eye,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SubmissionsSkeleton } from "@/components/features/submissions";

interface Submission {
  id: number;
  barangayName: string;
  overallProgress: number;
  currentStatus: string;
  statusColor: string;
  assignedAssessors: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
  lastUpdated: string;
}

export default function AdminSubmissionsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  // Mock loading state - in real app this would come from API
  const [isLoading] = useState(false);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [assessorFilter, setAssessorFilter] = useState("all");

  // Mock data matching the design from the image
  const submissionsData = useMemo((): Submission[] => [
    {
      id: 1,
      barangayName: "Barangay Balasinon",
      overallProgress: 85,
      currentStatus: "Submitted for Review",
      statusColor: "yellow",
      assignedAssessors: [
        { id: 1, name: "John Doe", avatar: "JD" },
        { id: 2, name: "Jane Smith", avatar: "JS" },
      ],
      lastUpdated: "1/15/2024",
    },
    {
      id: 2,
      barangayName: "Barangay Buguis",
      overallProgress: 45,
      currentStatus: "In Progress",
      statusColor: "blue",
      assignedAssessors: [{ id: 1, name: "John Doe", avatar: "JD" }],
      lastUpdated: "1/14/2024",
    },
    {
      id: 3,
      barangayName: "Barangay Carre",
      overallProgress: 100,
      currentStatus: "Finalized",
      statusColor: "purple",
      assignedAssessors: [{ id: 1, name: "John Doe", avatar: "JD" }],
      lastUpdated: "1/13/2024",
    },
    {
      id: 4,
      barangayName: "Barangay Clib",
      overallProgress: 0,
      currentStatus: "Not Started",
      statusColor: "gray",
      assignedAssessors: [],
      lastUpdated: "1/12/2024",
    },
    {
      id: 5,
      barangayName: "Barangay Harada Butai",
      overallProgress: 70,
      currentStatus: "Needs Rework",
      statusColor: "orange",
      assignedAssessors: [{ id: 1, name: "John Doe", avatar: "JD" }],
      lastUpdated: "1/11/2024",
    },
    {
      id: 6,
      barangayName: "Barangay Katipunan",
      overallProgress: 95,
      currentStatus: "Validated",
      statusColor: "green",
      assignedAssessors: [{ id: 1, name: "John Doe", avatar: "JD" }],
      lastUpdated: "1/11/2024",
    },
  ], []);

  // Filter submissions based on search and filters
  const filteredSubmissions = useMemo(() => {
    return submissionsData.filter((submission) => {
      const matchesSearch = submission.barangayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        submission.currentStatus
          .toLowerCase()
          .includes(statusFilter.toLowerCase());
      const matchesArea = areaFilter === "all"; // For now, all areas match
      const matchesAssessor = assessorFilter === "all"; // For now, all assessors match

      return matchesSearch && matchesStatus && matchesArea && matchesAssessor;
    });
  }, [searchQuery, statusFilter, areaFilter, assessorFilter, submissionsData]);

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      "Submitted for Review": {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: Clock,
      },
      "In Progress": { 
        bg: "bg-blue-100 dark:bg-blue-900/30", 
        text: "text-blue-800 dark:text-blue-300", 
        icon: Clock 
      },
      Finalized: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-800 dark:text-purple-300",
        icon: CheckCircle,
      },
      "Not Started": {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-800 dark:text-gray-300",
        icon: XCircle,
      },
      "Needs Rework": {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-800 dark:text-orange-300",
        icon: AlertTriangle,
      },
      Validated: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs["Not Started"];
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleViewDetails = (submission: Submission) => {
    router.push(`/admin/submissions/${submission.id}`);
  };

  const handleSendReminder = (submission: Submission) => {
    toast.success(`Reminder sent to ${submission.barangayName}`);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <SubmissionsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Submissions Queue
            </h1>
            <p className="text-[var(--muted-foreground)] mt-2">
              Live Pre-Assessment Status for All 25 Barangays
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Filters & Search
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Search Section - Left Side */}
              <div className="flex-1 max-w-md">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search by Barangay Name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Filters Section - Right Side */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filter by Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Filter by Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-10 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50">
                        <SelectItem
                          value="all"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          All Statuses
                        </SelectItem>
                        <SelectItem
                          value="submitted"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Submitted for Review
                        </SelectItem>
                        <SelectItem
                          value="progress"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem
                          value="finalized"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Finalized
                        </SelectItem>
                        <SelectItem
                          value="rework"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Needs Rework
                        </SelectItem>
                        <SelectItem
                          value="validated"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Validated
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Governance Area */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Filter by Governance Area
                    </label>
                    <Select value={areaFilter} onValueChange={setAreaFilter}>
                      <SelectTrigger className="h-10 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="All Areas" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50">
                        <SelectItem
                          value="all"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          All Areas
                        </SelectItem>
                        <SelectItem
                          value="financial"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Financial Administration
                        </SelectItem>
                        <SelectItem
                          value="disaster"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Disaster Preparedness
                        </SelectItem>
                        <SelectItem
                          value="safety"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Safety & Peace Order
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Assessor */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Filter by Assessor
                    </label>
                    <Select
                      value={assessorFilter}
                      onValueChange={setAssessorFilter}
                    >
                      <SelectTrigger className="h-10 bg-[var(--background)] border-[var(--border)] rounded-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="All Assessors" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50">
                        <SelectItem
                          value="all"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          All Assessors
                        </SelectItem>
                        <SelectItem
                          value="john"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          John Doe
                        </SelectItem>
                        <SelectItem
                          value="jane"
                          className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                        >
                          Jane Smith
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--muted-foreground)]">
              Showing {filteredSubmissions.length} submissions
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--hover)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Barangay Name
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Overall Progress
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Current Status
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Assigned Assessors
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Last Updated
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredSubmissions.map((submission) => {
                    const statusConfig = getStatusConfig(
                      submission.currentStatus
                    );
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={submission.id}
                        className="hover:bg-[var(--hover)] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {submission.barangayName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-[var(--border)] rounded-sm h-3 min-w-[100px]">
                              <div
                                className={`h-3 rounded-sm transition-all duration-300 ${getProgressBarColor(
                                  submission.overallProgress
                                )}`}
                                style={{
                                  width: `${submission.overallProgress}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-[var(--foreground)] min-w-[35px]">
                              {submission.overallProgress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {submission.currentStatus}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {submission.assignedAssessors.length > 0 ? (
                              submission.assignedAssessors.map(
                                (assessor) => (
                                  <div
                                    key={assessor.id}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    title={assessor.name}
                                  >
                                    {assessor.avatar}
                                  </div>
                                )
                              )
                            ) : (
                              <span className="text-sm text-[var(--muted-foreground)] italic">
                                No assessors assigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[var(--muted-foreground)]">
                            {submission.lastUpdated}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(submission)}
                              className="bg-[var(--background)] hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-sm font-medium transition-colors duration-200"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(submission)}
                              className="bg-[var(--background)] hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 rounded-sm font-medium transition-colors duration-200"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Remind
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
