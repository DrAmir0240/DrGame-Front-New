"use client";

import Link from "next/link";
import { UserX, Loader2, ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { Button, Card } from "@/components/ui";

import ProfileCard from "./components/profile-card";
import PersonalInfoCard from "./components/profile-info-card";
import { useProfile, useUploadProfilePic } from "./apis";

export default function ProfilePage() {
  const { data, isLoading, error } = useProfile();
  const uploadPic = useUploadProfilePic();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isForbidden = (error as { response?: { status?: number } } | null)?.response?.status === 403;

  if (!data || isForbidden) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="پروفایل"
          description="مدیریت اطلاعات حساب کاربری"
        />

        <Card className="rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-6">
            <UserX className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-xl font-bold">خطا در دریافت اطلاعات</h2>

          <p className="text-sm text-muted-foreground mt-3 max-w-md">
            ابتدا پروفایل خود را تکمیل کنید تا بتوانید از تمام امکانات پنل کاربری
            استفاده کنید.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <Button href="/complete-profile">
              تکمیل پروفایل
            </Button>

            <Button href="/" variant="outline">
              <ArrowLeft className="w-4 h-4 ml-1" />
              بازگشت به سایت
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="پروفایل"
        description="مدیریت اطلاعات حساب کاربری"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileCard
          profile={data}
          onUploadAvatar={(file) => uploadPic.mutate(file)}
          uploading={uploadPic.isPending}
        />

        <div className="lg:col-span-2">
          <PersonalInfoCard
            profile={data}
          />
        </div>
      </div>
    </div>
  );
}