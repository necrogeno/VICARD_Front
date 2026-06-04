"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Trash2, 
  Edit2,  
  UserCheck, 
  UserX,
  Palette
} from "lucide-react";
import { GafetService } from "../../services/api"; 

// --- INTERFAZ DE TYPESCRIPT CORREGIDA (Acoplada a tu MongoDB JSON) ---
interface User {
  _id?: string;
  id?: string; // Mantenemos por compatibilidad si es necesario
  Activo: boolean; // Cambiado a booleano según tu base de datos
  CentroTrabajo?: string;
  Ciudad?: string;
  CodigoPostal?: string;
  Colonia?: string;
  Direccion?: string;
  Extension?: string;
  Foto?: string;
  IdEmpleado?: string;
  Municipio?: string;
  Nombres: string; // Cambiado (antes era 'name')
  NumeroExterior?: string;
  NumeroInterior?: string;
  Pais?: string;
  PrimerApellido?: string; // Agregado
  SegundoApellido?: string; // Agregado
  Puesto: string;
  Telefono?: string; // Cambiado a T mayúscula (antes era 'telefono')
  UnidadAdministrativa?: string;
  email: string;
}

export default function AdminDashboard() {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "settings">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [themeColor, setThemeColor] = useState<"blue" | "emerald" | "violet">("blue");

  // Estado de Usuarios e indicador de carga
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado para el formulario de usuario (Agregar / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ 
    Nombres: "", 
    PrimerApellido: "",
    SegundoApellido: "",
    email: "", 
    Telefono: "", 
    Puesto: "Usuario", 
    Activo: true 
  });

  // --- EFECTO: CARGAR DATOS DESDE LA API ---
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await GafetService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      alert("No se pudieron cargar los usuarios desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- MAPEO DE COLORES DINÁMICOS ---
  const themeClasses = {
    blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600", hover: "hover:bg-blue-700", lightBg: "bg-blue-50" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600", hover: "hover:bg-emerald-700", lightBg: "bg-emerald-50" },
    violet: { bg: "bg-violet-600", text: "text-violet-600", border: "border-violet-600", hover: "hover:bg-violet-700", lightBg: "bg-violet-50" },
  };

  const currentTheme = themeClasses[themeColor];

  // --- LÓGICA DE FILTRADO CORREGIDA (Busca sobre el nombre completo real) ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nombreCompleto = `${user.Nombres || ''} ${user.PrimerApellido || ''} ${user.SegundoApellido || ''}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        nombreCompleto.includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.Puesto?.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  // --- MANEJADORES DE MODAL ---
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ Nombres: "", PrimerApellido: "", SegundoApellido: "", email: "", Telefono: "", Puesto: "Usuario", Activo: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      Nombres: user.Nombres || "", 
      PrimerApellido: user.PrimerApellido || "",
      SegundoApellido: user.SegundoApellido || "",
      email: user.email || "", 
      Telefono: user.Telefono || "", 
      Puesto: user.Puesto || "Usuario", 
      Activo: user.Activo
    });
    setIsModalOpen(true);
  };

  // --- PERSISTENCIA CON EL SERVICIO ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        alert("Función de actualización pendiente en GafetService.");
      } else {
        await GafetService.create(formData);
      }
      
      setIsModalOpen(false);
      fetchUsers(); 
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      alert("Hubo un error al procesar la solicitud.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        alert("Para eliminar permanentemente, añade el método DELETE en tu GafetService.");
        setUsers(users.filter(user => (user._id || user.id) !== userId));
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className={`p-2 rounded-lg text-white ${currentTheme.bg}`}>
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">Administrador</span>
          </div>
          
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "dashboard" ? `${currentTheme.lightBg} ${currentTheme.text}` : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "users" ? `${currentTheme.lightBg} ${currentTheme.text}` : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Users size={18} /> Usuarios
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "settings" ? `${currentTheme.lightBg} ${currentTheme.text}` : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Settings size={18} /> Configuración
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          v1.0.0 — Conectado a Producción
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold capitalize text-gray-900">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Admin Role</p>
            </div>
            <div className={`h-10 w-10 rounded-full ${currentTheme.bg} text-white flex items-center justify-center font-bold`}>
              AD
            </div>
          </div>
        </header>

        {/* CONTENEDOR DE VISTAS */}
        <div className="p-2 max-w-7xl w-full mx-auto space-y-6">
          
          {/* 1. SECCIÓN: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Usuarios Totales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gray-50 ${currentTheme.text}`}>
                    <Users size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Usuarios Activos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {users.filter(u => u.Activo === true).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Usuarios Inactivos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {users.filter(u => u.Activo === false).length}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl bg-red-50 text-red-600`}>
                    <UserX size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Rendimiento de la Plataforma</h3>
                <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  [ Espacio reservado para Gráfico de Analíticas ]
                </div>
              </div>
            </div>
          )}

          {/* 2. SECCIÓN: GESTIÓN DE USUARIOS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fadeIn">
              
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar usuario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-all bg-white"
                  />
                </div>
                
                <button 
                  onClick={handleOpenAddModal}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors shadow-sm ${currentTheme.bg} ${currentTheme.hover}`}
                >
                  <Plus size={16} /> Agregar Usuario
                </button>
              </div>

              {/* Loader de carga */}
              {isLoading ? (
                <div className="py-20 text-center text-gray-500 text-sm">
                  Cargando registros desde la base de datos...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-50/70">
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Puesto</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const currentId = user._id || user.id || "";
                          
                          // Combinación estructurada del Nombre Completo real
                          const nombreCompleto = `${user.Nombres || ''} ${user.PrimerApellido || ''} ${user.SegundoApellido || ''}`.trim();

                          return (
                            <tr key={currentId} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">
                                <a href={`/gafetdigital/Administrador/${currentId}`}>{nombreCompleto || "Sin Nombre"}</a>
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                <a href={`/gafetdigital/Administrador/${currentId}`}>{user.email}</a>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {/* Corregido propiedad 'Telefono' */}
                                <a href={`/gafetdigital/Administrador/${currentId}`}>{user.Telefono || "—"}</a>
                              </td>
                              <td className="px-6 py-4 text-gray-600"> 
                                <a href={`/gafetdigital/Administrador/${currentId}`}>
                                  <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium inline-block max-w-xs truncate">
                                    {user.Puesto}
                                  </span>
                                </a>
                              </td>
                              <td className="px-6 py-4">
                                {/* Corregido el Badge condicional con el Booleano 'Activo' */}
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.Activo ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-600"
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${user.Activo ? "bg-emerald-500" : "bg-red-400"}`} />
                                  {user.Activo ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button 
                                  onClick={() => handleOpenEditModal(user)}
                                  className="p-1.5 inline-flex items-center text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(currentId)}
                                  className="p-1.5 inline-flex items-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No se encontraron usuarios en el servidor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. SECCIÓN: CONFIGURACIÓN */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-2xl animate-fadeIn space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Palette size={20} className={currentTheme.text} /> Personalización de la Interfaz
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona el color de acento para los botones, estados activos y elementos visuales del panel.
                </p>
              </div>
              <hr className="border-gray-100" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => setThemeColor("blue")} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${themeColor === "blue" ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100" : "border-gray-200 hover:bg-gray-50"}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-600 shadow-sm" />
                  <span className="text-sm font-medium">Azul Corporativo</span>
                </button>
                <button onClick={() => setThemeColor("emerald")} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${themeColor === "emerald" ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-100" : "border-gray-200 hover:bg-gray-50"}`}>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 shadow-sm" />
                  <span className="text-sm font-medium">Verde Esmeralda</span>
                </button>
                <button onClick={() => setThemeColor("violet")} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${themeColor === "violet" ? "border-violet-600 bg-violet-50/50 ring-2 ring-violet-100" : "border-gray-200 hover:bg-gray-50"}`}>
                  <div className="w-8 h-8 rounded-full bg-violet-600 shadow-sm" />
                  <span className="text-sm font-medium">Violeta Eléctrico</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODAL PARA AGREGAR / EDITAR USUARIOS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-xl overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? "Modificar Usuario" : "Agregar Nuevo Usuario"}
              </h3>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Nombres</label>
                <input type="text" required value={formData.Nombres} onChange={(e) => setFormData({ ...formData, Nombres: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Primer Apellido</label>
                  <input type="text" required value={formData.PrimerApellido} onChange={(e) => setFormData({ ...formData, PrimerApellido: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Segundo Apellido</label>
                  <input type="text" value={formData.SegundoApellido} onChange={(e) => setFormData({ ...formData, SegundoApellido: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Correo Electrónico</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Teléfono</label>
                <input type="text" value={formData.Telefono} onChange={(e) => setFormData({ ...formData, Telefono: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Puesto</label>
                  <select value={formData.Puesto} onChange={(e) => setFormData({ ...formData, Puesto: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="Usuario">Usuario</option>
                    <option value="Editor">Editor</option>
                    <option value="Soporte">Soporte</option>
                    <option value="Analista Programador">Analista Programador</option>
                    <option value="Desarrollador Jr">Desarrollador Jr</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Estado</label>
                  <select value={formData.Activo ? "Activo" : "Inactivo"} onChange={(e) => setFormData({ ...formData, Activo: e.target.value === "Activo" })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className={`px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors shadow-sm ${currentTheme.bg} ${currentTheme.hover}`}>
                  {editingUser ? "Modificar Usuario" : "Agregar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}