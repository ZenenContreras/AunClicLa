"use client";
import React, { useState } from "react";
import { registerUser } from "../application/usecases/registerUser";
import { signInWithGoogle } from "../application/usecases/googleAuth";

export default function RegisterForm({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password, name);
      // Muestra mensaje de verificación enviada
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-12 mb-2" />
        <h2 className="text-2xl font-bold">Crear Cuenta</h2>
        <p className="text-gray-500 text-sm">Únete a nuestra comunidad</p>
      </div>
      <label className="block text-sm font-medium">Nombre</label>
      <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required placeholder="Nombre" />
      <label className="block text-sm font-medium">Correo electrónico</label>
      <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
      <label className="block text-sm font-medium">Contraseña</label>
      <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" />
      <label className="block text-sm font-medium">Confirmar Contraseña</label>
      <input type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="********" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Cargando..." : "Crear Cuenta"}</button>
      <div className="flex items-center my-2"><hr className="flex-1" /><span className="mx-2 text-gray-400">o</span><hr className="flex-1" /></div>
      <button type="button" className="btn-google w-full" onClick={signInWithGoogle}>
        <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2 inline" /> Continuar con Google
      </button>
      <div className="text-center mt-4 text-sm">
        ¿Ya tienes una cuenta? <button type="button" className="text-indigo-600" onClick={onLogin}>Iniciar Sesión</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        Al continuar, aceptas nuestros <a href="/terminos-de-servicio" className="underline">Términos de Servicio</a> y <a href="/politica-de-privacidad" className="underline">Política de Privacidad</a>
      </div>
    </form>
  );
}
