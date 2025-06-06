import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsHeader } from "@/components/dashboard/ReportsHeader";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ReportsHeader />
      </div>
    </DashboardLayout>
  );
}
