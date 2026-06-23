'use client';

import React, { useState } from 'react';
import Image from 'next/image';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#0c54be] to-[#a452bfab] px-4 font-['Public_Sans',sans-serif] relative select-none">
      
      {/* Banner Superior Gobierno del Estado */}
      <div className="absolute top-0 left-0 w-full text-center py-2 bg-black/10 text-[10px] text-white/80 tracking-wide">
        eventos.chihuahua.gob.mx es un sitio oficial de Gobierno del Estado de Chihuahua. <span className="underline cursor-pointer">¿Cómo saberlo?</span>
      </div>

      {/* Contenedor Principal Centrado */}
      <div className="flex flex-col items-center w-full max-w-[440px]">
        
        {/* Logo / Escudo del Estado (Ancho: 180px) */}
        <div className="w-[180px] flex flex-col items-center text-center text-white text-xs font-bold tracking-widest leading-tight">
          <Image
          alt='Gobierno del Estado de Chihuahua'
          src="/Logo-Institucional-Vertical-Gobierno-Chihuahua-2025-Blanco.svg"
          width={180}
          height={100}
          
          />
        </div>

        {/* Espacio de 48px según el plano */}
        <div className="h-12"></div>

        {/* Subtítulo del Formulario */}
        <p className="text-white/90 text-base font-normal tracking-wide text-center">
          Inicio de Sesión · Gestor de VCards
        </p>

        {/* Espacio de 24px según el plano */}
        <div className="h-6"></div>

        {/* Formulario */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          
          {/* Campo: Correo Institucional */}
          <div className="relative">
            <label className="absolute top-2 left-4 text-[10px] text-slate-400 font-medium pointer-events-none">
              Correo Institucional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre.apellido@chihuahua.gob.mx"
              className="w-full bg-[#f1f3f5] text-slate-800 pt-6 pb-2 px-4 rounded-full text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all border border-transparent"
            />
          </div>

          {/* Espacio de 16px entre inputs según el plano */}
          <div className="h-0"></div>

          {/* Campo: RFC / Contraseña */}
          <div className="relative">
            <label className="absolute top-2 left-4 text-[10px] text-slate-400 font-medium pointer-events-none">
              RFC
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••••••"
              className="w-full bg-[#f1f3f5] text-slate-800 pt-6 pb-2 px-4 rounded-full text-base placeholder-slate-400 tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all border border-transparent"
            />
            {/* Icono de visibilidad (Ojo) */}
            <button 
              type="button" 
              className="absolute right-4 bottom-3 text-slate-400 hover:text-slate-600"
            >
              O
            </button>
          </div>

          {/* Espacio de 24px según el plano */}
          <div className="h-2"></div>

          {/* Botón Iniciar Sesión (Ancho: 240px centrado) */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-[240px] py-2.5 bg-gradient-to-r from-[#9853be] to-[#b169d4] hover:from-[#8742ad] hover:to-[#a058c3] text-white text-base font-bold rounded-full shadow-lg shadow-black/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
            >
              Iniciar Sesión
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}