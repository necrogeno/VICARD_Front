// app/gafetdigital/[id]/page.tsx
import React from 'react';
import { GafetService } from '@/app/services/api';
import { notFound } from 'next/navigation';
import { ProfileCard, PersonaProps } from '@/app/gafetdigital/gafetdigital/[id]/ProfileCard'; // Ajusta si tu ruta difiere

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Home({ params }: Props) {
  const { id } = await params;

  try {
    const backendData: any = await GafetService.getById(id);

    if (!backendData) {
      return notFound();
    }

    // Mapeo exhaustivo basándonos en la imagen del JSON de ejemplo
    const datosPersona: PersonaProps = {
      idEmpleado: backendData.IdEmpleado || '[FALTANTE]',
      nombre: backendData.Nombres || '[FALTANTE]',
      apellidos: `${backendData.PrimerApellido || ''} ${backendData.SegundoApellido || ''}`.trim() || '[FALTANTE]',
      puesto: backendData.Puesto || '[FALTANTE]',
      telefono: backendData.Telefono || '[FALTANTE]',
      extension: backendData.Extension || '[FALTANTE]',
      email: backendData.email || '[FALTANTE]',
      centroTrabajo: backendData.CentroTrabajo || '[FALTANTE]',
      unidadAdministrativa: backendData.UnidadAdministrativa || '[FALTANTE]',
      direccion: `${backendData.Direccion || ''} ${backendData.NumeroExterior || ''}`.trim() || '[FALTANTE]',
      numeroInterior: backendData.NumeroInterior || '[FALTANTE]',
      colonia: backendData.Colonia || '[FALTANTE]',
      codigoPostal: backendData.CodigoPostal || '[FALTANTE]',
      ciudad: backendData.Ciudad || '[FALTANTE]',
      municipio: backendData.Municipio || '[FALTANTE]',
      pais: backendData.Pais || '[FALTANTE]',
      estaActivo: typeof backendData.Activo === 'boolean' ? backendData.Activo : false,
      fotoUrl: backendData.Foto ? `${backendData.Foto}` : undefined,
    };

    return (
      // Aplicamos el gradiente de fondo exacto de la imagen (Desde #3258a6 hasta el morado #9568C6)
      <div className="w-full min-h-screen bg-gradient-to-b from-[#1e469a] via-[#3258a6] to-[#9568C6] flex flex-col items-center p-0 m-0 overflow-x-hidden font-sans antialiased selection:bg-blue-200">
        
        {/* Banner Superior de Sitio Oficial de Gobierno */}
        <div className="w-full text-white text-[11px] py-2 text-center flex items-center justify-center gap-1 px-4 z-10 backdrop-blur-sm">
          <span className="inline-block w-3 h-3 bg-white text-[#112d6e] rounded-full font-bold text-[9px] leading-3 text-center">i</span>
          Este es un sitio oficial de Gobierno del Estado de Chihuahua. <span className="underline cursor-pointer opacity-90 hover:opacity-100">¿Cómo saberlo?</span>
        </div>

        {/* Cuadro contenedor para el Logo de Gobierno */}
        <div className="w-36 h-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-center text-[10px] p-1 mt-6 mb-15">
          <span className="font-bold text-gray-500 text-xs">LOGO GOBIERNO</span>
          <span>ESTADO DE CHIHUAHUA</span>
        </div>

        {/* Contenedor del Gafet */}
        <div className="flex-1 flex items-center justify-center p-4 w-full max-w-lg md:max-w-4xl my-4">
          <ProfileCard persona={datosPersona} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error al obtener los datos del gafet:", error);
    return notFound();
  }
}