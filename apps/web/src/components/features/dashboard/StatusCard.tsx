import { AssessmentStatus, AssessmentProgress } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

interface StatusCardProps {
  status: AssessmentStatus;
  progress: AssessmentProgress;
}

export function StatusCard({ status, progress }: StatusCardProps) {
  const router = useRouter();

  const getStatusConfig = (status: AssessmentStatus) => {
    switch (status) {
      case 'in-progress':
        return {
          badgeVariant: 'default' as const,
          badgeText: 'In Progress',
          title: 'Your assessment is currently in progress.',
          buttonText: 'Continue Assessment',
          buttonAction: () => router.push('/blgu/assessments')
        };
      case 'needs-rework':
        return {
          badgeVariant: 'secondary' as const,
          badgeText: 'NEEDS REWORK',
          title: 'Your assessment requires rework.',
          buttonText: 'View Feedback & Rework Items',
          buttonAction: () => router.push('/blgu/assessments')
        };
      case 'submitted':
        return {
          badgeVariant: 'outline' as const,
          badgeText: 'Submitted for Review',
          title: 'Your assessment has been submitted and is awaiting review.',
          buttonText: 'View My Submission (Read-Only)',
          buttonAction: () => router.push('/blgu/assessments')
        };
      case 'validated':
        return {
          badgeVariant: 'default' as const,
          badgeText: 'Validated',
          title: 'Congratulations! Your pre-assessment has been validated.',
          buttonText: 'View My Submission (Read-Only)',
          buttonAction: () => router.push('/blgu/assessments')
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900">Current Pre-Assessment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          {status === 'needs-rework' && (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <Badge 
            variant={config.badgeVariant} 
            className={`text-sm px-3 py-1 ${
              status === 'needs-rework' 
                ? 'bg-orange-100 text-orange-800 border-orange-300' 
                : 'bg-blue-100 text-blue-800 border-blue-300'
            }`}
          >
            {config.badgeText}
          </Badge>
          <h3 className="text-xl font-bold text-blue-900">{config.title}</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-blue-700">
            <span>Progress</span>
            <span>{progress.current} / {progress.total} Indicators Compliant</span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
          <p className="text-sm text-blue-600">
            {Math.round(progress.percentage)}% complete
          </p>
        </div>

        <Button 
          onClick={config.buttonAction}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}