"use client";

import { PageHeader } from "@/components/shared";



import ProfileCard from "./components/profile-card";
import PersonalInfoCard from "./components/profile-info-card";
import { useProfile } from "./apis";

export default function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return <div>در حال دریافت اطلاعات...</div>;
  }

  if (!data) {
    return <div>خطا در دریافت اطلاعات</div>;
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