"use client";
import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegisterForm from "../ui/RegisterForm";
import ForgotPasswordForm from "../ui/ForgotPasswordForm";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<"login" | "register" | "forgot">("login");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
          ×
        </button>
        {view === "login" && <LoginForm onForgot={() => setView("forgot")} onRegister={() => setView("register")} />}
        {view === "register" && <RegisterForm onLogin={() => setView("login")} />}
        {view === "forgot" && <ForgotPasswordForm onLogin={() => setView("login")} />}
      </div>
    </div>
  );
}
