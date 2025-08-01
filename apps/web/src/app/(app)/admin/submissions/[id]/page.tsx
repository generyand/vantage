"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubmissionDetailsPage() {
  const { isAuthenticated } = useAuthStore();
  const params = useParams();
  const router = useRouter();

  const submissionId = params.id as string;

  // Mock data matching the design from the image
  const submissionData = {
    id: submissionId,
    barangayName: "Barangay Balasinon",
    governanceArea: "Financial Administration",
    currentStatus: "Submitted for Review",
    lastUpdated: "1/15/2024, 6:30:00 PM",
    overallProgress: 85,
    assignedAssessors: [
      {
        id: 1,
        name: "Juan Dela Cruz",
        email: "juan@example.com",
        avatar: "JDC",
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@example.com",
        avatar: "MS",
      },
    ],
    timeline: [
      {
        id: 1,
        event: "Last Updated",
        date: "1/15/2024 at 6:30:00 PM",
        type: "update",
      },
    ],
  };

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

  const getProgressBarColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Back Button */}
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/submissions")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {submissionData.barangayName}
            </h1>
            <p className="text-gray-600 mt-2">
              Submission Details and Assessment Progress
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                    <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Barangay Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {submissionData.barangayName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Governance Area
                        </label>
                        <p className="text-lg text-gray-900">
                          {submissionData.governanceArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Current Status
                        </label>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3" />
                          {submissionData.currentStatus}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Last Updated
                        </label>
                        <p className="text-lg text-gray-900">
                          {submissionData.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Overall Progress
                      </label>
                      <span className="text-lg font-bold text-gray-900">
                        {submissionData.overallProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-300 ${getProgressBarColor(
                          submissionData.overallProgress
                        )}`}
                        style={{ width: `${submissionData.overallProgress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Assigned Assessors Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                    <div className="w-8 h-8 bg-purple-100 rounded-sm flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    Assigned Assessors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissionData.assignedAssessors.map((assessor) => (
                      <div
                        key={assessor.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {assessor.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {assessor.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {assessor.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                    <div className="w-8 h-8 bg-green-100 rounded-sm flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissionData.timeline.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.event}
                          </p>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
