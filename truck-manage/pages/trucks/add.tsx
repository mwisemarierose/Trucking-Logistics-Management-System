import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Dashboard from "@/app/dashboard/page";
import "./scss/add.scss";

export default function AddTruck() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation(
    (newTruck: { plate_number: string; capacity: string; status: string }) =>
      api.post("/trucks", newTruck),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("trucks");
        router.push("/trucks");
      },
      onError: () => {
        alert("Failed to add the truck. Please try again.");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const truck = {
      plate_number: formData.get("plate_number") as string,
      capacity: formData.get("capacity") as string,
      status: "Available",
    };
    mutation.mutate(truck);
  };

  return (
    <Dashboard>
      <div className="container">
        <h1 className="title">Add New Truck</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="plate_number">Plate Number</label>
            <input
              type="text"
              id="plate_number"
              name="plate_number"
              required
              pattern="[A-Za-z0-9-]+"
              title="Only letters, numbers, and hyphens are allowed"
              placeholder="e.g., ABC-1234"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity (in tons)</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              required
              min="1"
              placeholder="e.g., 10"
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Adding Truck..." : "Add Truck"}
          </button>
        </form>

        {mutation.isError && (
          <div className="error-message">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </Dashboard>
  );
}
