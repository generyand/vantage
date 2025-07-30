import { useQuery } from '@tanstack/react-query';

// Mock data - replace with actual API calls
const mockAnalyticsData = {
  officialPerformance: {
    totalBarangays: 25,
    passed: 18,
    failed: 5,
    notAssessed: 2,
    passedBarangays: [
      { name: 'Barangay Poblacion', score: 95 },
      { name: 'Barangay San Miguel', score: 92 },
      { name: 'Barangay San Jose', score: 88 },
      { name: 'Barangay San Antonio', score: 85 },
      { name: 'Barangay San Francisco', score: 82 },
      { name: 'Barangay San Pedro', score: 80 },
      { name: 'Barangay San Juan', score: 78 },
      { name: 'Barangay San Pablo', score: 75 },
      { name: 'Barangay San Mateo', score: 72 },
      { name: 'Barangay San Lorenzo', score: 70 },
      { name: 'Barangay San Isidro', score: 68 },
      { name: 'Barangay San Nicolas', score: 65 },
      { name: 'Barangay San Vicente', score: 62 },
      { name: 'Barangay San Rafael', score: 60 },
      { name: 'Barangay San Gabriel', score: 58 },
      { name: 'Barangay San Andres', score: 55 },
      { name: 'Barangay San Agustin', score: 52 },
      { name: 'Barangay San Sebastian', score: 50 },
    ]
  },
  crossMatching: {
    predictionAccuracy: {
      accuracy: 92,
      falsePositives: 1,
      falseNegatives: 1,
      totalPredictions: 23
    },
    discrepancies: [
      {
        barangay: 'Barangay San Vicente',
        vantagePrediction: 'Pass' as const,
        officialResult: 'Fail' as const,
        supervisorRemarks: 'Documentation issues discovered during final validation that were not captured in pre-assessment'
      },
      {
        barangay: 'Barangay San Rafael',
        vantagePrediction: 'Fail' as const,
        officialResult: 'Pass' as const,
        supervisorRemarks: 'Barangay made significant improvements between pre-assessment and final validation'
      }
    ]
  },
  systemicWeakness: {
    weaknesses: [
      {
        indicator: '3.1.5: BADAC Plan',
        failedCount: 12,
        totalBarangays: 25,
        percentage: 48
      },
      {
        indicator: '4.2.3: Environmental Management',
        failedCount: 10,
        totalBarangays: 25,
        percentage: 40
      },
      {
        indicator: '2.1.2: Financial Records',
        failedCount: 8,
        totalBarangays: 25,
        percentage: 32
      },
      {
        indicator: '5.3.1: Youth Development',
        failedCount: 7,
        totalBarangays: 25,
        percentage: 28
      },
      {
        indicator: '1.4.1: Digital Governance',
        failedCount: 6,
        totalBarangays: 25,
        percentage: 24
      }
    ]
  },
  barangays: [
    { value: 'poblacion', label: 'Barangay Poblacion' },
    { value: 'san-miguel', label: 'Barangay San Miguel' },
    { value: 'san-jose', label: 'Barangay San Jose' },
    { value: 'san-antonio', label: 'Barangay San Antonio' },
    { value: 'san-francisco', label: 'Barangay San Francisco' },
    { value: 'san-pedro', label: 'Barangay San Pedro' },
    { value: 'san-juan', label: 'Barangay San Juan' },
    { value: 'san-pablo', label: 'Barangay San Pablo' },
    { value: 'san-mateo', label: 'Barangay San Mateo' },
    { value: 'san-lorenzo', label: 'Barangay San Lorenzo' },
    { value: 'san-isidro', label: 'Barangay San Isidro' },
    { value: 'san-nicolas', label: 'Barangay San Nicolas' },
    { value: 'san-vicente', label: 'Barangay San Vicente' },
    { value: 'san-rafael', label: 'Barangay San Rafael' },
    { value: 'san-gabriel', label: 'Barangay San Gabriel' },
    { value: 'san-andres', label: 'Barangay San Andres' },
    { value: 'san-agustin', label: 'Barangay San Agustin' },
    { value: 'san-sebastian', label: 'Barangay San Sebastian' },
    { value: 'san-diego', label: 'Barangay San Diego' },
    { value: 'san-marcos', label: 'Barangay San Marcos' },
    { value: 'san-lucas', label: 'Barangay San Lucas' },
    { value: 'san-martin', label: 'Barangay San Martin' },
    { value: 'san-cristobal', label: 'Barangay San Cristobal' },
    { value: 'san-bartolome', label: 'Barangay San Bartolome' },
    { value: 'san-tomas', label: 'Barangay San Tomas' }
  ]
};

const analyticsKeys = {
  all: ['analytics'] as const,
  officialPerformance: (period: string) => [...analyticsKeys.all, 'official-performance', period] as const,
  crossMatching: (period: string) => [...analyticsKeys.all, 'cross-matching', period] as const,
  systemicWeakness: (period: string) => [...analyticsKeys.all, 'systemic-weakness', period] as const,
  barangays: () => [...analyticsKeys.all, 'barangays'] as const,
};

export function useOfficialPerformance(period: string) {
  return useQuery({
    queryKey: analyticsKeys.officialPerformance(period),
    queryFn: () => Promise.resolve(mockAnalyticsData.officialPerformance),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCrossMatching(period: string) {
  return useQuery({
    queryKey: analyticsKeys.crossMatching(period),
    queryFn: () => Promise.resolve(mockAnalyticsData.crossMatching),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSystemicWeakness(period: string) {
  return useQuery({
    queryKey: analyticsKeys.systemicWeakness(period),
    queryFn: () => Promise.resolve(mockAnalyticsData.systemicWeakness),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBarangays() {
  return useQuery({
    queryKey: analyticsKeys.barangays(),
    queryFn: () => Promise.resolve(mockAnalyticsData.barangays),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
} 