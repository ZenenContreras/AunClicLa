"use client";
import React, { useState } from "react";
import { loginUser } from "../application/usecases/loginUser";
import { signInWithGoogle } from "../application/usecases/googleAuth";

export default function LoginForm({ onForgot, onRegister }: { onForgot: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      // Redirige o cierra modal
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-12 mb-2" />
        <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
        <p className="text-gray-500 text-sm">Accede a tu cuenta para continuar</p>
      </div>
      <label className="block text-sm font-medium">Correo electrónico</label>
      <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
      <label className="block text-sm font-medium">Contraseña</label>
      <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          Recuérdame
        </label>
        <button type="button" className="text-indigo-600 text-sm" onClick={onForgot}>¿Olvidaste tu contraseña?</button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Cargando..." : "Iniciar Sesión"}</button>
      <div className="flex items-center my-2"><hr className="flex-1" /><span className="mx-2 text-gray-400">o</span><hr className="flex-1" /></div>
      <button type="button" className="btn-google w-full" onClick={signInWithGoogle}>
        <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2 inline" /> Continuar con Google
      </button>
      <div className="text-center mt-4 text-sm">
        ¿No tienes una cuenta? <button type="button" className="text-indigo-600" onClick={onRegister}>Regístrate</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        Al continuar, aceptas nuestros <a href="/terminos-de-servicio" className="underline">Términos de Servicio</a> y <a href="/politica-de-privacidad" className="underline">Política de Privacidad</a>
      </div>
    </form>
  );
}
