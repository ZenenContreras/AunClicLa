"use client";
import React, { useState } from "react";
import { registerUser } from "../application/usecases/registerUser";
import { signInWithGoogle } from "../application/usecases/googleAuth";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RegisterForm({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const t = useTranslations("auth");

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
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-5 py-7 max-w-xs w-full mx-auto">
      <div className="flex flex-col items-center mb-3">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-22" />
        <h2 className="text-xl font-bold text-indigo-700">{t("register.title")}</h2>
        <p className="text-gray-500 text-xs">{t("register.subtitle")}</p>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("register.name")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><UserIcon size={16} /></span>
          <input
            type="text"
            className="input pl-9 pr-3 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder={t("register.namePlaceholder")}
            autoComplete="name"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("register.email")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Mail size={16} /></span>
          <input
            type="email"
            className="input pl-9 pr-3 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder={t("register.emailPlaceholder")}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("register.password")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Lock size={16} /></span>
          <input
            type={showPassword ? "text" : "password"}
            className="input pl-9 pr-9 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder={t("register.passwordPlaceholder")}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? t("register.hidePassword") : t("register.showPassword")}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{t("register.confirm")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Lock size={16} /></span>
          <input
            type={showConfirm ? "text" : "password"}
            className="input pl-9 pr-9 py-2 w-full rounded-lg border focus:border-indigo-500 transition outline-none bg-white/80 text-sm"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder={t("register.confirmPlaceholder")}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500"
            tabIndex={-1}
            onClick={() => setShowConfirm(v => !v)}
            aria-label={showConfirm ? t("register.hidePassword") : t("register.showPassword")}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs flex items-center gap-2"><span>⚠️</span>{error}</div>}
      {success && <div className="text-green-600 text-xs flex items-center gap-2"><span>✅</span>{t("register.success")}</div>}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base shadow-md hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
        {loading ? t("register.loading") : t("register.button")}
      </button>
      <div className="flex items-center my-2"><hr className="flex-1" /><span className="mx-2 text-gray-400">{t("register.or")}</span><hr className="flex-1" /></div>
      <button
        type="button"
        className="w-full py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow hover:bg-gray-50 transition text-sm"
        onClick={signInWithGoogle}
      >
        <img src="/google-icon.svg" alt="Google" className="h-4 w-4" /> {t("register.google")}
      </button>
      <div className="text-center mt-3 text-xs">
        {t("register.hasAccount")} <button type="button" className="text-indigo-600 hover:underline" onClick={onLogin}>{t("register.login")}</button>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        {t("register.terms1")} <a href="/terminos-de-servicio" className="underline">{t("register.terms2")}</a> {t("register.terms3")} <a href="/politica-de-privacidad" className="underline">{t("register.privacy")}</a>
      </div>
    </form>
  );
}
