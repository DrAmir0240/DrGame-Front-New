import { HomeLayout } from "@/layouts/home-layout";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
