"use client";

import { FilePreviewerModal } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

interface MOVPreviewerProps {
  mov: {
    id: number;
    filename: string;
    original_filename: string;
    file_size: number;
    content_type: string;
    storage_path: string;
    status: string;
    uploaded_at: string;
  };
}

export function MOVPreviewer({ mov }: MOVPreviewerProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Extract file type from content_type for better compatibility
  const getFileType = () => {
    if (mov.content_type.startsWith('image/')) {
      return mov.content_type.split('/')[1]; // e.g., 'jpeg', 'png'
    } else if (mov.content_type === 'application/pdf') {
      return 'pdf';
    } else if (mov.content_type.startsWith('video/')) {
      return mov.content_type.split('/')[1]; // e.g., 'mp4', 'webm'
    } else if (mov.content_type.startsWith('text/')) {
      return 'txt';
    } else {
      // Extract extension from filename as fallback
      const extension = mov.original_filename.split('.').pop()?.toLowerCase();
      return extension || 'unknown';
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsPreviewOpen(true)}
      >
        <Eye className="h-4 w-4 mr-2" />
        Preview
      </Button>

      <FilePreviewerModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={mov.storage_path}
        fileName={mov.original_filename}
        fileType={getFileType()}
      />
    </>
  );
}
