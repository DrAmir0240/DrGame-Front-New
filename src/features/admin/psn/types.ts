export type AccountRegion = "America" | "Europe" | "Asia" | "Mix";

export interface PsnAccount {
  id: number;
  username: string;
  password?: string;
  employee_id: number | null;
  employee_name?: string | null;
  status_id: number | null;
  status_title?: string | null;
  region: AccountRegion | string | null;
  plus: boolean;
  price: number | null;
  bank_account_status?: boolean;
  bank_account_id?: number | null;
  two_step?: number | null;
  two_step_enabled?: boolean;
  sell_method?: number[];
  is_deleted?: boolean;
}

export interface AccountStatus {
  id: number;
  title: string;
}

export interface AccountCategory {
  id: number;
  title: string;
  type: "buy" | "rent";
  rent_time_days?: number | null;
  account_capacity: "1" | "2" | "3" | string;
  base_price: number;
}

export interface AccountGame {
  id: number;
  game_id: number;
  game_title: string;
  game_main_img?: string | null;
  is_deleted?: boolean;
}

export interface GamePickerItem {
  id: number;
  title: string;
  main_img?: string | null;
}