"use client";

import { useState } from "react";
import { Search, Play } from "lucide-react";
import { Input } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useVideos } from "./apis";
import { VideoCard } from "./components/video-card";

export function VideosPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useVideos();
  const videos = data?.results ?? [];

  const filtered = videos.filter((v) =>
    search
      ? v.title.toLowerCase().includes(search.toLowerCase()) ||
        (v.description ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      : true
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
          <Play className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
          <span className="text-xs text-primary-600 dark:text-primary-300">
            ویدیوها
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          آموزش و <span className="text-primary-500">راهنما</span>
        </h1>
        <p className="text-muted-foreground max-w-lg">
          ویدئوهای آموزشی و راهنمایی از دنیای بازی و کنسول‌های PlayStation
        </p>
      </div>

      <div className="relative flex-1 mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="جستجوی ویدیو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <Skeleton className="aspect-video" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            ویدیویی یافت نشد
          </h3>
          <p className="text-sm text-muted-foreground">
            با جستجو دوباره امتحان کنید
          </p>
        </div>
      )}
    </div>
  );
}