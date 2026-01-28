import { useState, useRef, useEffect } from "react";

export default function Navbar({ email, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar el dropdown si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-white shadow-md flex justify-end items-center px-6 relative">
      {/* Botón para abrir el dropdown */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
      >
        <span className="text-gray-700 font-bold">{email}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-6 top-16 bg-white shadow-lg rounded-md w-48 py-2 z-50"
        >
          {/* Correo en negritas */}
          <p className="px-4 py-2 text-gray-700 font-bold truncate">{email}</p>
          {/* Botón Cerrar sesión naranja */}
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors mt-1"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
