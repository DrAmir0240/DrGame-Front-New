"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { toast } from "@/components/ui";
import { useCreateCustomer, useUpdateCustomer } from "../apis";
import type { Customer } from "../types";

interface FormValues {
  address: string;
  postal_code: string;
}

interface Props {
  open: boolean;
  editing: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CustomerFormDialog({ open, editing, onClose, onSaved }: Props) {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { address: "", postal_code: "" },
  });

  useEffect(() => {
    if (editing) {
      reset({ address: editing.address ?? "", postal_code: editing.postal_code ?? "" });
      setProfilePic(null);
      setImgPreview(editing.profile_pic);
    } else {
      reset({ address: "", postal_code: "" });
      setProfilePic(null);
      setImgPreview(null);
    }
  }, [editing, open, reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setImgPreview(URL.createObjectURL(file));
    }
  }

  async function onFormSubmit(data: FormValues) {
    const formData = new FormData();
    if (data.address) formData.append("address", data.address);
    if (data.postal_code) formData.append("postal_code", data.postal_code);
    if (profilePic) formData.append("profile_pic", profilePic);

    try {
      if (editing) {
        await updateCustomer.mutateAsync({ id: editing.id, formData });
      } else {
        await createCustomer.mutateAsync(formData);
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.status === 400 ? "اطلاعات را به درستی وارد کنید" : "خطایی رخ داد");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش مشتری" : "مشتری جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="customer-form" disabled={isPending} className="flex-1">
            {isPending ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Textarea
          label="آدرس"
          placeholder="آدرس کامل..."
          {...register("address")}
        />
        <Input
          label="کد پستی"
          placeholder="کد پستی ۱۰ رقمی"
          maxLength={10}
          error={errors.postal_code?.message}
          {...register("postal_code", {
            pattern: { value: /^\d{0,10}$/, message: "کد پستی باید حداکثر ۱۰ رقم باشد" },
          })}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">تصویر پروفایل</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              انتخاب تصویر
            </Button>
            {imgPreview && (
              <img src={imgPreview} alt="preview" className="w-12 h-12 rounded-full object-cover border" />
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
