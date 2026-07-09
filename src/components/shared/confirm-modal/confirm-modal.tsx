"use client";

import { Button, Dialog } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title = "تایید حذف",
  message = "آیا از حذف این مورد اطمینان دارید؟",
  confirmLabel = "حذف",
  cancelLabel = "انصراف",
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title=""
      className="max-w-sm"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1">
            {cancelLabel}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? "در حال حذف..." : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="w-12 h-12 rounded-full bg-error-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-error-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
    </Dialog>
  );
}
