// services/api.ts

// 1. Configuración base (Next.js lee esto automáticamente, sin requires)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/gafetdigital/';

// 2. Función base genérica
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Eliminamos cualquier diagonal repetida al inicio del endpoint si la base ya la tiene
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
  
  // Obtener uno solo por ID -> Apunta directamente a: find/69fe3a880a357a75ef744196
  getById: (id: string) => apiFetch<any>(`find/${id}`),
  
  // Crear uno nuevo (POST)
  create: (data: any) => apiFetch('add', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};