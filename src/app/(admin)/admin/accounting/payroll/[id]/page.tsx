import PayrollDetailPage from "@/features/admin/accounting/modules/payroll-detail";

export default function PayrollDetail({ params }: { params: { id: string } }) {
  return <PayrollDetailPage id={Number(params.id)} />;
}
