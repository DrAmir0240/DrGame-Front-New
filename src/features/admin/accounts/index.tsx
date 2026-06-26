"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import type { AccountType, GameAccount } from "./types";
import { MOCK_ACCOUNTS } from "./constants";
import AccountFilters from "./components/AccountFilters";
import AccountsTable from "./components/AccountsTable";
import AccountFormDialog from "./components/AccountFormDialog";

const defaultForm = {
  name: "",
  email: "",
  password_encrypted: "",
  account_type: "ps_online" as AccountType,
  total_capacity: "",
  notes: "",
  is_active: true,
};

export const AccountsPage = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GameAccount | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [form, setForm] = useState(defaultForm);
  const [accounts, setAccounts] = useState<GameAccount[]>(MOCK_ACCOUNTS);

  function closeDialog() {
    setOpen(false);
    setEditing(null);
    setForm(defaultForm);
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

  return (
    <div>
      <PageHeader title="مدیریت اکانت‌ها" description="اکانت‌های بازی PS، Xbox و Nintendo">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> اکانت جدید
        </Button>
      </PageHeader>

      <AccountFilters search={search} filterType={filterType} onSearchChange={setSearch} onTypeChange={setFilterType} />

      <AccountsTable accounts={accounts} search={search} filterType={filterType} onEdit={openEdit} onDelete={handleDelete} />

      <AccountFormDialog open={open} editing={editing} form={form} onFormChange={setForm} onSubmit={handleSubmit} onClose={closeDialog} />
    </div>
  );
};

export default AccountsPage;
