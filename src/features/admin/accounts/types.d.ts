export type AccountType = "ps_online" | "ps_offline" | "xbox" | "nintendo";

export interface GameAccount {
  id: string;
  name: string;
  email?: string;
  password_encrypted?: string;
  account_type: AccountType;
  total_capacity?: number;
  sold_count?: number;
  notes?: string;
  is_active?: boolean;
}
