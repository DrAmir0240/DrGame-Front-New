"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useGames } from "../../apis";
import { GameCard } from "../../components/game-card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

const categories = [
  { value: "", label: "همه دسته‌بندی‌ها" },
  { value: "3", label: "اکشن-ادونچر" },
  { value: "4", label: "ورزشی" },
  { value: "5", label: "شبیه‌سازی" },
];

export function GamesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const [maxVolume, setMaxVolume] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: games, isLoading } = useGames({
    ...(category ? { category: Number(category) } : {}),
    ...(minVolume ? { min_volume: Number(minVolume) } : {}),
    ...(maxVolume ? { max_volume: Number(maxVolume) } : {}),
  });

  const filtered = (games ?? []).filter((g) =>
    search
      ? g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const clearFilters = () => {
    setCategory("");
    setMinVolume("");
    setMaxVolume("");
  };

  const hasFilters = category || minVolume || maxVolume;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-xs text-primary-600 dark:text-primary-300">بازی‌ها</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          فروشگاه <span className="text-primary-500">بازی</span>
        </h1>
        <p className="text-muted-foreground max-w-lg">
          جدیدترین و پرفروش‌ترین بازی‌های PS5، PS4، Xbox و PC را اینجا پیدا کنید
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی بازی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          فیلترها
          {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
        </Button>
      </div>

      {showFilters && (
        <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">فیلترها</span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                پاک کردن فیلترها
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="حداقل حجم (GB)"
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
            />
            <Input
              type="number"
              placeholder="حداکثر حجم (GB)"
              value={maxVolume}
              onChange={(e) => setMaxVolume(e.target.value)}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <Skeleton className="aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">بازی‌ای یافت نشد</h3>
          <p className="text-sm text-muted-foreground">
            با تغییر فیلترها یا جستجو دوباره امتحان کنید
          </p>
        </div>
      )}
    </div>
  );
}
