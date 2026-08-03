import TicketDetailPage from "@/features/customer/support/support-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TicketDetailPage id={Number(id)} />;
}