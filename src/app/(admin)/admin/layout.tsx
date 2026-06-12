
import { AdminLayout } from "@/layouts/admin-layout";
import { PropsWithChildren } from "@/types/children";

export default function UserDashboardLayoutWrapper({
  children,
}: PropsWithChildren) {
  return <AdminLayout>{children}</AdminLayout>;
}
