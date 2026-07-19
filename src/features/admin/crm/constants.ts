export const LIMIT = 10;

export const crmTabs = [
  { value: "files", label: "پرونده مشتریان" },
  { value: "sms", label: "ارسال پیامک" },
];

export const customerTypeTabs = [
  { value: "normal", label: "مشتریان عادی" },
  { value: "b2b", label: "مشتریان تجاری" },
];

export const DIRECTION_MAP: Record<
  string,
  { label: string; color: string; className: string }
> = {
  in: {
    label: "دریافت",
    color: "green",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  out: {
    label: "پرداخت",
    color: "red",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function getCustomerType(hasB2b: boolean) {
  return hasB2b
    ? { label: "تجاری", color: "purple", className: "bg-purple-100 text-purple-700 border-purple-200" }
    : { label: "عادی", color: "blue", className: "bg-blue-100 text-blue-700 border-blue-200" };
}
