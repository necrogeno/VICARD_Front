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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const selectedFile = e.target.files[0];
      const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

      // Validar tipo de archivo
      if (!validExtensions.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, foto: "Formato no válido. Solo se permiten archivos PNG, JPG o JPEG." }));
        setFoto(null);
        e.target.value = ''; // Limpiar el input
        return;
      }

      // Limpiar error de foto si pasa la validación
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.foto;
        return newErrors;
      });
      
      setFoto(selectedFile);
    }
  };

  const validateForm = () => {
    const localErrors: Record<string, string> = {};
    const regexSoloNumeros = /^[0-9]+$/;
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validaciones de Números
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

    // Validaciones de Texto (Letras)
    if (formData.nombres && !regexSoloLetras.test(formData.nombres)) {
      localErrors.nombres = "El nombre solo debe contener letras.";
    }
    if (formData.primerApellido && !regexSoloLetras.test(formData.primerApellido)) {
      localErrors.primerApellido = "El primer apellido solo debe contener letras.";
    }
    if (formData.segundoApellido && !regexSoloLetras.test(formData.segundoApellido)) {
      localErrors.segundoApellido = "El segundo apellido solo debe contener letras.";
    }
    if (formData.unidadAdministrativa && !regexSoloLetras.test(formData.unidadAdministrativa)) {
      localErrors.unidadAdministrativa = "La unidad administrativa solo debe contener letras.";
    }
    if (formData.colonia && !regexSoloLetras.test(formData.colonia)) {
      localErrors.colonia = "La colonia solo debe contener letras.";
    }
    if (formData.ciudad && !regexSoloLetras.test(formData.ciudad)) {
      localErrors.ciudad = "La ciudad solo debe contener letras.";
    }
    if (formData.municipio && !regexSoloLetras.test(formData.municipio)) {
      localErrors.municipio = "El municipio solo debe contener letras.";
    }

    // Validación de Email
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

      // Si hay un archivo seleccionado, lo subimos primero a nuestra API interna
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
        fotoUrlPath = uploadResult.url; // Contiene exactamente: "/Fotos/nombre_de_imagen.ext"
      }
      
      // Construcción del payload final mapeado a PascalCase
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
        Foto: fotoUrlPath // Aquí se guarda el string con la ruta limpia
      };

      console.log("Enviando nuevo registro mapeado al servicio Flask:", dbPayload);
      const response = await GafetService.create(dbPayload);
      
      alert("Empleado registrado con éxito");
      console.log("Respuesta del backend:", response);

      // Limpiar formulario completo
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

  // Helper para asignar estilos condicionales de error
  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-600 bg-red-50/30 text-red-900`;
    }
    return `${baseClass} border-neutral-300 focus:border-neutral-900`;
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
              <input type="text" name="idEmpleado" value={formData.idEmpleado} onChange={handleChange} placeholder="N/A o Número" className={getInputClass('idEmpleado')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Nombre(s) *</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required className={getInputClass('nombres')} />
              {errors.nombres && <p className="text-[11px] text-red-500 mt-0.5">{errors.nombres}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Primer Apellido *</label>
              <input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required className={getInputClass('primerApellido')} />
              {errors.primerApellido && <p className="text-[11px] text-red-500 mt-0.5">{errors.primerApellido}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Segundo Apellido</label>
              <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className={getInputClass('segundoApellido')} />
              {errors.segundoApellido && <p className="text-[11px] text-red-500 mt-0.5">{errors.segundoApellido}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Fotografía del Personal</label>
              <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer" />
              {errors.foto && <p className="text-[11px] text-red-500 mt-0.5">{errors.foto}</p>}
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
              <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} required className={getInputClass('puesto')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Correo Electrónico *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ejemplo@gob.mx" className={getInputClass('email')} />
              {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Teléfono *</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="(614)-000-0000" className={getInputClass('telefono')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Extensión</label>
              <input type="text" name="extension" value={formData.extension} onChange={handleChange} className={getInputClass('extension')} />
              {errors.extension && <p className="text-[11px] text-red-500 mt-0.5">{errors.extension}</p>}
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center cursor-pointer select-none">
                <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 h-4 w-4 accent-neutral-950" />
                <span className="ml-2 text-sm font-medium text-neutral-700">Personal Activo</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Centro de Trabajo *</label>
              <input type="text" name="centroTrabajo" value={formData.centroTrabajo} onChange={handleChange} required className={getInputClass('centroTrabajo')} />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Unidad Administrativa *</label>
              <input type="text" name="unidadAdministrativa" value={formData.unidadAdministrativa} onChange={handleChange} required className={getInputClass('unidadAdministrativa')} />
              {errors.unidadAdministrativa && <p className="text-[11px] text-red-500 mt-0.5">{errors.unidadAdministrativa}</p>}
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
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className={getInputClass('direccion')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Num. Exterior *</label>
              <input type="text" name="numeroExterior" value={formData.numeroExterior} onChange={handleChange} required className={getInputClass('numeroExterior')} />
              {errors.numeroExterior && <p className="text-[11px] text-red-500 mt-0.5">{errors.numeroExterior}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Num. Interior</label>
              <input type="text" name="numeroInterior" value={formData.numeroInterior} onChange={handleChange} placeholder="N/A" className={getInputClass('numeroInterior')} />
              {errors.numeroInterior && <p className="text-[11px] text-red-500 mt-0.5">{errors.numeroInterior}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Colonia *</label>
              <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} required className={getInputClass('colonia')} />
              {errors.colonia && <p className="text-[11px] text-red-500 mt-0.5">{errors.colonia}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Código Postal *</label>
              <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required className={getInputClass('codigoPostal')} />
              {errors.codigoPostal && <p className="text-[11px] text-red-500 mt-0.5">{errors.codigoPostal}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Ciudad *</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required className={getInputClass('ciudad')} />
              {errors.ciudad && <p className="text-[11px] text-red-500 mt-0.5">{errors.ciudad}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Municipio *</label>
              <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} required className={getInputClass('municipio')} />
              {errors.municipio && <p className="text-[11px] text-red-500 mt-0.5">{errors.municipio}</p>}
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