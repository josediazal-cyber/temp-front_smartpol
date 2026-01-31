import { API_URL } from "./config";

export async function getCandidates() {
  const response = await fetch(`${API_URL}/candidates`);
  if (!response.ok) throw new Error("Error al obtener candidatos");
  return response.json();
}

export async function getCandidateById(candidateId) {
  const response = await fetch(`${API_URL}/candidates/${candidateId}`);
  if (!response.ok) throw new Error("Error al obtener candidato");
  return response.json();
}

export async function createCandidate(candidate) {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Error al crear candidato");
  return response.json();
}

export async function updateCandidate(candidateId, candidate) {
  const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Error al actualizar candidato");
  return response.json();
}

export async function deleteCandidate(candidateId) {
  const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar candidato");
  return true;
}
