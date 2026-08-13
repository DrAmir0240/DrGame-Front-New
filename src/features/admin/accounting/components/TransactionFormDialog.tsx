"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from "@/components/ui";
import { toast } from "@/components/ui";
import {
  useCreateTransaction,
  useInvoicesList,
  useAccountSidesList,
  useBankAccountsDropdown,
} from "../apis";
import { formatPrice } from "@/utils/format";
import type { CreateTransactionFormData } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TransactionFormDialog({ open, onClose }: Props) {
  const { data: invoices = [] } = useInvoicesList();
  const { data: accountSides = [] } = useAccountSidesList();
  const { data: bankAccounts = [] } = useBankAccountsDropdown();
  const createTransaction = useCreateTransaction();

  const [selected, setSelected] = useState<number[]>([]);

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<CreateTransactionFormData>({
      defaultValues: {
        invoice_ids: [],
        amount: 0,
        bank_account_id: 0,
        account_side_id: 0,
        description: "",
      },
    });

  const receivable = useMemo(
    () =>
      invoices.filter((i) => i.payment_status !== "paid" && i.remaining_amount > 0),
    [invoices]
  );

  const total = useMemo(
    () =>
      selected.reduce((sum, id) => {
        const inv = invoices.find((i) => i.id === id);
        return sum + (inv?.remaining_amount ?? 0);
      }, 0),
    [selected, invoices]
  );

  const isPending = createTransaction.isPending;

  function handleClose() {
    setSelected([]);
    reset({
      invoice_ids: [],
      amount: 0,
      bank_account_id: 0,
      account_side_id: 0,
      description: "",
    });
    onClose();
  }

  function toggleInvoice(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onFormSubmit(data: CreateTransactionFormData) {
    try {
      if (selected.length === 0) {
        toast.error("حداقل یک فاکتور انتخاب کنید");
        return;
      }
      await createTransaction.mutateAsync({ ...data, invoice_ids: selected });
      handleClose();
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      toast.error(
        e?.response?.status === 400
          ? "اطلاعات را به درستی وارد کنید"
          : "خطا در ثبت تراکنش"
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      title="ثبت وصول وجه (تراکنش)"
      description="ثبت تراکنش برای یک یا چند فاکتور — مبلغ به ترتیب FIFO بین فاکتورها توزیع می‌شود"
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            انصراف
          </Button>
          <Button type="submit" form="transaction-form" disabled={isPending}>
            {isPending ? "در حال ثبت..." : "ثبت تراکنش"}
          </Button>
        </>
      }
    >
      <form
        id="transaction-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            فاکتورهای انتخابی (مانده‌دار) <span className="text-red-500">*</span>
          </label>
          <div className="border border-neutral-200 rounded-lg max-h-56 overflow-y-auto divide-y divide-neutral-100">
            {receivable.length === 0 && (
              <p className="text-sm text-neutral-400 p-3">فاکتور مانده‌داری یافت نشد</p>
            )}
            {receivable.map((inv) => {
              const checked = selected.includes(inv.id);
              return (
                <label
                  key={inv.id}
                  className="flex items-center justify-between gap-2 p-3 cursor-pointer hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={checked} onCheckedChange={() => toggleInvoice(inv.id)} />
                    <div>
                      <p className="text-sm font-medium">
                        #{inv.id} — {inv.account_side_name || "—"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatPrice(inv.amount)} · مانده {formatPrice(inv.remaining_amount)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">{inv.category_title || ""}</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500">جمع مانده انتخاب‌شده: {formatPrice(total)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="مبلغ تراکنش (تومان)"
            type="number"
            error={errors.amount?.message}
            {...register("amount", { required: "مبلغ الزامی است", valueAsNumber: true })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              طرف حساب <span className="text-red-500">*</span>
            </label>
            <Controller
              name="account_side_id"
              control={control}
              rules={{ required: "طرف حساب الزامی است", validate: (v) => v > 0 || "طرف حساب الزامی است" }}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب طرف حساب" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountSides.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.account_side_id && (
              <p className="text-xs text-red-500">{errors.account_side_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              حساب بانکی <span className="text-red-500">*</span>
            </label>
            <Controller
              name="bank_account_id"
              control={control}
              rules={{ required: "حساب بانکی الزامی است", validate: (v) => v > 0 || "حساب بانکی الزامی است" }}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب حساب بانکی" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((b) => (
                      <SelectItem key={b.key} value={b.key}>
                        {b.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bank_account_id && (
              <p className="text-xs text-red-500">{errors.bank_account_id.message}</p>
            )}
          </div>
          <Input label="توضیحات" {...register("description")} />
        </div>
      </form>
    </Dialog>
  );
}
