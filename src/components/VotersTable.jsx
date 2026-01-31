import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function VotersTable({ voters, filters, loading }) {
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  const sortedVoters = [...voters].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    if (voters.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const exportData = voters.map((voter) => ({
      ID: voter.id,
      Nombre: voter.firstName,
      Apellido: voter.lastName,
      Identificación: voter.identification,
      Género:
        voter.gender === "M"
          ? "Masculino"
          : voter.gender === "F"
            ? "Femenino"
            : "Otro",
      Teléfono: voter.phone,
      Email: voter.email,
      Departamento: voter.department?.name || "N/A",
      Municipio: voter.municipality?.name || "N/A",
      Barrio: voter.neighborhood,
      "Lugar de Votación": voter.votingLocation,
      Casilla: voter.votingBooth,
      Candidatos:
        voter.candidates
          ?.map((c) => `${c.name} (${c.corporation?.name})`)
          .join("; ") || "N/A",
      Líderes: voter.leaders?.map((l) => l.name).join("; ") || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Votantes");

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 8 }, // ID
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido
      { wch: 15 }, // Identificación
      { wch: 12 }, // Género
      { wch: 15 }, // Teléfono
      { wch: 25 }, // Email
      { wch: 18 }, // Departamento
      { wch: 18 }, // Municipio
      { wch: 15 }, // Barrio
      { wch: 20 }, // Lugar de Votación
      { wch: 10 }, // Casilla
      { wch: 30 }, // Candidatos
      { wch: 20 }, // Líderes
    ];
    worksheet["!cols"] = columnWidths;

    const fileName = `Informe_Votantes_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <span className="text-gray-400">⇅</span>;
    return sortConfig.direction === "asc" ? <span>▲</span> : <span>▼</span>;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">Cargando votantes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Votantes Registrados ({voters.length})
        </h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>📊</span> Exportar a Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("id")}
              >
                ID <SortIcon column="id" />
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("firstName")}
              >
                Nombre <SortIcon column="firstName" />
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("lastName")}
              >
                Apellido <SortIcon column="lastName" />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Identificación
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Género
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Departamento
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Municipio
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Lugar de Votación
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Candidatos
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Líderes
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVoters.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No hay votantes registrados con los filtros aplicados
                </td>
              </tr>
            ) : (
              sortedVoters.map((voter, idx) => (
                <tr
                  key={voter.id}
                  className={`border-b border-gray-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-3 text-gray-700">{voter.id}</td>
                  <td className="px-4 py-3 text-gray-700">{voter.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{voter.lastName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">
                    {voter.identification}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {voter.gender === "M"
                      ? "Masculino"
                      : voter.gender === "F"
                        ? "Femenino"
                        : "Otro"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{voter.phone}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {voter.department?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {voter.municipality?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">
                    {voter.votingLocation}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {voter.candidates && voter.candidates.length > 0 ? (
                        voter.candidates.map((candidate) => (
                          <span
                            key={candidate.id}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                            title={candidate.corporation?.name}
                          >
                            {candidate.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {voter.leaders && voter.leaders.length > 0 ? (
                        voter.leaders.map((leader) => (
                          <span
                            key={leader.id}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                          >
                            {leader.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
