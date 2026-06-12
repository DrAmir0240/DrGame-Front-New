"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import {
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { Plus, Pencil, Trash2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type AccountType = "ps_online" | "ps_offline" | "xbox" | "nintendo";

interface GameAccount {
  id: string;
  name: string;
  email?: string;
  password_encrypted?: string;
  account_type: AccountType;
  total_capacity?: number;
  sold_count?: number;
  notes?: string;
  is_active?: boolean;
}

const MOCK_ACCOUNTS: GameAccount[] = [
  {
    id: "1",
    name: "PSN Premium A1",
    email: "test1@mail.com",
    account_type: "ps_online",
    total_capacity: 10,
    sold_count: 3,
    is_active: true,
  },
  {
    id: "2",
    name: "Xbox Game Pass",
    email: "xbox@mail.com",
    account_type: "xbox",
    total_capacity: 5,
    sold_count: 2,
    is_active: true,
  },
  {
    id: "3",
    name: "Nintendo Family",
    account_type: "nintendo",
    total_capacity: 8,
    sold_count: 5,
    is_active: false,
  },
];

const typeLabels: Record<AccountType, string> = {
  ps_online: "PS آنلاین",
  ps_offline: "PS آفلاین",
  xbox: "Xbox",
  nintendo: "Nintendo",
};

const typeColors: Record<AccountType, string> = {
  ps_online: "bg-blue-100 text-blue-700 border-blue-200",
  ps_offline: "bg-indigo-100 text-indigo-700 border-indigo-200",
  xbox: "bg-emerald-100 text-emerald-700 border-emerald-200",
  nintendo: "bg-red-100 text-red-700 border-red-200",
};

export const AccountsPage = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GameAccount | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password_encrypted: "",
    account_type: "ps_online" as AccountType,
    total_capacity: "",
    notes: "",
    is_active: true,
  });

  const [accounts, setAccounts] = useState<GameAccount[]>(MOCK_ACCOUNTS);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.email ?? "").toLowerCase().includes(search.toLowerCase());

      const matchType = filterType === "all" || a.account_type === filterType;

      return matchSearch && matchType;
    });
  }, [accounts, search, filterType]);

  function closeDialog() {
    setOpen(false);
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password_encrypted: "",
      account_type: "ps_online",
      total_capacity: "",
      notes: "",
      is_active: true,
    });
  }

  function openEdit(a: GameAccount) {
    setEditing(a);
    setForm({
      name: a.name,
      email: a.email || "",
      password_encrypted: a.password_encrypted || "",
      account_type: a.account_type,
      total_capacity: String(a.total_capacity || ""),
      notes: a.notes || "",
      is_active: a.is_active ?? true,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data: GameAccount = {
      id: editing?.id || crypto.randomUUID(),
      name: form.name,
      email: form.email,
      password_encrypted: form.password_encrypted,
      account_type: form.account_type,
      total_capacity: Number(form.total_capacity) || 0,
      notes: form.notes,
      is_active: form.is_active,
      sold_count: editing?.sold_count || 0,
    };

    if (editing) {
      setAccounts((prev) => prev.map((a) => (a.id === editing.id ? data : a)));
    } else {
      setAccounts((prev) => [data, ...prev]);
    }

    closeDialog();
  }

  function handleDelete(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  const columns = [
    {
      header: "نام اکانت",
      render: (r: GameAccount) => (
        <span className="font-medium text-sm">{r.name}</span>
      ),
    },
    {
      header: "ایمیل",
      render: (r: GameAccount) => (
        <span className="text-sm text-muted-foreground">{r.email || "—"}</span>
      ),
    },
    {
      header: "نوع",
      render: (r: GameAccount) => (
        <Badge
          variant="outline"
          className={`text-xs border ${typeColors[r.account_type]}`}
        >
          {typeLabels[r.account_type]}
        </Badge>
      ),
    },
    {
      header: "ظرفیت",
      render: (r: GameAccount) => (
        <span className="text-sm">{r.total_capacity || "—"}</span>
      ),
    },
    {
      header: "فروش‌ها",
      render: (r: GameAccount) => (
        <span className="text-sm font-semibold">{r.sold_count || 0}</span>
      ),
    },
    {
      header: "وضعیت",
      render: (r: GameAccount) => (
        <Badge
          variant="outline"
          className={
            r.is_active
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-red-100 text-red-700 border-red-200"
          }
        >
          {r.is_active ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      header: "",
      render: (r: GameAccount) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(r.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مدیریت اکانت‌ها"
        description="اکانت‌های بازی PS، Xbox و Nintendo"
      >
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> اکانت جدید
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        <Tabs value={filterType} onValueChange={setFilterType}>
          <TabsList>
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="ps_online">PS آنلاین</TabsTrigger>
            <TabsTrigger value="ps_offline">PS آفلاین</TabsTrigger>
            <TabsTrigger value="xbox">Xbox</TabsTrigger>
            <TabsTrigger value="nintendo">Nintendo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={false} />

      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش اکانت" : "اکانت جدید"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>نام اکانت</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>رمز</Label>
                <Input
                  type="password"
                  value={form.password_encrypted}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password_encrypted: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>نوع</Label>
                <Select
                  value={form.account_type}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      account_type: v as AccountType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ظرفیت</Label>
                <Input
                  type="number"
                  value={form.total_capacity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      total_capacity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>یادداشت</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label>فعال</Label>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                انصراف
              </Button>
              <Button type="submit">{editing ? "ذخیره" : "ایجاد"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
