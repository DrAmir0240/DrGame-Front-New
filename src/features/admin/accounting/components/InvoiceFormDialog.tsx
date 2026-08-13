"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { toast } from "@/components/ui";
import {
  useCreateInvoice,
  useInvoiceCategories,
  useAccountSidesList,
} from "../apis";
import type { CreateInvoiceFormData, OrderItemType } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ORDER_TYPE_LABELS: Record<OrderItemType, string> = {
  sony_account: "اکانت سونی",
  repair: "تعمیر",
  product: "محصول",
};

export default function InvoiceFormDialog({ open, onClose }: Props) {
  const { data: customers = [] } = useAccountSidesList({ type: "customer" });
  const { data: categories = [] } = useInvoiceCategories();
  const createInvoice = useCreateInvoice();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } =
    useForm<CreateInvoiceFormData>({
      defaultValues: {
        customer_id: 0,
        category_id: 0,
        discount: 0,
        description: "",
        items: [
          {
            order_type: "sony_account",
            title: "",
            quantity: 1,
            unit_price: 0,
            discount: 0,
            order_data: { category_id: 0, source: "in_person", account_ids: [] },
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  useEffect(() => {
    if (open) {
      reset({
        customer_id: 0,
        category_id: 0,
        discount: 0,
        description: "",
        items: [
          {
            order_type: "sony_account",
            title: "",
            quantity: 1,
            unit_price: 0,
            discount: 0,
            order_data: { category_id: 0, source: "in_person", account_ids: [] },
          },
        ],
      });
    }
  }, [open, reset]);

  const isPending = createInvoice.isPending;

  async function onFormSubmit(data: CreateInvoiceFormData) {
    try {
      await createInvoice.mutateAsync(data);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      toast.error(
        e?.response?.status === 400
          ? "اطلاعات را به درستی وارد کنید"
          : "خطا در ایجاد فاکتور"
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="فاکتور یکپارچه جدید"
      description="ساخت فاکتور همراه با سفارشات (اکانت سونی، تعمیر، محصول)"
      className="max-w-3xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <Button type="submit" form="invoice-form" disabled={isPending}>
            {isPending ? "در حال ایجاد..." : "ایجاد فاکتور"}
          </Button>
        </>
      }
    >
      <form
        id="invoice-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              مشتری <span className="text-red-500">*</span>
            </label>
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: "مشتری الزامی است", validate: (v) => v > 0 || "مشتری الزامی است" }}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب مشتری" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.customer_id && (
              <p className="text-xs text-red-500">{errors.customer_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              دسته فاکتور <span className="text-red-500">*</span>
            </label>
            <Controller
              name="category_id"
              control={control}
              rules={{ required: "دسته فاکتور الزامی است", validate: (v) => v > 0 || "دسته فاکتور الزامی است" }}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.title} ({c.direction === "in" ? "ورودی" : "خروجی"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category_id && (
              <p className="text-xs text-red-500">{errors.category_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="تخفیف کل (تومان)"
            type="number"
            {...register("discount", { valueAsNumber: true })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">توضیحات</label>
            <Textarea {...register("description")} placeholder="توضیحات فاکتور..." />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-800">آیتم‌ها</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  order_type: "sony_account",
                  title: "",
                  quantity: 1,
                  unit_price: 0,
                  discount: 0,
                  order_data: { category_id: 0, source: "in_person", account_ids: [] },
                })
              }
            >
              <Plus className="w-4 h-4 ml-1" /> افزودن آیتم
            </Button>
          </div>

          {fields.map((field, index) => {
            const orderType = items?.[index]?.order_type ?? "sony_account";
            return (
              <div key={field.id} className="border border-neutral-200 rounded-lg p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-neutral-600">نوع سفارش</label>
                      <Controller
                        name={`items.${index}.order_type`}
                        control={control}
                        render={({ field: f }) => (
                          <Select value={f.value} onValueChange={f.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="نوع" />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(ORDER_TYPE_LABELS) as OrderItemType[]).map((t) => (
                                <SelectItem key={t} value={t}>
                                  {ORDER_TYPE_LABELS[t]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-neutral-600">عنوان</label>
                      <Input
                        placeholder="عنوان آیتم"
                        {...register(`items.${index}.title` as const, { required: "عنوان الزامی است" })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-neutral-600">دسته سفارش (id)</label>
                      <Input
                        type="number"
                        placeholder="category_id"
                        {...register(`items.${index}.order_data.category_id` as const, {
                          required: "الزامی",
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 mt-5"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="تعداد"
                    type="number"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  />
                  <Input
                    label="قیمت واحد"
                    type="number"
                    {...register(`items.${index}.unit_price` as const, {
                      required: "قیمت الزامی است",
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    label="تخفیف آیتم"
                    type="number"
                    {...register(`items.${index}.discount` as const, { valueAsNumber: true })}
                  />
                </div>

                {orderType === "sony_account" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-neutral-600">منبع فروش</label>
                      <Controller
                        name={`items.${index}.order_data.source` as const}
                        control={control}
                        render={({ field: f }) => (
                          <Select value={f.value ?? "in_person"} onValueChange={f.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_person">حضوری</SelectItem>
                              <SelectItem value="website">وب‌سایت</SelectItem>
                              <SelectItem value="telegram">تلگرام</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <Input
                      label="شناسه اکانت‌ها (با کاما: 10,11)"
                      placeholder="account_ids"
                      {...register(`items.${index}.order_data.account_ids` as const, {
                        setValueAs: (v) =>
                          Array.isArray(v)
                            ? v
                            : String(v ?? "")
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map(Number),
                      })}
                    />
                  </div>
                )}

                {orderType === "repair" && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-600">
                      دستگاه‌ها (عنوان / شماره سریال — هر سطر یکی)
                    </label>
                    <Input
                      placeholder="مثلاً پلی‌استیشن ۵ / PS5-12345"
                      {...register(`items.${index}.order_data.devices` as const, {
                        setValueAs: (v) => {
                          if (Array.isArray(v)) return v;
                          return String(v ?? "")
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((line) => {
                              const [title, serial_number] = line.split("/");
                              return { title: title?.trim() || "", serial_number: serial_number?.trim() || "" };
                            });
                        },
                      })}
                    />
                  </div>
                )}

                {orderType === "product" && (
                  <Input
                    label="شناسه محصول"
                    type="number"
                    placeholder="product_id"
                    {...register(`items.${index}.order_data.product_id` as const, {
                      valueAsNumber: true,
                    })}
                  />
                )}
              </div>
            );
          })}
        </div>
      </form>
    </Dialog>
  );
}
