"use client";

import { Play } from "lucide-react";
import type { Video } from "../types";

interface Props {
  video: Video;
}

export function VideoCard({ video }: Props) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-card transition hover:border-primary-500/30 hover:shadow-lg dark:border-neutral-700">
      <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-primary-500/90 p-3 opacity-90 transition group-hover:scale-110">
            <Play className="h-5 w-5 text-white" />
          </div>
        </div>
        {video.cover_image && (
          <img
            src={video.cover_image}
            alt={video.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold text-foreground transition group-hover:text-primary-500">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {video.description}
          </p>
        )}
        {video.duration && (
          <span className="mt-auto text-xs text-muted-foreground">
            مدت: {video.duration}
          </span>
        )}
      </div>
    </div>
  );
}