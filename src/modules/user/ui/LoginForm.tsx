"use client";
import React, { useState } from "react";
import { loginUser } from "../application/usecases/loginUser";
import { signInWithGoogle } from "../application/usecases/googleAuth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginForm({ onForgot, onRegister, onSuccess }: { onForgot: () => void; onRegister: () => void; onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("auth");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-5 py-7 max-w-xs w-full mx-auto">
      <div className="flex flex-col items-center mb-3">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-22" />
        <h2 className="text-xl font-bold text-indigo-700">{t("login.title")}</h2>
        <p className="text-gray-500 text-xs">{t("login.subtitle")}</p>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("login.email")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Mail size={16} /></span>
          <input
            type="email"
            className={`input pl-9 pr-3 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("login.password")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Lock size={16} /></span>
          <input
            type={showPassword ? "text" : "password"}
            className={`input pl-9 pr-9 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          {t("login.remember")}
        </label>
        <button type="button" className="text-indigo-600 text-xs hover:underline" onClick={onForgot}>{t("login.forgot")}</button>
      </div>
      {error && <div className="text-red-500 text-xs flex items-center gap-2"><span>⚠️</span>{error}</div>}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base shadow-md hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
        {loading ? t("login.loading") : t("login.button")}
      </button>
      <div className="flex items-center my-2"><hr className="flex-1" /><span className="mx-2 text-gray-400">{t("login.or")}</span><hr className="flex-1" /></div>
      <button
        type="button"
        className="w-full py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow hover:bg-gray-50 transition text-sm"
        onClick={signInWithGoogle}
      >
        <img src="/google-icon.svg" alt="Google" className="h-4 w-4" /> {t("login.google")}
      </button>
      <div className="text-center mt-3 text-xs">
        {t("login.noAccount")} <button type="button" className="text-indigo-600 hover:underline" onClick={onRegister}>{t("login.register")}</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        {t("login.terms1")} <a href="/terminos-de-servicio" className="underline">{t("login.terms2")}</a> {t("login.terms3")} <a href="/politica-de-privacidad" className="underline">{t("login.privacy")}</a>
      </div>
    </form>
  );
}
