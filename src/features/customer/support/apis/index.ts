import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  Ticket,
  TicketMessage,
  PaginatedResponse,
  CreateTicketPayload,
  ReplyTicketPayload,
  TicketStatus,
} from "../types";

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      params[key] = String(value);
    }
  }
  return params;
}

// ─── List ───

export function useTickets(filters?: {
  status?: TicketStatus | "all";
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<Ticket>>({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Ticket>>(
        "/customer/tickets/",
        { params }
      );
      return data;
    },
  });
}

// ─── Detail ───

export function useTicketDetail(id: number | null) {
  return useQuery<Ticket>({
    queryKey: ["tickets", id],
    queryFn: async () => {
      const { data } = await api.get<Ticket>(`/customer/tickets/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Messages ───

export function useTicketMessages(id: number | null) {
  return useQuery<TicketMessage[]>({
    queryKey: ["tickets", id, "messages"],
    queryFn: async () => {
      const { data } = await api.get<TicketMessage[]>(
        `/customer/tickets/${id}/messages/`
      );
      return data;
    },
    enabled: !!id,
  });
}

// ─── Create ───

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) =>
      api.post("/customer/tickets/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("تیکت با موفقیت ایجاد شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در ایجاد تیکت";
      toast.error(msg);
    },
  });
}

// ─── Reply ───

export function useReplyTicket(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReplyTicketPayload) =>
      api.post(`/customer/tickets/${ticketId}/reply/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", ticketId] });
      queryClient.invalidateQueries({
        queryKey: ["tickets", ticketId, "messages"],
      });
      toast.success("پاسخ شما ارسال شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در ارسال پاسخ";
      toast.error(msg);
    },
  });
}