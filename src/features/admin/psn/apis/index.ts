import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { PaginatedResponse } from "@/features/admin/website-home/types";
import type {
  PsnAccount,
  AccountStatus,
  AccountCategory,
  AccountGame,
  GamePickerItem,
} from "./types";

const LIMIT = 10;

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      params[key] = String(value);
    }
  }
  return params;
}

// ------------------------- Accounts -------------------------

export function usePsnAccounts(filters?: {
  limit?: number;
  offset?: number;
  search?: string;
  status?: number | string;
  region?: string;
  plus?: string | boolean;
  bank_account_status?: string | boolean;
  employee?: number | string;
  is_deleted?: string | boolean;
}) {
  return useQuery<PaginatedResponse<PsnAccount>>({
    queryKey: ["admin", "psn", "accounts", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PsnAccount>>(
        "/psn/accounts/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function usePsnAccount(id: number | null) {
  return useQuery<PsnAccount>({
    queryKey: ["admin", "psn", "accounts", id],
    queryFn: async () => {
      const { data } = await api.get<PsnAccount>(`/psn/accounts/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePsnAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/psn/accounts/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "accounts"] });
      toast.success("اکانت با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد اکانت"),
  });
}

export function useUpdatePsnAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => api.patch(`/psn/accounts/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "accounts"] });
      toast.success("اکانت با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی اکانت"),
  });
}

export function useDeletePsnAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/psn/accounts/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "accounts"] });
      toast.success("حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

// ------------------------- Account Games -------------------------

export function useAccountGames(accountId: number | null) {
  return useQuery<AccountGame[]>({
    queryKey: ["admin", "psn", "accounts", accountId, "games"],
    queryFn: async () => {
      const { data } = await api.get<AccountGame[] | PaginatedResponse<AccountGame>>(
        `/psn/accounts/${accountId}/games/`
      );
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!accountId,
  });
}

export function useAddGamesToAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      game_ids,
    }: {
      accountId: number;
      game_ids: number[];
    }) => api.post(`/psn/accounts/${accountId}/games/`, { game_ids }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["admin", "psn", "accounts", vars.accountId, "games"],
      });
      toast.success("بازی‌ها اضافه شدند");
    },
    onError: () => toast.error("خطا در افزودن بازی"),
  });
}

export function useRemoveGameFromAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      id,
    }: {
      accountId: number;
      id: number;
    }) => api.delete(`/psn/accounts/${accountId}/games/${id}/`),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["admin", "psn", "accounts", vars.accountId, "games"],
      });
      toast.success("بازی از اکانت حذف شد");
    },
    onError: () => toast.error("خطا در حذف بازی"),
  });
}

// ------------------------- Game Picker -------------------------

export function useGamePicker(search?: string) {
  return useQuery<GamePickerItem[]>({
    queryKey: ["admin", "psn", "games-picker", search],
    queryFn: async () => {
      const { data } = await api.get<GamePickerItem[] | PaginatedResponse<GamePickerItem>>(
        "/psn/games/",
        { params: buildParams({ search }) }
      );
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}

// ------------------------- Statuses -------------------------

export function useAccountStatuses() {
  return useQuery<AccountStatus[]>({
    queryKey: ["admin", "psn", "account-statuses"],
    queryFn: async () => {
      const { data } = await api.get<AccountStatus[] | PaginatedResponse<AccountStatus>>(
        "/psn/account-statuses/"
      );
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}

export function useCreateAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string }) =>
      api.post("/psn/account-statuses/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "account-statuses"] });
      toast.success("وضعیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد وضعیت"),
  });
}

export function useUpdateAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string } }) =>
      api.patch(`/psn/account-statuses/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "account-statuses"] });
      toast.success("وضعیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی وضعیت"),
  });
}

export function useDeleteAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/psn/account-statuses/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "psn", "account-statuses"] });
      toast.success("حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

// ------------------------- Categories (read-only list) -------------------------

export function useAccountCategories() {
  return useQuery<AccountCategory[]>({
    queryKey: ["admin", "psn", "account-categories"],
    queryFn: async () => {
      const { data } = await api.get<AccountCategory[] | PaginatedResponse<AccountCategory>>(
        "/psn/account-categories/"
      );
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}

export { LIMIT };