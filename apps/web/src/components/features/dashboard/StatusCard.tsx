import { AssessmentStatus, AssessmentProgress } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface StatusCardProps {
  status: AssessmentStatus;
  progress: AssessmentProgress;
}

// Circular Progress Component
const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-gray-600">Complete</div>
        </div>
      </div>
    </div>
  );
};

// Mini Trend Chart Component
const MiniTrendChart = ({
  data,
  color = "#3b82f6",
}: {
  data: number[];
  color?: string;
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-16 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="opacity-80"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon fill="url(#gradient)" points={`0,100 ${points} 100,100`} />
      </svg>
    </div>
  );
};

export function StatusCard({ status, progress }: StatusCardProps) {
  const router = useRouter();

  const getStatusConfig = (status: AssessmentStatus) => {
    switch (status) {
      case "in-progress":
        return {
          badgeText: "In Progress",
          title: "Your assessment is currently in progress.",
          buttonText: "Continue Assessment",
          buttonAction: () => router.push("/blgu/assessments"),
          primaryColor: "#3b82f6",
          bgGradient: "from-blue-50/80 via-indigo-50/60 to-purple-50/40",
          accentColor: "text-blue-600",
          icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
        };
      case "needs-rework":
        return {
          badgeText: "NEEDS REWORK",
          title: "Your assessment requires rework.",
          buttonText: "View Feedback & Rework Items",
          buttonAction: () => router.push("/blgu/assessments"),
          primaryColor: "#f59e0b",
          bgGradient: "from-amber-50/80 via-orange-50/60 to-red-50/40",
          accentColor: "text-amber-600",
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        };
      case "submitted":
        return {
          badgeText: "Submitted for Review",
          title: "Your assessment has been submitted and is awaiting review.",
          buttonText: "View My Submission (Read-Only)",
          buttonAction: () => router.push("/blgu/assessments"),
          primaryColor: "#8b5cf6",
          bgGradient: "from-purple-50/80 via-violet-50/60 to-indigo-50/40",
          accentColor: "text-purple-600",
          icon: <CheckCircle2 className="h-5 w-5 text-purple-600" />,
        };
      case "validated":
        return {
          badgeText: "Validated",
          title: "Congratulations! Your pre-assessment has been validated.",
          buttonText: "View My Submission (Read-Only)",
          buttonAction: () => router.push("/blgu/assessments"),
          primaryColor: "#10b981",
          bgGradient: "from-emerald-50/80 via-green-50/60 to-teal-50/40",
          accentColor: "text-emerald-600",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        };
    }
  };

  const config = getStatusConfig(status);

  // Mock trend data - in real app this would come from API
  const trendData = [65, 68, 70, 72, 75, 73, 76, 78, progress.percentage];

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card
        className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-sm`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {config.icon}
              Current Pre-Assessment Status
            </CardTitle>
            <Badge
              className={`px-3 py-1 text-xs font-medium rounded-sm bg-white/80 ${config.accentColor} border-0`}
            >
              {config.badgeText}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Progress Circle and Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CircularProgress
                  percentage={progress.percentage}
                  color={config.primaryColor}
                  size={140}
                  strokeWidth={10}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-sm p-3">
                  <div className="text-xl font-bold text-gray-900">
                    {progress.current}
                  </div>
                  <div className="text-xs text-gray-600">Compliant</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-sm p-3">
                  <div className="text-xl font-bold text-gray-900">
                    {progress.total - progress.current}
                  </div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-sm p-3">
                  <div className="text-xl font-bold text-gray-900">
                    {progress.total}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>

            {/* Right side - Trend and Details */}
            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress Trend
                  </span>
                  <Activity className="h-4 w-4 text-gray-600" />
                </div>
                <MiniTrendChart data={trendData} color={config.primaryColor} />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Last 30 days</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+
                    {Math.round(progress.percentage - trendData[0])}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-medium text-gray-900 leading-relaxed">
                  {config.title}
                </h3>

                <div className="bg-white/60 backdrop-blur-sm rounded-sm p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">
                      Overall Progress
                    </span>
                    <span className="text-gray-600 font-mono">
                      {progress.current} / {progress.total} Indicators
                    </span>
                  </div>
                  <Progress
                    value={progress.percentage}
                    className="h-2 bg-gray-200/60 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={config.buttonAction}
            className="w-full h-12 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
          >
            {config.buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
