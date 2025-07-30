"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Assessment, AssessmentValidation } from "@/types/assessment";
import { useSubmitAssessment } from "@/hooks/useAssessment";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface AssessmentHeaderProps {
  assessment: Assessment;
  validation: AssessmentValidation;
}

export function AssessmentHeader({ assessment, validation }: AssessmentHeaderProps) {
  const submitMutation = useSubmitAssessment();

  const getStatusIcon = () => {
    switch (assessment.status) {
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'needs_rework':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'submitted':
      case 'validated':
      case 'finalized':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (assessment.status) {
      case 'in_progress':
        return 'In Progress';
      case 'needs_rework':
        return 'Needs Rework';
      case 'submitted':
        return 'Submitted for Review';
      case 'validated':
        return 'Validated';
      case 'finalized':
        return 'Finalized';
      default:
        return 'Unknown';
    }
  };

  const getTooltipContent = () => {
    if (validation.missingIndicators.length > 0) {
      return (
        <div>
          <p className="font-medium mb-2">Missing indicator responses:</p>
          <ul className="text-sm space-y-1">
            {validation.missingIndicators.slice(0, 3).map((indicator, index) => (
              <li key={index}>• {indicator}</li>
            ))}
            {validation.missingIndicators.length > 3 && (
              <li>• ... and {validation.missingIndicators.length - 3} more</li>
            )}
          </ul>
        </div>
      );
    }

    if (validation.missingMOVs.length > 0) {
      return (
        <div>
          <p className="font-medium mb-2">Missing MOV files:</p>
          <ul className="text-sm space-y-1">
            {validation.missingMOVs.slice(0, 3).map((indicator, index) => (
              <li key={index}>• {indicator}</li>
            ))}
            {validation.missingMOVs.length > 3 && (
              <li>• ... and {validation.missingMOVs.length - 3} more</li>
            )}
          </ul>
        </div>
      );
    }

    return "Please complete all indicators and upload required MOVs before submitting.";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Status */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              SGLGB Pre-Assessment for {assessment.barangayName}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusIcon()}
              <span className="text-sm font-medium text-gray-600">
                {getStatusText()}
              </span>
              <span className="text-sm text-gray-500">
                • {assessment.completedIndicators} of {assessment.totalIndicators} indicators completed
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Submit Button */}
        <div className="flex items-center space-x-4">
          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {assessment.completedIndicators} / {assessment.totalIndicators}
            </div>
            <div className="text-xs text-gray-500">Indicators Complete</div>
          </div>

          {/* Submit Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={() => submitMutation.mutate()}
                    disabled={!validation.canSubmit || submitMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Review'
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!validation.canSubmit && (
                <TooltipContent side="bottom" className="max-w-sm">
                  {getTooltipContent()}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((assessment.completedIndicators / assessment.totalIndicators) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(assessment.completedIndicators / assessment.totalIndicators) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
} 