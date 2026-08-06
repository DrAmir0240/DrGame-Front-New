"use client";

import { BlogDetailView } from "@/features/website/blog/details";
import { use } from "react";


interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);
  return <BlogDetailView id={Number(id)} />;
}