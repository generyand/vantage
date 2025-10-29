"use client";

import { ComplianceBadge } from "@/components/features/reports";
import { PageHeader } from "@/components/shared";
import { useGetAssessmentsList } from "@vantage/shared";
import { AssessmentStatus } from "@vantage/shared/src/generated/schemas/assessments";

export default function ReportsPage() {
  // Fetch validated assessments
  const {
    data: assessments,
    isLoading,
    error,
  } = useGetAssessmentsList({
    status: AssessmentStatus.Validated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Reports"
            description={`Error loading reports: ${error.message}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Assessment Reports"
          description="View SGLGB compliance status for all validated barangay assessments"
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Assessments
            </h3>
            <p className="text-3xl font-bold">{assessments?.length || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Passed Compliance
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {assessments?.filter(
                (a) => a.final_compliance_status === "Passed"
              ).length || 0}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Failed Compliance
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {assessments?.filter(
                (a) => a.final_compliance_status === "Failed"
              ).length || 0}
            </p>
          </div>
        </div>

        {/* Assessment List */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold">Validated Assessments</h3>
          </div>

          {!assessments || assessments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No validated assessments found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {assessment.barangay_name || "Unknown Barangay"}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assessment.blgu_user_name || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Validated:{" "}
                        {assessment.validated_at
                          ? new Date(
                              assessment.validated_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {assessment.final_compliance_status && (
                        <ComplianceBadge
                          status={assessment.final_compliance_status}
                          assessmentId={assessment.id}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
