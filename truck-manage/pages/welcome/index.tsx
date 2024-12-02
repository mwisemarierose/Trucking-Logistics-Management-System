"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Dashboard from "@/app/dashboard/page";
import  "./index.scss";

const Welcome = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="welcome-page">
        <div className="welcome-message">
          <h1>Welcome to Trucking Logistics Management System</h1>
          <p>
            Streamline your logistics operations, manage trucks, drivers, and orders efficiently. 
            Please log in to access your dashboard.
          </p>
        </div>
        <div className="login-message">
          <p>You are not signed in. Please log in.</p>
          <a href="/login">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <Dashboard>
      <div className="welcome-page">
        <div className="welcome-message">
          <h2>Welcome, {session.user?.name}</h2>
          <p>{session.user?.email}</p>
        </div>
      </div>
    </Dashboard>
  );
};

export default Welcome;
