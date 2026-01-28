import { Link } from "react-router-dom";
// IMPORTA EL LOGO
import Logo from "../assets/logo.png";

export default function Sidebar() {
  return (
    <div className="w-52 h-screen bg-white shadow-md p-6 flex flex-col">
      {/* Logo arriba */}
      <div className="flex flex-col items-center mb-6">
        <img src={Logo} alt="SmartPol" className="w-24 mb-2" />
        <h3 className="text-xl font-bold">SmartPol</h3>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <Link
              to="/personas"
              className="block px-4 py-2 rounded-md hover:bg-orange-100 transition-colors"
            >
              Personas
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
