const API_URL = 'https://ad4f6d0ccc35.ngrok-free.app';

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error en login');
    }

    const data = await response.json();
    return data; // Devuelve id, access_token, refresh_token, message
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
