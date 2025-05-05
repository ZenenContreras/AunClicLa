"use client";
import React, { useState } from "react";
import { forgotPassword } from "../application/forgotPassword";
import { Mail } from "lucide-react";

export default function ForgotPasswordForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[420px] items-center justify-center bg-gray-50 py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/LogoAunClic.svg" alt="Logo" className="mx-auto h-20 w-auto mb-2" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Recuperar Contraseña</h2>
          <p className="mt-1 text-sm text-gray-600">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
        </div>
        {error && (
          <div className="p-3 bg-red-50 rounded-lg flex items-start space-x-2">
            <span className="text-red-400 mt-0.5">⚠️</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {sent ? (
          <div className="text-green-600 text-sm flex items-center gap-2 justify-center"><span>✅</span>¡Enlace enviado! Revisa tu correo.</div>
        ) : (
          <form className="space-y-5" onSubmit={handleForgot}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Mail size={18} /></span>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm text-gray-900 placeholder:text-gray-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 rounded-md bg-indigo-600 text-white font-semibold text-base shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar Enlace"
              )}
            </button>
          </form>
        )}
        <div className="text-center mt-4 text-sm">
          <button type="button" className="text-indigo-600 hover:underline" onClick={onLogin}>Volver a Iniciar Sesión</button>
        </div>
        <div className="bg-gray-100 px-6 py-3 text-xs text-center text-gray-500 rounded-lg mt-4">
          ¿Necesitas ayuda? Contacta a nuestro soporte en support@aunclic.com
        </div>
      </div>
    </div>
  );
}
