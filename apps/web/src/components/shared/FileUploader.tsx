"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { uploadWithProgress } from "../../lib/api";

interface UploadedFile {
  id: string | number;
  name: string;
  size: number;
  url: string;
}

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: string) => void;
  onDeleteFile?: (fileId: string | number) => void;
  uploadUrl: string;
  disabled?: boolean;
  existingFiles?: UploadedFile[];
  isLoading?: boolean;
}

export default function FileUploader({
  accept = ".mov,.mp4,.avi",
  multiple = false,
  maxSize = 100, // 100MB default
  onUploadComplete,
  onUploadError,
  onDeleteFile,
  uploadUrl,
  disabled = false,
  existingFiles = [],
  isLoading = false,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    if (
      accept &&
      !accept
        .split(",")
        .some((type) => file.name.toLowerCase().endsWith(type.trim()))
    ) {
      return `File type not supported. Accepted types: ${accept}`;
    }

    return null;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      onUploadError?.(errors.join(", "));
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload files one by one (could be modified to upload in parallel)
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const uploadResult = await uploadWithProgress(uploadUrl, file, {
          onProgress: (progress) => {
            const totalProgress =
              (i * 100 + progress.percentage) / validFiles.length;
            setUploadProgress(Math.round(totalProgress));
          },
        });

        // Call onUploadComplete with the file info
        onUploadComplete?.([file]);

        // Add to uploaded files list
        setUploadedFiles((prev) => [...prev, file]);

        // Add to existing files list with the URL
        if (uploadResult.url) {
          const newFile: UploadedFile = {
            id: Date.now(), // Temporary ID for demo
            name: uploadResult.name,
            size: uploadResult.size,
            url: uploadResult.url,
          };
          existingFiles.push(newFile);
        }
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : disabled || isUploading
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        } ${
          !disabled && !isUploading ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div>
              <p className="text-sm text-gray-600">Uploading files...</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {uploadProgress}% complete
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept} files up to {maxSize}MB{" "}
                {multiple ? "(multiple files allowed)" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Show existing files */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Existing Files:
          </h4>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    {file.name}
                  </a>
                  <span className="text-gray-400">
                    ({(file.size / 1024 / 1024).toFixed(1)}MB)
                  </span>
                </div>
                {!disabled && !isLoading && onDeleteFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show newly uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Newly Uploaded Files:
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded"
              >
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
