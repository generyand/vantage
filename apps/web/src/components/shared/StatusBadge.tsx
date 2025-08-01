import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SubmissionStatus } from '@/types/submissions';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        'Not Started': 'border-gray-200 bg-gray-100 text-gray-700',
        'In Progress': 'border-blue-200 bg-blue-100 text-blue-700',
        'Submitted for Review': 'border-yellow-200 bg-yellow-100 text-yellow-700',
        'Needs Rework': 'border-orange-200 bg-orange-100 text-orange-700',
        'Validated': 'border-green-200 bg-green-100 text-green-700',
        'Finalized': 'border-purple-200 bg-purple-100 text-purple-700',
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
  status: SubmissionStatus;
}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant: status }), className)} {...props}>
      {status}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants }; 