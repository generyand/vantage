'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Building } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/shared';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubmissions } from '@/hooks/useSubmissions';

export default function SubmissionDetailsPage() {
  const { isAuthenticated } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const { submissions } = useSubmissions();
  
  const submissionId = params.id as string;
  const submission = submissions.find(s => s.id === submissionId);

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

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Submission Not Found</h1>
            <p className="text-gray-600 mb-6">The submission you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/admin/submissions')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/submissions')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
        </div>

        <PageHeader
          title={submission.barangayName}
          description="Submission Details and Assessment Progress"
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay Name</label>
                    <p className="text-lg font-semibold">{submission.barangayName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Governance Area</label>
                    <p className="text-lg">{submission.governanceArea}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <div className="mt-1">
                      <StatusBadge status={submission.currentStatus} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-lg">{new Date(submission.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Overall Progress</label>
                      <span className="text-sm font-semibold text-gray-900">{submission.overallProgress}%</span>
                    </div>
                    <ProgressBar value={submission.overallProgress} size="lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Assessors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submission.assignedAssessors.length > 0 ? (
                  <div className="space-y-3">
                    {submission.assignedAssessors.map((assessor) => (
                      <div key={assessor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {assessor.avatar ? (
                            <img
                              src={assessor.avatar}
                              alt={assessor.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            assessor.name.split(' ').map(n => n[0]).join('').toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{assessor.name}</p>
                          <p className="text-xs text-gray-500">{assessor.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No assessors assigned</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.lastUpdated).toLocaleDateString()} at{' '}
                        {new Date(submission.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 