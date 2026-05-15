// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getBackendData(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store' // Opcional: para datos que cambian constantemente
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    throw error;
  }
}