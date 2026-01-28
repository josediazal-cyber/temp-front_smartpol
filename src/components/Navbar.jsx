export default function Navbar({ email, onLogout }) {
  return (
    <div className="h-16 bg-white shadow-md flex justify-between items-center px-6">
      <span className="text-gray-700 font-medium">{email}</span>
      <button
        onClick={onLogout}
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
