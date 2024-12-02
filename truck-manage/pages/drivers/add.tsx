import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import api from "../../utils/api";
import { useRouter } from "next/router";
import Dashboard from "@/app/dashboard/page";
import "./scss/add.scss";

const saveDriver = async (driverData: any) => {
  // Add new driver
  await api.post("/drivers", driverData);
};

export default function DriverForm({ driver }: { driver?: any }) {
  const { register, handleSubmit } = useForm({ defaultValues: driver || {} });
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation(saveDriver, {
    onSuccess: () => {
      queryClient.invalidateQueries("drivers");
      router.push("/drivers");
    },
    onError: () => {
      alert("Failed to save driver. Please try again.");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  return (
    <Dashboard>
      <div className="container">
        <h1 className="title">Add Driver</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: true })}
              className="block w-full border p-2 rounded"
            />
          </div>
          <div className="form-group">
            <label htmlFor="license_number">License Number</label>
            <input
              type="text"
              placeholder="License Number"
              {...register("license_number", { required: true })}
              className="block w-full border p-2 rounded"
            />
          </div>
          <div className="form-group">
          <label htmlFor="contact_number">Contact Number</label>
          <input
            type="text"
            placeholder="Contact Number"
            {...register("contact_number", { required: true })}
            className="block w-full border p-2 rounded"
          />
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </Dashboard>
  );
}
