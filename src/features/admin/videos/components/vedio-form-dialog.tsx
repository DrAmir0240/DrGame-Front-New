"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { Video } from "../types";

interface FormValues {
  title: string;
  description: string;
  video_url: string;
  is_active: string; // "true" | "false"
  cover_image?: FileList | null;
}

interface Props {
  open: boolean;
  editing: Video | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function VideoFormDialog({
  open,
  editing,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      is_active: "true",
      cover_image: null,
    },
  });

  const coverImage = watch("cover_image");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        title: editing.title ?? "",
        description: editing.description ?? "",
        video_url: editing.video_url ?? "",
        is_active: editing.is_active ? "true" : "false",
        cover_image: null,
      });
    } else {
      reset({
        title: "",
        description: "",
        video_url: "",
        is_active: "true",
        cover_image: null,
      });
    }
  }, [editing, open, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description ?? "");
    formData.append("video_url", values.video_url.trim());
    formData.append("is_active", values.is_active === "true" ? "true" : "false");

    if (values.cover_image?.[0]) {
      formData.append("cover_image", values.cover_image[0]);
    }

    await onSubmit(formData);
  };

  const coverPreview =
    coverImage?.[0] != null
      ? URL.createObjectURL(coverImage[0])
      : editing?.cover_image ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش ویدیو" : "ویدیو جدید"}
      description="اطلاعات ویدیو را وارد کنید"
      className="max-w-lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button type="submit" form="video-form" disabled={loading}>
            {loading
              ? "در حال ذخیره..."
              : editing
                ? "ذخیره تغییرات"
                : "ایجاد ویدیو"}
          </Button>
        </>
      }
    >
      <form
        id="video-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input
            id="title"
            {...register("title", { required: "عنوان الزامی است" })}
            placeholder="عنوان ویدیو"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="video_url">لینک ویدیو</Label>
          <Input
            id="video_url"
            dir="ltr"
            className="text-left"
            {...register("video_url", { required: "لینک ویدیو الزامی است" })}
            placeholder="https://..."
          />
          {errors.video_url && (
            <p className="text-sm text-destructive">
              {errors.video_url.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>وضعیت</Label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">فعال</SelectItem>
                  <SelectItem value="false">غیرفعال</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_image">تصویر کاور</Label>
          <div className="flex items-start gap-4">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="پیش‌نمایش"
                className="h-20 w-20 rounded-lg object-cover"
              />
            )}
            <Input
              id="cover_image"
              type="file"
              accept="image/*"
              className="cursor-pointer"
              {...register("cover_image")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            rows={4}
            {...register("description")}
            placeholder="توضیح کوتاه (اختیاری)"
          />
        </div>
      </form>
    </Dialog>
  );
}