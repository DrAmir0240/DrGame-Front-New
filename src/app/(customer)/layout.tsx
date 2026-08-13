import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { UserLayout } from "@/layouts/user-layout";
import { PropsWithChildren } from "@/types/children";

export default async function UserDashboardLayoutWrapper({
  children,
}: PropsWithChildren) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    redirect("/login");
  }

  return <UserLayout>{children}</UserLayout>;
}