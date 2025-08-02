import { PageHeader } from "@/components/shared";

export default function AssessorSubmissionsPage() {
  return (
    <div>
      <PageHeader
        title="Submissions Queue"
        description="Review and assess submitted barangay assessments"
      />
      
      <div className="mt-8">
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              No submissions available
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              When barangays submit their assessments, they will appear here for review.
            </p>
            <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)]">
              <h4 className="font-medium text-[var(--foreground)] mb-2">
                What to expect:
              </h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Barangay assessment submissions will be queued here</li>
                <li>• Review submitted documents and assessment data</li>
                <li>• Provide feedback and scoring for each submission</li>
                <li>• Track assessment progress and completion status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 