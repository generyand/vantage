"use client";

import FileUploader from "@/components/shared/FileUploader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useDeleteMOV,
  useUpdateResponse,
  useUploadMOV,
} from "@/hooks/useAssessment";
import { Indicator } from "@/types/assessment";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";
import { DynamicIndicatorForm } from "./DynamicIndicatorForm";

interface IndicatorAccordionProps {
  indicator: Indicator;
  isLocked: boolean;
  updateAssessmentData?: (updater: (data: any) => any) => void;
}

export function IndicatorAccordion({
  indicator,
  isLocked,
  updateAssessmentData,
}: IndicatorAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateResponse } = useUpdateResponse();
  const { mutate: uploadMOV, isPending: isUploading } = useUploadMOV();
  const { mutate: deleteMOV, isPending: isDeleting } = useDeleteMOV();

  const getStatusIcon = () => {
    switch (indicator.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "needs_rework":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "not_started":
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (indicator.status) {
      case "completed":
        return "Completed";
      case "needs_rework":
        return "Needs Rework";
      case "not_started":
      default:
        return "Not Started";
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? indicator.id : ""}
      onValueChange={(value) => setIsOpen(value === indicator.id)}
    >
      <AccordionItem
        value={indicator.id}
        className="border border-[var(--border)] rounded-lg bg-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200"
      >
        <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-[var(--hover)] rounded-lg transition-colors duration-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {getStatusText()}
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-[var(--foreground)]">
                  {indicator.code} - {indicator.name}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">
                  {indicator.description.length > 100
                    ? `${indicator.description.substring(0, 100)}...`
                    : indicator.description}
                </div>
              </div>
            </div>

            {/* MOV Files Count */}
            {indicator.movFiles.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                <span>{indicator.movFiles.length} MOV file(s)</span>
              </div>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-6 pb-6 pt-4">
          <div className="space-y-8">
            <DynamicIndicatorForm
              formSchema={indicator.formSchema}
              initialData={indicator.responseData}
              isDisabled={isLocked}
              onChange={(data) => {
                if (!isLocked && indicator.id) {
                  // Update the assessment data using the reactive state
                  updateAssessmentData((prevData) => {
                    const updatedData = { ...prevData };
                    const area = updatedData.governanceAreas.find((a) =>
                      a.indicators.some((i) => i.id === indicator.id)
                    );
                    if (area) {
                      const indicatorIndex = area.indicators.findIndex(
                        (i) => i.id === indicator.id
                      );
                      if (indicatorIndex !== -1) {
                        area.indicators[indicatorIndex] = {
                          ...area.indicators[indicatorIndex],
                          responseData: data,
                          complianceAnswer: data.compliance,
                          status:
                            data.compliance === "yes" ||
                            data.compliance === "no"
                              ? "completed"
                              : "not_started",
                        };
                      }
                    }
                    return updatedData;
                  });

                  // Call the update response hook
                  updateResponse(indicator.id, { response_data: data });
                }
              }}
            />

            {/* MOV File Uploader Section */}
            <div className="space-y-4 bg-[var(--card)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--cityscape-yellow)] rounded-full"></div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">
                  Means of Verification (MOV)
                </h4>
              </div>
              <FileUploader
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                maxSize={10} // 10MB limit
                multiple={true}
                disabled={isLocked}
                isLoading={isUploading || isDeleting}
                uploadUrl={`/api/v1/assessments/responses/${indicator.id}/movs`}
                existingFiles={indicator.movFiles.map((file) => ({
                  id: file.id,
                  name: file.name,
                  size: file.size,
                  url: file.url,
                }))}
                onUploadComplete={async (files) => {
                  // For each uploaded file
                  for (const file of files) {
                    try {
                      // First, get the file URL (in a real app, this would be from a storage service)
                      const fileUrl = URL.createObjectURL(file);

                      // Then create the MOV record
                      await uploadMOV({
                        responseId: indicator.id,
                        data: {
                          name: file.name,
                          size: file.size,
                          url: fileUrl,
                          response_id: indicator.id,
                        },
                      });

                      // Update the indicator's movFiles array
                      indicator.movFiles.push({
                        id: Date.now(), // Temporary ID for demo
                        name: file.name,
                        size: file.size,
                        url: fileUrl,
                      });
                    } catch (error) {
                      console.error("Failed to upload MOV:", error);
                      // TODO: Show error toast
                    }
                  }
                }}
                onDeleteFile={async (fileId) => {
                  try {
                    await deleteMOV({ movId: fileId });

                    // Remove the file from the indicator's movFiles array
                    const index = indicator.movFiles.findIndex(
                      (file) => file.id === fileId
                    );
                    if (index !== -1) {
                      // Get the file name before removing it
                      const deletedFileName = indicator.movFiles[index].name;

                      // Remove from movFiles
                      indicator.movFiles.splice(index, 1);

                      // Also remove from uploadedFiles if it exists there
                      setUploadedFiles((prev) =>
                        prev.filter((file) => file.name !== deletedFileName)
                      );

                      // Force a re-render
                      setIsOpen(isOpen);
                    }
                  } catch (error) {
                    console.error("Failed to delete MOV:", error);
                    // TODO: Show error toast
                  }
                }}
                onUploadError={(error) => {
                  console.error("MOV upload error:", error);
                  // TODO: Show error toast
                }}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
