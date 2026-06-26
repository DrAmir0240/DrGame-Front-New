"use client";

import { useMemo, useState } from "react";
import moment from "moment";
import { Plus, Search } from "lucide-react";

import { DataTable, DataTableColumn, PageHeader } from "@/components/shared";
import {StatusBadge} from "@/components/shared";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";

type DeviceType = "console" | "controller" | "other";
type RepairStatus =
  | "pending"
  | "received"
  | "under_review"
  | "price_set"
  | "approved"
  | "in_repair"
  | "repaired"
  | "completed";

interface RepairOrder {
  id: number;
  created_date: string;
  device_type: DeviceType;
  device_model: string;
  issue_description: string;
  notes: string;
  technician_price: number | null;
  final_price: number | null;
  status: RepairStatus;
}

const deviceTypes: Record<DeviceType, string> = {
  console: "کنسول",
  controller: "دسته بازی",
  other: "سایر",
};

function formatPrice(n: number | null | undefined) {
  return n ? new Intl.NumberFormat("fa-IR").format(n) + " ت" : "—";
}

const initialRepairs: RepairOrder[] = [
  { id: 1, created_date: "2025-06-01T10:00:00", device_type: "console", device_model: "PS5 Slim", issue_description: "روشن نمیشه", notes: "", technician_price: 500000, final_price: 800000, status: "received" },
  { id: 2, created_date: "2025-06-02T12:00:00", device_type: "controller", device_model: "DualSense", issue_description: "دریفت آنالوگ", notes: "", technician_price: null, final_price: null, status: "under_review" },
];

export default function RepairsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [repairs, setRepairs] = useState<RepairOrder[]>(initialRepairs);
  const [form, setForm] = useState({
    device_type: "console" as DeviceType,
    device_model: "",
    issue_description: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    return repairs.filter((r) => {
      const matchSearch =
        !search ||
        r.device_model?.toLowerCase().includes(search.toLowerCase()) ||
        r.issue_description?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [repairs, search]);

  function handleStatusChange(id: number, status: RepairStatus) {
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newRepair: RepairOrder = {
      id: Date.now(),
      created_date: new Date().toISOString(),
      device_type: form.device_type,
      device_model: form.device_model,
      issue_description: form.issue_description,
      notes: form.notes,
      technician_price: null,
      final_price: null,
      status: "pending",
    };
    setRepairs((prev) => [newRepair, ...prev]);
    setOpen(false);
    setForm({ device_type: "console", device_model: "", issue_description: "", notes: "" });
  }

  const statusActions: Partial<Record<RepairStatus, { label: string; next: RepairStatus }[]>> = {
    pending: [{ label: "دریافت شد", next: "received" }],
    received: [{ label: "بررسی", next: "under_review" }],
    under_review: [{ label: "قیمت‌گذاری", next: "price_set" }],
    price_set: [{ label: "تأیید مشتری", next: "approved" }],
    approved: [{ label: "شروع تعمیر", next: "in_repair" }],
    in_repair: [{ label: "تعمیر شد", next: "repaired" }],
    repaired: [{ label: "تکمیل", next: "completed" }],
  };

  const columns: DataTableColumn<RepairOrder>[] = [
    {
      header: "تاریخ",
      render: (r) => (
        <span className="text-sm">{moment(r.created_date).format("YYYY/MM/DD")}</span>
      ),
    },
    {
      header: "نوع",
      render: (r) => (
        <span className="text-sm">{deviceTypes[r.device_type] || r.device_type}</span>
      ),
    },
    {
      header: "مدل",
      render: (r) => (
        <span className="font-medium text-sm">{r.device_model || "—"}</span>
      ),
    },
    {
      header: "مشکل",
      render: (r) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {r.issue_description || "—"}
        </span>
      ),
    },
    {
      header: "قیمت تعمیرکار",
      render: (r) => <span className="text-sm">{formatPrice(r.technician_price)}</span>,
    },
    {
      header: "قیمت نهایی",
      render: (r) => (
        <span className="text-sm font-semibold">{formatPrice(r.final_price)}</span>
      ),
    },
    {
      header: "وضعیت",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: "عملیات",
      render: (r) => {
        const actions = statusActions[r.status];
        return (
          <div className="flex gap-1 flex-wrap">
            {actions?.map((a) => (
              <Button
                key={a.next}
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(r.id, a.next);
                }}
              >
                {a.label}
              </Button>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="تعمیرات" description="مدیریت سفارش‌های تعمیر">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> سفارش تعمیر جدید
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی مدل یا مشکل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <DataTable<RepairOrder> columns={columns} data={filtered} isLoading={false} />

      <Dialog  open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>سفارش تعمیر جدید</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>نوع دستگاه</Label>
              <Select
                value={form.device_type}
                onValueChange={(v) => setForm({ ...form, device_type: v as DeviceType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(deviceTypes).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>مدل</Label>
              <Input
                value={form.device_model}
                onChange={(e) => setForm({ ...form, device_model: e.target.value })}
                placeholder="مثلاً PS5 Slim"
              />
            </div>
            <div className="space-y-2">
              <Label>شرح مشکل *</Label>
              <Textarea
                value={form.issue_description}
                onChange={(e) => setForm({ ...form, issue_description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>یادداشت</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={!form.issue_description}>
                ثبت
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
