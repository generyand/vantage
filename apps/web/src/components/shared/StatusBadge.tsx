import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SubmissionStatus } from '@/types/submissions';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        // Original variants
        'Not Started': 'border-gray-200 bg-gray-100 text-gray-700',
        'In Progress': 'border-blue-200 bg-blue-100 text-blue-700',
        'Submitted for Review': 'border-yellow-200 bg-yellow-100 text-yellow-700',
        'Needs Rework': 'border-orange-200 bg-orange-100 text-orange-700',
        'Validated': 'border-green-200 bg-green-100 text-green-700',
        'Finalized': 'border-purple-200 bg-purple-100 text-purple-700',
        // New submission status variants
        'awaiting_review': 'border-blue-200 bg-blue-100 text-blue-700',
        'in_progress': 'border-yellow-200 bg-yellow-100 text-yellow-700',
        'needs_rework': 'border-orange-200 bg-orange-100 text-orange-700',
        'validated': 'border-green-200 bg-green-100 text-green-700',
        // Overall status variants
        'draft': 'border-gray-200 bg-gray-100 text-gray-700',
        'submitted': 'border-blue-200 bg-blue-100 text-blue-700',
        'under_review': 'border-yellow-200 bg-yellow-100 text-yellow-700',
        'completed': 'border-purple-200 bg-purple-100 text-purple-700',
      },
    },
    defaultVariants: {
      variant: 'Not Started',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: SubmissionStatus | string;
}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  const statusName = typeof status === 'string' ? status : status.name;
  
  // Map status to display name and variant
  const getStatusConfig = (statusValue: string) => {
    const statusMap: Record<string, { display: string; variant: string }> = {
      // Original statuses
      'Not Started': { display: 'Not Started', variant: 'Not Started' },
      'In Progress': { display: 'In Progress', variant: 'In Progress' },
      'Submitted for Review': { display: 'Submitted for Review', variant: 'Submitted for Review' },
      'Needs Rework': { display: 'Needs Rework', variant: 'Needs Rework' },
      'Validated': { display: 'Validated', variant: 'Validated' },
      'Finalized': { display: 'Finalized', variant: 'Finalized' },
      // New submission statuses
      'awaiting_review': { display: 'Awaiting Review', variant: 'awaiting_review' },
      'in_progress': { display: 'In Progress', variant: 'in_progress' },
      'needs_rework': { display: 'Needs Rework', variant: 'needs_rework' },
      'validated': { display: 'Validated', variant: 'validated' },
      // Overall statuses
      'draft': { display: 'Draft', variant: 'draft' },
      'submitted': { display: 'Submitted', variant: 'submitted' },
      'under_review': { display: 'Under Review', variant: 'under_review' },
      'completed': { display: 'Completed', variant: 'completed' },
    };
    
    return statusMap[statusValue] || { display: statusValue, variant: 'Not Started' };
  };
  
  const config = getStatusConfig(statusName);
  
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <div className={cn(statusBadgeVariants({ variant: config.variant as any }), className)} {...props}>
      {config.display}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants }; 