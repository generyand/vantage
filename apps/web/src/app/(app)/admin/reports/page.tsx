'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AnalyticsHeader,
  OfficialPerformanceWidget,
  CrossMatchingWidget,
  SystemicWeaknessWidget,
  AIRecommendationsWidget
} from '@/components/features/analytics';
import { 
  useOfficialPerformance,
  useCrossMatching,
  useSystemicWeakness,
  useBarangays
} from '@/hooks/useAnalytics';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('sglgb-2024');

  // Fetch analytics data
  const { 
    data: officialPerformance, 
    isLoading: isLoadingOfficial, 
    error: errorOfficial 
  } = useOfficialPerformance(selectedPeriod);
  
  const { 
    data: crossMatching, 
    isLoading: isLoadingCrossMatching, 
    error: errorCrossMatching 
  } = useCrossMatching(selectedPeriod);
  
  const { 
    data: systemicWeakness, 
    isLoading: isLoadingSystemic, 
    error: errorSystemic 
  } = useSystemicWeakness(selectedPeriod);
  
  const { 
    data: barangays, 
    isLoading: isLoadingBarangays, 
    error: errorBarangays 
  } = useBarangays();

  const isLoading = isLoadingOfficial || isLoadingCrossMatching || isLoadingSystemic || isLoadingBarangays;
  const hasError = errorOfficial || errorCrossMatching || errorSystemic || errorBarangays;

  if (hasError) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load analytics data. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full lg:col-span-2" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Official Performance Widget - Spans 2 columns */}
        <div className="lg:col-span-2">
          <OfficialPerformanceWidget 
            data={officialPerformance!}
            period={selectedPeriod}
          />
        </div>

        {/* Systemic Weakness Widget */}
        <div>
          <SystemicWeaknessWidget 
            data={systemicWeakness!}
          />
        </div>
      </div>

      {/* Cross Matching Widget - Full width */}
      <CrossMatchingWidget 
        data={crossMatching!}
      />

      {/* AI Recommendations Widget - Full width */}
      <AIRecommendationsWidget 
        data={{ barangays: barangays! }}
      />
    </div>
  );
} 