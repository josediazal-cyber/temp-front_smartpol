import React, { useState, useEffect } from "react";
import { getVoterReport } from "../api/reports";
import ReportFilters from "../components/ReportFilters";
import AggregationCounters from "../components/AggregationCounters";
import VotersTable from "../components/VotersTable";

export default function Reportes() {
  const [voters, setVoters] = useState([]);
  const [aggregations, setAggregations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    loadReport(filters);
  }, [filters]);

  const loadReport = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVoterReport(currentFilters);
      setVoters(response.data || []);
      setAggregations(response.aggregations || null);
    } catch (error) {
      console.error("Error loading report:", error);
      setError(error.message || "Error al cargar el reporte");
      setVoters([]);
      setAggregations(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setActiveFilters(newFilters);
  };

  const handleCounterClick = (filterType, value) => {
    let newFilters = { ...filters };

    if (filterType === "gender") {
      newFilters.gender = newFilters.gender === value ? "" : value;
    } else if (filterType === "leaderId") {
      newFilters.leaderId = newFilters.leaderId == value ? "" : value;
    } else if (filterType === "candidateId") {
      newFilters.candidateId = newFilters.candidateId == value ? "" : value;
    } else if (filterType === "location") {
      newFilters.departmentId =
        newFilters.departmentId == value.departmentId ? "" : value.departmentId;
      newFilters.municipalityId =
        newFilters.municipalityId == value.municipalityId
          ? ""
          : value.municipalityId;
    }

    setFilters(newFilters);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Informe General de Votantes
        </h1>
        <p className="text-gray-600 mt-2">
          Visualiza, analiza y exporta la información de votantes registrada en
          SMARTPOL
        </p>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error al cargar los datos</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-red-600">
            Verifica que el servidor backend esté ejecutándose en
            http://localhost:3000
          </p>
        </div>
      )}

      {/* Filtros Dinámicos */}
      <ReportFilters
        onFiltersChange={handleFiltersChange}
        aggregations={aggregations}
      />

      {/* Contadores Interactivos */}
      {aggregations && (
        <AggregationCounters
          aggregations={aggregations}
          onCounterClick={handleCounterClick}
        />
      )}

      {/* Tabla de Votantes */}
      <VotersTable voters={voters} filters={activeFilters} loading={loading} />
    </div>
  );
}
