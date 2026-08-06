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
import type { PsnAccount, AccountStatus } from "../../types";

interface FormValues {
  username: string;
  password: string;
  status: string;
  region: string;
  plus: string;
  price: string;
  bank_account_status: string;
  two_step: string;
  note?: string;
}

interface Props {
  open: boolean;
  editing: PsnAccount | null;
  statuses: AccountStatus[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}

const REGIONS = [
  { value: "America", label: "America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Mix", label: "Mix" },
];

export function AccountFormDialog({
  open,
  editing,
  statuses,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      status: "",
      region: "Europe",
      plus: "false",
      price: "",
      bank_account_status: "false",
      two_step: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        username: editing.username ?? "",
        password: "", // معمولاً خالی می‌گذاریم مگر بک‌اند برگرداند
        status: editing.status_id != null ? String(editing.status_id) : "",
        region: editing.region ?? "Europe",
        plus: editing.plus ? "true" : "false",
        price: editing.price != null ? String(editing.price) : "",
        bank_account_status: editing.bank_account_status ? "true" : "false",
        two_step: editing.two_step != null ? String(editing.two_step) : "",
      });
    } else {
      reset({
        username: "",
        password: "",
        status: "",
        region: "Europe",
        plus: "false",
        price: "",
        bank_account_status: "false",
        two_step: "",
      });
    }
  }, [editing, open, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    const payload: Record<string, unknown> = {
      username: values.username.trim(),
      region: values.region,
      plus: values.plus === "true",
      bank_account_status: values.bank_account_status === "true",
    };

    if (values.password.trim()) {
      payload.password = values.password.trim();
    }
    if (values.status) {
      payload.status = Number(values.status);
    }
    if (values.price) {
      payload.price = Number(values.price);
    }
    if (values.two_step) {
      payload.two_step = Number(values.two_step);
    }

    await onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش اکانت" : "اکانت جدید"}
      description="اطلاعات سونی اکانت را وارد کنید"
      className="max-w-lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button type="submit" form="psn-account-form" disabled={loading}>
            {loading
              ? "در حال ذخیره..."
              : editing
                ? "ذخیره تغییرات"
                : "ایجاد اکانت"}
          </Button>
        </>
      }
    >
      <form
        id="psn-account-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="username">یوزرنیم</Label>
          <Input
            id="username"
            dir="ltr"
            className="text-left"
            {...register("username", { required: "یوزرنیم الزامی است" })}
            placeholder="acc_ps5_001"
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            پسورد {editing && <span className="text-muted-foreground">(خالی = بدون تغییر)</span>}
          </Label>
          <Input
            id="password"
            type="password"
            dir="ltr"
            className="text-left"
            {...register("password", {
              required: editing ? false : "پسورد الزامی است",
            })}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>وضعیت</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>ریجن</Label>
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>PS Plus</Label>
            <Controller
              name="plus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">دارد</SelectItem>
                    <SelectItem value="false">ندارد</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>وضعیت بانکی</Label>
            <Controller
              name="bank_account_status"
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">قیمت (تومان)</Label>
            <Input
              id="price"
              type="number"
              dir="ltr"
              className="text-left"
              {...register("price")}
              placeholder="3500000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="two_step">کد دو مرحله‌ای</Label>
            <Input
              id="two_step"
              dir="ltr"
              className="text-left"
              {...register("two_step")}
              placeholder="123456"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}