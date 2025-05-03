"use client";
import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegisterForm from "../ui/RegisterForm";
import ForgotPasswordForm from "../ui/ForgotPasswordForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ open, onClose, onNotify }: { open: boolean; onClose: () => void; onNotify?: (msg: string, type?: string) => void }) {
  const [view, setView] = useState<"login" | "register" | "forgot">("login");

  if (!open) return null;

  const handleSuccess = () => {
    if (onNotify) onNotify("auth.notifications.loginSuccess", "success");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10"
            initial={{ scale: 0.92, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, duration: 0.32 }}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
              ×
            </button>
            {view === "login" && <LoginForm onForgot={() => setView("forgot")} onRegister={() => setView("register")} onSuccess={handleSuccess} />}
            {view === "register" && <RegisterForm onLogin={() => setView("login")} />}
            {view === "forgot" && <ForgotPasswordForm onLogin={() => setView("login")} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
