import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TechnicalNotesPanelProps {
  technicalNotes: string;
  indicatorName: string;
}

export function TechnicalNotesPanel({ technicalNotes, indicatorName }: TechnicalNotesPanelProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <FileText className="h-5 w-5" />
          Technical Notes for {indicatorName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-white p-4 border border-blue-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {technicalNotes || "No technical notes available for this indicator."}
          </p>
        </div>
        <p className="mt-2 text-xs text-blue-700">
          These notes provide guidance for assessors on how to evaluate this indicator.
        </p>
      </CardContent>
    </Card>
  );
}
