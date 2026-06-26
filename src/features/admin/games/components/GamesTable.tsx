"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import { formatPrice } from "@/utils/format";
import type { Game } from "../types";
import { platformLabels } from "../constants";

interface Props {
  games: Game[];
  search: string;
  platform: string;
  onEdit: (game: Game) => void;
  onDelete: (id: number) => void;
}

export default function GamesTable({ games, search, platform, onEdit, onDelete }: Props) {
  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
      const matchPlatform = platform === "all" || g.platform === platform;
      return matchSearch && matchPlatform;
    });
  }, [games, search, platform]);

  const columns: DataTableColumn<Game>[] = [
    {
      header: "نام بازی",
      render: (r) => <span className="font-medium text-sm">{r.name}</span>,
    },
    {
      header: "پلتفرم",
      render: (r) => <Badge variant="outline">{platformLabels[r.platform]}</Badge>,
    },
    {
      header: "قیمت",
      render: (r) => <span className="font-semibold text-sm">{formatPrice(r.price)}</span>,
    },
    {
      header: "",
      render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(r); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(r.id); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable<Game> columns={columns} data={filtered} isLoading={false} />;
}
