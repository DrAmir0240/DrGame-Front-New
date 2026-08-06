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
import { Dialog } from "@/components/ui"; 
import type { BlogPost, BlogCategory } from "../../types";

interface PostFormValues {
  title: string;
  slug: string;
  body: string;
  category_id: string;
  status: "draft" | "published";
  cover_image?: FileList | null;
}

interface PostFormDialogProps {
  open: boolean;
  editing: BlogPost | null;
  categories: BlogCategory[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function PostFormDialog({
  open,
  editing,
  categories,
  loading = false,
  onClose,
  onSubmit,
}: PostFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      body: "",
      category_id: "",
      status: "draft",
      cover_image: null,
    },
  });

  const titleValue = watch("title");
  const coverImage = watch("cover_image");

  // پر کردن فرم هنگام باز شدن / ویرایش
  useEffect(() => {
    if (!open) return;

    if (editing) {
      reset({
        title: editing.title ?? "",
        slug: editing.slug ?? "",
        body: editing.body ?? "",
        category_id:
          editing.category_id != null ? String(editing.category_id) : "",
        status: editing.status ?? "draft",
        cover_image: null,
      });
    } else {
      reset({
        title: "",
        slug: "",
        body: "",
        category_id: "",
        status: "draft",
        cover_image: null,
      });
    }
  }, [editing, open, reset]);

  // تولید خودکار اسلاگ از عنوان (فقط وقتی در حالت ایجاد هستیم)
  useEffect(() => {
    if (!editing && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, editing, setValue]);

  const onFormSubmit = async (values: PostFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("slug", values.slug.trim());
    formData.append("body", values.body ?? "");
    formData.append("status", values.status);

    if (values.category_id) {
      formData.append("category_id", values.category_id);
    }

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
      title={editing ? "ویرایش پست" : "ایجاد پست جدید"}
      description="اطلاعات پست بلاگ را وارد کنید"
      className="max-w-2xl"
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
          <Button
            type="submit"
            form="blog-post-form"
            disabled={loading}
          >
            {loading
              ? "در حال ذخیره..."
              : editing
                ? "ذخیره تغییرات"
                : "ایجاد پست"}
          </Button>
        </>
      }
    >
      <form
        id="blog-post-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-5"
      >
        {/* عنوان */}
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input
            id="title"
            placeholder="عنوان پست"
            {...register("title", { required: "عنوان الزامی است" })}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* اسلاگ */}
        <div className="space-y-2">
          <Label htmlFor="slug">اسلاگ</Label>
          <Input
            id="slug"
            placeholder="url-friendly-slug"
            dir="ltr"
            className="text-left"
            {...register("slug", { required: "اسلاگ الزامی است" })}
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>

        {/* دسته‌بندی و وضعیت */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
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
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>وضعیت</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">پیش‌نویس</SelectItem>
                    <SelectItem value="published">منتشر شده</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* تصویر کاور */}
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

        {/* محتوا */}
        <div className="space-y-2">
          <Label htmlFor="body">محتوا</Label>
          <Textarea
            id="body"
            placeholder="متن کامل پست..."
            rows={10}
            className="resize-y"
            {...register("body")}
          />
        </div>
      </form>
    </Dialog>
  );
}