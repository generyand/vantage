import { AssessorFeedback } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, MessageSquare } from 'lucide-react';

interface FeedbackSectionProps {
  feedback: AssessorFeedback[];
}

export function FeedbackSection({ feedback }: FeedbackSectionProps) {
  const router = useRouter();

  if (feedback.length === 0) {
    return null;
  }

  const truncateComment = (comment: string, maxLength: number = 90) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          Action Required: Address Assessor's Feedback
        </CardTitle>
        <p className="text-sm text-amber-700 leading-relaxed">
          Review and address the following items to proceed with your assessment.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feedback.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-sm rounded-sm p-4 border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-blue-100 text-blue-800 text-xs font-medium font-mono">
                      {item.indicator}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {item.governanceArea}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {truncateComment(item.comment)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {feedback.length > 3 && (
            <div className="text-center py-2">
              <span className="text-xs text-amber-700 bg-amber-100/50 px-3 py-1 rounded-sm">
                +{feedback.length - 3} more items require attention
              </span>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/blgu/assessments')}
              className="text-amber-800 border-amber-300 hover:bg-amber-100 flex items-center gap-2 rounded-sm font-medium shadow-sm transition-all duration-200"
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