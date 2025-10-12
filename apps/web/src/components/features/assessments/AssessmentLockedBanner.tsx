"use client";

import { AssessmentStatus } from "@/types/assessment";
import { Clock, Lock, Shield } from "lucide-react";

interface AssessmentLockedBannerProps {
  status: AssessmentStatus;
}

export function AssessmentLockedBanner({
  status,
}: AssessmentLockedBannerProps) {
  const getBannerContent = () => {
    switch (status) {
      case "Submitted for Review":
        return {
          icon: <Clock className="h-5 w-5" />,
          title: "Assessment Submitted for Review",
          description:
            "This assessment has been submitted and is currently under review. No further changes can be made at this time.",
          bgGradient: "from-blue-50/80 to-indigo-50/60",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          textColor: "text-blue-800",
          borderColor: "border-blue-200/60",
        };
      case "Validated":
        return {
          icon: <Shield className="h-5 w-5" />,
          title: "Assessment Validated",
          description:
            "This assessment has been validated by the assessor. The content is now locked and cannot be modified.",
          bgGradient: "from-green-50/80 to-emerald-50/60",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          textColor: "text-green-800",
          borderColor: "border-green-200/60",
        };
      default:
        return {
          icon: <Lock className="h-5 w-5" />,
          title: "Assessment Locked",
          description:
            "This assessment is currently locked and cannot be modified.",
          bgGradient: "from-gray-50/80 to-slate-50/60",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          textColor: "text-gray-800",
          borderColor: "border-gray-200/60",
        };
    }
  };

  const content = getBannerContent();

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${content.bgGradient} border-b ${content.borderColor} backdrop-blur-sm`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Enhanced Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 ${content.iconBg} rounded-sm flex items-center justify-center shadow-sm`}
          >
            <div className={content.iconColor}>{content.icon}</div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className={`text-base font-semibold ${content.textColor}`}>
                {content.title}
              </h3>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <p
                className={`text-sm ${content.textColor} opacity-90 leading-relaxed`}
              >
                {content.description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <div
              className={`px-4 py-2 ${content.iconBg} ${content.textColor} rounded-sm text-xs font-medium uppercase tracking-wide shadow-sm`}
            >
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
