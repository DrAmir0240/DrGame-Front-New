import { Suspense } from "react";
import { PageHeader } from "@/components/shared";
import DailyLedger from "@/features/admin/accounting/components/DailyLedger";

export default function DailyPage() {
  return (
    <Suspense>
      <PageHeader title="دفتر روزانه" description="فاکتورها، تراکنش‌ها و طرف‌های حساب امروز" />
      <DailyLedger />
    </Suspense>
  );
}
