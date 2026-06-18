// app/gafetdigital/[id]/page.tsx
import React from 'react';
import { GafetService } from '@/app/services/api';
import { notFound } from 'next/navigation';
import { ProfileCard, PersonaProps } from '@/app/gafetdigital/gafetdigital/[id]/ProfileCard'; // Asegúrate de ajustar la ruta
import { Landmark, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

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

    // Mapeo exhaustivo basándonos en tu objeto JSON
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
      telefonoPersonal: backendData.TelefonoPersonal,
    };

    return (
      <div className="w-full min-h-screen bg-fixed bg-gradient-to-b from-[#1e469a] via-[#3258a6] to-[#9568C6]/70 flex flex-col items-center p-0 m-0 overflow-x-hidden font-sans antialiased selection:bg-blue-200">
        
        {/* Banner Fijo Superior de Sitio Oficial de Gobierno */}
        <div className="w-full bg-[#0d2e75]/60 text-white text-[11px] py-2 text-center flex items-center justify-center gap-1.5 px-4 z-10 backdrop-blur-sm">
          <span className="inline-block w-3.5 h-3.5 bg-white text-[#11398d] rounded-full font-bold font-gotham text-[9px] leading-3.5 text-center">i</span>
          <span>
            politicadigital.chihuahua.gob.mx es un sitio oficial de Gobierno del Estado de Chihuahua.
          </span>
          
          {/* El botón se convierte en un <label> vinculado al checkbox invisible */}
          <label 
            htmlFor="toggle-banner"
            className="underline font-medium font-gotham opacity-90 hover:opacity-100 cursor-pointer flex items-center gap-0.5 ml-1 select-none"
          >
            {/* Alternamos textos y flechas de forma condicional puramente con CSS */}
            <span className="inline peer-checked:hidden">¿Cómo saberlo? <ChevronDown size={12} className="inline" /></span>
            <span className="hidden peer-checked:inline">Ocultar <ChevronUp size={12} className="inline" /></span>
          </label>
        </div>

        {/* TRUCO CSS: Checkbox oculto para controlar el estado sin "use client" */}
        <input type="checkbox" id="toggle-banner" className="peer hidden" />

        {/* SECCIÓN AZUL DE EXPLICACIÓN: Se despliega usando el estado del checkbox superior */}
        <div className="w-full bg-[#0d2e75]/60 text-white overflow-hidden max-h-0 opacity-0 transition-all duration-300 ease-in-out peer-checked:max-h-[500px] peer-checked:py-6 peer-checked:opacity-100 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Bloque 1: Dominio Oficial */}
            <div className="flex gap-4">
              <div className="p-2 rounded-xl shrink-0">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-bold font-gotham text-sm tracking-wide">Dominio oficial .gob</h4>
                <p className="text-xs font-gotham text-white/80 mt-1 leading-relaxed">
                  Los sitios web oficiales del Gobierno de Chihuahua están adheridos al dominio <span className="font-semibold text-white">chihuahua.gob.mx</span>
                </p>
              </div>
            </div>

            {/* Bloque 2: Seguridad Digital HTTPS */}
            <div className="flex gap-4">
              <div className="p-2 rounded-xl shrink-0">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-bold font-gotham text-sm tracking-wide">Seguridad Digital HTTPS</h4>
                <p className="text-xs font-gotham text-white/80 mt-1 leading-relaxed">
                  Todos los sitios web oficiales del Gobierno de Chihuahua cuentan con certificado de seguridad SSL.
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* Cuadro contenedor para el Logo de Gobierno */}
        <div className="w-50 h-20 flex flex-col items-center justify-center p-1 mt-10 mb-15">
          <Image
            src="/Horizontal-Institucional-Gobierno-Blanco.svg"
            alt="GOBIERNO DEL ESTADO DE CHIHUAHUA"
            width={195} // Ajusta según necesites
            height={65}
            className="object-cover"
            priority
          />
        </div>

        {/* Contenedor del Gafet */}
        <div className="flex-1 flex items-center justify-center p-4 w-full max-w-lg md:max-w-4xl mb-2">
          <ProfileCard persona={datosPersona} />
        </div>





        {/* logo parte de abajo */}
        <div>
              <div className="w-full h-20 flex flex-col items-center justify-center mt-40 mb-10">
                <Image
                  src="/Logo-Institucional-Vertical-Gobierno-Chihuahua-2025-Blanco.svg"
                  alt="GOBIERNO DEL ESTADO DE CHIHUAHUA"
                  width={300} // Ajusta según necesites
                  height={100}
                  className="object-cover"
                  priority
                />
              </div>
            </div>


            {/* redes sociales */}
            <div className='flex flex-col justify-center items-center p-10 gap-3 mt-10'>
              <span className='block font-gotham font-bold text-center text-white text-sm'>Síguenos:</span>
              
              {/* Contenedor de iconos alineados horizontalmente */}
              <div className='flex items-center justify-center gap-3'>
                
                {/* FACEBOOK */}
                <a 
                  href="https://www.facebook.com/gobiernodechihuahua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* X (TWITTER) */}
                <a 
                  href="https://x.com/GobiernoEdoChih" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>

                {/* INSTAGRAM */}
                <a 
                  href="https://www.instagram.com/gobiernodechihuahua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* YOUTUBE */}
                <a 
                  href="https://www.youtube.com/@gobiernodechihuahua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* TIKTOK */}
                <a 
                  href="https://www.tiktok.com/@gobiernodechihuahua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 30 30" aria-hidden="true">
                    <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"/>
                  </svg>
                </a>

              </div>
            </div>

            {/* enlace */}
            <div className="w-full max-w-sm mx-auto p-6 font-sans antialiased">
              
              {/* Tarjeta Principal */}
              <div className=" rounded-lg p-6 text-center">
                
                {/* Título */}
                <h2 className="text-white font-gotham text-2xl md:text-3xl font-bold tracking-wide mb-4">
                  chihuahua.gob.mx
                </h2>
                
                {/* Barra de progreso / Línea divisoria */}
                <div className="w-full h-2 bg-white rounded-full overflow-hidden flex mb-4">
                  {/* Parte morada (ajusta el ancho w-1/2 según lo requieras) */}
                  <div className="w-1/2 h-full bg-[#9568C6]"></div>
                  {/* Parte blanca */}
                  <div className="w-1/2 h-full bg-white"></div>
                </div>
                
                {/* Footer de la tarjeta */}
                <p className="text-white/80 font-gotham text-xs flex items-center justify-center gap-1">
                  <span>©</span> Portal de Gobierno del Estado de Chihuahua
                </p>

              </div>

            </div>







      </div>

      


    );
  } catch (error) {
    console.error("Error al obtener los datos del gafet:", error);
    return notFound();
  }
}