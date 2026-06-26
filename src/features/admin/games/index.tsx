"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import type { Game, GameFormData } from "./types";
import { initialGames } from "./constants";
import GameFilters from "./components/GameFilters";
import GamesTable from "./components/GamesTable";
import GameFormDialog from "./components/GameFormDialog";

export const GamesPage = () => {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");

  function closeDialog() {
    setOpen(false);
    setEditing(null);
  }

  function handleSubmit(form: GameFormData, editing: Game | null) {
    if (editing) {
      setGames((prev) =>
        prev.map((g) =>
          g.id === editing.id ? { ...g, ...form, price: Number(form.price) } : g
        )
      );
    } else {
      setGames((prev) => [
        { id: Date.now(), ...form, price: Number(form.price) },
        ...prev,
      ]);
    }
    closeDialog();
  }

  function deleteGame(id: number) {
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="بازی‌ها" description="مدیریت لیست بازی‌های دیجیتال">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> بازی جدید
        </Button>
      </PageHeader>

      <GameFilters
        search={search}
        platform={filterPlatform}
        onSearchChange={setSearch}
        onPlatformChange={setFilterPlatform}
      />

      <GamesTable
        games={games}
        search={search}
        platform={filterPlatform}
        onEdit={(game) => { setEditing(game); setOpen(true); }}
        onDelete={deleteGame}
      />

      <GameFormDialog
        open={open}
        editing={editing}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GamesPage;
