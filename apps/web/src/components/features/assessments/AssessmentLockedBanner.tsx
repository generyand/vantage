"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssessmentStatus } from "@/types/assessment";
import { Lock, CheckCircle, Clock } from "lucide-react";

interface AssessmentLockedBannerProps {
  status: AssessmentStatus;
}

export function AssessmentLockedBanner({ status }: AssessmentLockedBannerProps) {
  const getBannerContent = () => {
    switch (status) {
      case 'submitted':
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Assessment Submitted for Review',
          description: 'This assessment has been submitted and is currently under review. No further changes can be made at this time.',
          variant: 'default' as const,
        };
      case 'validated':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: 'Assessment Validated',
          description: 'This assessment has been validated by the assessor. The content is now locked and cannot be modified.',
          variant: 'default' as const,
        };
      case 'finalized':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: 'Assessment Finalized',
          description: 'This assessment has been finalized and is now part of the official record. No changes are permitted.',
          variant: 'default' as const,
        };
      default:
        return {
          icon: <Lock className="h-4 w-4" />,
          title: 'Assessment Locked',
          description: 'This assessment is currently locked and cannot be modified.',
          variant: 'default' as const,
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <Alert variant={content.variant}>
          <div className="flex items-center space-x-2">
            {content.icon}
            <AlertDescription className="font-medium">
              {content.title}: {content.description}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
} 