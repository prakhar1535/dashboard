import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsHeader } from "@/components/dashboard/ReportsHeader";
import { Suspense } from "react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Suspense fallback={<div className="p-4">Loading reports...</div>}>
          <ReportsHeader />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
