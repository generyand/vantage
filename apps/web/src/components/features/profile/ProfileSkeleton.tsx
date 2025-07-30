import { Skeleton } from '@/components/ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Profile Form Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
            {/* User Details Section Skeleton */}
            <div className="xl:col-span-2">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 border-0 shadow-lg h-full rounded-sm">
                {/* Card Header */}
                <div className="relative z-10 p-6 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                </div>
                
                {/* Card Content */}
                <div className="relative z-10 p-6 pt-0 flex flex-col h-full">
                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="bg-gray-100/80 backdrop-blur-sm rounded-sm p-4 border border-gray-200/50">
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </div>
                      
                      {/* Email Address */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="bg-gray-100/80 backdrop-blur-sm rounded-sm p-4 border border-gray-200/50">
                          <Skeleton className="h-5 w-40" />
                        </div>
                      </div>
                      
                      {/* Assigned Barangay */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="bg-gray-100/80 backdrop-blur-sm rounded-sm p-4 border border-gray-200/50">
                          <Skeleton className="h-5 w-28" />
                        </div>
                      </div>
                      
                      {/* Role */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="bg-gray-100/80 backdrop-blur-sm rounded-sm p-4 border border-gray-200/50">
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alert */}
                  <div className="bg-amber-50/80 border-amber-200/60 backdrop-blur-sm rounded-sm p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <Skeleton className="h-4 w-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section Skeleton */}
            <div className="space-y-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/40 border-0 shadow-lg rounded-sm">
                {/* Card Header */}
                <div className="relative z-10 p-6 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-sm" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                  <Skeleton className="h-4 w-56" />
                </div>
                
                {/* Card Content */}
                <div className="relative z-10 p-6 pt-0">
                  <div className="space-y-5">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <div className="relative">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <div className="relative">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-sm p-3 border border-white/50">
                        <Skeleton className="h-3 w-32 mb-2" />
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Skeleton className="w-4 h-4 rounded-full" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <div className="relative">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 