"use client";

import Link from "next/link";
import { ChevronRight, Calendar, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useVideoDetail } from "../apis";

interface Props {
  id: number;
}

export function VideoDetailView({ id }: Props) {
  const { data: video, isLoading } = useVideoDetail(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        ویدیویی یافت نشد
      </div>
    );
  }

  return (
    <article className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/videos">
          <Button variant="ghost" size="sm" className="gap-1 mb-4 -mr-2">
            <ChevronRight className="h-4 w-4" />
            بازگشت به ویدیوها
          </Button>
        </Link>

        <h1 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {video.duration && (
            <span>مدت: {video.duration}</span>
          )}
          {video.slug && (
            <span className="text-xs">slug: {video.slug}</span>
          )}
        </div>
      </div>

      {video.cover_image && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <img
            src={video.cover_image}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {video.video_file && (
        <div className="mb-8">
          <video
            src={video.video_file}
            controls
            className="w-full rounded-2xl bg-neutral-900"
            poster={video.cover_image ?? undefined}
          >
            <p className="text-sm text-muted-foreground">
              مرورگر شما از پخش וیدیو پشتیبانی نمی‌کند.
            </p>
          </video>
        </div>
      )}

      {video.description && (
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 leading-8 text-foreground">
          {video.description}
        </div>
      )}
    </article>
  );
}
