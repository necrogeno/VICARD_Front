'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/gafetdigital/Administrador');
    } else {
      setError('Correo o contraseña incorrectos.');
    }
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

        <div className="h-12"></div>

        <p className="text-white/90 text-base font-normal tracking-wide text-center">
          Inicio de Sesión · Gestor de VCards
        </p>

        <div className="h-6"></div>

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
            <button
              type="button"
              className="absolute right-4 bottom-3 text-slate-400 hover:text-slate-600"
            >
              O
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          <div className="h-2"></div>

          {/* Botón Iniciar Sesión */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-[240px] py-2.5 bg-gradient-to-r from-[#9853be] to-[#b169d4] hover:from-[#8742ad] hover:to-[#a058c3] disabled:opacity-60 text-white text-base font-bold rounded-full shadow-lg shadow-black/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
