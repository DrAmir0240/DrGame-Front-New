"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";

interface FormValues {
  item_id: number;
  is_active: boolean;
}

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: FormValues) => Promise<void>;
}

export function SectionItemFormDialog({
  open,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { item_id: undefined, is_active: true },
  });

  const submit = async (values: FormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="افزودن آیتم به سکشن"
      className="max-w-sm"
      footer={
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button
            type="submit"
            form="section-item-form"
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                ...
              </>
            ) : (
              "افزودن"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="section-item-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-4"
      >
        <Input
          id="item_id"
          type="number"
          label="شناسه آیتم (ID)"
          required
          error={errors.item_id?.message}
          {...register("item_id", {
            required: "شناسه الزامی است",
            valueAsNumber: true,
            min: 1,
          })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} />
          فعال
        </label>
      </form>
    </Dialog>
  );
}