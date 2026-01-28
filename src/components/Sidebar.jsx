import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-52 h-screen bg-white shadow-md p-6 flex flex-col">
      <h3 className="text-xl font-bold mb-6">SmartPol</h3>
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <Link
              to="/inicio"
              className="block px-4 py-2 rounded-md hover:bg-orange-100 transition-colors"
            >
              Inicio
            </Link>
          </li>
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
