import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../utils/api";
import { useRouter } from "next/router";
import Dashboard from "@/app/dashboard/page";
import "./scss/add.scss";

// Fetch trucks
const fetchTrucks = async () => {
  const { data } = await api.get("/trucks");
  return data;
};

// Fetch drivers
const fetchDrivers = async () => {
  const { data } = await api.get("/drivers");
  return data;
};

// Save order and update truck status
const saveOrderAndUpdateTruck = async (orderData: any, trucks: any[]) => {
  // First save the order
  const orderResponse = await api.post("/orders", orderData);
  
  // If a truck is assigned, find its ID and update status
  if (orderData.assigned_truck) {
    const truck = trucks.find((t: any) => t.plate_number === orderData.assigned_truck);
    if (truck) {
      await api.patch(`/trucks/${truck.id}`, {
        status: "Delivering"
      });
    }
  }
  
  return orderResponse.data;
};

export default function OrdersForm({ order }: { order?: any }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: order || {},
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: trucks = [] } = useQuery("trucks", fetchTrucks);
  const { data: drivers = [] } = useQuery("drivers", fetchDrivers);

  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const mutation = useMutation(
    (orderData: any) => saveOrderAndUpdateTruck(orderData, trucks), 
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
        queryClient.invalidateQueries("trucks"); // Invalidate trucks query to refresh status
        router.push("/orders");
      },
      onError: () => {
        alert("Failed to save order. Please try again.");
      },
    }
  );

  const selectedTruck = watch("assigned_truck");

  // Filter drivers based on the selected truck
  useEffect(() => {
    if (selectedTruck) {
      const associatedDrivers = drivers.filter(
        (driver: { assigned_truck: any; }) => driver.assigned_truck === selectedTruck
      );
      setFilteredDrivers(associatedDrivers);
      setValue("assigned_driver", ""); // Reset assigned_driver selection if the truck changes
    } else {
      setFilteredDrivers([]);
    }
  }, [selectedTruck, drivers, setValue]);

  const onSubmit = (data: any) => {
    // Dynamically set order status
    const order_status = 
      data.assigned_truck && data.assigned_driver ? "Delivering" : "Pending";
    
    mutation.mutate({ ...data, order_status });
  };

  return (
    <Dashboard>
      <div className="orders-form">
        <h1>Add Order</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input
            type="text"
            placeholder="Customer Name"
            {...register("customer_name", { required: true })}
            className="input"
          />
          <select
            {...register("assigned_truck", { required: false })}
            className="input"
          >
            <option value="">Select Assigned Truck</option>
            {trucks
              .filter((truck: any) => truck.status === "Available")
              .map((truck: any) => (
                <option key={truck.plate_number} value={truck.plate_number}>
                  {truck.name} ({truck.plate_number})
                </option>
              ))}
          </select>
          <select
            {...register("assigned_driver", { required: false })}
            className="input"
            disabled={filteredDrivers.length === 0}
          >
            <option value="">Select Assigned Driver</option>
            {filteredDrivers.map((driver: any) => (
              <option key={driver.id} value={driver.name}>
                {driver.name} - {driver.contact_number} (License:{" "}
                {driver.license_number})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="submit-button"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}