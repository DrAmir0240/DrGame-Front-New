import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AdminLayout } from "@/layouts/admin-layout";
import { PropsWithChildren } from "@/types/children";

export default async function AdminDashboardLayoutWrapper({
  children,
}: PropsWithChildren) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}