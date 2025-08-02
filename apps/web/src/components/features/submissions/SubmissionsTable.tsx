'use client';

import * as React from 'react';
import { MoreHorizontal, Eye, Mail } from 'lucide-react';
import DataTable, { Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { AssessorAvatars } from '@/components/shared/AssessorAvatars';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Submission, SubmissionStatus, Assessor } from '@/types/submissions';

interface SubmissionsTableProps {
  submissions: Submission[];
  loading?: boolean;
  onViewDetails: (submission: Submission) => void;
  onSendReminder: (submission: Submission) => void;
}

interface SubmissionTableRow extends Submission, Record<string, unknown> {
  actions: React.ReactNode;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export function SubmissionsTable({
  submissions,
  loading = false,
  onViewDetails,
  onSendReminder,
}: SubmissionsTableProps) {
  const columns: Column<SubmissionTableRow>[] = [
    {
      key: 'barangayName',
      label: 'Barangay Name',
      sortable: true,
    },
    {
      key: 'overallProgress',
      label: 'Overall Progress',
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <ProgressBar value={value as number} showLabel />
        </div>
      ),
    },
    {
      key: 'currentStatus',
      label: 'Current Status',
      sortable: true,
      render: (value) => <StatusBadge status={value as SubmissionStatus} />,
    },
    {
      key: 'assignedAssessors',
      label: 'Assigned Assessors',
      sortable: false,
      render: (value) => <AssessorAvatars assessors={value as Assessor[]} />,
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-[var(--muted-foreground)]">
          {formatDate(value as string)}
        </span>
      ),
    },
    {
      key: 'governanceArea',
      label: 'Governance Area',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (value) => value as React.ReactNode,
    },
  ];

  // Add actions column separately to avoid type issues
  const tableData: SubmissionTableRow[] = submissions.map(submission => ({
    ...submission,
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(submission)}>
            <Eye className="mr-2 h-4 w-4" />
            View Submission Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSendReminder(submission)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Reminder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }));

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm overflow-hidden">
      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No submissions found matching your filters."
      />
    </div>
  );
} 