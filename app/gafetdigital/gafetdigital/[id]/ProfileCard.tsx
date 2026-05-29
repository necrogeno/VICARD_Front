// app/components/ProfileCard.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import Image from 'next/image';

export interface PersonaProps {
  nombre: string;
  apellidos: string;
  puesto: string;
  direccion: string;
  telefono: string;
  email: string;
  colonia: string;
  estaActivo: boolean;
  fotoUrl?: string;
}

export const ProfileCard = ({ persona }: { persona: PersonaProps }) => {
  const { nombre, apellidos, puesto, direccion, telefono, email, colonia, estaActivo, fotoUrl } = persona;
  const [imgSrc, setImgSrc] = useState(fotoUrl || '/productos/placeholder-default.jpg');

  return (
    <div className="lg:max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
      <div className="relative h-32 bg-blue-500 flex md:items-end justify-center">
        <div className="absolute -bottom-12">
          <div className="relative w-24 h-24"> {/* Contenedor con tamaño fijo para fill */}
            <Image
              src={imgSrc}
              alt={`${nombre} ${apellidos}`}
              fill
              className="rounded-full border-4 border-white object-cover bg-gray-200"
              onError={() => setImgSrc('/productos/placeholder-default.jpg')}
            />
            <span className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-white rounded-full ${estaActivo ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </div>
        </div>
      </div>

      <div className="pt-14 pb-8 px-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">
          {nombre} {apellidos}
        </h2>
        <p className="text-slate-500 font-medium flex items-center justify-center gap-1.5 mt-1">
          <Briefcase size={14} />
          {puesto}
        </p>
        
        <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${estaActivo ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {estaActivo ? 'Disponible' : 'No disponible'}
        </div>

        <hr className="my-6 border-slate-100" />

        <div className="space-y-4 text-left text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-slate-400 shrink-0" />
            <span>{telefono}</span>
          </div>
          
          <div className="flex items-start gap-3 text-indigo-600 font-medium">
            <Mail size={18} className="shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-slate-400 shrink-0" />
            <div>
              <p className="font-medium text-slate-800">{colonia}</p>
              <p className="text-xs text-slate-500">{direccion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};