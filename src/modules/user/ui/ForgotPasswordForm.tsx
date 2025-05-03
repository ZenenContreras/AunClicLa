"use client";
import React, { useState } from "react";
import { forgotPassword } from "../application/usecases/forgotPassword";
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
    <form onSubmit={handleForgot} className="space-y-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-6 py-8 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-4">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-22" />
        <h2 className="text-2xl font-bold text-indigo-700">Recuperar Contraseña</h2>
        <p className="text-gray-500 text-sm text-center">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Mail size={18} /></span>
          <input
            type="email"
            className="input pl-10 pr-3 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm flex items-center gap-2"><span>⚠️</span>{error}</div>}
      {sent ? (
        <div className="text-green-600 text-sm flex items-center gap-2"><span>✅</span>¡Enlace enviado! Revisa tu correo.</div>
      ) : (
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>}
          Enviar Enlace
        </button>
      )}
      <div className="text-center mt-4 text-sm">
        <button type="button" className="text-indigo-600 hover:underline" onClick={onLogin}>Volver a Iniciar Sesión</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        ¿No recibiste el correo? Revisa tu carpeta de spam o intenta con otro correo.
      </div>
    </form>
  );
}
