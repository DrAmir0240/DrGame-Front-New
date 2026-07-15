import ExpenseDetailPage from "@/features/admin/accounting/modules/expense-detail";

export default function ExpenseDetail({ params }: { params: { id: string } }) {
  return <ExpenseDetailPage id={Number(params.id)} />;
}
