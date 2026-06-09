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
    fotoUrl
  } = persona;

  const [imgSrc, setImgSrc] = useState(fotoUrl || '/productos/placeholder-default.jpg');

  return (
    <div className='w-full max-w-[390px] relative'>
      <div className="w-full max-w-[390px] bg-white rounded-[4px] shadow-2xl  flex flex-col static overflow-hidden">
        <span className='block w-full h-2.5 bg-[#9568c6]'></span>
        {/* SECCIÓN SUPERIOR: Logos y Encabezado del Gafet */}
        <div className="bg-white pt-6 px-6 pb-2 text-center flex flex-col items-center">
          
          {/* Foto de Perfil con el Check/X de estatus superpuesto */}
          <div className="absolute w-28 h-28 mt-2">
            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-md absolute bottom-22 bg-gray-100">
              <Image
                src={imgSrc}
                alt={`${nombre} ${apellidos}`}
                fill
                className="object-cover"
                onError={() => setImgSrc('/productos/placeholder-default.jpg')}
              />
            </div>
            {/* Badge de estado en la esquina inferior derecha de la foto */}
            <div className="absolute bottom-21 -right-1 z-10 bg-white rounded-full p-0.5 shadow">
              {estaActivo ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500 fill-rose-50" />
              )}
            </div>
          </div>

          {/* Nombre y Apellidos */}
          <h1 className="text-2xl mt-15 font-bold text-[#1a3d7d] tracking-tight leading-tight">
            {nombre}
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 leading-tight">
            {apellidos}
          </h2>

          {/* Puesto */}
          <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-wider">
            {puesto}
          </p>
          
          {/* Dependencia/Coordinación abreviada debajo del puesto */}
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            {centroTrabajo}
          </p>

          {/* Fecha de activación o estado */}
          {estaActivo && (
            <p className="text-[11px] text-gray-500 font-medium mt-3 bg-gray-100 px-3 py-0.5 rounded-full">
              Activo al: <span className="font-semibold text-gray-700">9 de Junio del 2026</span>
            </p>
          )}
        </div>

        {/* BANNER DE INACTIVIDAD (Solo si estaActivo === false) */}
        {!estaActivo && (
          <div className="w-full bg-[#9568C6] text-white text-center py-2 text-xs font-bold uppercase tracking-widest shadow-inner">
            Usuario Inactivo
          </div>
        )}

        {/* SECCIÓN INFERIOR: Detalles e Información de Contacto */}
        <div className="bg-white px-6 pt-5 pb-6 flex-1 flex flex-col justify-between border-t border-gray-100">
          
          <div className="space-y-4">
            
            {/* Teléfono y Extensión */}
            <div className="flex items-start gap-3 text-left">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0 mt-0.5">
                <Phone size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Número Telefónico</span>
                <span className="text-xs font-semibold text-gray-700">{telefono}</span>
                {extension && extension !== 'N/A' && (
                  <span className="text-[11px] text-gray-400 mt-0.5">Extensión: <span className="font-medium text-gray-600">{extension}</span></span>
                )}
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="flex items-start gap-3 text-left">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0 mt-0.5">
                <Mail size={15} />
              </div>
              <div className="flex flex-col overflow-hidden w-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</span>
                <span className="text-xs font-medium text-blue-600 break-all underline decoration-1">{email}</span>
              </div>
            </div>

            {/* Centro de Trabajo / Unidad Administrativa */}
            <div className="flex items-start gap-3 text-left">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0 mt-0.5">
                <Building2 size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Centro de Trabajo</span>
                <span className="text-xs font-bold text-gray-800">{centroTrabajo}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Unidad Administrativa</span>
                <span className="text-xs font-medium text-gray-600 leading-tight">{unidadAdministrativa}</span>
              </div>
            </div>

            {/* Dirección Completa */}
            <div className="flex items-start gap-3 text-left">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0 mt-0.5">
                <MapPin size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dirección</span>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  {direccion}
                  {numeroInterior && numeroInterior !== 'N/A' ? `, Int. ${numeroInterior}` : ''}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Col. {colonia}, C.P. {codigoPostal}
                </span>
                <span className="text-[11px] text-gray-400">
                  {ciudad}, {municipio}, {pais}
                </span>
              </div>
            </div>

          </div>

          {/* BOTÓN INFERIOR: Descargar VCard */}
          <div className="mt-6">
            <button 
              type="button" 
              className="w-full bg-[#1b449c] hover:bg-[#15357a] text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download size={14} />
              Descargar VCard
            </button>
          </div>
                
        </div>
      </div>
    </div>
    
  );
};