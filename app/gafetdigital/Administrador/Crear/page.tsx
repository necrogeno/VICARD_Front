'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { GafetService } from '../../../services/api'; // Ajusta la ruta según tu estructura de carpetas

export default function EmpleadoForm() {
  const router = useRouter(); 

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validExtensions.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, foto: "Formato no válido. Solo se permiten archivos PNG, JPG o JPEG." }));
        setFoto(null);
        setPreviewUrl(null);
        e.target.value = ''; 
        return;
      }

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.foto;
        return newErrors;
      });
      
      setFoto(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFoto = () => {
    setFoto(null);
    setPreviewUrl(null);
  };

  const validateForm = () => {
    const localErrors: Record<string, string> = {};
    const regexSoloNumeros = /^[0-9]+$/;
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.extension && !regexSoloNumeros.test(formData.extension)) {
      localErrors.extension = "La extensión debe contener solo números.";
    }
    if (formData.numeroExterior && !regexSoloNumeros.test(formData.numeroExterior)) {
      localErrors.numeroExterior = "El número exterior debe contener solo números.";
    }
    if (formData.numeroInterior && formData.numeroInterior !== 'N/A' && formData.numeroInterior.trim() !== '' && !regexSoloNumeros.test(formData.numeroInterior)) {
      localErrors.numeroInterior = "El número interior debe contener solo números o 'N/A'.";
    }
    if (formData.codigoPostal && !regexSoloNumeros.test(formData.codigoPostal)) {
      localErrors.codigoPostal = "El código postal debe contener solo números.";
    }

    if (formData.nombres && !regexSoloLetras.test(formData.nombres)) {
      localErrors.nombres = "El nombre solo debe contener letras.";
    }
    if (formData.primerApellido && !regexSoloLetras.test(formData.primerApellido)) {
      localErrors.primerApellido = "El primer apellido solo debe contener letras.";
    }
    if (formData.segundoApellido && !regexSoloLetras.test(formData.segundoApellido)) {
      localErrors.segundoApellido = "El segundo apellido solo debe contener letras.";
    }

    if (formData.email && !regexEmail.test(formData.email)) {
      localErrors.email = "Introduce un correo electrónico válido.";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Por favor, corrige los campos marcados en rojo.");
      return;
    }

    try {
      let fotoUrlPath = "";

      if (foto) {
        const fileData = new FormData();
        fileData.append('file', foto);

        const uploadResponse = await fetch('../../services/upload', {
          method: 'POST',
          body: fileData
        });

        if (!uploadResponse.ok) {
          throw new Error("No se pudo guardar la imagen en el servidor local.");
        }

        const uploadResult = await uploadResponse.json();
        fotoUrlPath = uploadResult.url; 
      }
      
      const hoy = new Date();
      const dia = String(hoy.getDate()).padStart(2, '0');
      const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
      const anio = hoy.getFullYear();
      const fechaActualFormateada = `${dia}/${mes}/${anio}`;
      
      const dbPayload = {
        IdEmpleado: formData.idEmpleado || "N/A",
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
        NumeroInterior: formData.numeroInterior || "N/A",
        Colonia: formData.colonia,
        CodigoPostal: formData.codigoPostal,
        Ciudad: formData.ciudad,
        Municipio: formData.municipio,
        Pais: formData.pais,
        Activo: formData.activo,
        Foto: fotoUrlPath,
        FechaRegistro: fechaActualFormateada
      };

      console.log("Enviando nuevo registro mapeado al servicio Flask:", dbPayload);
      const response = await GafetService.create(dbPayload);
      
      alert("Empleado registrado con éxito");
      console.log("Respuesta del backend:", response);

      // Redirección a la ruta correspondiente a app/gafetdigital/Administrador/page.tsx
      router.push('/gafetdigital/Administrador');

    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert(`Error al guardar: ${err.message}`);
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full text-[13px] px-4 py-2.5 bg-white border rounded-full focus:outline-none transition-colors placeholder-neutral-300 text-neutral-700 h-10";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-600 bg-red-50/20`;
    }
    return `${baseClass} border-neutral-200 focus:border-blue-500`;
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased">
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <div className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button type="button" className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
          <div className="h-5 w-px bg-neutral-300"></div>
          <button type="button" onClick={() => window.history.back()} className="p-1.5 rounded hover:bg-neutral-100 text-[#0052CC]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-[#0052CC] tracking-tight">Creación de Perfil de Personal</h1>
            <p className="text-[10px] text-neutral-400 font-medium -mt-0.5">Coordinación de Política Digital</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-8 py-10">
        {/* ENCABEZADO DEL FORMULARIO Y ACCIONES */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-200 mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Nuevo Usuario</h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">Centro de Trabajo</p>
          </div>
          <div className="flex items-center space-x-3">
            <button type="submit" className="px-6 py-2.5 bg-[#0052CC] text-white text-[13px] font-semibold rounded-full hover:bg-[#0043A4] transition-colors flex items-center space-x-2 shadow-sm">
              <span>Generar Usuario</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button type="button" onClick={() => window.history.back()} className="px-6 py-2.5 bg-[#FFE5EC] text-[#FF3366] text-[13px] font-bold rounded-full hover:bg-[#FFD0DC] transition-colors">
              Cancelar
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {/* SECCIÓN I: INFORMACIÓN PERSONAL */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0052CC] uppercase tracking-wider mb-5">Información Personal</h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Contenedor Foto de Perfil */}
              <div className="flex flex-col items-center justify-start">
                <div className="w-[140px] h-[170px] bg-[#E9ECEF] border border-neutral-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-14 h-14 text-neutral-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  )}
                </div>
                {previewUrl && (
                  <button type="button" onClick={removeFoto} className="mt-2 text-[11px] text-red-500 hover:text-red-600 font-semibold flex items-center space-x-1 transition-colors">
                    <span>Eliminar</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>

              {/* Campos de Texto e Input de Archivo */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">ID Empleado</label>
                  <input type="text" name="idEmpleado" value={formData.idEmpleado} onChange={handleChange} placeholder="Texto" className={getInputClass('idEmpleado')} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Nombre(s) *</label>
                  <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Texto" required className={getInputClass('nombres')} />
                  {errors.nombres && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.nombres}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Primer Apellido *</label>
                  <input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} placeholder="Texto" required className={getInputClass('primerApellido')} />
                  {errors.primerApellido && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.primerApellido}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Segundo Apellido</label>
                  <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} placeholder="Texto" className={getInputClass('segundoApellido')} />
                  {errors.segundoApellido && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.segundoApellido}</p>}
                </div>
                <div className="md:col-span-2 mt-1">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide ml-1 mb-2">Cambiar Fotografía del Personal</label>
                  <div className="flex items-center space-x-3">
                    <label className="px-5 py-2 bg-[#9B5DE5] hover:bg-[#8342D6] text-white text-[12px] font-bold rounded-md cursor-pointer transition-colors flex items-center space-x-2 shadow-sm">
                      <span>Seleccionar Archivo</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} className="hidden" />
                    </label>
                    <span className="text-[12px] text-neutral-500 font-medium truncate max-w-xs">
                      {foto ? foto.name : "Ningún archivo seleccionado"}
                    </span>
                  </div>
                  {foto && (
                    <p className="text-[10px] text-neutral-400 italic mt-1.5 ml-1">
                      Ruta actual en BD: /Fotos/{foto.name}
                    </p>
                  )}
                  {errors.foto && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.foto}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN II: DATOS LABORALES Y DE CONTACTO */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0052CC] uppercase tracking-wider mb-5">Datos Laborales y de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Puesto *</label>
                <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} required placeholder="Texto" className={getInputClass('puesto')} />
              </div>
              <div className="flex items-center md:justify-start pt-7 pl-2">
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="rounded-md border-neutral-300 text-[#0052CC] focus:ring-0 h-5 w-5 bg-white transition-colors" />
                  <span className="ml-2.5 text-[13px] font-bold text-neutral-700">Personal Activo</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Centro de Trabajo *</label>
                <input type="text" name="centroTrabajo" value={formData.centroTrabajo} onChange={handleChange} required placeholder="Texto" className={getInputClass('centroTrabajo')} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Unidad Administrativa *</label>
                <input type="text" name="unidadAdministrativa" value={formData.unidadAdministrativa} onChange={handleChange} required placeholder="Texto" className={getInputClass('unidadAdministrativa')} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Correo Electrónico *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Texto" className={getInputClass('email')} />
                {errors.email && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Teléfono Oficial *</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Texto" className={getInputClass('telefono')} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Extensión *</label>
                <input type="text" name="extension" value={formData.extension} onChange={handleChange} placeholder="Texto" className={getInputClass('extension')} />
                {errors.extension && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.extension}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Teléfono Personal</label>
                <input type="text" name="telefonoPersonal" placeholder="Texto" className="w-full text-[13px] px-4 py-2.5 bg-white border border-neutral-200 rounded-full focus:outline-none placeholder-neutral-300 text-neutral-700 h-10" />
              </div>
            </div>
          </div>

          {/* SECCIÓN III: DIRECCIÓN DE ADSCRIPCIÓN */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0052CC] uppercase tracking-wider mb-5">Dirección de Adscripción</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Calle / Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Texto" required className={getInputClass('direccion')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Num. Exterior *</label>
                  <input type="text" name="numeroExterior" value={formData.numeroExterior} onChange={handleChange} placeholder="Texto" required className={getInputClass('numeroExterior')} />
                  {errors.numeroExterior && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.numeroExterior}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Num. Interior</label>
                  <input type="text" name="numeroInterior" value={formData.numeroInterior} onChange={handleChange} placeholder="Texto" className={getInputClass('numeroInterior')} />
                  {errors.numeroInterior && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.numeroInterior}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Colonia *</label>
                <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} placeholder="Texto" required className={getInputClass('colonia')} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Código Postal *</label>
                <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="Texto" required className={getInputClass('codigoPostal')} />
                {errors.codigoPostal && <p className="text-[11px] text-red-500 ml-2 mt-1">{errors.codigoPostal}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Ciudad *</label>
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Texto" required className={getInputClass('ciudad')} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 ml-1 mb-1.5">Municipio *</label>
                <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} placeholder="Texto" required className={getInputClass('municipio')} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}