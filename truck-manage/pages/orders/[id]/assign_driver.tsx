import { useRouter } from "next/router";
import AssignDriverToOrder from "@/components/AssignDriver";

export default function AssignDriverPage() {
  const { query } = useRouter();
  const { id } = query;

  if (!id) return <p>Loading...</p>;

  return <AssignDriverToOrder orderId={id as string} />;
}
