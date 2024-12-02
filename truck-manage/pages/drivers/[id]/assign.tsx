import { useRouter } from "next/router";
import AssignTruck from "@/components/AssignTruck";

export default function AssignTruckPage() {
  const { query } = useRouter();
  const { id } = query;
  console.log(id);

  if (!id) return <p>Loading...</p>;

  return <AssignTruck driverId={id as string} />;
}
