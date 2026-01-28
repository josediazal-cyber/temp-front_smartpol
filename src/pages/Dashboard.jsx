import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("user_email"); // guardamos al loguear

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // redirige al login
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar email={email} onLogout={handleLogout} />
        <div style={{ flex: 1, overflow: "auto" }}>
          <Outlet /> {/* Aquí se renderizan Inicio o Personas */}
        </div>
      </div>
    </div>
  );
}
