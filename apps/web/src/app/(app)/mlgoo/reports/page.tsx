'use client';

import { useState } from 'react';
import { 
  Target,
  Activity,
  Filter,
  Zap,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportsSkeleton } from '@/components/features/reports/ReportsSkeleton';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('sglgb-2024');
  const [selectedBarangay, setSelectedBarangay] = useState('');
  
  // Mock loading state - in real app this would come from API
  const [isLoading] = useState(false);

  // Mock data matching the design from the image
  const analyticsData = {
    globalFilters: {
      assessmentPeriod: 'SGLGB 2024',
      availablePeriods: ['SGLGB 2024', 'SGLGB 2023', 'SGLGB 2022']
    },
    officialPerformance: {
      title: 'Official SGLGB Performance (sglgb-2024)',
      passRate: 78,
      totalBarangays: 25,
      passed: 18,
      failed: 5,
      inProgress: 2,
      barangays: [
        { name: 'Barangay Poblacion', score: 95, status: 'passed' },
        { name: 'Barangay Balasinon', score: 92, status: 'passed' },
        { name: 'Barangay Buguis', score: 89, status: 'passed' },
        { name: 'Barangay Carre', score: 85, status: 'passed' },
        { name: 'Barangay Clib', score: 82, status: 'passed' },
        { name: 'Barangay Harada Butai', score: 80, status: 'passed' },
        { name: 'Barangay Katipunan', score: 78, status: 'passed' },
        { name: 'Barangay Kiblagon', score: 76, status: 'passed' },
        { name: 'Barangay Labon', score: 73, status: 'passed' },
        { name: 'Barangay Laperas', score: 70, status: 'passed' },
        { name: 'Barangay Lapla', score: 68, status: 'passed' },
        { name: 'Barangay Litos', score: 65, status: 'passed' },
        { name: 'Barangay Luparan', score: 62, status: 'passed' },
        { name: 'Barangay Mckinley', score: 60, status: 'passed' },
        { name: 'Barangay New Cebu', score: 58, status: 'passed' },
        { name: 'Barangay Osmeña', score: 55, status: 'passed' },
        { name: 'Barangay Palili', score: 52, status: 'passed' },
        { name: 'Barangay Parame', score: 50, status: 'failed' },
        { name: 'Barangay Roxas', score: 48, status: 'failed' },
        { name: 'Barangay Solongvale', score: 45, status: 'failed' },
        { name: 'Barangay Tagolilong', score: 42, status: 'failed' },
        { name: 'Barangay Tala-o', score: 40, status: 'failed' },
        { name: 'Barangay Talas', score: 38, status: 'inProgress' },
        { name: 'Barangay Tanwalang', score: 35, status: 'inProgress' },
        { name: 'Barangay Waterfall', score: 32, status: 'inProgress' }
      ]
    },
    municipalityPerformance: {
      hotspots: [
        { indicator: '1.1.5 BADAC Plan', score: '10/25', status: 'critical' },
        { indicator: '4.2.3 Environmental Management', score: '10/25', status: 'critical' },
        { indicator: '2.1.2 Financial Records', score: '12/25', status: 'warning' },
        { indicator: '3.3.1 Youth Development', score: '7/25', status: 'critical' },
        { indicator: '1.4.1 Digital Governance', score: '6/25', status: 'critical' }
      ]
    },
    capacityDevelopment: {
      title: 'Capacity Development Priority',
      description: 'Focus municipal training programs on the indicators with the lowest scores. Indicators with failing indicators represent the most critical areas for capacity development.'
    },
    preAssessmentAnalysis: {
      predictionAccuracy: 92,
      falsePositives: 1,
      falseNegatives: 1,
      summary: 'The VANTAGE pre-assessment system achieved a 92% accuracy rate, with 1 false positives and 1 false negatives. This indicates the system\'s effectiveness in predicting SGLGB outcomes.'
    },
    aiReport: {
      title: 'Generate AI-Powered CapDev Report',
      description: 'Get detailed insights and recommendations for specific barangays',
      availableBarangays: [
        'Barangay Poblacion',
        'Barangay Balasinon',
        'Barangay Buguis',
        'Barangay Carre',
        'Barangay Clib',
        'Barangay Harada Butai',
        'Barangay Katipunan',
        'Barangay Kiblagon',
        'Barangay Labon',
        'Barangay Laperas',
        'Barangay Lapla',
        'Barangay Litos',
        'Barangay Luparan',
        'Barangay Mckinley',
        'Barangay New Cebu',
        'Barangay Osmeña',
        'Barangay Palili',
        'Barangay Parame',
        'Barangay Roxas',
        'Barangay Solongvale',
        'Barangay Tagolilong',
        'Barangay Tala-o',
        'Barangay Talas',
        'Barangay Tanwalang',
        'Barangay Waterfall'
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Global Filters */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Global Filters</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Assessment Period:</span>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40 bg-[var(--background)] border-[var(--border)] rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50">
                    {analyticsData.globalFilters.availablePeriods.map((period) => (
                      <SelectItem 
                        key={period} 
                        value={period.toLowerCase().replace(' ', '-')}
                        className="text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-900 dark:hover:text-blue-400 cursor-pointer px-3 py-2"
                      >
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Official SGLGB Performance - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {analyticsData.officialPerformance.title}
                  </h3>
                  
                  {/* Donut Chart and Stats */}
                  <div className="flex items-center gap-8 mb-6">
                    {/* Donut Chart Representation */}
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-green-500 transform -rotate-90"
                        style={{
                          borderTopColor: 'transparent',
                          borderRightColor: 'transparent',
                          borderBottomColor: 'transparent',
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (analyticsData.officialPerformance.passRate / 100) * 50}% 0%, 100% 50%, 50% 50%)`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[var(--foreground)]">{analyticsData.officialPerformance.totalBarangays}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">Total</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-[var(--foreground)]">Passed ({analyticsData.officialPerformance.passed})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-[var(--foreground)]">Failed ({analyticsData.officialPerformance.failed})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-[var(--foreground)]">In Progress ({analyticsData.officialPerformance.inProgress})</span>
                      </div>
                    </div>
                    
                    {/* Pass Rate */}
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium text-[var(--foreground)] mb-1">Officially Passed Barangays</div>
                      <div className="text-sm text-[var(--muted-foreground)]">Pass Rate: <span className="font-bold text-green-600 dark:text-green-400">{analyticsData.officialPerformance.passRate}%</span></div>
                    </div>
                  </div>
                </div>
                
                {/* Barangay List */}
                <div className="p-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide pb-2 border-b border-[var(--border)]">
                      <div>Barangay</div>
                      <div>Score</div>
                      <div>Status</div>
                    </div>
                    
                    {analyticsData.officialPerformance.barangays.map((barangay, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-center py-2 hover:bg-[var(--hover)] rounded-sm transition-colors">
                        <div className="text-sm font-medium text-[var(--foreground)]">{barangay.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--border)] rounded-sm h-2">
                            <div 
                              className={`h-2 rounded-sm ${getScoreBarColor(barangay.score)}`}
                              style={{ width: `${barangay.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[var(--foreground)] w-8">{barangay.score}%</span>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(barangay.status)}`}>
                            {barangay.status === 'passed' ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Municipality-Wide Performance Hotspots */}
            <div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">Municipality-Wide Performance Hotspots</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Top 5 most commonly failed indicators based on historical results</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {analyticsData.municipalityPerformance.hotspots.map((hotspot, index) => (
                    <div key={index} className="bg-red-50/80 dark:bg-red-900/20 rounded-sm p-4 border border-red-200/50 dark:border-red-800/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{hotspot.indicator}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">Failed by {hotspot.score.split('/')[1]} barangays ({hotspot.score})</div>
                        </div>
                        <div className={`px-2 py-1 rounded-sm text-xs font-bold ${getStatusColor(hotspot.status)}`}>
                          {hotspot.score}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Capacity Development Priority */}
                  <div className="mt-6 bg-blue-50/80 dark:bg-blue-900/20 rounded-sm p-4 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">{analyticsData.capacityDevelopment.title}</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{analyticsData.capacityDevelopment.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Assessment Effectiveness Analysis */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">Pre-Assessment Effectiveness Analysis</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Prediction Accuracy */}
                <div className="bg-green-50/80 dark:bg-green-900/20 rounded-sm p-6 text-center border border-green-200/50 dark:border-green-800/50">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{analyticsData.preAssessmentAnalysis.predictionAccuracy}%</div>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">Prediction Accuracy</div>
                  <div className="text-xs text-green-700 dark:text-green-300">21 total predictions</div>
                </div>
                
                {/* False Positives */}
                <div className="bg-orange-50/80 dark:bg-orange-900/20 rounded-sm p-6 text-center border border-orange-200/50 dark:border-orange-800/50">
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">{analyticsData.preAssessmentAnalysis.falsePositives}</div>
                  <div className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">False Positives</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">Predicted Pass, Actually Failed</div>
                </div>
                
                {/* False Negatives */}
                <div className="bg-red-50/80 dark:bg-red-900/20 rounded-sm p-6 text-center border border-red-200/50 dark:border-red-800/50">
                  <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{analyticsData.preAssessmentAnalysis.falseNegatives}</div>
                  <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">False Negatives</div>
                  <div className="text-xs text-red-700 dark:text-red-300">Predicted Fail, Actually Passed</div>
                </div>
              </div>
              
              {/* Analysis Summary */}
              <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-sm p-4 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">Analysis Summary</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{analyticsData.preAssessmentAnalysis.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered CapDev Report Generator */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-[var(--foreground)]">{analyticsData.aiReport.title}</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{analyticsData.aiReport.description}</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Select a Barangay:</span>
                  <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                    <SelectTrigger className="w-64 bg-[var(--background)] border-[var(--border)] rounded-sm">
                      <SelectValue placeholder="Choose a barangay..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-sm z-50">
                      {analyticsData.aiReport.availableBarangays.map((barangay) => (
                        <SelectItem 
                          key={barangay} 
                          value={barangay}
                          className="text-[var(--foreground)] hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-900 dark:hover:text-purple-400 cursor-pointer px-3 py-2"
                        >
                          {barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  disabled={!selectedBarangay}
                >
                  <Zap className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 