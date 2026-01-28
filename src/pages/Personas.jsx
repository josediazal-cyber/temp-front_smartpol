import { useState, useEffect } from "react";
import { getVoters } from "../api/voters";
import AddVoterModal from "../components/AddVoterModal";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Personas() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Listado de Votantes
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Votante
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddVoterModal
          onClose={() => setShowModal(false)}
          onVoterAdded={fetchVoters}
        />
      )}

      {/* Mensajes */}
      {loading && <p className="text-gray-500">Cargando votantes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabla */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-orange-50">
              <tr>
                {[
                  "ID",
                  "Nombre",
                  "Identificación",
                  "Género",
                  "Correo",
                  "Teléfono",
                  "Ubicación de votación",
                  "Estado político",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, idx) => (
                <tr
                  key={voter.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-orange-100 transition-colors`}
                >
                  <td className="px-6 py-3">{voter.id}</td>
                  <td className="px-6 py-3 font-medium">
                    {voter.firstName} {voter.lastName}
                  </td>
                  <td className="px-6 py-3">{voter.identification}</td>
                  <td className="px-6 py-3">{voter.gender}</td>
                  <td className="px-6 py-3">{voter.email}</td>
                  <td className="px-6 py-3">{voter.phone}</td>
                  <td className="px-6 py-3">
                    {voter.votingLocation} - {voter.votingBooth}
                  </td>
                  <td className="px-6 py-3">{voter.politicalStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
