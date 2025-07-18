'use client';

import { useState, useRef } from 'react';
import { uploadWithProgress, type UploadProgress } from '@/lib/api';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: string) => void;
  uploadUrl: string;
  disabled?: boolean;
}

export default function FileUploader({
  accept = '.mov,.mp4,.avi',
  multiple = false,
  maxSize = 100, // 100MB default
  onUploadComplete,
  onUploadError,
  uploadUrl,
  disabled = false,
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
    
    if (accept && !accept.split(',').some(type => file.name.toLowerCase().endsWith(type.trim()))) {
      return `File type not supported. Accepted types: ${accept}`;
    }
    
    return null;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      onUploadError?.(errors.join(', '));
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload files one by one (could be modified to upload in parallel)
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        await uploadWithProgress(
          uploadUrl,
          file,
          {
            onProgress: (progress: UploadProgress) => {
              const totalProgress = ((i * 100) + progress.percentage) / validFiles.length;
              setUploadProgress(Math.round(totalProgress));
            }
          }
        );
      }

      setUploadedFiles(validFiles);
      onUploadComplete?.(validFiles);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
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
      <input
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
            ? 'border-blue-400 bg-blue-50'
            : disabled || isUploading
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${
          !disabled && !isUploading ? 'cursor-pointer' : 'cursor-not-allowed'
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
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
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
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept} files up to {maxSize}MB {multiple ? '(multiple files allowed)' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <div className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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