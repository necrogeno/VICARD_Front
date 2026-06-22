'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GafetService } from '../../../../services/api'; // Ajusta la ruta según tu estructura de carpetas

export default function EmpleadoForm() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
    vcardPublic: false,
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [currentFotoUrl, setCurrentFotoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID de usuario válido.");
      setLoading(false);
      return;
    }

    const fetchEmpleado = async () => {
      try {
        setLoading(true);
        const jsonDeMongoDB = await GafetService.getById(id);

        if (jsonDeMongoDB) {
          setFormData({
            idEmpleado: jsonDeMongoDB.IdEmpleado || '',
            nombres: jsonDeMongoDB.Nombres || '',
            primerApellido: jsonDeMongoDB.PrimerApellido || '',
            segundoApellido: jsonDeMongoDB.SegundoApellido || '',
            puesto: jsonDeMongoDB.Puesto || '',
            telefono: jsonDeMongoDB.Telefono || '',
            extension: jsonDeMongoDB.Extension || '',
            email: jsonDeMongoDB.email || '',
            centroTrabajo: jsonDeMongoDB.CentroTrabajo || '',
            unidadAdministrativa: jsonDeMongoDB.UnidadAdministrativa || '',
            direccion: jsonDeMongoDB.Direccion || '',
            numeroExterior: jsonDeMongoDB.NumeroExterior || '',
            numeroInterior: jsonDeMongoDB.NumeroInterior || '',
            colonia: jsonDeMongoDB.Colonia || '',
            codigoPostal: jsonDeMongoDB.CodigoPostal || '',
            ciudad: jsonDeMongoDB.Ciudad || '',
            municipio: jsonDeMongoDB.Municipio || '',
            pais: jsonDeMongoDB.Pais || 'México',
            activo: jsonDeMongoDB.Activo ?? true,
            vcardPublic: jsonDeMongoDB.VcardPublic ?? false,
          });

          if (jsonDeMongoDB.Foto) {
            setCurrentFotoUrl(jsonDeMongoDB.Foto);
            setPreviewUrl(jsonDeMongoDB.Foto);
          }
        }
      } catch (err: any) {
        console.error("Error al cargar el empleado:", err);
        setError(err.message || "No se pudo cargar la información del empleado.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const file = e.target.files[0];
      setFoto(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const validateForm = () => {
    const localErrors: Record<string, string> = {};
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.nombres && !regexSoloLetras.test(formData.nombres)) {
      localErrors.nombres = "El nombre solo debe contener letras.";
    }
    if (formData.primerApellido && !regexSoloLetras.test(formData.primerApellido)) {
      localErrors.primerApellido = "El primer apellido solo debe contener letras.";
    }
    if (formData.email && !regexEmail.test(formData.email)) {
      localErrors.email = "Por favor, introduce un correo electrónico válido.";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return alert("Error: No se puede actualizar un registro sin un ID válido.");
    if (!validateForm()) return alert("Por favor, corrige los campos marcados antes de continuar.");
    
    try {
      let finalFotoUrl = currentFotoUrl;

      if (foto) {
        const uploadData = new FormData();
        uploadData.append('file', foto);

        const uploadResponse = await fetch('/services/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadResponse.ok) throw new Error("No se pudo subir la nueva fotografía.");

        const uploadResult = await uploadResponse.json();
        finalFotoUrl = uploadResult.url;
      }

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
        VcardPublic: formData.vcardPublic,
        Foto: finalFotoUrl 
      };
      
      await GafetService.update(id, dbPayload);
      alert("Información del personal actualizada con éxito.");
      router.push('/gafetdigital/Administrador');
    } catch (err: any) {
      alert(`Error al actualizar: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center my-10 text-sm text-neutral-500">Cargando datos...</div>;
  if (error) return <div className="text-center my-10 text-sm text-red-500">{error}</div>;

  const inputBaseClass = "w-full text-neutral-800 text-sm px-4 py-2.5 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all placeholder-neutral-300 shadow-inner";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-neutral-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-10">
        
        {/* BARRA SUPERIOR */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Coordinación de Política Digital</span>
              <h1 className="text-2xl font-black text-blue-900 tracking-tight">Edición de Perfil</h1>
            </div>
          </div>
        </div>

        {/* HERO EMPLEADO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-50 to-neutral-100/50 p-6 rounded-2xl border border-neutral-200 mb-8">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              {formData.nombres || 'Nombre'} {formData.primerApellido || 'Apellido'} {formData.segundoApellido}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {formData.puesto || 'Puesto'} • {formData.centroTrabajo || 'Centro de Trabajo'}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button 
              onClick={handleSubmit}
              type="submit" 
              className="flex items-center gap-2 bg-[#0056C6] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-all"
            >
              Guardar Cambios
            </button>
            <button 
              type="button" 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("¡Enlace copiado!");
              }}
              className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-sm px-4 py-2.5 rounded-full transition-all"
            >
              Copiar Link
            </button>
            <div className="w-px h-6 bg-neutral-300 mx-1 hidden md:block" />
            <button 
              type="button" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
            >
              Eliminar Personal
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL (ACOMODO OPTIMIZADO) */}
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6 border-b border-neutral-100 pb-2">
              Información Personal
            </h3>
            
            {/* Contenedor flex principal: Separa por completo la foto de la cuadrícula de textos */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Tarjeta de Foto Independiente */}
              <div className="w-full md:w-44 flex flex-col items-center bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm shrink-0">
                <div className="w-28 h-32 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-xs text-neutral-400 p-2">Sin Foto</div>
                  )}
                </div>
                
                <span className="text-[10px] text-blue-500 font-mono mb-3 truncate max-w-full text-center px-1 block">
                  {foto ? foto.name : (currentFotoUrl.split('/').pop() || 'No imagen')}
                </span>

                <label className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-2 px-3 rounded-full cursor-pointer transition-all text-center block">
                  Reemplazar Archivo
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Cuadrícula de inputs autónoma (Evita el desfase vertical) */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">ID Empleado</label>
                  <input type="text" name="idEmpleado" value={formData.idEmpleado} onChange={handleChange} className={inputBaseClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Nombre(s)*</label>
                  <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required className={`${inputBaseClass} ${errors.nombres ? 'border-red-500 ring-1 ring-red-200' : ''}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Primer Apellido*</label>
                  <input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required className={`${inputBaseClass} ${errors.primerApellido ? 'border-red-500 ring-1 ring-red-200' : ''}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Segundo Apellido</label>
                  <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className={inputBaseClass} />
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN 2: DATOS LABORALES Y DE CONTACTO */}
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6 border-b border-neutral-100 pb-2">
              Datos Laborales y de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Puesto *</label>
                <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} required className={inputBaseClass} />
              </div>

              {/* Checkbox alineado correctamente */}
              <div className="flex items-center md:pt-5 ml-3">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="sr-only" />
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${formData.activo ? 'bg-[#0056C6] border-[#0056C6]' : 'border-neutral-400 bg-white'}`}>
                    {formData.activo && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-800">Personal Activo</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Centro de Trabajo *</label>
                <input type="text" name="centroTrabajo" value={formData.centroTrabajo} onChange={handleChange} required className={inputBaseClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Unidad Administrativa *</label>
                <input type="text" name="unidadAdministrativa" value={formData.unidadAdministrativa} onChange={handleChange} required className={inputBaseClass} />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Correo Electrónico *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputBaseClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Teléfono Oficial *</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required className={inputBaseClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Extensión *</label>
                <input type="text" name="extension" value={formData.extension} onChange={handleChange} required className={inputBaseClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 ml-3 mb-1">Teléfono Personal</label>
                <input type="text" placeholder="Texto" className={`${inputBaseClass} bg-neutral-50 text-neutral-400 border-dashed`} disabled />
              </div>
            </div>
          </div>

          {/* VCard Checkbox */}
          <div className="pt-2 ml-3">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
              <input type="checkbox" name="vcardPublic" checked={formData.vcardPublic} onChange={handleChange} className="sr-only" />
              <div className={`w-5 h-5 border-2 rounded transition-all ${formData.vcardPublic ? 'bg-blue-600 border-blue-600' : 'border-neutral-300 bg-white'}`}>
                {formData.vcardPublic && (
                  <svg className="w-3.5 h-3.5 text-white mx-auto mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-neutral-600 font-medium">
                Acepto la inclusión de datos personales de contacto <strong className="text-neutral-800 font-bold">(Teléfono Personal)</strong> en la VCard
              </span>
            </label>
          </div>

        </form>
      </div>
    </div>
  );
}