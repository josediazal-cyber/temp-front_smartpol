import { API_URL } from './config';

export async function getCorporations() {
  try {
    const response = await fetch(`${API_URL}/corporations`);
    if (!response.ok) {
      throw new Error(`Error al obtener corporaciones: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getCorporations:', error);
    throw error;
  }
}

export async function getCorporationById(id) {
  try {
    const response = await fetch(`${API_URL}/corporations/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener corporación: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getCorporationById:', error);
    throw error;
  }
}

export async function createCorporation(data) {
  try {
    const response = await fetch(`${API_URL}/corporations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error al crear corporación: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createCorporation:', error);
    throw error;
  }
}

export async function updateCorporation(id, data) {
  try {
    const response = await fetch(`${API_URL}/corporations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar corporación: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateCorporation:', error);
    throw error;
  }
}

export async function deleteCorporation(id) {
  try {
    const response = await fetch(`${API_URL}/corporations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar corporación: ${response.status}`);
    }
  } catch (error) {
    console.error('Error in deleteCorporation:', error);
    throw error;
  }
}
