import { API_URL } from './config';

export async function getLeaders() {
  const response = await fetch(`${API_URL}/leaders`);
  if (!response.ok) throw new Error('Error al obtener líderes');
  return await response.json();
}

export async function getCandidatesByLeader(leaderId) {
  const response = await fetch(`${API_URL}/leaders/${leaderId}/candidates`);
  if (!response.ok) throw new Error('Error al obtener candidatos');
  return await response.json();
}
