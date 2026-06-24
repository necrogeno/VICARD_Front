// services/api.ts

// 1. Configuración base
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/gafetdigital/';

// 2. Función base genérica
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
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
export const GafetService = {
  // Obtener todos los elementos
  getAll: () => apiFetch<any[]>('find'),
  
  // Obtener uno solo por ID
  getById: (id: string) => apiFetch<any>(`find/${id}`),
  
  // Crear uno nuevo (POST)
  create: (data: any) => apiFetch('add', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Actualizar un elemento por ID (PUT)
  update: (id: string, data: any) => apiFetch(`update/${id}`, {
    method: 'PUT', // Cambiar a 'PATCH' si tu API solo actualiza campos parciales
    body: JSON.stringify(data),
  }),

  // Buscar un elemento por correo electrónico
  getByEmail: (email: string) => apiFetch<any>(`findusuario/${encodeURIComponent(email)}`),
};