import { useState } from "react";
import "../build/css/AdminDashboard.css";
import CreateTrip from "./CreateTrip";
import { useNavigate } from "react-router";
import Reservations from './Resrvations';
import Dashboard from "./Dashboard";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard"); 
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Menu</h2>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => setCurrentView("dashboard")}>
            Dashboard
          </li>
          <li className="menu-item" onClick={() => setCurrentView("reservations")}>
          Reservations
          </li>
          <li className="menu-item" onClick={() => setCurrentView("createTrip")}>
            Create Trip
          </li>
          <li className="menu-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>
      <main className="dashboard-content">
      
        {currentView === "dashboard" && (
          <div>
            
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p>Welcome to the Admin Panel. Select an option from the menu.</p>
            
          </div>
          
        )}
        {currentView === "reservations" && <Reservations />}
        {currentView === "users" && (
          <div>
            <h1>Users Management</h1>
            <p>Manage your users here.</p>
          </div>
        )}
        {currentView === "createTrip" && <CreateTrip />}
        {currentView === "login" && (
          <div>
            <h1>Logging out...</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
