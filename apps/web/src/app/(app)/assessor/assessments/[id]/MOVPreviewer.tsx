"use client";

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

  const canPreview = () => {
    const previewableTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv'
    ];
    return previewableTypes.includes(mov.content_type);
  };

  const getPreviewComponent = () => {
    if (mov.content_type.startsWith('image/')) {
      return (
        <img 
          src={mov.storage_path} 
          alt={mov.original_filename}
          className="max-w-full max-h-96 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    } else if (mov.content_type === 'application/pdf') {
      return (
        <iframe 
          src={mov.storage_path}
          className="w-full h-96 border-0"
          title={mov.original_filename}
        />
      );
    } else if (mov.content_type.startsWith('text/')) {
      return (
        <div className="w-full h-96 overflow-auto border rounded p-4 bg-white">
          <pre className="text-sm whitespace-pre-wrap">
            {/* Note: In a real implementation, you'd fetch the text content */}
            Text content preview would be loaded here...
          </pre>
        </div>
      );
    }
    return null;
  };

  if (!canPreview()) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Eye className="h-4 w-4 mr-2" />
        Preview Not Available
      </Button>
    );
  }

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

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{mov.original_filename}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              {getPreviewComponent()}
              <div className="hidden text-center text-gray-500 mt-4">
                Preview not available for this file type
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>File Size:</strong> {(mov.file_size / 1024).toFixed(2)} KB</p>
              <p><strong>Content Type:</strong> {mov.content_type}</p>
              <p><strong>Uploaded:</strong> {new Date(mov.uploaded_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
