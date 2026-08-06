"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { AboutUs } from "../types";

interface FormValues {
  title: string;
  phone_number: string;
  email: string;
  address: string;
  e_namaad_url: string;
  is_active: boolean;
  logo?: FileList;
  e_namaad?: FileList;
}

interface Props {
  open: boolean;
  editing: AboutUs | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AboutUsFormDialog({
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
      phone_number: "",
      email: "",
      address: "",
      e_namaad_url: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        phone_number: editing.phone_number,
        email: editing.email,
        address: editing.address,
        e_namaad_url: editing.e_namaad_url ?? "",
        is_active: editing.is_active,
      });
    } else {
      reset({
        title: "",
        phone_number: "",
        email: "",
        address: "",
        e_namaad_url: "",
        is_active: true,
      });
    }
  }, [editing, open, reset]);

  const submit = async (values: FormValues) => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("phone_number", values.phone_number);
    fd.append("email", values.email);
    fd.append("address", values.address);
    fd.append("e_namaad_url", values.e_namaad_url);
    fd.append("is_active", String(values.is_active));

    if (values.logo?.[0]) {
      fd.append("logo", values.logo[0]);
    }
    if (values.e_namaad?.[0]) {
      fd.append("e_namaad", values.e_namaad[0]);
    }

    await onSubmit(fd);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش درباره ما" : "ایجاد درباره ما"}
      description="اطلاعات بخش درباره ما را وارد کنید"
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
            form="about-us-form"
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
      <form
        id="about-us-form"
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
          id="phone_number"
          label="شماره تماس"
          placeholder="021-12345678"
          error={errors.phone_number?.message}
          {...register("phone_number")}
        />

        <Input
          id="email"
          type="email"
          label="ایمیل"
          placeholder="info@drgame.ir"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">آدرس</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-secondary-600"
            placeholder="تهران، ..."
            {...register("address")}
          />
        </div>

        <Input
          id="e_namaad_url"
          label="لینک اینماد"
          placeholder="https://..."
          {...register("e_namaad_url")}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">لوگو</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            {...register("logo")}
          />
          {editing?.logo && (
            <img
              src={editing.logo}
              alt="logo"
              className="mt-2 h-16 rounded-lg object-contain"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">تصویر اینماد</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            {...register("e_namaad")}
          />
          {editing?.e_namaad && (
            <img
              src={editing.e_namaad}
              alt="enamad"
              className="mt-2 h-16 rounded-lg object-contain"
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} />
          فعال
        </label>
      </form>
    </Dialog>
  );
}