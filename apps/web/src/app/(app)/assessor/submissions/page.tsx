'use client';

import { useState, useEffect } from 'react';
import { useAssessorGovernanceArea } from '@/hooks/useAssessorGovernanceArea';
import { generateSubmissionsData } from '@/components/features/submissions/SubmissionsData';
import { KPICards, SubmissionsFilters, SubmissionsTable } from '@/components/features/submissions';
import { SubmissionsFilter, BarangaySubmission } from '@/types/submissions';
import { toast } from 'react-hot-toast';

export default function AssessorSubmissionsPage() {
  const { governanceAreaName, isLoading: governanceAreaLoading } = useAssessorGovernanceArea();
  const [filters, setFilters] = useState<SubmissionsFilter>({
    search: '',
    status: []
  });
  const [filteredSubmissions, setFilteredSubmissions] = useState<BarangaySubmission[]>([]);
  const [submissionsData, setSubmissionsData] = useState(generateSubmissionsData('Environmental Management'));

  // Update data when governance area is loaded
  useEffect(() => {
    if (governanceAreaName && !governanceAreaLoading) {
      setSubmissionsData(generateSubmissionsData(governanceAreaName));
    }
  }, [governanceAreaName, governanceAreaLoading]);

  // Filter submissions based on search and status
  useEffect(() => {
    let filtered = submissionsData.submissions;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(submission =>
        submission.barangayName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(submission =>
        filters.status.includes(submission.areaStatus)
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissionsData.submissions, filters]);

  const handleSubmissionClick = (submission: BarangaySubmission) => {
    // Navigate to the assessment validation page
    // For now, show a toast message
    toast.success(`Opening ${submission.barangayName} assessment for review`);
    
    // TODO: Navigate to actual assessment page
    // router.push(`/assessor/assessments/${submission.id}`);
  };

  const handleFiltersChange = (newFilters: SubmissionsFilter) => {
    setFilters(newFilters);
  };

  // Show loading if governance area is loading
  if (governanceAreaLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--muted)] rounded-sm w-1/3 mb-2"></div>
          <div className="h-6 bg-[var(--muted)] rounded-sm w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[var(--muted)] rounded-sm animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Row with enhanced styling */}
      <div className="bg-gradient-to-r from-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-sm p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Work Overview
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Your current workload and progress summary
          </p>
        </div>
        <KPICards kpi={submissionsData.kpi} />
      </div>

      {/* Enhanced Filtering & Search Bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Filter & Search
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Find specific submissions quickly
          </p>
        </div>
        <SubmissionsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Enhanced Main Submissions Data Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--muted)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Barangay Submissions
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-[var(--text-muted)]">Live updates</span>
            </div>
          </div>
        </div>
        
        {filteredSubmissions.length > 0 ? (
          <SubmissionsTable
            submissions={filteredSubmissions}
            onSubmissionClick={handleSubmissionClick}
          />
        ) : (
          <div className="text-center py-16 px-6">
            <div className="mx-auto h-16 w-16 text-[var(--text-muted)] mb-6 bg-[var(--muted)] rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8"
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
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              No submissions found
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              {filters.search || filters.status.length > 0
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'When barangays submit their assessments for your area, they will appear here for review.'}
            </p>
            {(filters.search || filters.status.length > 0) && (
              <button
                onClick={() => handleFiltersChange({ search: '', status: [] })}
                className="mt-4 px-4 py-2 text-sm bg-[var(--cityscape-yellow)] text-[var(--cityscape-accent-foreground)] rounded-sm hover:bg-[var(--cityscape-yellow-dark)] transition-colors duration-200"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 