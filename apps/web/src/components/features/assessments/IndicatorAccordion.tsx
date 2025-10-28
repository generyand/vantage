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
import { uploadMovFile } from "@/lib/uploadMov";
import { Assessment, ComplianceAnswer, Indicator } from "@/types/assessment";
import { postAssessmentsResponses } from "@vantage/shared";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";
import { DynamicIndicatorForm } from "./DynamicIndicatorForm";

interface IndicatorAccordionProps {
  indicator: Indicator;
  isLocked: boolean;
  updateAssessmentData?: (updater: (data: Assessment) => Assessment) => void;
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

  // Track compliance locally so UI reacts immediately on change
  const [localCompliance, setLocalCompliance] = useState<
    ComplianceAnswer | undefined
  >(
    (indicator.complianceAnswer ||
      (indicator.responseData?.compliance as ComplianceAnswer | undefined)) as
      | ComplianceAnswer
      | undefined
  );
  const shouldShowMov = localCompliance === "yes";

  async function ensureResponseId(): Promise<number> {
    const existing = (indicator as any).responseId as number | null | undefined;
    if (existing) return existing;

    const created = await postAssessmentsResponses({
      indicator_id: parseInt(indicator.id),
      assessment_id: parseInt((indicator as any).governanceAreaId || "0") || 1, // fallback
      response_data: {},
    });

    if (updateAssessmentData) {
      updateAssessmentData((prevData) => {
        const updated = { ...prevData };
        const area = updated.governanceAreas.find((a) =>
          a.indicators.some((i) => i.id === indicator.id)
        );
        if (area) {
          const idx = area.indicators.findIndex((i) => i.id === indicator.id);
          (area.indicators[idx] as any).responseId = created.id;
        }
        return updated;
      });
    }
    return created.id;
  }

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
              onChange={(data: { compliance?: ComplianceAnswer }) => {
                if (!isLocked && indicator.id && updateAssessmentData) {
                  // Update local state for instant UI reaction
                  if (data.compliance) {
                    setLocalCompliance(data.compliance);
                  }
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
                        const current = area.indicators[indicatorIndex];
                        const movCount = current.movFiles?.length || 0;
                        const compliance = data.compliance;
                        const newStatus =
                          compliance === "no"
                            ? "completed"
                            : compliance === "yes" && movCount > 0
                            ? "completed"
                            : "not_started";
                        area.indicators[indicatorIndex] = {
                          ...current,
                          responseData: data,
                          complianceAnswer: compliance,
                          status: newStatus,
                        };
                      }
                    }
                    return updatedData;
                  });

                  // Ensure a real response exists, then save
                  ensureResponseId().then((responseId) =>
                    updateResponse(responseId, { response_data: data })
                  );
                }
              }}
            />

            {/* MOV File Uploader Section (shown only when compliant == yes) */}
            {shouldShowMov && (
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
                    for (const file of files) {
                      try {
                        // 1) Upload file to Supabase Storage
                        const { storagePath } = await uploadMovFile(file, {
                          assessmentId: "1", // TODO: replace with real assessment id from context
                          responseId: indicator.id.toString(),
                        });

                        // 2) Create the MOV record in backend
                        const responseId = await ensureResponseId();
                        await uploadMOV({
                          responseId,
                          data: {
                            filename: file.name,
                            original_filename: file.name,
                            file_size: file.size,
                            content_type: file.type,
                            storage_path: storagePath,
                            response_id: responseId,
                          },
                        });

                        // Update local UI state so area progress reflects upload
                        if (updateAssessmentData) {
                          updateAssessmentData((prev) => {
                            const updated = { ...prev };
                            const area = updated.governanceAreas.find((a) =>
                              a.indicators.some((i) => i.id === indicator.id)
                            );
                            if (area) {
                              const idx = area.indicators.findIndex(
                                (i) => i.id === indicator.id
                              );
                              if (idx !== -1) {
                                const current = area.indicators[idx];
                                const files = [
                                  ...current.movFiles,
                                  {
                                    id: Date.now().toString(),
                                    name: file.name,
                                    size: file.size,
                                    url: storagePath,
                                  },
                                ];
                                area.indicators[idx] = {
                                  ...current,
                                  movFiles: files,
                                  status:
                                    (current.complianceAnswer ||
                                      localCompliance) === "yes"
                                      ? "completed"
                                      : current.status,
                                };
                              }
                            }
                            return updated;
                          });
                        }
                      } catch (error) {
                        console.error("Failed to upload MOV:", error);
                      }
                    }
                  }}
                  onDeleteFile={async (fileId) => {
                    try {
                      await deleteMOV({
                        movId:
                          typeof fileId === "string"
                            ? parseInt(fileId)
                            : fileId,
                      });

                      // Remove from local state and update status if necessary
                      if (updateAssessmentData) {
                        updateAssessmentData((prev) => {
                          const updated = { ...prev };
                          const area = updated.governanceAreas.find((a) =>
                            a.indicators.some((i) => i.id === indicator.id)
                          );
                          if (area) {
                            const idx = area.indicators.findIndex(
                              (i) => i.id === indicator.id
                            );
                            if (idx !== -1) {
                              const current = area.indicators[idx];
                              const files = current.movFiles.filter(
                                (f) => f.id !== fileId
                              );
                              area.indicators[idx] = {
                                ...current,
                                movFiles: files,
                                status:
                                  (current.complianceAnswer ||
                                    localCompliance) === "yes" &&
                                  files.length === 0
                                    ? "not_started"
                                    : current.status,
                              };
                            }
                          }
                          return updated;
                        });
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
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
