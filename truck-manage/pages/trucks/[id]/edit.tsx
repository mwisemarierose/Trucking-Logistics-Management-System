import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import Dashboard from "@/app/dashboard/page";
import "../scss/edit.scss";

const fetchTruckById = async (id: string) => {
  const { data } = await api.get(`/trucks/${id}`);
  return data;
};

export default function EditTruck() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const {
    data: truck,
    isLoading,
    error,
  } = useQuery(["truck", id], () => fetchTruckById(id as string), {
    enabled: !!id,
  });

  const mutation = useMutation(
    (updatedTruck: {
      plate_number: string;
      capacity: string;
      status: string;
    }) => api.put(`/trucks/${id}`, updatedTruck),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("trucks");
        router.push("/trucks");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedTruck = {
      plate_number: formData.get("plate_number") as string,
      capacity: formData.get("capacity") as string,
      status: truck?.status || "Available",
    };
    mutation.mutate(updatedTruck);
  };

  if (isLoading) return <p>Loading truck details...</p>;
  if (error || !truck) return <p>Error loading truck details</p>;

  return (
    <Dashboard>
      <div className="container">
        <h1 className="title">Edit Truck</h1>
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label className="form-label">Plate Number:</label>
            <input
              type="text"
              name="plate_number"
              defaultValue={truck.plate_number}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Capacity (in tons):</label>
            <input
              type="number"
              name="capacity"
              defaultValue={truck.capacity}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update Truck"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}
