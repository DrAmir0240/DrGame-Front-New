import IncomeDetailPage from "@/features/admin/accounting/modules/income-detail";

export default function IncomeDetail({ params }: { params: { id: string } }) {
  return <IncomeDetailPage id={Number(params.id)} />;
}
