"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assessment } from "@/types/assessment";
import { IndicatorAccordion } from "./IndicatorAccordion";
import { CheckCircle, Circle, AlertCircle, FileText, Target } from "lucide-react";
import Image from "next/image";

interface AssessmentTabsProps {
  assessment: Assessment;
  isLocked: boolean;
}

export function AssessmentTabs({ assessment, isLocked }: AssessmentTabsProps) {
  const [activeTab, setActiveTab] = useState(assessment.governanceAreas[0]?.id || "");

  // Function to get the logo path based on area name
  const getAreaLogo = (areaName: string) => {
    const name = areaName.toLowerCase();
    
    if (name.includes('financial') || name.includes('admin')) {
      return '/Assessment_Areas/financialAdmin.png';
    } else if (name.includes('disaster') || name.includes('preparedness')) {
      return '/Assessment_Areas/disasterPreparedness.png';
    } else if (name.includes('safety') || name.includes('peace') || name.includes('order')) {
      return '/Assessment_Areas/safetyPeaceAndOrder.png';
    } else if (name.includes('social') || name.includes('protection') || name.includes('sensitivity')) {
      return '/Assessment_Areas/socialProtectAndSensitivity.png';
    } else if (name.includes('business') || name.includes('friendliness') || name.includes('competitiveness')) {
      return '/Assessment_Areas/businessFriendliness.png';
    } else if (name.includes('environmental') || name.includes('management')) {
      return '/Assessment_Areas/environmentalManagement.png';
    }
    
    // Default fallback
    return '/Assessment_Areas/financialAdmin.png';
  };

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

  const getAreaConfig = (areaName: string) => {
    const name = areaName.toLowerCase();
    
    if (name.includes('financial')) {
      return {
        bgGradient: 'from-emerald-50 to-green-50',
        accentColor: 'text-emerald-600',
        borderColor: 'border-emerald-200'
      };
    } else if (name.includes('disaster')) {
      return {
        bgGradient: 'from-blue-50 to-indigo-50',
        accentColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      };
    } else if (name.includes('safety') || name.includes('peace')) {
      return {
        bgGradient: 'from-amber-50 to-orange-50',
        accentColor: 'text-amber-600',
        borderColor: 'border-amber-200'
      };
    } else if (name.includes('social') || name.includes('protection')) {
      return {
        bgGradient: 'from-pink-50 to-rose-50',
        accentColor: 'text-pink-600',
        borderColor: 'border-pink-200'
      };
    } else if (name.includes('business') || name.includes('competitiveness')) {
      return {
        bgGradient: 'from-purple-50 to-violet-50',
        accentColor: 'text-purple-600',
        borderColor: 'border-purple-200'
      };
    } else if (name.includes('environmental')) {
      return {
        bgGradient: 'from-green-50 to-emerald-50',
        accentColor: 'text-green-600',
        borderColor: 'border-green-200'
      };
    }
    
    return {
      bgGradient: 'from-gray-50 to-slate-50',
      accentColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    };
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-sm shadow-lg border-0 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Tab Navigation */}
        <div className="bg-gradient-to-r from-slate-100/50 to-gray-100/30 border-b border-gray-200/60 px-6 py-6">
          <TabsList className="grid w-full grid-cols-6 h-auto bg-transparent gap-3">
            {assessment.governanceAreas.map((area) => {
              const progress = getAreaProgress(area.id);
              const logoPath = getAreaLogo(area.name);
              const config = getAreaConfig(area.name);
              const isActive = activeTab === area.id;
              
              return (
                <TabsTrigger
                  key={area.id}
                  value={area.id}
                  className={`group relative flex flex-col items-center p-5 rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.03] min-h-[180px] overflow-hidden ${
                    isActive 
                      ? `bg-gradient-to-br ${config.bgGradient} shadow-xl scale-[1.05] border-2 ${config.borderColor}` 
                      : 'bg-white/90 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300/80'
                  }`}
                >
                  {/* Decorative background for active state */}
                  {isActive && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-3 w-full">
                    {/* Logo and Status */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-sm p-3 shadow-md transition-all duration-200 ${
                        isActive ? 'bg-white/95 shadow-lg' : 'bg-white/90 group-hover:shadow-lg'
                      }`}>
                        <Image
                          src={logoPath}
                          alt={`${area.name} logo`}
                          width={32}
                          height={32}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        {getAreaStatusIcon(area.id)}
                      </div>
                    </div>
                    
                    {/* Area Code - Main Display */}
                    <div className={`px-4 py-2 rounded-sm text-lg font-bold transition-colors duration-200 ${
                      isActive 
                        ? `${config.accentColor} bg-white/90 shadow-sm` 
                        : 'text-gray-700 bg-gray-100/80 group-hover:bg-gray-200/80'
                    }`}>
                      {area.code}
                    </div>
                    
                    {/* Progress Section */}
                    <div className="w-full space-y-2 mt-auto">
                      {/* Progress Percentage */}
                      <div className={`text-center transition-colors duration-200 ${
                        isActive ? config.accentColor : 'text-gray-700'
                      }`}>
                        <div className="text-lg font-bold">{progress}%</div>
                        <div className="text-xs opacity-80">complete</div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200/80 rounded-sm h-2 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-sm transition-all duration-500 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      {/* Progress Text */}
                      <div className="text-xs text-center text-gray-600">
                        {area.indicators.filter(i => i.status === 'completed').length} of {area.indicators.length} indicators
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm ${
                    isActive ? 'hidden' : ''
                  }`} />
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Enhanced Tab Content */}
        {assessment.governanceAreas.map((area) => {
          const config = getAreaConfig(area.name);
          const logoPath = getAreaLogo(area.name);
          const progress = getAreaProgress(area.id);
          const completedIndicators = area.indicators.filter(i => i.status === 'completed').length;
          
          return (
            <TabsContent key={area.id} value={area.id} className="p-0">
              <div className="space-y-6">
                {/* Enhanced Area Header */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} p-8 ${config.borderColor} border-b`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left side - Area info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/90 rounded-sm p-3 shadow-sm">
                            <Image
                              src={logoPath}
                              alt={`${area.name} logo`}
                              width={40}
                              height={40}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                              {area.name}
                            </h2>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`px-3 py-1 rounded-sm bg-white/60 backdrop-blur-sm ${config.accentColor} font-medium`}>
                                {area.code}
                              </span>
                              <span className="text-gray-700">
                                {area.isCore ? 'Core Area' : 'Essential Area'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed max-w-2xl">
                          {area.description}
                        </p>
                      </div>

                      {/* Right side - Stats */}
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                          <div className="text-2xl font-bold text-gray-900">{completedIndicators}</div>
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Completed</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                          <div className="text-2xl font-bold text-gray-900">{area.indicators.length - completedIndicators}</div>
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Remaining</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-sm p-4 text-center shadow-sm">
                          <div className={`text-2xl font-bold ${config.accentColor}`}>{progress}%</div>
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Complete</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Area Progress</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200/80 rounded-sm h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>{completedIndicators} indicators completed</span>
                        <span>{area.indicators.length - completedIndicators} remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Indicators Section */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Assessment Indicators</h3>
                    <span className="text-sm text-gray-500">({area.indicators.length} total)</span>
                  </div>
                  
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
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
} 