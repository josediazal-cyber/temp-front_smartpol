import { API_URL } from "./config";

export async function getVoterReport(filters = {}) {
  const params = new URLSearchParams();
  
  // Agregar parámetros por defecto para paginación
  params.append("page", filters.page || 1);
  params.append("limit", filters.limit || 50);
  
  // Agregar filtros solo si tienen valor
  if (filters.gender) params.append("gender", filters.gender);
  if (filters.leaderId) params.append("leaderId", filters.leaderId);
  if (filters.corporationId) params.append("corporationId", filters.corporationId);
  if (filters.candidateId) params.append("candidateId", filters.candidateId);
  if (filters.departmentId) params.append("departmentId", filters.departmentId);
  if (filters.municipalityId) params.append("municipalityId", filters.municipalityId);
  if (filters.votingLocation) params.append("votingLocation", filters.votingLocation);

  const url = `${API_URL}/voters/report/general?${params.toString()}`;
  console.log("Fetching:", url); // Para debug
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(`Error al obtener reporte de votantes: ${response.status}`);
  }
  return response.json();
}
