import { useState, useEffect } from "react";
import { getVoters, deleteVoter } from "../api/voters";
import AddVoterModal from "../components/AddVoterModal";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function Personas() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [search, setSearch] = useState("");

  const fetchVoters = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVoters();
      setVoters(data);
    } catch {
      setError("No se pudieron cargar los votantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleEdit = (voter) => {
    setEditingVoter(voter);
    setShowModal(true);
  };

  const handleDelete = async (voterId) => {
    if (!confirm("¿Estás seguro de eliminar este votante?")) return;
    await deleteVoter(voterId);
    setVoters(voters.filter((v) => v.id !== voterId));
  };

  const filteredVoters = voters.filter((v) => {
    const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
    const identification = v.identification?.toLowerCase() || "";
    return (
      fullName.includes(search.toLowerCase()) ||
      identification.includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Listado de Votantes
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Gestión y control estratégico de personas registradas en la campaña
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVoter(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar votante
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre o identificación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <AddVoterModal
          voter={editingVoter}
          onClose={() => setShowModal(false)}
          onVoterAdded={fetchVoters}
        />
      )}

      {/* Estados */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          Cargando votantes...
        </div>
      )}

      {error && (
        <div className="bg-white p-6 rounded-xl text-red-600">{error}</div>
      )}

      {!loading && !error && filteredVoters.length === 0 && (
        <div className="bg-white p-6 rounded-xl text-gray-500">
          No se encontraron resultados
        </div>
      )}

      {/* ===== DESKTOP ===== */}
      {!loading && !error && filteredVoters.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {[
                    "Nombre",
                    "Identificación",
                    "Correo",
                    "Teléfono",
                    "Ubicación",
                    "Estado",
                    "Acciones",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wide text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredVoters.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {v.firstName} {v.lastName}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {v.identification}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {v.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {v.phone}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {v.votingLocation} - {v.votingBooth}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        {v.politicalStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-gray-400 hover:text-orange-500 transition"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== MOBILE ===== */}
      {!loading && !error && (
        <div className="md:hidden space-y-4">
          {filteredVoters.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              <div className="font-bold text-gray-900 text-lg">
                {v.firstName} {v.lastName}
              </div>

              <div className="text-sm text-gray-700 mt-3 space-y-1">
                <p>
                  <b>ID:</b> {v.identification}
                </p>
                <p>
                  <b>Email:</b> {v.email}
                </p>
                <p>
                  <b>Tel:</b> {v.phone}
                </p>
                <p>
                  <b>Ubicación:</b> {v.votingLocation}
                </p>
              </div>

              <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-semibold">
                {v.politicalStatus}
              </span>

              <div className="flex justify-end gap-5 mt-4">
                <button
                  onClick={() => handleEdit(v)}
                  className="text-gray-400 hover:text-orange-500 transition"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
