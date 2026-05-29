// app/gafet/[id]/page.tsx (o la ruta en la que esté tu página)
import React from 'react';
import { GafetService } from '@/app/services/api';
import { notFound } from 'next/navigation';
import { ProfileCard, PersonaProps } from '@/app/gafetdigital/gafetdigital/[id]/ProfileCard'; // Asegúrate de ajustar la ruta de importación

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Home({ params }: Props) {
  const { id } = await params;

  try {
    const backendData: any = await GafetService.getById(id);

    const datosPersona: PersonaProps = {
      nombre: backendData.Nombres,
      apellidos: `${backendData.PrimerApellido} ${backendData.SegundoApellido}`.trim(),
      puesto: backendData.Puesto,
      direccion: `${backendData.Direccion} ${backendData.NumeroExterior}`,
      telefono: backendData.Telefono,
      email: backendData.email,
      colonia: backendData.Colonia,
      estaActivo: backendData.Activo,
      fotoUrl: backendData.Foto 
        ? `${backendData.Foto}` 
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