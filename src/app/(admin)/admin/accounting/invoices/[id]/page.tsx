import InvoiceDetailPage from "@/features/admin/accounting/modules/invoice-detail";

export default function InvoiceDetail({ params }: { params: { id: string } }) {
  return <InvoiceDetailPage id={Number(params.id)} />;
}
