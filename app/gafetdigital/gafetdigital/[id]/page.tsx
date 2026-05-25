import React from 'react';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { GafetService } from '@/app/services/api';
import { notFound } from 'next/navigation';

// 1. Mantén la estructura limpia de tu interfaz de UI
interface PersonaProps {
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

// 2. Componente de la Tarjeta (Se queda exactamente igual)
const ProfileCard = ({ persona }: { persona: PersonaProps }) => {
  const { 
    nombre, 
    apellidos, 
    puesto, 
    direccion, 
    telefono, 
    email, 
    colonia, 
    estaActivo, 
    fotoUrl 
  } = persona;

  return (
    <div className="lg:max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
      <div className="relative h-32 bg-blue-500 flex md:items-end justify-center">
        <div className="absolute -bottom-12">
          <div className="relative">
            <img 
              src={fotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
              alt={`${nombre} ${apellidos}`}
              className="w-24 h-24 rounded-full border-4 border-white object-cover bg-gray-200"
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

interface Props {
  params: Promise<{ id: string }>;
}

// 3. Página Principal Asíncrona
export default async function Home({ params }: Props) {
  const { id } = await params;

  try {
    // Obtenemos el objeto crudo (any) desde el backend
    const backendData: any = await GafetService.getById(id);

    // Mapeamos las propiedades en español/mayúsculas a nuestro formato de interfaz
    const datosPersona: PersonaProps = {
      nombre: backendData.Nombres,
      apellidos: `${backendData.PrimerApellido} ${backendData.SegundoApellido}`.trim(),
      puesto: backendData.Puesto,
      direccion: `${backendData.Direccion} ${backendData.NumeroExterior}`,
      telefono: backendData.Telefono,
      email: backendData.email, // Este sí funcionaba porque venía en minúsculas en el JSON
      colonia: backendData.Colonia,
      estaActivo: backendData.Activo,
      fotoUrl: backendData.Foto 
        ? `${process.env.NEXT_PUBLIC_API_URL}${backendData.Foto}` 
        : undefined
    };

    return (
      <div className="flex lg:items-center justify-center min-h-screen bg-gray-50 p-4">
        <ProfileCard persona={datosPersona} />
      </div>
    );
  } catch (error) {
    console.error("Error al obtener los datos del gafet:", error);
    notFound(); 
  }
}