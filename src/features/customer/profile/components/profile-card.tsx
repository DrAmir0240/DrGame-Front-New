"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Button } from "@/components/ui";
import { getImageUrl } from "@/lib/utils";

interface ProfileCardProps {
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    profile_pic?: string | null;
    wallet_balance: number;
  };

  onUploadAvatar?: (file: File) => void;
  uploading?: boolean;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default function ProfileCard({
  profile,
  onUploadAvatar,
  uploading,
}: ProfileCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const avatarSrc = preview || (profile.profile_pic ? getImageUrl(profile.profile_pic) : "/images/avatar-placeholder.png");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onUploadAvatar?.(file);

    e.target.value = "";
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>پروفایل</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <img
            src={avatarSrc}
            alt={profile.first_name}
            className="w-28 h-28 rounded-full object-cover border-4 border-primary/10"
          />

          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h2 className="mt-5 text-xl font-bold">
          {profile.first_name} {profile.last_name}
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          {profile.phone}
        </p>

        <div className="mt-6 w-full rounded-xl border border-neutral-300 bg-muted/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-primary" />

            <span className="text-sm text-muted-foreground">
              موجودی کیف پول
            </span>
          </div>

          <p className="text-lg font-bold text-primary">
            {formatPrice(profile.wallet_balance)} تومان
          </p>
        </div>

        <Button
          type="button"
          className="w-full mt-6"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "در حال آپلود..." : "تغییر تصویر پروفایل"}
        </Button>
      </CardContent>
    </Card>
  );
}
