require('dotenv').config();
// services/api.ts

// 1. Configuración base
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 2. Función base genérica (el "motor" del servicio)
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Error HTTP: ${response.status}`);
  }

  return response.json();
}

// 3. Funciones específicas exportables
export const ItemService = {
  // Obtener todos los elementos
  getAll: () => apiFetch<any[]>('/find'),
  
  // Obtener uno solo por ID
  getById: (id: string) => apiFetch<any>(`/find/${id}`),
  
  // Crear uno nuevo (POST)
  create: (data: any) => apiFetch('/add', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};