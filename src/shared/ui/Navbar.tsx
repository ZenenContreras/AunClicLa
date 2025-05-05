"use client";

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Heart, LogOut, ChevronDown, ChevronRight, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../hooks/useUser";
import AuthModal from "../../modules/user/ui/AuthModal";
import { supabase } from "../lib/supabase/supabaseClient";

// Simulación de hooks de usuario y carrito (reemplazar por lógica real)
const useMockCart = () => ({ cartItemCount: 2 });

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const NAV_LINKS = [
  { id: "home", labelKey: "home", href: "/" },
  { id: "products", labelKey: "products", href: "/productos" },
  { id: "foods", labelKey: "foods", href: "/comidas" },
  { id: "boutique", labelKey: "boutique", href: "/boutique" },
];

function getPathWithLocale(pathname: string, newLocale: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (LANGUAGES.some((l) => l.code === parts[0])) {
    parts[0] = newLocale;
  } else {
    parts.unshift(newLocale);
  }
  return "/" + parts.join("/");
}

const LanguageSelectorStyled = ({ isMobile = false }: { isMobile?: boolean }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const languageOptions = LANGUAGES.map(l => ({ value: l.code, label: l.label, flag: l.flag }));
  const currentLanguage = languageOptions.find((option) => option.value === locale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleLanguageChange = (langValue: string) => {
    setIsOpen(false);
    const newPath = getPathWithLocale(pathname, langValue);
    router.replace(newPath);
  };

  return (
    <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }} ref={ref}>
      <motion.button
        className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm duration-200`}
        onClick={() => setIsOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        aria-label="Seleccionar idioma"
        style={{ cursor: "pointer" }}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        {!isMobile && <span className="font-medium text-base">{currentLanguage?.label}</span>}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-indigo-600">▼</motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className={`absolute mt-2 right-0 ${isMobile ? "w-36" : "w-44"} bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }}>
            {languageOptions.map((option) => (
              <motion.button key={option.value} className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-base ${locale === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleLanguageChange(option.value)} whileHover={{ x: 5 }} style={{ cursor: "pointer" }}>
                <span className="text-lg">{option.flag}</span>
                <span>{option.label}</span>
                {locale === option.value && (
                  <motion.span className="ml-auto text-indigo-600 text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 10 }}>✓</motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- SISTEMA DE NOTIFICACIONES ---
const NotificationContext = createContext<any>(null);
export function useNotification() {
  return useContext(NotificationContext);
}

function ToastContainer({ toasts, onRemove }: { toasts: any[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35 }}
          className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold flex items-center gap-2 ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"}`}
          style={{ minWidth: 220, maxWidth: 320 }}
        >
          {toast.type === "success" ? "✅" : "⚠️"}
          <span>{toast.message}</span>
          <button className="ml-2 text-white/70 hover:text-white" onClick={() => onRemove(toast.id)} aria-label="Cerrar">×</button>
        </motion.div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations("navbar");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const { cartItemCount } = useMockCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Avatar: foto de Google o inicial
  const getUserAvatar = (user: any) => user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const getUserInitial = (user: any) => user?.email?.charAt(0)?.toUpperCase() || "U";
  const getUserName = (user: any) => user?.user_metadata?.nombre || user?.email?.split("@")[0] || "Usuario";

  // --- NOTIFICACIONES ---
  const [toasts, setToasts] = useState<any[]>([]);
  const tNotif = useTranslations();
  const notify = (msgKey: string, type: string = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message: tNotif(msgKey), type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2000);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Menú de usuario (solo foto/avatar en desktop)
  const renderUserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen((v) => !v)}
        className="flex items-center focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isUserMenuOpen}
        style={{ cursor: "pointer" }}
      >
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200 shadow transition-all duration-200 hover:ring-2 hover:ring-indigo-400">
          {getUserAvatar(user) ? (
            <img src={getUserAvatar(user)} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-indigo-600 font-bold text-lg">{getUserInitial(user)}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-600 ml-1 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-56 bg-white/95 rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 backdrop-blur-md"
          >
            <button onClick={() => { router.push("/perfil"); setIsUserMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition" style={{ cursor: "pointer" }}><User className="h-4 w-4 mr-2" />{tAuth("userMenu.profile")}</button>
            <button onClick={() => { router.push("/pedidos"); setIsUserMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition" style={{ cursor: "pointer" }}><ShoppingCart className="h-4 w-4 mr-2" />{tAuth("userMenu.orders")}</button>
            <button onClick={() => { router.push("/favoritos"); setIsUserMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition" style={{ cursor: "pointer" }}><Heart className="h-4 w-4 mr-2" />{tAuth("userMenu.favorites")}</button>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={async () => { await supabase.auth.signOut(); setIsUserMenuOpen(false); notify("auth.notifications.logoutSuccess", "success"); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition" style={{ cursor: "pointer" }}><LogOut className="h-4 w-4 mr-2" />{tAuth("userMenu.logout")}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Navegación
  const handleNavClick = useCallback((href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }, [router]);

  return (
    <>
      <NotificationContext.Provider value={notify}>
        <motion.header
          className="fixed w-full z-50 bg-white shadow-lg border-b border-indigo-50 backdrop-blur-xl"
          initial={false}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
          role="banner"
        >
          <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between h-16 md:h-18">
            <motion.div
              className="flex items-center gap-1 group cursor-pointer select-none min-w-[180px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              tabIndex={0}
              aria-label="Ir al inicio"
            >
              <motion.div whileHover={{ rotate: [0, -5, 5, -5, 0], filter: ["drop-shadow(0 0 0 #a5b4fc)", "drop-shadow(0 0 12px #a5b4fc)", "drop-shadow(0 0 0 #a5b4fc)"] }} transition={{ duration: 0.7 }}>
                <Image src="/LogoAunClic.svg" alt="Logo" width={56} height={56} className="h-16 w-16 md:h-14 md:w-14" priority />
              </motion.div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-xl md:text-2xl tracking-tight leading-none group-hover:underline group-focus:underline transition-all duration-200 -ml-4">A un clic la</span>
            </motion.div>
            <div className="hidden md:flex flex-1 justify-center">
              <motion.ul className="flex gap-3 lg:gap-6 items-center" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } } }} className="relative">
                    <button
                      className={`px-2 py-2 rounded-lg font-quicksand text-lg tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 
                        ${pathname === link.href ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"}
                        bg-transparent`}
                      aria-current={pathname === link.href ? "page" : undefined}
                      style={{ minWidth: 90, cursor: "pointer", fontFamily: 'Quicksand, sans-serif' }}
                      onClick={() => handleNavClick(link.href)}
                    >
                      <span className="relative">
                        {t(link.labelKey)}
                        {pathname === link.href && (
                          <motion.div
                            className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full"
                            layoutId="nav-underline"
                            initial={{ opacity: 0, scaleX: 0.7 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0.7 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                          />
                        )}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <div className="hidden md:flex items-center gap-3 lg:gap-5">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200" aria-label={t("cart")}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>
              {user ? renderUserMenu() : (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors shadow-md text-base font-semibold min-w-[140px]" aria-label="Iniciar sesión" style={{ height: 44, cursor: "pointer" }} onClick={() => setIsAuthModalOpen(true)}>
                  <User className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </motion.button>
              )}
              <div className="ml-1"><LanguageSelectorStyled /></div>
            </div>
            {/* MOBILE NAV */}
            <div className="flex md:hidden items-center gap-1.5">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200" aria-label={t("cart")}>
                <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8" />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>
              <LanguageSelectorStyled isMobile />
              <button className="ml-1 p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all" onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menú móvil" style={{ cursor: "pointer" }}>
                <Menu className="h-8 w-8" />
              </button>
            </div>
          </nav>
        </motion.header>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div className="fixed inset-0 z-[101] flex flex-col h-full w-full max-w-[100vw] bg-white/98 shadow-2xl p-0 md:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} style={{ WebkitBackdropFilter: 'blur(18px)', backdropFilter: 'blur(18px)' }}>
              <div className="flex items-center justify-between px-5 pt-safe-top pb-2 h-20 border-b border-indigo-50 bg-white/90 sticky top-0 z-10">
                <div className="flex items-center gap-1 group cursor-pointer select-none">
                  <Image src="/LogoAunClic.svg" alt="Logo" width={44} height={44} className="h-12 w-12" />
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-lg tracking-tight leading-none group-hover:underline">A un clic la</span>
                </div>
                <button className="p-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" onClick={() => setIsMobileMenuOpen(false)} aria-label="Cerrar menú móvil" style={{ cursor: "pointer" }}>
                  <X className="h-8 w-8 text-indigo-500" />
                </button>
              </div>
              <div className="flex items-center gap-3 px-5 py-6 border-b border-indigo-50 bg-white/90">
                {user && (
                  <>
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200 shadow">
                      {getUserAvatar(user) ? (
                        <img src={getUserAvatar(user)} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-indigo-600 font-bold text-lg">{getUserInitial(user)}</span>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{getUserName(user)}</span>
                  </>
                )}
              </div>
              <nav className="flex-1 flex flex-col gap-1 px-2 py-6 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <button key={link.id} className={`flex items-center w-full text-left px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${pathname === link.href ? "bg-indigo-50 text-indigo-700 shadow-md" : "hover:bg-indigo-50 text-gray-800"}`} aria-current={pathname === link.href ? "page" : undefined} style={{ minHeight: 52, cursor: "pointer" }} onClick={() => handleNavClick(link.href)}>
                    {t(link.labelKey)}
                    {pathname === link.href && <ChevronRight className="ml-auto h-6 w-6 text-indigo-500" />}
                  </button>
                ))}
              </nav>
              <div className="px-2 pb-8 pt-2 flex flex-col gap-4">
                <div className="w-full flex flex-col gap-2">
                  {user ? (
                    <>
                      <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm transition-all duration-150" style={{ cursor: "pointer" }} onClick={() => { router.push("/perfil"); setIsMobileMenuOpen(false); }}><User className="h-8 w-8" /> <span>{tAuth("userMenu.profile")}</span></button>
                      <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm transition-all duration-150" style={{ cursor: "pointer" }} onClick={() => { router.push("/pedidos"); setIsMobileMenuOpen(false); }}><ShoppingCart className="h-8 w-8" /> <span>{tAuth("userMenu.orders")}</span></button>
                      <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm transition-all duration-150" style={{ cursor: "pointer" }} onClick={() => { router.push("/favoritos"); setIsMobileMenuOpen(false); }}><Heart className="h-8 w-8" /> <span>{tAuth("userMenu.favorites")}</span></button>
                      <button className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-sm transition-all duration-150" style={{ cursor: "pointer" }} onClick={async () => { await supabase.auth.signOut(); setIsMobileMenuOpen(false); }}><LogOut className="h-8 w-8" /> <span>{tAuth("userMenu.logout")}</span></button>
                    </>
                  ) : (
                    <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm transition-all duration-150" style={{ cursor: "pointer" }} onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}><User className="h-8 w-8" /> <span>Iniciar Sesión</span></button>
                  )}
                </div>
                <div className="mt-2 flex justify-center"><LanguageSelectorStyled isMobile /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onNotify={notify} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </NotificationContext.Provider>
      <style jsx global>{`
        @media (max-width: 768px) {
          .pt-safe-top {
            padding-top: env(safe-area-inset-top, 1rem);
          }
        }
      `}</style>
    </>
  );
} 