import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { PropsWithChildren } from "@/types/children";

export default async function AuthLayoutWrapper({
  children,
}: PropsWithChildren) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (accessToken) {
    redirect("/");
  }

  return <>{children}</>;
}