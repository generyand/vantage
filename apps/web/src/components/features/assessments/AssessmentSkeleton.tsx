import { Skeleton } from '@/components/ui/Skeleton';

export function AssessmentSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Enhanced Header Skeleton */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 rounded-sm shadow-lg border-0 p-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                {/* Left side - Title and Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm" />
                    <Skeleton className="h-9 w-96" />
                  </div>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-64" />
                  </div>
                </div>

                {/* Right side - Stats and Submit Button */}
                <div className="flex flex-col items-end gap-4">
                  {/* Progress Stats */}
                  <div className="flex items-center gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                        <Skeleton className="h-8 w-16 mx-auto mb-1" />
                        <Skeleton className="h-3 w-20 mx-auto" />
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>

              {/* Enhanced Progress Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-sm p-6 border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  
                  <div className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Validation Info */}
                <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200/60 rounded-sm">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Assessment Tabs Skeleton */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
            {/* Enhanced Tab Navigation */}
            <div className="bg-gradient-to-r from-slate-100/50 to-gray-100/30 border-b border-gray-200/60 px-6 py-6">
              <div className="grid w-full grid-cols-6 h-auto gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="group relative flex flex-col items-center p-5 rounded-sm min-h-[180px] overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60">
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center space-y-3 w-full">
                      {/* Logo and Status */}
                      <div className="relative">
                        <Skeleton className="w-14 h-14 rounded-sm" />
                        <Skeleton className="absolute -top-1 -right-1 w-5 h-5 rounded-full" />
                      </div>
                      
                      {/* Area Code */}
                      <Skeleton className="h-8 w-16" />
                      
                      {/* Progress Section */}
                      <div className="w-full space-y-2 mt-auto">
                        {/* Progress Percentage */}
                        <div className="text-center">
                          <Skeleton className="h-6 w-12 mx-auto mb-1" />
                          <Skeleton className="h-3 w-16 mx-auto" />
                        </div>
                        
                        {/* Progress Bar */}
                        <Skeleton className="h-2 w-full" />
                        
                        {/* Progress Text */}
                        <Skeleton className="h-3 w-24 mx-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Tab Content */}
            <div className="space-y-6">
              {/* Enhanced Area Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 p-8 border-b border-emerald-200">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left side - Area info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-sm" />
                        <div>
                          <Skeleton className="h-8 w-64 mb-2" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                        </div>
                      </div>
                      
                      <Skeleton className="h-4 w-2xl" />
                    </div>

                    {/* Right side - Stats */}
                    <div className="flex items-center gap-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                          <Skeleton className="h-8 w-12 mx-auto mb-1" />
                          <Skeleton className="h-3 w-20 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Indicators Section */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                      {/* Accordion Header */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-5 w-5" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-5" />
                      </div>
                      
                      {/* Accordion Content (expanded) */}
                      <div className="px-4 pb-4 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        
                        {/* Technical Notes */}
                        <div className="bg-gray-50 p-4 rounded-sm">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        
                        {/* Compliance Input */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex gap-4">
                            {Array.from({ length: 3 }).map((_, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-8" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* MOV Uploader */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <div className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center">
                            <Skeleton className="h-8 w-8 mx-auto mb-2" />
                            <Skeleton className="h-4 w-48 mx-auto mb-1" />
                            <Skeleton className="h-3 w-64 mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 