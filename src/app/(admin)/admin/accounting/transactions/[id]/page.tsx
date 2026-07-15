import TransactionDetailPage from "@/features/admin/accounting/modules/transaction-detail";

export default function TransactionDetail({ params }: { params: { id: string } }) {
  return <TransactionDetailPage id={Number(params.id)} />;
}
