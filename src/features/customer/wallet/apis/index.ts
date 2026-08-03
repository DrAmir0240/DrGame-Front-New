// src/features/wallet/api.ts  یا  src/features/wallet/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
    PaginatedResponse,
  WalletOverview,
  WalletTransaction,
} from "../types"; // یا مسیر تایپ‌های خودت



// ─── Wallet Overview ───

export function useWalletOverview() {
  return useQuery<WalletOverview>({
    queryKey: ["wallet", "overview"],
    queryFn: async () => {
      const { data } = await api.get<WalletOverview>("/customer/wallet/");
      return data;
    },
  });
}

// ─── Wallet Transactions ───

export function useWalletTransactions(filters?: {
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<WalletTransaction>>({
    queryKey: ["wallet", "transactions", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.page) params.page = String(filters.page);
      if (filters?.limit) params.limit = String(filters.limit);

      const { data } = await api.get<PaginatedResponse<WalletTransaction>>(
        "/customer/wallet/transactions/",
        { params }
      );
      return data;
    },
  });
}

// ─── Charge Wallet ───

export function useChargeWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) =>
      api.post("/customer/wallet/charge/", { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("درخواست شارژ با موفقیت ثبت شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در ثبت درخواست شارژ";
      toast.error(msg);
    },
  });
}