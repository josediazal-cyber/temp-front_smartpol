import { API_URL } from './config';

export async function getDepartments() {
  const response = await fetch(`${API_URL}/departments`);
  if (!response.ok) throw new Error('Error al obtener departamentos');
  return await response.json();
}

export async function getMunicipalities(departmentId) {
  const response = await fetch(`${API_URL}/municipalities/by-department/${departmentId}`);
  if (!response.ok) throw new Error('Error al obtener municipios');
  return await response.json();
}
