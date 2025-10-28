'use client';

import { AreaResultsDisplay, ComplianceBadge } from '@/components/features/reports';
import { PageHeader } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AssessmentDetails {
  id: number;
  status: string;
  final_compliance_status?: 'Passed' | 'Failed';
  area_results?: Record<string, string>;
  ai_recommendations?: Record<string, any>;
  blgu_user?: {
    name: string;
    barangay?: {
      name: string;
    };
  };
}

export default function ReportDetailsPage() {
  const params = useParams();
  const assessmentId = params.id as string;
  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchAssessmentDetails = async () => {
    //   try {
    //     const response = await fetch(`/api/v1/assessments/${assessmentId}`);
    //     if (!response.ok) throw new Error('Failed to fetch assessment');
    //     const data = await response.json();
    //     setAssessment(data);
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Unknown error');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchAssessmentDetails();

    // Mock data for now
    setTimeout(() => {
      setAssessment({
        id: Number(assessmentId),
        status: 'Validated',
        final_compliance_status: 'Passed',
        area_results: {
          'Financial Administration and Sustainability': 'Passed',
          'Disaster Preparedness': 'Passed',
          'Safety, Peace and Order': 'Passed',
          'Social Protection and Sensitivity': 'Passed',
          'Business-Friendliness and Competitiveness': 'Failed',
          'Environmental Management': 'Failed',
        },
        ai_recommendations: null,
        blgu_user: {
          name: 'Sample User',
          barangay: {
            name: 'Sample Barangay',
          },
        },
      });
      setIsLoading(false);
    }, 500);
  }, [assessmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Assessment Report"
            description={error || 'Assessment not found'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title={`Assessment Report - ${assessment.blgu_user?.barangay?.name || 'Unknown'}`}
          description="View detailed SGLGB compliance status and area breakdown"
        />

        {/* Compliance Status Badge */}
        {assessment.final_compliance_status && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Final SGLGB Compliance Status
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overall compliance determination based on the 3+1 rule
                </p>
              </div>
              <ComplianceBadge status={assessment.final_compliance_status} />
            </div>
          </div>
        )}

        {/* Area Results */}
        {assessment.area_results && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Governance Area Results</h3>
            <AreaResultsDisplay areaResults={assessment.area_results} />
          </div>
        )}

        {/* AI Recommendations (if available) */}
        {assessment.ai_recommendations && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h3>
            <div className="space-y-4">
              {assessment.ai_recommendations.summary && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {assessment.ai_recommendations.summary}
                  </p>
                </div>
              )}
              {assessment.ai_recommendations.recommendations && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {assessment.ai_recommendations.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {assessment.ai_recommendations.capacity_development_needs && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Capacity Development Needs</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {assessment.ai_recommendations.capacity_development_needs.map(
                      (need: string, index: number) => (
                        <li key={index}>{need}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
