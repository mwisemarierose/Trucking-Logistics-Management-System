import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import Dashboard from "@/app/dashboard/page";
import "../scss/edit.scss";

// Fetch driver by ID from the API
const fetchDriverById = async (id: string) => {
  const { data } = await api.get(`/drivers/${id}`);
  console.log(data);
  return data;
};

export default function EditDriver() {
  const router = useRouter();
  const { id } = router.query; // Get the driver ID from the URL
  const queryClient = useQueryClient();

  // Fetch driver details using react-query
  const {
    data: driver,
    isLoading,
    error,
  } = useQuery(["drivers", id], () => fetchDriverById(id as string), {
    enabled: !!id, // Only run the query if 'id' is available
  });

  // Mutation to update driver details
  const mutation = useMutation(
    (updatedDriver: {
      name: string;
      license_number: string;
      assigned_truck: string;
      contact_number: string;
    }) => api.put(`/drivers/${id}`, updatedDriver),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("drivers");
        router.push("/drivers");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Construct updated driver data
    const updatedDriver = {
      name: formData.get("name") as string,
      license_number: formData.get("license_number") as string,
      assigned_truck: formData.get("assigned_truck") as string,
      contact_number: formData.get("contact_number") as string,
    };

    // Call the mutation to update the driver details
    mutation.mutate(updatedDriver);
  };

  // Loading and error handling
  if (isLoading) return <p>Loading driver details...</p>;
  if (error || !driver) return <p>Error loading driver details</p>;

  return (
    <Dashboard>
<div className="container">
  <h1 className="title">Edit Driver</h1>
  <form className="form" onSubmit={handleSubmit}>
    <div>
      <label className="form-label" htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        name="name"
        className="form-input"
        defaultValue={driver.name}
        required
      />
    </div>
    <div>
      <label className="form-label" htmlFor="license_number">License Number:</label>
      <input
        id="license_number"
        type="number"
        name="license_number"
        className="form-input"
        defaultValue={driver.license_number}
        required
      />
    </div>
    <div>
      <label className="form-label" htmlFor="assigned_truck">Assigned Truck:</label>
      <input
        id="assigned_truck"
        type="number"
        name="assigned_truck"
        className="form-input"
        defaultValue={driver.assigned_truck}
      />
    </div>
    <div>
      <label className="form-label" htmlFor="contact_number">Contact Number:</label>
      <input
        id="contact_number"
        type="number"
        name="contact_number"
        className="form-input"
        defaultValue={driver.contact_number}
        required
      />
    </div>
    <button type="submit" className="btn-primary" disabled={mutation.isLoading}>
      {mutation.isLoading ? "Updating..." : "Update Driver"}
    </button>
  </form>
</div>

    </Dashboard>
  );
}
