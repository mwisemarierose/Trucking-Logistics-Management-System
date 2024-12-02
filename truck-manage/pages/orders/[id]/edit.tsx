import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import Dashboard from "@/app/dashboard/page";
import "../scss/edit.scss";

// Fetch order by ID from the API
const fetchOrderById = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export default function EditOrder() {
  const router = useRouter();
  const { id } = router.query; // Get the order ID from the URL
  const queryClient = useQueryClient();

  // Fetch order details using react-query
  const {
    data: order,
    isLoading,
    error,
  } = useQuery(["orders", id], () => fetchOrderById(id as string), {
    enabled: !!id, // Only run the query if 'id' is available
  });

  // Mutation to update the order's details
  const mutation = useMutation(
    async (updatedCustomerName: string) => {
      // Fetch the current order details
      const currentOrder = await fetchOrderById(id as string);

      // Merge the updated customer_name with the existing fields
      const updatedOrder = {
        ...currentOrder,
        customer_name: updatedCustomerName,
      };

      // Send the full updated object back to the API
      return api.put(`/orders/${id}`, updatedOrder);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
        router.push("/orders");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extract the updated customer_name from the form
    const updatedCustomerName = formData.get("customer_name") as string;

    // Call the mutation to update the customer name
    mutation.mutate(updatedCustomerName);
  };

  // Loading and error handling
  if (isLoading) return <p>Loading order details...</p>;
  if (error || !order) return <p>Error loading order details</p>;

  return (
    <Dashboard>
      <div className="container">
        <h1 className="title">Edit Customer Name</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="customer_name">
              Customer Name:
            </label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
              className="form-input"
              defaultValue={order.customer_name}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update Customer Name"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}
