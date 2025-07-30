'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AIReport {
  executiveSummary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  actionableRecommendations: string[];
  suggestedCapDevNeeds: string[];
}

interface AIRecommendationsData {
  barangays: Array<{
    value: string;
    label: string;
  }>;
}

interface AIRecommendationsWidgetProps {
  data: AIRecommendationsData;
}

export function AIRecommendationsWidget({ data }: AIRecommendationsWidgetProps) {
  const [selectedBarangay, setSelectedBarangay] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<AIReport | null>(null);

  const handleGenerateReport = async () => {
    if (!selectedBarangay) return;

    setIsGenerating(true);
    
    // Simulate API call to Gemini
    setTimeout(() => {
      const mockReport: AIReport = {
        executiveSummary: `${data.barangays.find(b => b.value === selectedBarangay)?.label} demonstrated moderate performance in the SGLGB assessment, achieving a pass rate of 75%. While the barangay shows strong community engagement and basic governance structures, there are specific areas requiring targeted improvement to achieve higher standards.`,
        keyStrengths: [
          "Strong community participation in local governance",
          "Well-maintained basic infrastructure",
          "Effective disaster preparedness protocols",
          "Transparent financial management practices"
        ],
        areasForImprovement: [
          "Documentation and record-keeping systems",
          "Environmental management programs",
          "Youth development initiatives",
          "Digital governance implementation"
        ],
        actionableRecommendations: [
          "Establish a comprehensive documentation system with digital backup",
          "Develop and implement environmental protection programs",
          "Create youth engagement programs and facilities",
          "Implement basic digital services for residents"
        ],
        suggestedCapDevNeeds: [
          "Records Management and Documentation Training",
          "Environmental Management and Sustainability Workshop",
          "Youth Development and Leadership Training",
          "Digital Governance and E-Services Training"
        ]
      };
      
      setGeneratedReport(mockReport);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    // Mock PDF download functionality
    console.log('Downloading PDF for', selectedBarangay);
    // In a real implementation, this would call an API to generate and download a PDF
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Generate AI-Powered CapDev Report</CardTitle>
        <p className="text-sm text-gray-600">
          Get detailed insights and recommendations for specific barangays
        </p>
      </CardHeader>
      <CardContent>
        {!generatedReport ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select a Barangay
                </label>
                <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a barangay..." />
                  </SelectTrigger>
                  <SelectContent>
                    {data.barangays.map((barangay) => (
                      <SelectItem key={barangay.value} value={barangay.value}>
                        {barangay.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedBarangay || isGenerating}
                className="mt-6"
              >
                {isGenerating ? 'Generating...' : 'Generate Insights'}
              </Button>
            </div>
            
            {isGenerating && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Analyzing data and generating insights...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  CapDev Report: {data.barangays.find(b => b.value === selectedBarangay)?.label}
                </h3>
                <p className="text-sm text-gray-600">AI-Generated Analysis</p>
              </div>
              <Button onClick={handleDownloadPDF} variant="outline">
                Download as PDF
              </Button>
            </div>

            {/* Executive Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Executive Summary</h4>
              <p className="text-sm text-blue-800">{generatedReport.executiveSummary}</p>
            </div>

            {/* Key Strengths */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Strengths</h4>
              <div className="space-y-2">
                {generatedReport.keyStrengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h4>
              <div className="space-y-2">
                {generatedReport.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{area}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Actionable Recommendations</h4>
              <div className="space-y-2">
                {generatedReport.actionableRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-1 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested CapDev Needs */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Suggested CapDev Needs</h4>
              <div className="space-y-2">
                {generatedReport.suggestedCapDevNeeds.map((need, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{need}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate New Report Button */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setGeneratedReport(null);
                  setSelectedBarangay('');
                }}
              >
                Generate New Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 