"use client";

import { VideoDetailView } from "@/features/website/videos/details";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);
  return <VideoDetailView id={Number(id)} />;
}
