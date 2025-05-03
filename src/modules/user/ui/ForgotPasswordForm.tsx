"use client";
import React, { useState } from "react";
import { forgotPassword } from "../application/usecases/forgotPassword";

export default function ForgotPasswordForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleForgot} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-12 mb-2" />
        <h2 className="text-2xl font-bold">Recuperar Contraseña</h2>
        <p className="text-gray-500 text-sm">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
      </div>
      <label className="block text-sm font-medium">Correo electrónico</label>
      <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {sent ? (
        <div className="text-green-600 text-sm">¡Enlace enviado! Revisa tu correo.</div>
      ) : (
        <button type="submit" className="btn-primary w-full">Enviar Enlace</button>
      )}
      <div className="text-center mt-4 text-sm">
        <button type="button" className="text-indigo-600" onClick={onLogin}>Volver a Iniciar Sesión</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        ¿No recibiste el correo? Revisa tu carpeta de spam o intenta con otro correo.
      </div>
    </form>
  );
}
