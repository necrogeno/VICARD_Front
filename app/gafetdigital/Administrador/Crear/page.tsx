'use client';

import React, { useState } from 'react';
import { GafetService } from '../../../services/api'; // Ajusta la ruta según tu estructura de carpetas

export default function EmpleadoForm() {
  const [formData, setFormData] = useState({
    idEmpleado: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    puesto: '',
    telefono: '',
    extension: '',
    email: '',
    centroTrabajo: '',
    unidadAdministrativa: '',
    direccion: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    codigoPostal: '',
    ciudad: '',
    municipio: '',
    pais: 'México',
    activo: true,
  });

  const [foto, setFoto] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Guardar los datos usando el método create (POST) del servicio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Reconstruimos el JSON mapeando de camelCase a PascalCase para tu backend
      const dbPayload = {
        IdEmpleado: formData.idEmpleado,
        Nombres: formData.nombres,
        PrimerApellido: formData.primerApellido,
        SegundoApellido: formData.segundoApellido,
        Puesto: formData.puesto,
        Telefono: formData.telefono,
        Extension: formData.extension,
        email: formData.email,
        CentroTrabajo: formData.centroTrabajo,
        UnidadAdministrativa: formData.unidadAdministrativa,
        Direccion: formData.direccion,
        NumeroExterior: formData.numeroExterior,
        NumeroInterior: formData.numeroInterior,
        Colonia: formData.colonia,
        CodigoPostal: formData.codigoPostal,
        Ciudad: formData.ciudad,
        Municipio: formData.municipio,
        Pais: formData.pais,
        Activo: formData.activo,
        Foto: '' // Al ser un registro nuevo, inicia vacío o se maneja en el backend
      };

      console.log("Enviando nuevo registro al servicio:", dbPayload);
      const response = await GafetService.create(dbPayload);
      
      alert("Empleado registrado con éxito");
      console.log("Respuesta del servidor:", response);

      // Opcional: Limpiar el formulario tras un envío exitoso
      setFormData({
        idEmpleado: '',
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        puesto: '',
        telefono: '',
        extension: '',
        email: '',
        centroTrabajo: '',
        unidadAdministrativa: '',
        direccion: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        codigoPostal: '',
        ciudad: '',
        municipio: '',
        pais: 'México',
        activo: true,
      });
      setFoto(null);

    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert(`Error al guardar: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white border border-neutral-200 rounded-lg shadow-sm font-sans">
      <header className="mb-8 border-b border-neutral-100 pb-4">
        <h1 className="text-xl font-semibold text-neutral-800 tracking-tight">Registro de Personal</h1>
        <p className="text-xs text-neutral-500 mt-1">Ingrese los datos oficiales para el alta en el sistema.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN: Información Personal */}
        <div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">ID Empleado</label>
              <input type="text" name="idEmpleado" value={formData.idEmpleado} onChange={handleChange} placeholder="N/A o Número" className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Nombre(s) *</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Primer Apellido *</label>
              <input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Segundo Apellido</label>
              <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Fotografía del Personal</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer" />
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* SECCIÓN: Datos de Contacto y Laborales */}
        <div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Datos Laborales y Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Puesto *</label>
              <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Correo Electrónico *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ejemplo@gob.mx" className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Teléfono *</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="(614)-000-0000" className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Extensión</label>
              <input type="text" name="extension" value={formData.extension} onChange={handleChange} className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center cursor-pointer select-none">
                <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 h-4 w-4 accent-neutral-950" />
                <span className="ml-2 text-sm font-medium text-neutral-700">Personal Activo</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Centro de Trabajo *</label>
              <input type="text" name="centroTrabajo" value={formData.centroTrabajo} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Unidad Administrativa *</label>
              <input type="text" name="unidadAdministrativa" value={formData.unidadAdministrativa} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* SECCIÓN: Dirección Adscrita */}
        <div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Dirección de Adscripción</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Calle / Dirección *</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Num. Exterior *</label>
              <input type="text" name="numeroExterior" value={formData.numeroExterior} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Num. Interior</label>
              <input type="text" name="numeroInterior" value={formData.numeroInterior} onChange={handleChange} placeholder="N/A" className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Colonia *</label>
              <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Código Postal *</label>
              <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Ciudad *</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Municipio *</label>
              <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} required className="w-full text-sm px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="pt-4 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-neutral-950 text-white text-sm font-medium rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-colors shadow-sm">
            Crear Gafet
          </button>
        </div>

      </form>
    </div>
  );
}