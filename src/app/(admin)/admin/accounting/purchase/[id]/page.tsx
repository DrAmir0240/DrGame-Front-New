import PurchaseDetailPage from "@/features/admin/accounting/modules/purchase-detail";

export default function PurchaseDetail({ params }: { params: { id: string } }) {
  return <PurchaseDetailPage id={Number(params.id)} />;
}
