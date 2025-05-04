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
    <form onSubmit={handleLogin} className="space-y-4 bg-white rounded-2xl shadow-xl px-4 py-6 max-w-md w-full mx-auto">
      <div className="flex flex-col items-center mb-3">
        <img src="/LogoAunClic.svg" alt="Logo" className="h-20 mb-1" />
        <h2 className="text-xl font-bold text-gray-900">{t("login.title")}</h2>
        <p className="text-gray-600 text-xs">{t("login.subtitle")}</p>
      </div>
      {error && (
        <div className="p-2 mb-2 bg-red-50 rounded-xl flex items-start space-x-2">
          <span className="text-red-400 mt-0.5">⚠️</span>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold mb-1 text-gray-700">{t("login.email")}</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Mail size={16} /></span>
          <input
            type="email"
            className="pl-9 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder:text-gray-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1 text-gray-700">{t("login.password")}</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Lock size={16} /></span>
          <input
            type={showPassword ? "text" : "password"}
            className="pl-9 pr-9 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder:text-gray-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 p-1 rounded-full hover:bg-gray-100"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center text-xs text-gray-600">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <span className="ml-2">{t("login.remember")}</span>
        </label>
        <button type="button" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium" onClick={onForgot}>{t("login.forgot")}</button>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t("login.loading")}
          </span>
        ) : (
          t("login.button")
        )}
      </button>
      <div className="flex items-center my-2">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="px-2 text-gray-500 text-xs">{t("login.or")}</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
      <button
        type="button"
        className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        onClick={signInWithGoogle}
      >
        <img src="/google-icon.svg" alt="Google" className="h-4 w-4 mr-2" /> {t("login.google")}
      </button>
      <div className="text-center mt-3 text-xs text-gray-800">
        {t("login.noAccount")} <button type="button" className="text-indigo-600 hover:underline font-semibold" onClick={onRegister}>{t("login.register")}</button>
      </div>
      <div className="text-xs text-gray-600 mt-2 text-center">
        {t("login.terms1")} <a href="/terminos-de-servicio" className="underline text-indigo-600">{t("login.terms2")}</a> {t("login.terms3")} <a href="/politica-de-privacidad" className="underline text-indigo-600">{t("login.privacy")}</a>
      </div>
    </form>
  );
}
