"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react";
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useBlogCategories, useBlogPosts } from "./apis";
import { BlogCard } from "./components/blog-card";


export function BlogsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories, isLoading: categoriesLoading } =
    useBlogCategories();
  const { data: posts, isLoading } = useBlogPosts({
    ...(category !== "all" ? { category: Number(category) } : {}),
  });

  const filtered = (posts?.results ?? []).filter((p) =>
    search
      ? p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category_title?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const clearFilters = () => {
    setCategory("all");
  };

  const hasFilters = category !== "all";

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5">
          <BookOpen className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
          <span className="text-xs text-primary-600 dark:text-primary-300">
            وبلاگ
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-extrabold text-foreground md:text-4xl">
          مقالات و{" "}
          <span className="text-primary-500">اخبار گیمینگ</span>
        </h1>
        <p className="max-w-lg text-muted-foreground">
          آخرین اخبار، راهنماها و مقالات دنیای بازی و کنسول
        </p>
      </div>

      {/* Search + Filter toggle */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجوی مقاله، نویسنده یا دسته‌بندی..."
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
          <SlidersHorizontal className="h-4 w-4" />
          فیلترها
          {hasFilters && (
            <span className="h-2 w-2 rounded-full bg-primary-500" />
          )}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-card p-5 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">فیلترها</span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
                پاک کردن فیلترها
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                {(categories ?? []).map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading || categoriesLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700"
            >
              <Skeleton className="aspect-[16/10]" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-foreground">
            مقاله‌ای یافت نشد
          </h3>
          <p className="text-sm text-muted-foreground">
            با تغییر فیلترها یا جستجو دوباره امتحان کنید
          </p>
        </div>
      )}
    </div>
  );
}