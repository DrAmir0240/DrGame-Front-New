// src/app/(customer)/wallet/page.tsx
"use client";

import { useState } from "react";
import {
  useWalletOverview,
  useWalletTransactions,
} from "@/features/customer/wallet/apis";
import { WalletBalanceCard } from "./components/balance-card";
import { TransactionsList } from "./components/wallet-transactions";
import { ChargeDialog } from "./components/charge-wallet";
import { PageHeader } from "@/components/shared";

export default function WalletPage() {
  const [chargeOpen, setChargeOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: overview, isLoading: overviewLoading } = useWalletOverview();
  const {
    data: transactionsData,
    isLoading: txLoading,
    isFetching,
  } = useWalletTransactions({ page });

  return (
      <div className="space-y-6">
          <PageHeader
                title="کیف پول"
                description="مدیریت موجودی و مشاهده تراکنش‌ها"
              />

        <WalletBalanceCard
          balance={overview?.balance ?? 0}
          isLoading={overviewLoading}
          onChargeClick={() => setChargeOpen(true)}
        />

        <TransactionsList
          data={transactionsData}
          isLoading={txLoading}
          isFetching={isFetching}
          page={page}
          onPageChange={setPage}
        />

      <ChargeDialog open={chargeOpen} onClose={() => setChargeOpen(false)} />
    </div>
  );
}