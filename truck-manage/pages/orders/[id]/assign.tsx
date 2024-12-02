import { useRouter } from "next/router";
import AssignTruckToOrder from "@/components/AssignTruckOrder";

export default function AssignTruckToOrderPage() {
  const { query } = useRouter();
  const { id } = query;

  if (!id) return <p>Loading...</p>;

  return <AssignTruckToOrder orderId={id as string} />;
}
