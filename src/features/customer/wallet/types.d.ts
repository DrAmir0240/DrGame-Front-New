export type WalletTransactionType =
  | "charge_admin"
  | "charge_gateway"
  | "debit_order"
  | "refund";

export type WalletTransactionStatus = "pending" | "success" | "failed";

export interface WalletTransaction {
  id: number;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  amount: number;
  balance_before: number;
  balance_after: number;
  gateway?: string | null;
  created_at: string;
}

export interface WalletOverview {
  balance: number;
  recent_transactions: WalletTransaction[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}