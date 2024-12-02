import { useQuery } from "react-query";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Link from "next/link";
import Dashboard from "@/app/dashboard/page";
import "./scss/id.scss";

const fetchDriverById = async (id: string) => {
  const { data } = await api.get(`/drivers/${id}`);
  return data;
};

export default function ViewTruck() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: drivers,
    isLoading,
    error,
  } = useQuery(["drivers", id], () => fetchDriverById(id as string), {
    enabled: !!id,
  });

  if (isLoading) return <p>Loading driver details...</p>;
  if (error || !drivers) return <p>Error loading driver details</p>;

  return (
    <Dashboard>
      <div className="truck-details">
        <h1 className="title">Drivers Details</h1>
        <p>
          <strong>Name:</strong> {drivers.name}
        </p>
        <p>
          <strong>License Number:</strong> {drivers.license_number} tons
        </p>
        <p>
          <strong>Assigned Truck:</strong> {drivers.assigned_truck}
        </p>
        <p>
          <strong>Contact Number:</strong> {drivers.contact_number}
        </p>

        <div className="actions">
          <Link href={`/drivers/${id}/edit`} className="btn edit">
            Edit
          </Link>
          <Link href="/drivers" className="btn back">
            Back
          </Link>
        </div>
      </div>
    </Dashboard>
  );
}
