import SalesDetailPage from "@/features/admin/accounting/modules/sales-detail";

export default function SalesDetail({ params }: { params: { id: string } }) {
  return <SalesDetailPage id={Number(params.id)} />;
}
