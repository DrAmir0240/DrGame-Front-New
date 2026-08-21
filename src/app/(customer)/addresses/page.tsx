import { PageHeader } from "@/components/shared";
import { AddressSection } from "@/features/customer/addresses";

export default function Addresses() {
  return (
    <div className="space-y-6">
      <PageHeader title="آدرس‌ها" description="مدیریت آدرس‌های پستی شما" />
      <AddressSection />
    </div>
  );
}
