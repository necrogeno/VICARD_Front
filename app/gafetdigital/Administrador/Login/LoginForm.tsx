'use client';

import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejaría la lógica de autenticación con el backend
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        
        {/* Encabezado */}
        <div className="text-center">
          {/* Isotipo/Logo Minimalista con toque lila */}
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-purple-400 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900 tracking-tight">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa tus credenciales para acceder a la plataforma
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Campo de Correo Electrónico */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-blue-500 transition-colors text-sm text-slate-900"
                placeholder="usuario@correo.com"
              />
            </div>

            {/* Campo de Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-purple-600 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-blue-500 transition-colors text-sm text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-purple-400 border-slate-300 rounded transition-colors"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 select-none">
              Recordar mi sesión
            </label>
          </div>

          {/* Botón de Acción Principal */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 shadow-sm transition-all duration-200"
            >
              Ingresar al sistema
            </button>
          </div>
        </form>

        {/* Footer del Login */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-purple-600 transition-colors">
              Solicitar acceso
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}