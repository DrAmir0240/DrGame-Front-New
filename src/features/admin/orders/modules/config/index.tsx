"use client";

import { PageHeader } from "@/components/shared";
import ConfigTab from "./components/ConfigTab";

export default function ConfigPage() {
  const roles = [
    { id: 1, role_name: "کارشناس فروش" },
    { id: 2, role_name: "تکنسین تعمیرات" },
    { id: 3, role_name: "انباردار" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="کانفیگ سفارشات" description="مدیریت دسته‌بندی‌ها، مراحل و اکشن‌ها" />
      <ConfigTab roles={roles} />
    </div>
  );
}
