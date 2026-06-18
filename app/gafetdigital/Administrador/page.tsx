"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { GafetService } from '../../services/api'; 

import { 
  Search, 
  Menu, 
  User, 
  Lock, 
  LogOut, 
  Users, 
  Contact, 
  CheckCircle2, 
  MinusCircle, 
  RefreshCw, 
  History, 
  ArrowUpDown, 
  ChevronRight,
  UserPlus,
  ChevronDown
} from 'lucide-react';

const formatHeaderDate = (date: Date) => {
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]}, ${date.getFullYear()}`;
};

const formatHeaderTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; 
  
  const strHours = hours < 10 ? '0' + hours : hours;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  const strSeconds = seconds < 10 ? '0' + seconds : seconds;
  
  return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
};

export default function BusquedaUsuarioPage() {
  const router = useRouter();

  // Estados base
  const [resultadosTabla, setResultadosTabla] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // NUEVOS ESTADOS: Control de ordenamiento (Por defecto ordena por Nombre de forma Ascendente)
  const [sortBy, setSortBy] = useState<"Nombre" | "IdEmpleado">("Nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Función para obtener/recargar datos de la API (Envuelta en useCallback para poder reutilizarla)
  const fetchUsuarios = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await GafetService.getAll();
      if (Array.isArray(data)) {
        setResultadosTabla(data);
      } else {
        setResultadosTabla([]); 
      }
    } catch (error) {
      console.error("Error obteniendo los usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Reloj en tiempo real
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reiniciar a la página 1 ante cambios de filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUnidad, sortBy, sortOrder]);

  // Función para alternar u ordenar los elementos
  const handleToggleSort = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      // Si ya estaba en desc, podemos alternar la columna o regresar a asc
      setSortOrder("asc");
    }
  };

  // Función para limpiar filtros e historial de búsqueda (Botón Historial/Reset)
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedUnidad("");
    setSortBy("Nombre");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Filtra Y ORDENA los usuarios basándose en los estados reactivos
  const usuariosFiltrados = useMemo(() => {
    const filtrados = resultadosTabla.filter((row) => {
      const nombreCompleto = `${row.Nombres || ''} ${row.PrimerApellido || ''} ${row.SegundoApellido || ''}`.trim().toLowerCase();
      const cumpleNombre = nombreCompleto.includes(searchTerm.toLowerCase());

      const unidadUsuario = (row.UnidadAdministrativa || '').trim().toLowerCase();
      const cumpleUnidad = selectedUnidad === "" || unidadUsuario === selectedUnidad.toLowerCase();

      return cumpleNombre && cumpleUnidad;
    });

    // Aplicar ordenamiento dinámico
    return filtrados.sort((a, b) => {
      let campoA = "";
      let campoB = "";

      if (sortBy === "Nombre") {
        campoA = `${a.Nombres || ''} ${a.PrimerApellido || ''}`.trim().toLowerCase();
        campoB = `${b.Nombres || ''} ${b.PrimerApellido || ''}`.trim().toLowerCase();
      } else if (sortBy === "IdEmpleado") {
        campoA = String(a.IdEmpleado || "").toLowerCase();
        campoB = String(b.IdEmpleado || "").toLowerCase();
      }

      if (campoA < campoB) return sortOrder === "asc" ? -1 : 1;
      if (campoA > campoB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [resultadosTabla, searchTerm, selectedUnidad, sortBy, sortOrder]);

  // Lógica de Paginación
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const usuariosPaginados = useMemo(() => {
    return usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  }, [usuariosFiltrados, indexOfFirstItem, indexOfLastItem]);

  // Últimos 10 registros del panel derecho
  const ultimosRegistros = useMemo(() => {
    const getTiempo = (fechaStr: string) => {
      if (!fechaStr) return 0;
      const parts = fechaStr.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
      }
      return new Date(fechaStr).getTime() || 0; 
    };

    return [...resultadosTabla]
      .filter((row) => row.FechaRegistro && row.FechaRegistro.trim() !== '')
      .sort((a, b) => getTiempo(b.FechaRegistro) - getTiempo(a.FechaRegistro))
      .slice(0, 10);
  }, [resultadosTabla]);

  return (
    <div className="min-h-screen bg-[#F9FAFC] flex flex-col font-sans text-gray-800 selection:bg-blue-200">
      
      {/* 1. GOBERNACIÓN TOP BAR */}
      <div className="bg-[#0056B3] text-white text-[10px] py-1.5 text-center border-b border-blue-700 px-4">
        identificame.chihuahua.gob.mx es un sitio oficial de Gobierno del Estado de Chihuahua. 
        <span className="underline ml-1 cursor-pointer hover:text-gray-200">¿Cómo saberlo?</span>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900 transition">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 pr-18">
            <Image
              src='/Logo-Institucional-Gobierno-2025-Horizontal-Azul.svg' 
              alt="Gobierno del estado"
              width={200} 
              height={50}
              className='object-cover'
            />
          </div>
            <div className="text-xl text-center font-bold text-blue-900 ml-2 w-full">
              identificame.<span className="text-[#0056B3]">chihuahua.gob.mx</span>
            </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-500">
          <div className="text-right tabular-nums">
            <span className="block text-[10px] uppercase font-bold text-gray-400">
              {currentTime ? formatHeaderDate(currentTime) : "Cargando..."}
            </span>
            <span className="text-blue-900 font-bold text-sm min-w-[85px] inline-block">
              {currentTime ? formatHeaderTime(currentTime) : "--:--:--"}
            </span>
          </div>
          <div className="flex items-center gap-4 border-l pl-6 border-gray-200 text-gray-600">
            <button className="hover:text-blue-600"><User className="w-5 h-5" /></button>
            <button className="hover:text-blue-600"><Lock className="w-5 h-5" /></button>
            <button className="hover:text-red-600"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* 3. WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR IZQUIERDO */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-gray-100">
            Gestión de Usuarios
          </div>
          <nav className="flex-1 py-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#0056B3] text-white font-medium text-sm transition">
              <Users className="w-5 h-5" />
              Búsqueda de Usuarios
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 text-sm transition">
              <Contact className="w-5 h-5" />
              Lista de Servidores
            </a>
          </nav>
          <div className="h-1 flex">
            <div className="w-1/2 bg-[#0056B3]"></div>
            <div className="w-1/2 bg-purple-400"></div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL CENTRAL */}
        <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          
          <h1 className="text-4xl font-extrabold text-[#0056B3] text-center mt-4 mb-8 tracking-tight">
            Búsqueda de Usuario
          </h1>

          {/* FORMULARIO DE BÚSQUEDA */}
          <div className="space-y-4 max-w-3xl mx-auto mb-10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nombre del Servidor Público" 
                className="w-full pl-5 pr-12 py-3 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A259FF] text-white p-2 rounded-full hover:bg-purple-600 transition">
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Coordinación de Política Digital" 
                className="w-full px-5 py-3.5 border-2 border-gray-200 bg-gray-50 rounded-full text-sm text-gray-400 font-medium"
                disabled
              />
              
              <div className="relative group">
                <select 
                  value={selectedUnidad}
                  onChange={(e) => setSelectedUnidad(e.target.value)}
                  className="w-full pl-6 pr-12 py-3.5 border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 bg-white appearance-none focus:outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm truncate"
                >
                  <option value="">Todas las Unidades Administrativas</option>
                  <option value="Departamento de Datos y Ciberseguridad">Departamento de Datos y Ciberseguridad</option>
                  <option value="Departamento Desarrollo y Estrategias Digitales">Departamento Desarrollo y Estrategias Digitales</option>
                  <option value="Departamento de Telefonía Y Servicios Electrónicos">Departamento de Telefonía Y Servicios Electrónicos</option>
                  <option value="Departamento de Desarrollo y Ciberseguridad">Departamento de Desarrollo y Ciberseguridad</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 text-gray-400 group-hover:text-[#0056B3]">
                  <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => router.push('/gafetdigital/Administrador/Crear')}
                className="bg-[#0056B3] w-3xl text-center hover:bg-blue-700 text-white font-semibold px-12 py-3 rounded-full text-sm shadow-md transition-all flex justify-center gap-2"
              >
                Añadir Servidor Público
              </button>
            </div>
          </div>

          {/* CONTROLES DE TABLA */}
          <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-xs text-gray-500 mb-4 px-2">
            <div className="flex items-center gap-2">
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); 
                }}
                className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none cursor-pointer font-medium text-gray-700 shadow-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>Resultados por página</span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                Mostrando resultados {usuariosFiltrados.length === 0 ? 0 : indexOfFirstItem + 1} a {Math.min(indexOfLastItem, usuariosFiltrados.length)} de {usuariosFiltrados.length}
                {sortOrder && ` (Ordenado ${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`}
              </span>
              
              <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white shadow-sm">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border-r bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 font-bold transition-all"
                >
                  ◀
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-[#0056B3] text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border-l bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 font-bold transition-all"
                >
                  ▶
                </button>
              </div>

              {/* ACCIONES DE TABLA RE-VINCULADAS */}
              <div className="flex items-center gap-3 text-blue-600 pl-2 border-l border-gray-300">
                {/* 1. Recargar los datos directo de la API */}
                <button 
                  onClick={fetchUsuarios} 
                  className={`hover:text-blue-800 ${isLoading ? 'animate-spin' : ''}`}
                  title="Recargar datos de la API"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                
                {/* 2. Limpiar filtros e historial de búsqueda */}
                <button 
                  onClick={handleResetFilters} 
                  className="hover:text-blue-800" 
                  title="Restablecer filtros"
                >
                  <History className="w-4 h-4" />
                </button>
                
                {/* 3. Cambiar orden (Ascendente / Descendente) */}
                <button 
                  onClick={handleToggleSort} 
                  className="hover:text-blue-800" 
                  title={`Cambiar orden a ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* LISTA DE RESULTADOS */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 font-medium flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                Cargando información...
              </div>
            ) : usuariosPaginados.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-medium">
                No se encontraron servidores públicos.
              </div>
            ) : (
              usuariosPaginados.map((row, idx) => {
                const nombreCompleto = `${row.Nombres || ''} ${row.PrimerApellido || ''} ${row.SegundoApellido || ''}`.trim();
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => router.push(`/gafetdigital/Administrador/Update/${row._id}`)}
                    className="bg-white border border-purple-200 hover:border-purple-400 rounded-full px-6 py-2.5 shadow-sm flex items-center justify-between text-[11px] transition-all cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 w-[12%]">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${row.Activo ? 'text-green-500' : 'text-gray-300'}`} />
                      <div>
                        <div className="font-bold text-gray-900">{row.IdEmpleado || "N/A"}</div>
                        <div className="text-[9px] pr-1 text-gray-400 uppercase">N. Empleado</div>
                      </div>
                    </div>

                    <div className="w-[20%]">
                      <div className="font-bold text-gray-900">{nombreCompleto || "N/A"}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Nombre</div>
                    </div>

                    <div className="w-[22%]">
                      <div className="text-gray-700 font-medium truncate">{row.email || "N/A"}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Correo Electrónico</div>
                    </div>

                    <div className="w-[8%]">
                      <div className="font-bold text-gray-900">{row.Extension || "N/A"}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Extensión</div>
                    </div>

                    <div className="w-[20%]">
                      <div className="font-bold text-gray-900 truncate">{row.CentroTrabajo || "N/A"}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Dependencia</div>
                    </div>

                    <div className="w-[12%]">
                      <div className="text-gray-600 truncate">{row.UnidadAdministrativa || "N/A"}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Unidad Administrativa</div>
                    </div>

                    <div className="flex items-center gap-2 w-[6%] justify-end">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Eliminar ID:", row._id);
                        }}
                        className="text-pink-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* SIDEBAR DERECHO */}
        <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="text-[9px] font-bold text-blue-900 uppercase tracking-tighter">
              Gobierno de Chihuahua <br />
              <span className="text-gray-500 font-normal">Coordinación de Política Digital</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] block text-gray-400 uppercase font-semibold">Registros Totales</span>
              <span className="text-3xl font-black text-[#0056B3]">{resultadosTabla.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0056B3]">Últimos Registros</h3>
            <a href="#" className="text-[10px] text-gray-400 hover:text-blue-600 flex items-center gap-0.5">
              Ver Usuarios <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            {ultimosRegistros.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No hay registros recientes.</p>
            ) : (
              ultimosRegistros.map((item, index) => {
                const nombreCompleto = `${item.Nombres || ''} ${item.PrimerApellido || ''} ${item.SegundoApellido || ''}`.trim();
                
                return (
                  <div 
                    key={index} 
                    onClick={() => router.push(`/gafetdigital/Administrador/Update/${item._id}`)}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-all border-b border-gray-50 pb-2 cursor-pointer"
                  >
                    <div className="max-w-[70%]">
                      <h4 className="text-xs font-bold text-gray-800 truncate" title={nombreCompleto}>
                        {nombreCompleto || "N/A"}
                      </h4>
                      <p className="text-[9px] text-gray-400 uppercase tracking-tight truncate" title={item.UnidadAdministrativa}>
                        {item.UnidadAdministrativa || "Sin Departamento"}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-gray-700 block text-right">
                          {item.FechaRegistro}
                        </span>
                      </div>
                      <UserPlus className="w-4 h-4 text-blue-500 shrink-0" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}