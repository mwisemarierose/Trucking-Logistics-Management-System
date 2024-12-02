import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query"; 
import api from "../../utils/api"; 
import Link from "next/link"; 
import Dashboard from "@/app/dashboard/page"; 
import DataTable from "@/components/Table"; 
import './scss/index.scss'; 

// Fetch trucks
const fetchTrucks = async () => { 
  const { data } = await api.get("/trucks"); 
  return data || []; 
}; 

// Delete truck
const deleteTruck = async (id: string) => { 
  await api.delete(`/trucks/${id}`); 
}; 

// Update truck status
const updateTruckStatus = async ({ id, status }: { id: string; status: string }) => {
  const { data } = await api.patch(`/trucks/${id}`, { status });
  return data;
};

export default function Trucks() { 
  const queryClient = useQueryClient(); 

  // Fetch trucks query
  const { data, isLoading, error, isFetching } = useQuery("trucks", fetchTrucks); 

  // Delete mutation
  const deleteMutation = useMutation(deleteTruck, { 
    onSuccess: () => { 
      queryClient.invalidateQueries("trucks"); 
    }, 
    onError: () => { 
      alert("Failed to delete truck. Please try again."); 
    }, 
  }); 

  // Status update mutation
  const statusMutation = useMutation(updateTruckStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries("trucks");
    },
    onError: () => {
      alert("Failed to update truck status. Please try again.");
    }
  });

  // Handle delete
  const handleDelete = (id: string) => { 
    if (confirm("Are you sure you want to delete this truck?")) { 
      deleteMutation.mutate(id); 
    } 
  }; 

  // Handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  // Columns definition
  const columns = [ 
    { 
      Header: "Plate Number", 
      accessor: "plate_number", 
    }, 
    { 
      Header: "Capacity", 
      accessor: "capacity", 
    }, 
    { 
      Header: "Status", 
      accessor: "status", 
      Cell: ({ row }: any) => ( 
        <select 
          value={row.original.status} 
          className="status-dropdown"
          onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
          disabled={statusMutation.isLoading}
        > 
          <option value="Available">Available</option> 
          <option value="Delivering">Delivering</option> 
          <option value="Maintenance">Maintenance</option> 
        </select> 
      ), 
    }, 
    { 
      Header: "Action", 
      accessor: "", 
      Cell: ({ row }: any) => ( 
        <div className="action-buttons"> 
          <Link href={`/trucks/${row.original.id}`} className="view-link"> 
            View 
          </Link> 
          <Link href={`/trucks/${row.original.id}/edit`} className="edit-link"> 
            Edit 
          </Link> 
          <button 
            onClick={() => handleDelete(row.original.id)} 
            className={`delete-button ${ 
              deleteMutation.isLoading ? "disabled" : "" 
            }`} 
            disabled={deleteMutation.isLoading} 
          > 
            {deleteMutation.isLoading ? "Deleting..." : "Delete"} 
          </button> 
        </div> 
      ), 
    }, 
  ]; 

  // Loading and error states
  if (isLoading || isFetching) return <p>Loading trucks...</p>; 
  if (error) return <p>Error loading trucks</p>; 

  // Render component
  return ( 
    <Dashboard> 
      <div className="page-container"> 
        <div className="header-container"> 
          <Link href="/trucks/add" className="add-truck-btn"> 
            Add Truck 
          </Link> 
        </div> 
        <DataTable 
          data={data} 
          columns={columns} 
          title="Truck Management" 
          placeholder="Search trucks..." 
        /> 
      </div> 
    </Dashboard> 
  ); 
}