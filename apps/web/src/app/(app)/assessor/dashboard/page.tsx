import { SubmissionsQueue } from "@/components/features";
import { PageHeader } from "@/components/shared";

export default async function AssessorDashboardPage() {
  // Server component shell; data fetching happens via client hook in future task
  return (
    <div className="space-y-6">
      <PageHeader title="Assessor Dashboard" description="Review BLGU submissions." />
      <SubmissionsQueue items={[]} />
    </div>
  );
}


