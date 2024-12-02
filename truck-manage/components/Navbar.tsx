import Link from "next/link";
import { useRouter } from "next/router";
import "./scss/navbar.scss";

export default function Navbar() {
  const router = useRouter();
  const activeLink = router.pathname; 

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className={`navbar-item ${activeLink === "/dashboard" ? "active" : ""}`}>
          <Link href="/dashboard">
            <a className="navbar-link">
              <i className="icon-dashboard"></i> Dashboard
            </a>
          </Link>
        </li>
        <li className={`navbar-item ${activeLink === "/trucks" ? "active" : ""}`}>
          <Link href="/trucks">
            <a className="navbar-link">
              <i className="icon-trucks"></i> Trucks
            </a>
          </Link>
        </li>
        <li className={`navbar-item ${activeLink === "/drivers" ? "active" : ""}`}>
          <Link href="/drivers">
            <a className="navbar-link">
              <i className="icon-drivers"></i> Drivers
            </a>
          </Link>
        </li>
        <li className={`navbar-item ${activeLink === "/orders" ? "active" : ""}`}>
          <Link href="/orders">
            <a className="navbar-link">
              <i className="icon-orders"></i> Orders
            </a>
          </Link>
        </li>
      </ul>
      <div className="sign-out">
        <Link href="/home">
          <a className="navbar-link">
            <i className="icon-signout"></i> Sign Out
          </a>
        </Link>
      </div>
    </nav>
  );
}
