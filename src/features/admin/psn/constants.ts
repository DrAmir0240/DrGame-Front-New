export const REGION_OPTIONS = [
  { value: "America", label: "آمریکا" },
  { value: "Europe", label: "اتریش" },
  { value: "Asia", label: "آسیا" },
  { value: "Mix", label: "مخلوط" },
] as const;

export const ACCOUNT_STATUS_TYPE = {
  buy: "خرید",
  rent: "اجاره",
} as const;

export const ACCOUNT_CAPACITY_OPTIONS = [
  { value: "1", label: "Offline" },
  { value: "2", label: "Online + Offline" },
  { value: "3", label: "Online" },
] as const;

export const ACCOUNT_CAPACITY_LABELS: Record<string, string> = {
  "1": "Offline",
  "2": "Online + Offline",
  "3": "Online",
};

export const PLATFORM_OPTIONS = [
  { value: "psn", label: "PSN" },
  { value: "xbox", label: "Xbox" },
  { value: "nintendo", label: "Nintendo" },
] as const;

export const STATUS_COLORS = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  blocked: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
};
