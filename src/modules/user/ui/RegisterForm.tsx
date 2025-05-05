"use client";
import React, { useState } from "react";
import { registerUser } from "../application/registerUser";
import { signInWithGoogle } from "../application/googleAuth";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from '@headlessui/react';

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
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
      setShowVerificationModal(true);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-3 bg-white rounded-2xl shadow-xl px-2 py-4 max-w-md w-full mx-auto ">
        <div className="flex flex-col items-center mb-2">
          <img src="/LogoAunClic.svg" alt="Logo" className="h-14 mb-1" />
          <h2 className="text-base font-bold text-gray-900">{t("register.title")}</h2>
          <p className="text-gray-600 text-xs">{t("register.subtitle")}</p>
        </div>
        {error && (
          <div className="p-2 mb-2 bg-red-50 rounded-xl flex items-start space-x-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("register.name")}</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon size={16} /></span>
            <input
              type="text"
              className="pl-9 pr-3 py-2 w-full rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder={t("register.namePlaceholder")}
              autoComplete="name"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("register.email")}</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></span>
            <input
              type="email"
              className="pl-9 pr-3 py-2 w-full rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder={t("register.emailPlaceholder")}
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("register.password")}</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></span>
            <input
              type={showPassword ? "text" : "password"}
              className="pl-9 pr-9 py-2 w-full rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder={t("register.passwordPlaceholder")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 p-1 rounded-full hover:bg-gray-100"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? t("register.hidePassword") : t("register.showPassword")}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("register.confirm")}</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></span>
            <input
              type={showConfirm ? "text" : "password"}
              className="pl-9 pr-9 py-2 w-full rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder={t("register.confirmPlaceholder")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 p-1 rounded-full hover:bg-gray-100"
              tabIndex={-1}
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? t("register.hidePassword") : t("register.showPassword")}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("register.loading")}
            </span>
          ) : (
            t("register.button")
          )}
        </button>
        <div className="flex items-center my-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-2 text-gray-500 text-xs">{t("register.or")}</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <button
          type="button"
          className="w-full flex justify-center items-center py-2 px-4 rounded-xl shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 border border-gray-200"
          onClick={signInWithGoogle}
        >
          <img src="/google-icon.svg" alt="Google" className="h-4 w-4 mr-2" /> {t("register.google")}
        </button>
        <div className="text-center mt-2 text-xs text-gray-800">
          {t("register.hasAccount")} <button type="button" className="text-indigo-600 hover:underline font-semibold" onClick={onLogin}>{t("register.login")}</button>
        </div>
        <div className="text-xs text-gray-600 mt-1 text-center">
          {t("register.terms1")} <a href="/terminos-de-servicio" className="underline text-indigo-600">{t("register.terms2")}</a> {t("register.terms3")} <a href="/politica-de-privacidad" className="underline text-indigo-600">{t("register.privacy")}</a>
        </div>
      </form>
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 flex flex-col items-center">
            <img src="/LogoAunClic.svg" alt="Logo" className="h-14 mb-2" />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-base font-bold text-gray-900 mb-1">¡Verifica tu correo!</div>
            <div className="text-gray-600 text-xs text-center mb-2">Te hemos enviado un correo de verificación a <span className="font-semibold text-indigo-600">{email}</span>. Sigue el enlace para activar tu cuenta.</div>
            <button
              onClick={() => {
                setShowVerificationModal(false);
                setName("");
                setEmail("");
                setPassword("");
                setConfirm("");
                onLogin();
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
