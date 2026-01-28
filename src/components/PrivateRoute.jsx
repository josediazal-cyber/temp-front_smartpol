import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const accessToken = localStorage.getItem("access_token");

  // Si no hay token, redirige al login
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza los hijos (la página)
  return children;
}
