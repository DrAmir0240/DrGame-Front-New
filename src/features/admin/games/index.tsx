"use client";

import React, { useMemo, useState } from "react";

import { PageHeader, DataTable } from "@/components/shared";
import {
  Button,
  Input,
  Label,
  Switch,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";

import { Plus, Pencil, Trash2, Search } from "lucide-react";


type Platform = "ps" | "xbox" | "nintendo" | "all";

type Game = {
  id: number;
  name: string;
  platform: Exclude<Platform, "all">;
  price: number;
  is_active: boolean;
};


const initialGames: Game[] = [
  { id: 1, name: "GTA V", platform: "ps", price: 1200000, is_active: true },
  { id: 2, name: "FIFA 24", platform: "xbox", price: 900000, is_active: true },
  {
    id: 3,
    name: "Zelda",
    platform: "nintendo",
    price: 1500000,
    is_active: false,
  },
];


function formatPrice(n: number) {
  return n ? new Intl.NumberFormat("fa-IR").format(n) + " تومان" : "—";
}

const platformLabels: Record<Game["platform"], string> = {
  ps: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
};


export const GamesPage = () => {
  const [games, setGames] = useState<Game[]>(initialGames);

  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Game | null>(null);

  const [search, setSearch] = useState<string>("");
  const [filterPlatform, setFilterPlatform] = useState<Platform>("all");

  const [form, setForm] = useState<{
    name: string;
    platform: Game["platform"];
    price: string;
    is_active: boolean;
  }>({
    name: "",
    platform: "ps",
    price: "",
    is_active: true,
  });


  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm({ name: "", platform: "ps", price: "", is_active: true });
  };

  const openEdit = (game: Game) => {
    setEditing(game);
    setForm({
      name: game.name,
      platform: game.platform,
      price: String(game.price),
      is_active: game.is_active,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Game = {
      id: editing ? editing.id : Date.now(),
      name: form.name,
      platform: form.platform,
      price: Number(form.price || 0),
      is_active: form.is_active,
    };

    if (editing) {
      setGames((prev) => prev.map((g) => (g.id === editing.id ? payload : g)));
    } else {
      setGames((prev) => [payload, ...prev]);
    }

    closeDialog();
  };

  const deleteGame = (id: number) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  /* ---------------- Filter ---------------- */

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchSearch =
        !search || g.name.toLowerCase().includes(search.toLowerCase());

      const matchPlatform =
        filterPlatform === "all" || g.platform === filterPlatform;

      return matchSearch && matchPlatform;
    });
  }, [games, search, filterPlatform]);

  /* ---------------- Table ---------------- */

  const columns = [
    {
      header: "نام بازی",
      render: (r: Game) => (
        <span className="font-medium text-sm">{r.name}</span>
      ),
    },
    {
      header: "پلتفرم",
      render: (r: Game) => (
        <Badge variant="outline" className="text-xs">
          {platformLabels[r.platform]}
        </Badge>
      ),
    },
    {
      header: "قیمت",
      render: (r: Game) => (
        <span className="text-sm font-semibold">{formatPrice(r.price)}</span>
      ),
    },
    {
      header: "",
      render: (r: Game) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
          >
            <Pencil className="w-4 h-4 " />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              deleteGame(r.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-error" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="بازی‌ها" description="مدیریت لیست بازی‌های دیجیتال">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          بازی جدید
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

        <Select
          value={filterPlatform}
          onValueChange={(v: Platform) => setFilterPlatform(v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="ps">PlayStation</SelectItem>
            <SelectItem value="xbox">Xbox</SelectItem>
            <SelectItem value="nintendo">Nintendo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={false} />

      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش بازی" : "بازی جدید"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>نام بازی</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>پلتفرم</Label>
              <Select
                value={form.platform}
                onValueChange={(v: Game["platform"]) =>
                  setForm({ ...form, platform: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ps">PS</SelectItem>
                  <SelectItem value="xbox">Xbox</SelectItem>
                  <SelectItem value="nintendo">Nintendo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>قیمت</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label>فعال</Label>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
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
}
