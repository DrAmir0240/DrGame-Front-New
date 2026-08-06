"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { StoreGame, GameCategory } from "../../types";

interface FormValues {
  title: string;
  volume: string;
  description: string;
  main_img?: FileList;
}

interface Props {
  open: boolean;
  editing: StoreGame | null;
  categories: GameCategory[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function GameFormDialog({
  open,
  editing,
  categories,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [categoryId, setCategoryId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", volume: "", description: "" },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title ?? "",
        volume: editing.volume != null ? String(editing.volume) : "",
        description: editing.description ?? "",
      });
      setCategoryId(String(editing.category_id ?? ""));
    } else {
      reset({ title: "", volume: "", description: "" });
      setCategoryId("");
    }
  }, [editing, open, reset]);

  const submit = async (values: FormValues) => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("category_id", categoryId);
    if (values.volume) fd.append("volume", values.volume);
    fd.append("description", values.description ?? "");
    if (values.main_img?.[0]) {
      fd.append("main_img", values.main_img[0]);
    }
    await onSubmit(fd);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش بازی" : "بازی جدید"}
      description="اطلاعات بازی فروشگاه را وارد کنید"
      className="max-w-lg"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="game-form"
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : editing ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد"
            )}
          </Button>
        </div>
      }
    >
      <form id="game-form" onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          id="title"
          label="عنوان"
          required
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">دسته‌بندی</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!categoryId && (
            <p className="mt-1 text-xs text-error-500">
              انتخاب دسته‌بندی الزامی است
            </p>
          )}
        </div>

        <Input
          id="volume"
          type="number"
          label="حجم بازی (گیگابایت)"
          placeholder="مثلاً 45"
          {...register("volume")}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">توضیحات</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-secondary-600"
            placeholder="توضیحات بازی..."
            {...register("description")}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">تصویر بازی</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            {...register("main_img", {
              required: !editing ? "تصویر الزامی است" : false,
            })}
          />
          {errors.main_img && (
            <p className="mt-1 text-xs text-error-500">
              {errors.main_img.message}
            </p>
          )}
          {editing?.main_img && (
            <img
              src={editing.main_img}
              alt=""
              className="mt-2 h-24 rounded-lg object-cover"
            />
          )}
        </div>
      </form>
    </Dialog>
  );
}
