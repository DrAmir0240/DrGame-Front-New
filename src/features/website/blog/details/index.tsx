"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useBlogPost, useBlogPostImages } from "../apis";

interface Props {
  id: number;
}

export function BlogDetailView({ id }: Props) {
  const { data: post, isLoading } = useBlogPost(id);
  const { data: images } = useBlogPostImages(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        پست یافت نشد
      </div>
    );
  }

  const sortedImages = [...(Array.isArray(images) ? images : [])].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <article className="container max-w-3xl py-8">
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1 mb-4 -mr-2">
            <ChevronRight className="h-4 w-4" />
            بازگشت به وبلاگ
          </Button>
        </Link>

        <span className="mb-3 inline-block rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-300">
          {post.category_title}
        </span>

        <h1 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "-"}
          </span>
        </div>
      </div>

      {post.cover_image && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {post.body && (
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 leading-8 text-foreground">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      )}

      {sortedImages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">گالری تصاویر</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sortedImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
              >
                <Image
                  src={img.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}