import React from "react";

export default function AggregationCounters({ aggregations, onCounterClick }) {
  if (!aggregations) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Resumen de Información
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Contadores por Género */}
        {aggregations.byGender && (
          <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">
              Por Género
            </h3>
            <div className="space-y-2">
              {aggregations.byGender.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onCounterClick("gender", item.gender)}
                  className="w-full text-left p-2 rounded hover:bg-blue-200 transition flex justify-between items-center"
                >
                  <span className="text-sm">
                    {item.gender || "No especificado"}
                  </span>
                  <span className="font-semibold text-blue-700">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contadores por Líder */}
        {aggregations.byLeader && (
          <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">
              Por Líder
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {aggregations.byLeader.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onCounterClick("leaderId", item.id)}
                  className="w-full text-left p-2 rounded hover:bg-green-200 transition flex justify-between items-center"
                  title={item.name}
                >
                  <span className="text-sm truncate">{item.name}</span>
                  <span className="font-semibold text-green-700">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contadores por Candidato */}
        {aggregations.byCandidate && (
          <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">
              Por Candidato
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {aggregations.byCandidate.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onCounterClick("candidateId", item.id)}
                  className="w-full text-left p-2 rounded hover:bg-purple-200 transition flex justify-between items-center"
                  title={`${item.name} (${item.corporationName})`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs truncate">{item.name}</span>
                    <span className="text-xs text-gray-600">
                      {item.corporationName}
                    </span>
                  </div>
                  <span className="font-semibold text-purple-700">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contadores por Ubicación */}
        {aggregations.byLocation && (
          <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">
              Por Ubicación
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {aggregations.byLocation.map((item) => (
                <button
                  key={`${item.departmentId}-${item.municipalityId}`}
                  onClick={() =>
                    onCounterClick("location", {
                      departmentId: item.departmentId,
                      municipalityId: item.municipalityId,
                    })
                  }
                  className="w-full text-left p-2 rounded hover:bg-orange-200 transition flex justify-between items-center"
                  title={`${item.departmentName} - ${item.municipalityName}`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs truncate">
                      {item.departmentName}
                    </span>
                    <span className="text-xs text-gray-600 truncate">
                      {item.municipalityName}
                    </span>
                  </div>
                  <span className="font-semibold text-orange-700">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
