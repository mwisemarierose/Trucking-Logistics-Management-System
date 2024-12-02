import { useQuery } from "react-query";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Link from "next/link";
import Dashboard from "@/app/dashboard/page";
import "./scss/id.scss";

const fetchTruckById = async (id: string) => {
  const { data } = await api.get(`/trucks/${id}`);
  return data;
};

export default function ViewTruck() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: truck,
    isLoading,
    error,
  } = useQuery(["truck", id], () => fetchTruckById(id as string), {
    enabled: !!id,
  });

  if (isLoading) return <p>Loading truck details...</p>;
  if (error || !truck) return <p>Error loading truck details</p>;

  return (
    <Dashboard>
      <div className="container">
        <h1 className="title">Truck Details</h1>
        <p>
          <span className="text-bold">Plate Number:</span> {truck.plate_number}
        </p>
        <p>
          <span className="text-bold">Capacity:</span> {truck.capacity} tons
        </p>
        <p>
          <span className="text-bold">Status:</span> {truck.status}
        </p>

        <div className="button-group">
          <Link href={`/trucks/${id}/edit`} className="btn edit">
            Edit
          </Link>
          <Link href="/trucks" className="btn back">
            Back
          </Link>
        </div>
      </div>
    </Dashboard>
  );
}
