"use client";

import { Dialog } from "@/components/ui";
import { StatusBadge } from "@/components/shared";
import { formatPrice } from "@/utils/format";
import { useExpenseDetail, useIncomeDetail, usePayrollDetail, usePurchaseDetail, useSalesDetail, useDailyInvoiceDetail, useDailyTransactionDetail } from "../apis";
import type { Expense, Income, Payroll, Purchase, Sales, DailyInvoiceDetail, DailyTransactionDetail } from "../types";

type EntityType = "expense" | "income" | "payroll" | "purchase" | "sales" | "invoice" | "transaction";

interface Props {
  open: boolean;
  onClose: () => void;
  type: EntityType;
  id: number;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

function InvoiceDetail({ data }: { data: Expense | Income | Purchase | Sales }) {
  return (
    <div className="space-y-0">
      <Row label="طرف حساب">{data.account_side?.name || "—"}</Row>
      <Row label="دسته‌بندی">{data.category?.title || "—"}</Row>
      <Row label="مبلغ">{formatPrice(data.amount)}</Row>
      <Row label="تخفیف">{formatPrice(data.discount)}</Row>
      <Row label="پرداختی">{formatPrice(data.paid_amount)}</Row>
      <Row label="مانده"><span className={data.remaining_amount > 0 ? "text-red-600" : "text-emerald-600"}>{formatPrice(data.remaining_amount)}</span></Row>
      <Row label="وضعیت"><StatusBadge status={data.status} /></Row>
      <Row label="پرداخت"><StatusBadge status={data.payment_status} /></Row>
      {data.description && <Row label="توضیحات"><span className="max-w-[250px] text-left">{data.description}</span></Row>}
      <Row label="تاریخ ایجاد">{new Date(data.created_at).toLocaleDateString("fa-IR")}</Row>
    </div>
  );
}

function PayrollPayrollDetail({ data }: { data: Payroll }) {
  const d = data.payroll_detail;
  return (
    <div className="space-y-0">
      <Row label="طرف حساب">{data.account_side?.name || "—"}</Row>
      <Row label="مبلغ کل">{formatPrice(data.amount)}</Row>
      <Row label="پرداختی">{formatPrice(data.paid_amount)}</Row>
      <Row label="مانده"><span className={data.remaining_amount > 0 ? "text-red-600" : "text-emerald-600"}>{formatPrice(data.remaining_amount)}</span></Row>
      <Row label="وضعیت پرداخت"><StatusBadge status={data.payment_status} /></Row>
      {d && <>
        <div className="mt-3 mb-1 text-xs font-semibold text-neutral-400 uppercase">جزئیات حقوق</div>
        <Row label="حقوق پایه">{formatPrice(d.base_salary)}</Row>
        <Row label="اضافه‌کاری">{formatPrice(d.overtime_amount)}</Row>
        <Row label="پاداش">{formatPrice(d.bonus)}</Row>
        <Row label="حق مسکن">{formatPrice(d.housing_allowance)}</Row>
        <Row label="حق غذا">{formatPrice(d.food_allowance)}</Row>
        <Row label="حق حمل‌ونقل">{formatPrice(d.transportation_allowance)}</Row>
        <Row label="بیمه">{formatPrice(d.insurance_deduction)}</Row>
        <Row label="مالیات">{formatPrice(d.tax_deduction)}</Row>
        <Row label="وام">{formatPrice(d.loan_deduction)}</Row>
        <Row label="سایر کسورات">{formatPrice(d.other_deductions)}</Row>
        {d.gross_salary != null && <Row label="حقوق ناخالص">{formatPrice(d.gross_salary)}</Row>}
        {d.total_deductions != null && <Row label="جمع کسورات">{formatPrice(d.total_deductions)}</Row>}
        {d.net_salary != null && <Row label="حقوق خالص"><span className="text-emerald-700 font-bold">{formatPrice(d.net_salary)}</span></Row>}
        <Row label="روزهای کار">{d.work_days}</Row>
        <Row label="ساعات اضافه‌کاری">{d.overtime_hours}</Row>
        {d.description && <Row label="توضیحات">{d.description}</Row>}
      </>}
      <Row label="تاریخ ایجاد">{new Date(data.created_at).toLocaleDateString("fa-IR")}</Row>
    </div>
  );
}

function InvoiceDetailFull({ data }: { data: DailyInvoiceDetail }) {
  return (
    <div className="space-y-0">
      <Row label="طرف حساب">{data.account_side?.name || "—"}</Row>
      <Row label="دسته‌بندی">{data.category?.title || "—"}</Row>
      <Row label="مبلغ">{formatPrice(data.amount)}</Row>
      <Row label="تخفیف">{formatPrice(data.discount)}</Row>
      <Row label="پرداختی">{formatPrice(data.paid_amount)}</Row>
      <Row label="مانده"><span className={data.remaining_amount > 0 ? "text-red-600" : "text-emerald-600"}>{formatPrice(data.remaining_amount)}</span></Row>
      <Row label="وضعیت"><StatusBadge status={data.status} /></Row>
      <Row label="پرداخت"><StatusBadge status={data.payment_status} /></Row>
      {data.description && <Row label="توضیحات"><span className="max-w-[250px] text-left">{data.description}</span></Row>}
      {data.items && data.items.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase mb-2">آیتم‌ها</div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-3 py-1.5 text-right">عنوان</th>
                  <th className="px-3 py-1.5 text-right">تعداد</th>
                  <th className="px-3 py-1.5 text-right">قیمت واحد</th>
                  <th className="px-3 py-1.5 text-right">تخفیف</th>
                  <th className="px-3 py-1.5 text-right">جمع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-1.5">{item.title}</td>
                    <td className="px-3 py-1.5">{item.quantity}</td>
                    <td className="px-3 py-1.5">{formatPrice(item.unit_price)}</td>
                    <td className="px-3 py-1.5">{formatPrice(item.discount)}</td>
                    <td className="px-3 py-1.5 font-medium">{formatPrice(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Row label="تاریخ ایجاد">{new Date(data.created_at).toLocaleDateString("fa-IR")}</Row>
    </div>
  );
}

function TransactionDetail({ data }: { data: DailyTransactionDetail }) {
  return (
    <div className="space-y-0">
      <Row label="طرف حساب">{data.account_side?.name || "—"}</Row>
      <Row label="حساب بانکی">{data.bank_account?.title || "—"}</Row>
      <Row label="مبلغ"><span className={data.direction === "in" ? "text-emerald-600" : "text-red-600"}>{data.direction === "in" ? "+" : "-"}{formatPrice(data.amount)}</span></Row>
      <Row label="جهت"><StatusBadge status={data.direction} /></Row>
      {data.description && <Row label="توضیحات">{data.description}</Row>}
      <Row label="تاریخ ایجاد">{new Date(data.created_at).toLocaleDateString("fa-IR")}</Row>
    </div>
  );
}

const titles: Record<EntityType, string> = {
  expense: "جزئیات هزینه",
  income: "جزئیات درآمد",
  payroll: "جزئیات فیش حقوقی",
  purchase: "جزئیات فاکتور خرید",
  sales: "جزئیات فاکتور فروش",
  invoice: "جزئیات فاکتور",
  transaction: "جزئیات تراکنش",
};

export default function AccountingDetailModal({ open, onClose, type, id }: Props) {
  const expense = useExpenseDetail(type === "expense" ? id : 0);
  const income = useIncomeDetail(type === "income" ? id : 0);
  const payroll = usePayrollDetail(type === "payroll" ? id : 0);
  const purchase = usePurchaseDetail(type === "purchase" ? id : 0);
  const sales = useSalesDetail(type === "sales" ? id : 0);
  const invoice = useDailyInvoiceDetail(type === "invoice" ? id : 0);
  const transaction = useDailyTransactionDetail(type === "transaction" ? id : 0);

  const loading = { expense, income, payroll, purchase, sales, invoice, transaction }[type].isLoading;
  const data = { expense, income, payroll, purchase, sales, invoice, transaction }[type].data;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} title={titles[type]} className="max-w-lg">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600" />
        </div>
      ) : !data ? (
        <p className="text-center text-neutral-400 py-8">داده‌ای یافت نشد</p>
      ) : type === "payroll" ? (
        <PayrollPayrollDetail data={data as Payroll} />
      ) : type === "invoice" ? (
        <InvoiceDetailFull data={data as DailyInvoiceDetail} />
      ) : type === "transaction" ? (
        <TransactionDetail data={data as DailyTransactionDetail} />
      ) : (
        <InvoiceDetail data={data as Expense | Income | Purchase | Sales} />
      )}
    </Dialog>
  );
}
