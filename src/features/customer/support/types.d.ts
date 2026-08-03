export type TicketCategory = "order" | "payment" | "account" | "general";
export type TicketStatus = "open" | "in_progress" | "waiting" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type MessageSender = "customer" | "employee" | "system";

export interface TicketMessage {
  id: number;
  sender: MessageSender;
  body: string;
  attachment?: string | null;
  is_internal: boolean;
  created_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  closed_at: string | null;
  created_at: string;
  updated_at?: string;
  messages?: TicketMessage[];
  order_id?: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateTicketPayload {
  title: string;
  category: TicketCategory;
  body: string;
  priority?: TicketPriority;
  order_id?: number;
}

export interface ReplyTicketPayload {
  body: string;
}