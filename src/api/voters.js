import { API_URL } from "./config";

export async function getVoters() {
  const response = await fetch(`${API_URL}/voters`);
  if (!response.ok) throw new Error("Error al obtener votantes");
  return response.json();
}

export async function createVoter(voter) {
  const response = await fetch(`${API_URL}/voters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(voter),
  });
  if (!response.ok) throw new Error("Error al crear votante");
  return response.json();
}

export async function updateVoter(voterId, voter) {
  const response = await fetch(`${API_URL}/voters/${voterId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(voter),
  });
  if (!response.ok) throw new Error("Error al actualizar votante");
  return response.json();
}

export async function deleteVoter(voterId) {
  const response = await fetch(`${API_URL}/voters/${voterId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar votante');
  return true;
}
export async function assignCandidateToVoter(voterId, candidateId) {
  const response = await fetch(`${API_URL}/voters/${voterId}/assign-candidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId }),
  });
  if (!response.ok) throw new Error("Error al asignar candidato al votante");
  return response.json();
}
