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



  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Back Button */}
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/mlgoo/submissions")}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-sm transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              {submissionData.barangayName}
            </h1>
            <p className="text-[var(--muted-foreground)] mt-2">
              Submission Details and Assessment Progress
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card className="bg-[var(--card)] rounded-sm shadow-lg border border-[var(--border)] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
                    <div 
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: 'var(--kpi-blue-from)' }}
                    >
                      <FileText className="h-5 w-5" style={{ color: 'var(--kpi-blue-text)' }} />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1 block">
                          Barangay Name
                        </label>
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {submissionData.barangayName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1 block">
                          Governance Area
                        </label>
                        <p className="text-lg text-[var(--foreground)]">
                          {submissionData.governanceArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1 block">
                          Current Status
                        </label>
                        <div 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium"
                          style={{ 
                            backgroundColor: 'var(--analytics-warning-bg)',
                            color: 'var(--analytics-warning-text)'
                          }}
                        >
                          <Clock className="h-3 w-3" />
                          {submissionData.currentStatus}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1 block">
                          Last Updated
                        </label>
                        <p className="text-lg text-[var(--foreground)]">
                          {submissionData.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview Card */}
              <Card className="bg-[var(--card)] rounded-sm shadow-lg border border-[var(--border)] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[var(--foreground)]">
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-[var(--muted-foreground)]">
                        Overall Progress
                      </label>
                      <span className="text-lg font-bold text-[var(--foreground)]">
                        {submissionData.overallProgress}%
                      </span>
                    </div>
                    <div 
                      className="w-full rounded-full h-4"
                      style={{ backgroundColor: 'var(--analytics-neutral-border)' }}
                    >
                      <div
                        className="h-4 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: submissionData.overallProgress >= 90 ? 'var(--analytics-success)' :
                                          submissionData.overallProgress >= 70 ? 'var(--analytics-warning)' :
                                          submissionData.overallProgress >= 40 ? 'var(--analytics-warning)' :
                                          'var(--analytics-danger)',
                          width: `${submissionData.overallProgress}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Assigned Assessors Card */}
              <Card className="bg-[var(--card)] rounded-sm shadow-lg border border-[var(--border)] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
                    <div 
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: 'var(--kpi-purple-from)' }}
                    >
                      <User className="h-5 w-5" style={{ color: 'var(--kpi-purple-text)' }} />
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
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: 'var(--analytics-danger)' }}
                        >
                          {assessor.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {assessor.name}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {assessor.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card className="bg-[var(--card)] rounded-sm shadow-lg border border-[var(--border)] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
                    <div 
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: 'var(--analytics-success-bg)' }}
                    >
                      <Calendar className="h-5 w-5" style={{ color: 'var(--analytics-success-text-light)' }} />
                    </div>
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissionData.timeline.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5"
                          style={{ backgroundColor: 'var(--analytics-success)' }}
                        ></div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {item.event}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">{item.date}</p>
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
