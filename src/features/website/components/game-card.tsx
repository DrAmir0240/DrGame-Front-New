"use client";

import Link from "next/link";
import { HardDrive } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { formatNumber } from "@/utils/format";
import type { GameListItem } from "../types";

interface GameCardProps {
  game: GameListItem;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={getImageUrl(game.main_img)}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">
          {game.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {game.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{formatNumber(game.volume)} GB</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatNumber(game.units_sold)} فروش
          </span>
        </div>
      </div>
    </Link>
  );
}
