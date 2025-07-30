"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Indicator } from "@/types/assessment";
import { IndicatorForm } from "./IndicatorForm";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface IndicatorAccordionProps {
  indicator: Indicator;
  isLocked: boolean;
}

export function IndicatorAccordion({ indicator, isLocked }: IndicatorAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    switch (indicator.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'needs_rework':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'not_started':
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (indicator.status) {
      case 'completed':
        return 'Completed';
      case 'needs_rework':
        return 'Needs Rework';
      case 'not_started':
      default:
        return 'Not Started';
    }
  };

  return (
    <Accordion type="single" collapsible value={isOpen ? indicator.id : ""} onValueChange={(value) => setIsOpen(value === indicator.id)}>
      <AccordionItem value={indicator.id} className="border border-gray-200 rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium text-gray-500">
                  {getStatusText()}
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {indicator.code} - {indicator.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {indicator.description.length > 100 
                    ? `${indicator.description.substring(0, 100)}...` 
                    : indicator.description
                  }
                </div>
              </div>
            </div>
            
            {/* MOV Files Count */}
            {indicator.movFiles.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{indicator.movFiles.length} MOV file(s)</span>
              </div>
            )}
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-6 pb-6">
          <IndicatorForm 
            indicator={indicator} 
            isLocked={isLocked}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 