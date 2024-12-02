import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../../utils/api";
import Link from "next/link";
import Dashboard from "@/app/dashboard/page";
import DataTable from "@/components/Table";
import "./scss/index.scss"; 

const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data || [];
};

// Mutation to delete an order
const deleteOrder = async (id: string) => {
  await api.delete(`/orders/${id}`);
};

// Mutation to complete an order (not delete)
const completeOrder = async (id: string) => {
  // Complete the order first
  await api.patch(`/orders/${id}`, { order_status: "Completed" });
};

export default function Orders() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching } = useQuery("orders", fetchOrders);

  // Mutation for deleting an order
  const mutationDelete = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
    },
    onError: () => {
      alert("Failed to delete Order. Please try again.");
    },
  });

  // Mutation for completing an order
  const mutationComplete = useMutation(completeOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
    },
    onError: () => {
      alert("Failed to complete the order. Please try again.");
    },
  });

  // Handle delete order
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Order?")) {
      mutationDelete.mutate(id);
    }
  };

  // Handle complete order
  const handleComplete = (id: string) => {
    if (confirm("Are you sure you want to complete this order?")) {
      mutationComplete.mutate(id);
    }
  };

  const columns = [
    {
      Header: "Order ID",
      accessor: "id",
    },
    {
      Header: "Customer Name",
      accessor: "customer_name",
    },
    {
      Header: "Assigned Truck",
      accessor: "assigned_truck",
      Cell: ({ value }: any) => (value ? value : "No truck assigned"),
    },
    {
      Header: "Assigned Driver",
      accessor: "assigned_driver",
      Cell: ({ value }: any) => (value ? value : "No driver assigned"),
    },
    {
      Header: "Status",
      accessor: "order_status",
      Cell: ({ value }: any) => {
        let statusClass = "";
        
        if (value === "Pending") {
          statusClass = "pending";
        } else if (value === "Delivering") {
          statusClass = "delivering";
        } else if (value === "Completed") {
          statusClass = "completed";
        }
  
        return <span className={statusClass}>{value}</span>;
      },
    },
    {
      Header: "Action",
      accessor: "",
      Cell: ({ row }: any) => (
        <div className="actions">
          <Link href={`/orders/${row.original.id}`} className="view">
            View
          </Link>
          <Link href={`/orders/${row.original.id}/edit`} className="edit">
            Edit
          </Link>
          <Link href={`/orders/${row.original.id}/assign_driver`} className="driver">
            Assign Driver
          </Link>
          <button
            onClick={() => handleComplete(row.original.id)} // Call handleComplete with the order ID
            className={`truck ${mutationComplete.isLoading ? "disabled" : ""}`}
            disabled={mutationComplete.isLoading}
          >
            {mutationComplete.isLoading ? "Completing..." : "Complete Order"}
          </button>
          <button
            onClick={() => handleDelete(row.original.id)} // Delete order
            className={`delete ${mutationDelete.isLoading ? "disabled" : ""}`}
            disabled={mutationDelete.isLoading}
          >
            {mutationDelete.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  if (isLoading || isFetching) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <Dashboard>
      <div className="orders-page">
        <div className="add-order-button">
          <Link href="/orders/add">Add Order</Link>
        </div>
        <DataTable
          data={data}
          columns={columns}
          title="Orders Management"
          placeholder="Search orders..."
        />
      </div>
    </Dashboard>
  );
}
