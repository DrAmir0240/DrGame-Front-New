import type { AccountType, GameAccount } from "./types";

export const MOCK_ACCOUNTS: GameAccount[] = [
  { id: "1", name: "PSN Premium A1", email: "test1@mail.com", account_type: "ps_online", total_capacity: 10, sold_count: 3, is_active: true },
  { id: "2", name: "Xbox Game Pass", email: "xbox@mail.com", account_type: "xbox", total_capacity: 5, sold_count: 2, is_active: true },
  { id: "3", name: "Nintendo Family", account_type: "nintendo", total_capacity: 8, sold_count: 5, is_active: false },
];

export const typeLabels: Record<AccountType, string> = {
  ps_online: "PS آنلاین",
  ps_offline: "PS آفلاین",
  xbox: "Xbox",
  nintendo: "Nintendo",
};

export const typeColors: Record<AccountType, string> = {
  ps_online: "bg-blue-100 text-blue-700 border-blue-200",
  ps_offline: "bg-indigo-100 text-indigo-700 border-indigo-200",
  xbox: "bg-emerald-100 text-emerald-700 border-emerald-200",
  nintendo: "bg-red-100 text-red-700 border-red-200",
};
