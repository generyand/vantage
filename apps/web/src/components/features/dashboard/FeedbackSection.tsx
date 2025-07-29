import { AssessorFeedback } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface FeedbackSectionProps {
  feedback: AssessorFeedback[];
}

export function FeedbackSection({ feedback }: FeedbackSectionProps) {
  const router = useRouter();

  if (feedback.length === 0) {
    return null;
  }

  const truncateComment = (comment: string, maxLength: number = 80) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Action Required: Address Assessor's Feedback
        </CardTitle>
        <p className="text-sm text-orange-700">
          Review and address the following items to proceed with your assessment.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-blue-600">
                      {item.indicator}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-600">
                      {item.governanceArea}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {truncateComment(item.comment)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => router.push('/blgu/assessments')}
              className="text-orange-700 border-orange-300 hover:bg-orange-100 flex items-center gap-2"
            >
              View all feedback and begin rework
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}