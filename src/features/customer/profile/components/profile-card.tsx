"use client";

import { Camera, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Button } from "@/components/ui";

interface ProfileCardProps {
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    avatar?: string | null;
    wallet_balance: number;
  };

  onUploadAvatar?: () => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default function ProfileCard({
  profile,
  onUploadAvatar,
}: ProfileCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>پروفایل</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <img
            src={profile.avatar || "/images/avatar-placeholder.png"}
            alt={profile.first_name}
            className="w-28 h-28 rounded-full object-cover border-4 border-primary/10"
          />

          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={onUploadAvatar}
          >
            <Camera className="w-4 h-4" />
          </Button>
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
          className="w-full mt-6"
          variant="outline"
          onClick={onUploadAvatar}
        >
          تغییر تصویر پروفایل
        </Button>
      </CardContent>
    </Card>
  );
}