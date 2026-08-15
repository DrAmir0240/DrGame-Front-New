"use client";

import Link from "next/link";
import { ArrowLeft, Gamepad2, Package, FileText } from "lucide-react";
import { useSections, useSectionItems } from "@/features/website/apis";
import { getImageUrl, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import type { Section, SectionItem } from "@/features/website/types";

const itemTypeMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  game: { label: "بازی", icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  product: { label: "کالا", icon: <Package className="w-3.5 h-3.5" /> },
  blog: { label: "بلاگ", icon: <FileText className="w-3.5 h-3.5" /> },
};

const sectionIconMeta: Record<
  Section["model_content"],
  React.ReactNode
> = {
  game: <Gamepad2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
  product: <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
  blog: <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
};

function itemHref(item: SectionItem): string | null {
  if (item.item_type === "game") return `/games/${item.item_id}`;
  if (item.item_type === "product") return `/products/${item.item_id}`;
  return null;
}

function SectionBlock({ section }: { section: Section }) {
  const { data: items, isLoading } = useSectionItems(section.id);

  const visibleItems = (items ?? []).slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-secondary-500/15 border border-primary-500/20 flex items-center justify-center">
            {sectionIconMeta[section.model_content] ?? sectionIconMeta.game}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
            {section.title}
          </h2>
        </div>
        <Link
          href={
            section.model_content === "game"
              ? "/games"
              : section.model_content === "blog"
                ? "/blog"
                : "/products"
          }
          className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all font-medium"
        >
          مشاهده همه
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700"
            >
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleItems.map((item, idx) => {
            const href = itemHref(item);
            const meta = itemTypeMeta[item.item_type] ?? itemTypeMeta.product;
            const hideOnMobile = idx >= 4 ? "hidden md:block" : "";
            const card = (
              <div className="group relative bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 h-full">
                <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {item.item_image ? (
                    <img
                      src={getImageUrl(item.item_image)}
                      alt={item.item_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
                      {meta.icon}
                      {meta.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">
                    {item.item_title}
                  </h3>
                  {item.item_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.item_description}
                    </p>
                  )}
                </div>
              </div>
            );

            return href ? (
              <Link
                key={item.item_id}
                href={href}
                className={cn("block h-full", hideOnMobile)}
              >
                {card}
              </Link>
            ) : (
              <div key={item.item_id} className={cn("h-full", hideOnMobile)}>
                {card}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function HomeSections() {
  const { data: sections, isLoading } = useSections();

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container space-y-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-64 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!sections || sections.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container space-y-14">
        {sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
