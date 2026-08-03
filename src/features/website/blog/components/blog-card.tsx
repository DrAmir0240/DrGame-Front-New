"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import type { BlogPost } from "../types";

interface Props {
  post: BlogPost;
}

export function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-card transition hover:border-primary-500/30 hover:shadow-lg dark:border-neutral-700"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            بدون تصویر
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-primary-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {post.category_title}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold text-foreground transition group-hover:text-primary-500">
          {post.title}
        </h3>

        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.author_name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.published_at).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}