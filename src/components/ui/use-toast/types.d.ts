import type * as React from "react";

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};
export type ToastState = {
  toasts: ToasterToast[];
};
export type ToastFn = Omit<ToasterToast, "id">;
