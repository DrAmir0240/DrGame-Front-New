"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { Banner } from "../../types";

interface FormValues {
  title: string;
  order: number;
  is_chosen: boolean;
  image?: FileList;
}

interface Props {
  open: boolean;
  editing: Banner | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function BannerFormDialog({
  open,
  editing,
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
    defaultValues: {
      title: "",
      order: 1,
      is_chosen: true,
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        order: editing.order,
        is_chosen: editing.is_chosen,
      });
    } else {
      reset({ title: "", order: 1, is_chosen: true });
    }
  }, [editing, open, reset]);

  const submit = async (values: FormValues) => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("order", String(values.order));
    fd.append("is_chosen", String(values.is_chosen));
    if (values.image?.[0]) {
      fd.append("image", values.image[0]);
    }
    await onSubmit(fd);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش بنر" : "بنر جدید"}
      description="اطلاعات بنر صفحه اصلی را وارد کنید"
      className="max-w-md"
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
            form="banner-form"
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
              "ایجاد بنر"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="banner-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-4"
      >
        <Input
          id="title"
          label="عنوان"
          required
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />

        <Input
          id="order"
          type="number"
          label="ترتیب نمایش"
          required
          {...register("order", {
            required: true,
            valueAsNumber: true,
            min: 0,
          })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">تصویر بنر</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            {...register("image", {
              required: !editing ? "تصویر الزامی است" : false,
            })}
          />
          {errors.image && (
            <p className="mt-1 text-xs text-error-500">
              {errors.image.message}
            </p>
          )}
          {editing?.image && (
            <img
              src={editing.image}
              alt=""
              className="mt-2 h-20 rounded-lg object-cover"
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_chosen")} />
          نمایش در صفحه اصلی (فعال)
        </label>
      </form>
    </Dialog>
  );
}