"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  ClipboardDocumentIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import "./page.scss";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const menuItems = [
    { name: "Home", path: "/home", icon: HomeIcon },
    { name: "Trucks", path: "/trucks", icon: TruckIcon },
    { name: "Drivers", path: "/drivers", icon: UserGroupIcon },
    { name: "Orders", path: "/orders", icon: ClipboardDocumentIcon },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div 
        className={`dashboard__sidebar ${
          isSidebarOpen ? "dashboard__sidebar--open" : ""
        }`}
      >
        <div className="dashboard__sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="dashboard__sidebar-nav">
          <ul>
            {menuItems.map(({ name, path, icon: Icon }) => (
              <li key={path} className="dashboard__sidebar-nav-item">
                <Link
                  href={path}
                  className={
                    pathname === path 
                      ? "dashboard__sidebar-nav-item-link dashboard__sidebar-nav-item-link--active"
                      : "dashboard__sidebar-nav-item-link"
                  }
                >
                  <Icon />
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() => signOut()}
            className="dashboard__sidebar-nav-logout"
          >
            <ArrowLeftCircleIcon />
            Sign out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard__content">
        <div className="dashboard__content-header">
          {/* Mobile Menu Button */}
          <button
            className="dashboard__content-header-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.75h16.5m-16.5 6.5h16.5m-16.5 6.5h16.5"
              />
            </svg>
          </button>
          <h1 className="dashboard__content-header-title">LOGISTIC. MS</h1>
        </div>

        {/* Page Content */}
        <div className="dashboard__content-page">{children}</div>
      </div>
    </div>
  );
}