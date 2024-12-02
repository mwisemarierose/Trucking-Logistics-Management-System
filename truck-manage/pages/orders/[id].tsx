import { useQuery } from "react-query";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Link from "next/link";
import Dashboard from "@/app/dashboard/page";
import "./scss/id.scss";

const fetchOrderById = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export default function ViewOrder() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery(["orders", id], () => fetchOrderById(id as string), {
    enabled: !!id,
  });

  if (isLoading) return <p>Loading order details...</p>;
  if (error || !orders) return <p>Error loading order details</p>;

  return (
    <Dashboard>
      <div className="truck-details">
        <h1 className="title">Order Details</h1>
        <p>
          <strong>Name:</strong> {orders.customer_name}
        </p>
        <p>
          <strong>Assigned Truck:</strong> {orders.assigned_truck}
        </p>
        <p>
          <strong>Assigned Driver:</strong> {orders.assigned_driver}
        </p>
        <p>
          <strong>Order status:</strong> {orders.order_status}
        </p>

        <div className="actions">
          <Link href={`/orders/${id}/edit`} className="btn edit">
            Edit
          </Link>
          <Link href="/orders" className="btn back">
            Back
          </Link>
        </div>
      </div>
    </Dashboard>
  );
}
