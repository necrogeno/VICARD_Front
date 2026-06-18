// app/components/ProfileCard.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Building2, Download, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

export interface PersonaProps {
  idEmpleado: string;
  nombre: string;
  apellidos: string;
  puesto: string;
  telefono: string;
  extension: string;
  email: string;
  centroTrabajo: string;
  unidadAdministrativa: string;
  direccion: string;
  numeroInterior: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  municipio: string;
  pais: string;
  estaActivo: boolean;
  fotoUrl?: string;
  telefonoPersonal: string;
}

export const ProfileCard = ({ persona }: { persona: PersonaProps }) => {
  const {
    idEmpleado,
    nombre,
    apellidos,
    puesto,
    telefono,
    extension,
    email,
    centroTrabajo,
    unidadAdministrativa,
    direccion,
    numeroInterior,
    colonia,
    codigoPostal,
    ciudad,
    municipio,
    pais,
    estaActivo,
    fotoUrl,
    telefonoPersonal
  } = persona;

  function dividirCorreo(email: string): { usuario: string; dominio: string } {
    if (!email || email === '[FALTANTE]' || !email.includes('@')) {
      return { usuario: email || '[FALTANTE]', dominio: '[FALTANTE]' };
    }
  
    const [usuario, dominio] = email.split('@');
    
    return {
      usuario: usuario || '[FALTANTE]',
      dominio: dominio ? `@${dominio}` : '[FALTANTE]'
    };
  }

  const { usuario, dominio } = dividirCorreo(email);
  const [imgSrc, setImgSrc] = useState(fotoUrl || '/productos/placeholder-default.jpg');

  // Funciones auxiliares para validar si un campo tiene información real o es nulo/faltante
  const tieneTelefonoValido = telefono && telefono !== '[FALTANTE]' && telefono !== 'N/A';
  const tieneExtensionValida = extension && extension !== '[FALTANTE]' && extension !== 'N/A';
  const tieneTelefonoPValido = telefonoPersonal && telefonoPersonal !== '[FALTANTE]' && telefono !== 'N/A';
  return (
    <div className='w-full max-w-[390px] relative'>
      <div className="w-full max-w-[390px] bg-white rounded-[4px] shadow-2xl flex flex-col static overflow-hidden">
        <span className='block w-full h-2.5 bg-[#9568c6]'></span>
        
        {/* SECCIÓN SUPERIOR: Logos y Encabezado del Gafet */}
        <div className="bg-white pt-6 px-6 pb-2 text-center flex flex-col items-center">
          
          {/* Foto de Perfil con el Check/X de estatus superpuesto */}
          <div className="absolute w-28 h-28 mt-2">
            <div className="w-full h-full rounded-2xl overflow-hidden border-3 border-white shadow-md absolute bottom-22 bg-gray-100">
              <Image
                src={imgSrc}
                alt={`${nombre} ${apellidos}`}
                fill
                className="object-cover"
                onError={() => setImgSrc('/productos/placeholder-default.jpg')}
              />
            </div>
            <div className="absolute bottom-21 -right-1 z-10 bg-white rounded-full p-0.5 shadow">
              {estaActivo ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500 fill-rose-50" />
              )}
            </div>
          </div>

          {/* Nombre y Apellidos */}
          <h1 className="text-4xl mt-15 font-korolev text-[#004EAA] tracking-tight leading-tight">
            {nombre}
          </h1>
          <h2 className="text-xl font-gotham font-bold text-black-700 mb-3.5 leading-tight">
            {apellidos}
          </h2>

          {/* Dependencia/Coordinación abreviada debajo del puesto */}
          <p className="text-xs font-gotham font-bold text-blue-600 mt-0.5">
            {centroTrabajo}
          </p>

          {/* Puesto */}
          <p className="text-[10px] mb-2.5 font-medium font-gotham text-gray-400 mt-2 uppercase tracking-wider">
            {puesto}
          </p>
          
          {/* Fecha de activación o estado */}
          {estaActivo && (
            <p className="text-[11px] text-gray-500 font-medium mt-3 px-3 py-0.5 rounded-full">
              Activo al: <span className="font-semibold font-gotham text-gray-700">9 de Junio del 2026</span>
            </p>
          )}
        </div>

        {/* BANNER DE INACTIVIDAD (Solo si estaActivo === false) */}
        {!estaActivo && (
          <div className="w-full bg-[#e40069] text-white font-gotham text-center py-2 text-xs font-bold uppercase tracking-widest shadow-inner">
            Usuario Inactivo
          </div>
        )}

        {estaActivo && (
          <div className='w-full px-6 m-auto mb-6'>
            <div>
              <button 
                type="button" 
                className="w-full bg-[#1b449c] hover:bg-[#15357a] text-white font-gotham font-semibold text-xs py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download size={14} />
                Descargar VCard
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN INFERIOR: Detalles e Información de Contacto */}
        <div className="bg-white px-6 pt-5 pb-6 flex-1 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* cuadro de telefono, extension y correo */}
            <div className='border mb-15 border-gray-300 pb-5 pt-5 pr-6 pl-6 rounded-2xl'>

              {/* Teléfono y Extensión (Solo si tiene un teléfono válido) */}
              {tieneTelefonoValido && (
                <div className="flex items-start gap-3 text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold font-gotham text-gray-400 uppercase tracking-wider">Número Telefónico</span>
                    <span className="text-xl mb-2.5 font-semibold font-gotham text-[#004EAA]">{telefono}</span>
                    
                    {/* Extensión interna (Solo si existe y es válida) */}
                    {tieneExtensionValida && (
                      <div className='mb-2.5'>
                        <span className="text-[10px] uppercase font-bold font-gotham text-gray-400 mt-0.5 block tracking-wider">Extensión: </span>
                        <span className="text-xl font-medium font-gotham text-[#004EAA] block">{extension}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teléfono personal (Solo si tiene un teléfono válido) */}
              {tieneTelefonoPValido && (
                <div className="flex items-start gap-3 text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold font-gotham text-gray-400 uppercase tracking-wider">Número Personal</span>
                    <span className="text-xl mb-2.5 font-semibold font-gotham text-[#004EAA]">{telefonoPersonal}</span>
                  </div>
                </div>
              )}

              {/* Correo Electrónico */}
              <div className="flex items-start gap-3 text-left">
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] font-bold font-gotham text-gray-400 uppercase tracking-wider">Correo Electrónico</span>
                  <span className="text-xl font-medium font-gotham text-[#004EAA] break-all no-underline decoration-1">{usuario}</span>
                  <span className="text-xs font-medium font-gotham text-[#004EAA] break-all no-underline decoration-1">{dominio}</span>
                </div>
              </div>

            </div>

            <div className='border border-gray-300 pb-5 pt-5 pr-6 pl-6 rounded-2xl mb-8'>

              {/* Centro de Trabajo / Unidad Administrativa */}
              <div className="flex items-start gap-3 text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-gotham text-gray-400 uppercase tracking-wider">Centro de Trabajo</span>
                  <span className="text-xl font-bold font-gotham text-[#004EAA] mb-2.5">{centroTrabajo}</span>
                  <span className="text-[10px] text-gray-400 font-gotham font-bold uppercase tracking-wider mt-1.5">Unidad Administrativa</span>
                  <span className="text-xl font-medium font-gotham text-[#004EAA] leading-tight mb-2.5">{unidadAdministrativa}</span>
                </div>
              </div>

              {/* Dirección Completa */}
              <div className="flex items-start gap-3 text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-gotham text-gray-400 uppercase tracking-wider">Dirección</span>
                  <span className="text-xl font-semibold font-gotham text-[#004EAA] leading-tight">
                    {direccion}
                    {numeroInterior && numeroInterior !== 'N/A' && numeroInterior !== '[FALTANTE]' ? `, Int. ${numeroInterior}` : ''}
                  </span>
                  <span className="text-xl font-semibold font-gotham text-[#004EAA] mt-0.5">
                    Col. {colonia}, C.P. {codigoPostal}
                  </span>
                  <span className="text-[11px] font-gotham text-[#004EAA]/80">
                    {ciudad}, {municipio}, {pais}
                  </span>
                </div>
              </div>

            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};