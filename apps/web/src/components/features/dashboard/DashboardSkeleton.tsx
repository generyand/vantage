import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Status Card Skeleton */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-80" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      {/* Feedback Section Skeleton */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Governance Areas Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}