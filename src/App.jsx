import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/Inicio";
import Personas from "./pages/Personas";
import Reportes from "./pages/Reportes";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas dentro de Dashboard */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="inicio" element={<Inicio />} />
          <Route path="personas" element={<Personas />} />
          <Route path="reportes" element={<Reportes />} />
          {/* Ruta por defecto dentro de Dashboard */}
          <Route index element={<Navigate to="inicio" replace />} />
        </Route>

        {/* Redirigir cualquier otra ruta a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
