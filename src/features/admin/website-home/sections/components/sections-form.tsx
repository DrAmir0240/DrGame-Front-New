"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import { MODEL_CONTENT_OPTIONS } from "../../constants";
import type { Section } from "../../types";
import { cn } from "@/lib/utils";

interface FormValues {
  title: string;
  model_content: "game" | "product" | "blog";
}

interface Props {
  open: boolean;
  editing: Section | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: FormValues) => Promise<void>;
}

export function SectionFormDialog({
  open,
  editing,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", model_content: "game" },
  });

  const modelContent = watch("model_content");

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        model_content: editing.model_content,
      });
    } else {
      reset({ title: "", model_content: "game" });
    }
  }, [editing, open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش سکشن" : "سکشن جدید"}
      className="max-w-md"
      footer={
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button
            type="submit"
            form="section-form"
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                ذخیره...
              </>
            ) : editing ? (
              "ذخیره"
            ) : (
              "ایجاد"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="section-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          id="title"
          label="عنوان سکشن"
          required
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">نوع محتوا</label>
          <div className="grid grid-cols-3 gap-2">
            {MODEL_CONTENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue("model_content", opt.value, { shouldValidate: true })
                }
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-medium transition",
                  modelContent === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-200 text-muted-foreground hover:bg-neutral-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Dialog>
  );
}