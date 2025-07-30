"use client";

import { useState, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Indicator, ComplianceAnswer } from "@/types/assessment";
import { useUpdateIndicatorAnswer, useUploadMOV, useDeleteMOV } from "@/hooks/useAssessment";
import { AlertTriangle, Upload, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorFormProps {
  indicator: Indicator;
  isLocked: boolean;
}

export function IndicatorForm({ indicator, isLocked }: IndicatorFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateAnswerMutation = useUpdateIndicatorAnswer();
  const uploadMOVMutation = useUploadMOV();
  const deleteMOVMutation = useDeleteMOV();

  const handleAnswerChange = (answer: ComplianceAnswer) => {
    if (isLocked) return;
    updateAnswerMutation.mutate({ indicatorId: indicator.id, answer });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0 || isLocked) return;

    Array.from(files).forEach(file => {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF, DOC, DOCX, JPG, or PNG files.');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      uploadMOVMutation.mutate({ indicatorId: indicator.id, file });
    });
  };

  const handleDeleteFile = (fileId: string) => {
    if (isLocked) return;
    deleteMOVMutation.mutate({ indicatorId: indicator.id, fileId });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Indicator Description */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Indicator Description</h3>
        <p className="text-gray-700">{indicator.description}</p>
      </div>

      {/* Technical Notes */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Technical Notes</h3>
        <p className="text-gray-700 text-sm">{indicator.technicalNotes}</p>
      </div>

      {/* Assessor's Remarks (Conditional) */}
      {indicator.assessorComment && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Assessor&apos;s Comment for Rework
                </h3>
                <p className="text-orange-800">{indicator.assessorComment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Input */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Compliance Assessment</h3>
        <RadioGroup
          value={indicator.complianceAnswer || ""}
          onValueChange={handleAnswerChange}
          disabled={isLocked}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${indicator.id}-yes`} />
            <Label htmlFor={`${indicator.id}-yes`} className="text-sm font-medium">
              Yes - We comply with this requirement
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${indicator.id}-no`} />
            <Label htmlFor={`${indicator.id}-no`} className="text-sm font-medium">
              No - We do not comply with this requirement
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="na" id={`${indicator.id}-na`} />
            <Label htmlFor={`${indicator.id}-na`} className="text-sm font-medium">
              N/A - This requirement is not applicable to our barangay
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* MOV Uploader (Conditional) */}
      {indicator.complianceAnswer === 'yes' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Means of Verification (MOV)</h3>
          <p className="text-sm text-gray-600">
            Please upload supporting documents to verify your compliance. 
            Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
          </p>

          {/* File Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-gray-400",
              isLocked && "opacity-50 cursor-not-allowed"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={isLocked}
            />
            
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLocked}
                className="text-primary hover:text-primary/80 underline disabled:opacity-50"
              >
                click to browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>

          {/* Upload Progress */}
          {uploadMOVMutation.isPending && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading file...</span>
            </div>
          )}

          {/* Uploaded Files List */}
          {indicator.movFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Uploaded Files</h4>
              <div className="space-y-2">
                {indicator.movFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                        disabled={isLocked}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        disabled={isLocked || deleteMOVMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {updateAnswerMutation.isPending && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Saving changes...</span>
        </div>
      )}

      {deleteMOVMutation.isPending && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Deleting file...</span>
        </div>
      )}
    </div>
  );
}