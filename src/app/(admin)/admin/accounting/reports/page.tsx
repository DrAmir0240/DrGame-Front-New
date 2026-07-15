import { Suspense } from "react";
import { PageHeader } from "@/components/shared";
import FinancialReports from "@/features/admin/accounting/components/FinancialReports";

export default function ReportsPage() {
  return (
    <Suspense>
      <PageHeader title="گزارشات مالی" description="گزارش درآمد، هزینه، سفارشات و نمودارها" />
      <FinancialReports />
    </Suspense>
  );
}
