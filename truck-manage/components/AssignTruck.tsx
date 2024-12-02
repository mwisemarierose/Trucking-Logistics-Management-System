import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../utils/api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Dashboard from "@/app/dashboard/page";
import "./scss/assignTruck.scss";

const fetchTrucks = async () => {
  const { data } = await api.get("/trucks");
  return data || [];
};

const assignTruck = async ({ driverId, truckName }: { driverId: string; truckName: string }) => {
  console.log("Assigning truck:", { driverId, truckName });
  const { data: existingDriver } = await api.get(`/drivers/${driverId}`);
  const updatedDriver = {
    ...existingDriver,
    assigned_truck: truckName,
  };
  await api.put(`/drivers/${driverId}`, updatedDriver);
};

export default function AssignTruck({ driverId }: { driverId: string }) {
  const { data: trucks, isLoading, error } = useQuery("trucks", fetchTrucks);
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation(assignTruck, {
    onSuccess: () => {
      queryClient.invalidateQueries("drivers");
      router.push("/drivers");
    },
    onError: (error: any) => {
      console.error("Error assigning truck:", error);
      alert("Failed to assign truck. Please try again.");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({ driverId, truckName: data.truckName });
  };

  if (isLoading) return <p>Loading trucks...</p>;
  if (error) return <p>Error loading trucks</p>;

  return (
    <Dashboard>
      <div className="assign-truck-container">
        <h1 className="assign-truck-title">Assign Truck</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="assign-truck-form">
          <select
            {...register("truckName", { required: true })}
            className="assign-truck-select"
          >
            <option value="">Select Truck</option>
            {trucks
            .filter((truck: any) => truck.status === "Available")
            .map((truck: any) => (
              <option key={truck.id} value={truck.plate_number}>
                {truck.plate_number}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`assign-truck-button ${mutation.isLoading ? "assign-truck-button-disabled" : ""}`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Assigning..." : "Assign"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}