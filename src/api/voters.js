const API_URL = 'https://ad4f6d0ccc35.ngrok-free.app'; // Cambia esto a tu URL

export async function getVoters() {
  try {
    const response = await fetch(`${API_URL}/voters`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener votantes');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createVoter(voter) {
  const response = await fetch(`${API_URL}/voters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voter),
  });
  if (!response.ok) throw new Error('Error al crear votante');
  return await response.json();
}

// NUEVA FUNCIÓN: asignar candidato a votante
export async function assignCandidateToVoter(voterId, candidateId) {
  const response = await fetch(`${API_URL}/voters/${voterId}/assign-candidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId }),
  });

  if (!response.ok) throw new Error('Error al asignar candidato al votante');
  return await response.json();
}
