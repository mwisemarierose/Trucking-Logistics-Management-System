import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import api from "../utils/api";
import Dashboard from "@/app/dashboard/page";
import "./scss/assignDriver.scss";

// Define interfaces for our resources
interface Truck {
  id: string;
  plate_number: string;
  status: string;
}

interface Driver {
  id: string;
  name: string;
  assigned_truck?: string; // Associated truck plate number
}

interface Order {
  id: string;
  assigned_truck?: string;
  assigned_driver?: string;
  order_status: string;
}

interface AvailableResources {
  trucks: Truck[];
  drivers: Driver[];
}

// Fetch available trucks and drivers
const fetchAvailableResources = async (): Promise<AvailableResources> => {
  const [trucksResponse, driversResponse, ordersResponse] = await Promise.all([
    api.get("/trucks"),
    api.get("/drivers"),
    api.get("/orders")
  ]);

  const trucks = trucksResponse.data || [];
  const drivers = driversResponse.data || [];
  const orders = ordersResponse.data || [];

  // Filter drivers:
  // 1. Must have an available truck
  // 2. Not currently assigned to a delivering order
  const availableDrivers = drivers.filter((driver: Driver) => {
    // Find the driver's truck
    const driverTruck = trucks.find((truck: Truck) => truck.plate_number === driver.assigned_truck);
    
    // Check if truck is available
    const truckAvailable = driverTruck && driverTruck.status === 'Available';
    
    // Check if driver is not in an active order
    const notInActiveOrder = !orders.some((order: Order) => 
      order.assigned_driver === driver.id && 
      (order.order_status=== "Delivering" || order.order_status === "Progress")
    );

    return truckAvailable && notInActiveOrder;
  });

  return {
    trucks: trucks,
    drivers: availableDrivers
  };
};

// Define form input types
interface AssignDriverFormInputs {
  driverId: string;
}

// Assign driver to order
const assignDriverToOrder = async ({ 
  orderId, 
  driverId 
}: { 
  orderId: string, 
  driverId: string 
}) => {
  // Fetch driver details to get associated truck
  const { data: driver } = await api.get(`/drivers/${driverId}`);
  
  // Fetch existing order
  const { data: existingOrder } = await api.get(`/orders/${orderId}`);
  
  // Update order with driver and truck details
  const updatedOrder = {
    ...existingOrder,
    assigned_driver: driver.name,
    assigned_truck: driver.assigned_truck,
    order_status: "Delivering"
  };

  const { data: trucks } = await api.get('/trucks');
  const truck = trucks.find((t: Truck) => t.plate_number === driver.assigned_truck);
  // Update order
  await api.put(`/orders/${orderId}`, updatedOrder);
  // Update truck status
  await api.patch(`/trucks/${truck.id}`, { 
    status: "Delivering" 
  });
};

export default function AssignDriverToOrder({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<AssignDriverFormInputs>();

  // Fetch available resources
  const { 
    data: resources, 
    isLoading: resourcesLoading, 
    error: resourcesError 
  } = useQuery<AvailableResources>("availableResources", fetchAvailableResources);

  // Mutation for assigning driver
  const assignDriverMutation = useMutation(assignDriverToOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", "trucks", "drivers"]);
      router.push("/orders");
    },
    onError: (error: any) => {
        console.log(error);
      console.error("Error assigning driver to order:", error);
      alert("Failed to assign driver to order. Please try again.");
    }
  });

  // Submit handler for driver assignment
  const onSubmitAssignDriver = (data: AssignDriverFormInputs) => {
    assignDriverMutation.mutate({
      orderId,
      driverId: data.driverId
    });
  };


  // Loading and error states
  if (resourcesLoading) return <p>Loading available resources...</p>;
  if (resourcesError) return <p>Error loading available resources</p>;

  return (
    <Dashboard>
      <div className="assign-driver-container">
        <h1 className="assign-driver-title">Assign Driver to Order</h1>
        
        <form 
          onSubmit={handleSubmit(onSubmitAssignDriver)} 
          className="assign-driver-form"
        >
          {/* Driver Selection */}
          <div className="form-group">
            <label htmlFor="driverId">Select Driver</label>
            <select
              {...register("driverId", { 
                required: "Driver is required",
                validate: (value) => {
                  // Ensure resources is defined and driver exists
                  if (!resources || resources.drivers.length === 0) {
                    return "No drivers available";
                  }
                  const driverExists = resources.drivers.some(
                    (driver) => driver.id === value
                  );
                  return driverExists || "Selected driver is not available";
                }
              })}
              className="assign-driver-select"
            >
              <option value="">Select Available Driver</option>
              {resources?.drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} (Truck: {driver.assigned_truck})
                </option>
              ))}
            </select>
            {errors.driverId && (
              <p className="error-message">
                {errors.driverId.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`assign-driver-button ${
              assignDriverMutation.isLoading ? "assign-driver-button-disabled" : ""
            }`}
            disabled={assignDriverMutation.isLoading}
          >
            {assignDriverMutation.isLoading ? "Assigning..." : "Assign Driver"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}