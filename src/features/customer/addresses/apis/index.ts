import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import type { Address, AddressFormData, PaginatedAddresses } from "../types";

const LIMIT = 10;

export const ADDRESS_LIMIT = LIMIT;

function addressBase(customerId?: number | null): string {
  return customerId ? `/crm/customers/${customerId}/addresses/` : "/customer/addresses/";
}

function scopeKey(customerId?: number | null): string | number {
  return customerId ?? "me";
}

export function useAddressList(options: { customerId?: number | null; page?: number }) {
  const { customerId, page = 0 } = options;
  return useQuery<PaginatedAddresses>({
    queryKey: ["addresses", scopeKey(customerId), page],
    queryFn: async () => {
      const { data } = await api.get<PaginatedAddresses>(addressBase(customerId), {
        params: { limit: LIMIT, offset: page * LIMIT },
      });
      return data;
    },
    enabled: customerId === undefined ? true : !!customerId,
  });
}

export function useCreateAddress(customerId?: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddressFormData) => {
      const { data } = await api.post<Address>(addressBase(customerId), payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses", scopeKey(customerId)] });
      toast.success("آدرس با موفقیت افزوده شد");
    },
    onError: (err) => toastApiError(err, "خطا در افزودن آدرس"),
  });
}

export function useUpdateAddress(customerId?: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<AddressFormData> & { id: number }) => {
      const { data } = await api.patch<Address>(`${addressBase(customerId)}${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses", scopeKey(customerId)] });
      toast.success("آدرس با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در ویرایش آدرس"),
  });
}

export function useSetDefaultAddress(customerId?: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<Address>(`${addressBase(customerId)}${id}/`, {
        is_default: true,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses", scopeKey(customerId)] });
      toast.success("آدرس پیش‌فرض تغییر کرد");
    },
    onError: (err) => toastApiError(err, "خطا در تغییر آدرس پیش‌فرض"),
  });
}

export function useDeleteAddress(customerId?: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${addressBase(customerId)}${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses", scopeKey(customerId)] });
      toast.success("آدرس حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف آدرس"),
  });
}
