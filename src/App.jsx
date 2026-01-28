import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/Inicio";
import Personas from "./pages/Personas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Dashboard />}>
          <Route path="inicio" element={<Inicio />} />
          <Route path="personas" element={<Personas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
