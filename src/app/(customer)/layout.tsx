
import { UserLayout } from "@/layouts/user-layout";
import { PropsWithChildren } from "@/types/children";

export default function UserDashboardLayoutWrapper({
  children,
}: PropsWithChildren) {
  return <UserLayout>{children}</UserLayout>;
}
