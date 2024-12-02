import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../../utils/api";
import Link from "next/link";
import Dashboard from "@/app/dashboard/page";
import DataTable from "@/components/Table";
import "./scss/index.scss";

const fetchDrivers = async () => {
  const { data } = await api.get("/drivers");
  console.log(data);
  return data || [];
};

const deleteDriver = async (id: string) => {
  await api.delete(`/drivers/${id}`);
};

export default function DriverManagement() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching } = useQuery("drivers", fetchDrivers);

  const mutation = useMutation(deleteDriver, {
    onSuccess: () => {
      queryClient.invalidateQueries("drivers");
    },
    onError: () => {
      alert("Failed to delete driver. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      mutation.mutate(id);
    }
  };

  const columns = [
    {
      Header: "Driver ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "License Num",
      accessor: "license_number",
    },
    {
      Header: "Assigned Truck",
      accessor: "assigned_truck",
    },
    {
      Header: "Contact Num",
      accessor: "contact_number",
    },
    {
      Header: "Action",
      accessor: "",
      Cell: ({ row }: any) => (
        <div className="actions">
          <Link href={`/drivers/${row.original.id}`} className="view">
            View
          </Link>
          <Link href={`/drivers/${row.original.id}/edit`} className="edit">
            Edit
          </Link>
          <Link href={`/drivers/${row.original.id}/assign`} className="assign">
            Assign
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            className={`delete ${mutation.isLoading ? "loading" : ""}`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  if (isLoading || isFetching) return <p>Loading drivers...</p>;
  if (error) return <p>Error loading drivers.</p>;

  return (
    <Dashboard>
      <div className="driver-management">
        <div className="add-button-container">
          <Link href="/drivers/add" className="add-button">
            Add Driver
          </Link>
        </div>
        <DataTable
          data={data}
          columns={columns}
          title="Driver Management"
          placeholder="Search drivers..."
        />
      </div>
    </Dashboard>
  );
}
