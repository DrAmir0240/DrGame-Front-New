import type { TaskPriority, TaskStatus } from "./types";

export const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "کم", color: "bg-gray-100 text-gray-600 border-gray-200" },
  normal: { label: "معمولی", color: "bg-blue-100 text-blue-700 border-blue-200" },
  high: { label: "بالا", color: "bg-amber-100 text-amber-700 border-amber-200" },
  urgent: { label: "فوری", color: "bg-red-100 text-red-700 border-red-200" },
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: "انجام‌نشده",
  in_progress: "درحال انجام",
  done: "انجام‌شده",
  cancelled: "لغوشده",
};

export const priorityOptions: { value: string; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "urgent", label: "فوری" },
  { value: "high", label: "بالا" },
  { value: "normal", label: "معمولی" },
  { value: "low", label: "کم" },
];

export const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "todo", label: "انجام‌نشده" },
  { value: "in_progress", label: "درحال انجام" },
  { value: "done", label: "انجام‌شده" },
  { value: "cancelled", label: "لغوشده" },
];

import type { Task } from "./types";

export const mockTasks: Task[] = [
  { id: "1", title: "رفع باگ لاگین", description: "خطای ۴۰۱ در صفحه ورود", priority: "urgent", status: "in_progress", assigned_to_name: "علی رضایی", assigned_to_id: "s1", branch_id: "b1", due_date: "2026-06-28", created_date: "2026-06-25" },
  { id: "2", title: "اضافه کردن فیلتر تاریخ", description: "به بخش سفارش‌ها", priority: "high", status: "todo", assigned_to_name: "محمد احمدی", assigned_to_id: "s2", branch_id: "b2", due_date: "2026-07-01", created_date: "2026-06-26" },
  { id: "3", title: "بروزرسانی کتابخانه‌ها", priority: "normal", status: "done", assigned_to_name: "سارا کریمی", assigned_to_id: "s3", branch_id: "b1", due_date: "2026-06-24", created_date: "2026-06-20" },
  { id: "4", title: "طراحی صفحه جدید تنظیمات", description: "طبق wireframe مصوب", priority: "low", status: "todo", assigned_to_name: "علی رضایی", assigned_to_id: "s1", branch_id: "b1", due_date: "2026-07-05", created_date: "2026-06-26" },
  { id: "5", title: "گزارگیری ماهانه", priority: "high", status: "in_progress", assigned_to_name: "محمد احمدی", assigned_to_id: "s2", branch_id: "b2", due_date: "2026-06-27", created_date: "2026-06-22" },
  { id: "6", title: "رفع مشکل دیتابیس", priority: "urgent", status: "todo", assigned_to_name: "سارا کریمی", assigned_to_id: "s3", due_date: "2026-06-26", created_date: "2026-06-26" },
];

export const mockStaff = [
  { id: "s1", full_name: "علی رضایی" },
  { id: "s2", full_name: "محمد احمدی" },
  { id: "s3", full_name: "سارا کریمی" },
];

export const mockBranches = [
  { id: "b1", name: "شعبه مرکزی" },
  { id: "b2", name: "شعبه غرب" },
];

export const kanbanColumns: { status: TaskStatus; label: string; color: string; bg: string; headerColor: string }[] = [
  { status: "todo", label: "انجام‌نشده", color: "border-t-gray-400", bg: "bg-gray-50 dark:bg-gray-900/30", headerColor: "text-gray-500" },
  { status: "in_progress", label: "درحال انجام", color: "border-t-blue-500", bg: "bg-blue-50/50 dark:bg-blue-950/20", headerColor: "text-blue-500" },
  { status: "done", label: "انجام‌شده", color: "border-t-emerald-500", bg: "bg-emerald-50/50 dark:bg-emerald-950/20", headerColor: "text-emerald-500" },
];
