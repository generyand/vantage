"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssessorQueue } from "@/hooks/useAssessor";
import Link from "next/link";
import * as React from "react";

type QueueItem = {
  assessment_id: number;
  barangay_name: string;
  submission_date: string | null;
  status: string;
  updated_at: string;
};

interface SubmissionsQueueProps {
  items?: QueueItem[];
}

const STATUS_TABS = [
  { key: "Submitted for Review", label: "Submitted for Review" },
  { key: "Needs Rework", label: "Needs Rework" },
  { key: "Validated", label: "Validated" },
];

export function SubmissionsQueue({ items = [] }: SubmissionsQueueProps) {
  const { data } = useAssessorQueue();
  const serverItems = (data as QueueItem[]) ?? items;
  const [active, setActive] = React.useState<string>(STATUS_TABS[0].key);

  const filtered = React.useMemo(
    () => serverItems.filter((i) => i.status === active),
    [serverItems, active]
  );

  return (
    <Tabs value={active} onValueChange={setActive} className="w-full">
      <TabsList>
        {STATUS_TABS.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {STATUS_TABS.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barangay</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tab.key === active ? filtered : []).map((row) => (
                <TableRow key={row.assessment_id}>
                  <TableCell>{row.barangay_name}</TableCell>
                  <TableCell>
                    {row.submission_date
                      ? new Date(row.submission_date).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm">
                      <Link href={`/assessor/submissions/${row.assessment_id}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      ))}
    </Tabs>
  );
}


