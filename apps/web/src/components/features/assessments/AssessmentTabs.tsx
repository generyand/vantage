"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assessment } from "@/types/assessment";
import { IndicatorAccordion } from "./IndicatorAccordion";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface AssessmentTabsProps {
  assessment: Assessment;
  isLocked: boolean;
}

export function AssessmentTabs({ assessment, isLocked }: AssessmentTabsProps) {
  const [activeTab, setActiveTab] = useState(assessment.governanceAreas[0]?.id || "");

  const getAreaStatusIcon = (areaId: string) => {
    const area = assessment.governanceAreas.find(a => a.id === areaId);
    if (!area) return <Circle className="h-4 w-4 text-gray-400" />;

    const totalIndicators = area.indicators.length;
    const completedIndicators = area.indicators.filter(i => i.status === 'completed').length;
    const needsReworkIndicators = area.indicators.filter(i => i.status === 'needs_rework').length;

    if (needsReworkIndicators > 0) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }

    if (completedIndicators === totalIndicators) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getAreaProgress = (areaId: string) => {
    const area = assessment.governanceAreas.find(a => a.id === areaId);
    if (!area) return 0;

    const totalIndicators = area.indicators.length;
    const completedIndicators = area.indicators.filter(i => i.status === 'completed').length;
    
    return totalIndicators > 0 ? Math.round((completedIndicators / totalIndicators) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200 px-6">
          <TabsList className="grid w-full grid-cols-6 h-auto bg-transparent">
            {assessment.governanceAreas.map((area) => (
              <TabsTrigger
                key={area.id}
                value={area.id}
                className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 data-[state=active]:border-primary border-transparent rounded-none"
              >
                <div className="flex items-center space-x-2">
                  {getAreaStatusIcon(area.id)}
                  <span className="text-xs font-medium">{area.code}</span>
                </div>
                <div className="text-xs text-center leading-tight">
                  {area.name}
                </div>
                <div className="text-xs text-gray-500">
                  {getAreaProgress(area.id)}% complete
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {assessment.governanceAreas.map((area) => (
          <TabsContent key={area.id} value={area.id} className="p-6">
            <div className="space-y-4">
              {/* Area Header */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {area.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {area.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    {area.isCore ? 'Core Area' : 'Essential Area'}
                  </span>
                  <span className="text-gray-500">
                    {area.indicators.length} indicators
                  </span>
                  <span className="text-gray-500">
                    {area.indicators.filter(i => i.status === 'completed').length} completed
                  </span>
                </div>
              </div>

              {/* Indicators Accordion */}
              <div className="space-y-4">
                {area.indicators.map((indicator) => (
                  <IndicatorAccordion
                    key={indicator.id}
                    indicator={indicator}
                    isLocked={isLocked}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 