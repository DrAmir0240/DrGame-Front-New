"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/shared";
import InvoicesLedger from "@/features/admin/accounting/components/InvoicesLedger";

export default function InvoicesPage() {
  return (
    <Suspense>
      <PageHeader
        title="فاکتور و تراکنش"
        description="فاکتورهای یکپارچه، سفارشات مرتبط و وصول وجه"
      />
      <InvoicesLedger />
    </Suspense>
  );
}
