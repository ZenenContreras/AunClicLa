"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Heart, LogOut, ChevronDown, ChevronRight, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simulación de hooks de usuario y carrito (reemplazar por lógica real)
type MockUser = { email: string; avatar_url?: string } | null;
const useMockUser = (): { user: MockUser; signOut: () => void } => ({ user: null, signOut: () => {} });
const useMockCart = () => ({ cartItemCount: 0 });

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const NAV_LINKS = [
  { id: "home", href: "/", key: "home" },
  { id: "products", href: "/productos", key: "products" },
  { id: "foods", href: "/comidas", key: "foods" },
  { id: "boutique", href: "/boutique", key: "boutique" },
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

  if (isMobile) {
    return (
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }} ref={ref}>
        <motion.button
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm duration-200"
          onClick={() => setIsOpen((v) => !v)}
          whileTap={{ scale: 0.95 }}
          aria-label="Seleccionar idioma"
        >
          <span className="font-medium text-base">{currentLanguage?.flag}</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-indigo-600 text-sm">▼</motion.span>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div className="absolute mt-2 right-0 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
              initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} transition={{ duration: 0.15 }}>
              {languageOptions.map((option) => (
                <motion.button key={option.value} className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-base ${locale === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleLanguageChange(option.value)} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
                  <span className="text-lg">{option.flag}</span>
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }} ref={ref}>
      <motion.button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm duration-200"
        onClick={() => setIsOpen((v) => !v)} whileTap={{ scale: 0.95 }} aria-label="Seleccionar idioma">
        <Globe2 className="h-5 w-5" />
        <span className="font-medium text-base">{currentLanguage?.flag} {currentLanguage?.label}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-indigo-600">▼</motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute mt-2 right-0 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
            initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }}>
            {languageOptions.map((option) => (
              <motion.button key={option.value} className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-base ${locale === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleLanguageChange(option.value)} whileHover={{ x: 5 }}>
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

export default function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useMockUser(); // Reemplazar por hook real
  const { cartItemCount } = useMockCart(); // Reemplazar por hook real

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const underlineLayoutId = "nav-underline";
  const overlayVariants = {
    closed: { opacity: 0, pointerEvents: "none" as const },
    open: { opacity: 0.5, pointerEvents: "auto" as const },
  };
  const mobileMenuVariants = {
    closed: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    open: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <>
      <motion.header
        className="fixed w-full z-50 bg-white shadow-md border-b border-indigo-50"
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        role="banner"
        style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
      >
        <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between h-20 md:h-24">
          <motion.div
            className="flex items-center gap-1 group cursor-pointer select-none min-w-[180px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            tabIndex={0}
            aria-label="Ir al inicio"
          >
            <motion.div whileHover={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 0.5 }}>
              <Image src="/LogoAunClic.svg" alt="Logo" width={56} height={56} className="h-12 w-12 md:h-14 md:w-14 drop-shadow-md" priority />
            </motion.div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-xl md:text-2xl tracking-tight leading-none group-hover:underline group-focus:underline transition-all duration-200 ml-2">A un clic la</span>
          </motion.div>
          <div className="hidden md:flex flex-1 justify-center">
            <motion.ul className="flex gap-6 lg:gap-10 items-center" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}>
              {NAV_LINKS.map((link) => (
                <motion.li key={link.key} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } } }} className="relative">
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${pathname === link.href ? "text-indigo-700 bg-transparent" : "text-gray-700 hover:text-indigo-600 bg-transparent"}`}
                    aria-current={pathname === link.href ? "page" : undefined}
                    style={{ minWidth: 90 }}
                  >
                    <span className="relative">
                      {t(link.key)}
                      {pathname === link.href && (
                        <motion.div
                          className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                          layoutId={underlineLayoutId}
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
            </motion.button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-1 px-2 py-1.5 rounded-full border-2 border-indigo-100 bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors" aria-label="Menú de usuario">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-1 ring-1 ring-black ring-opacity-5 z-50 border border-indigo-50">
                    <button className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-indigo-50 focus:bg-indigo-50 transition-all"><User className="h-5 w-5 mr-2" />Perfil</button>
                    <button className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-indigo-50 focus:bg-indigo-50 transition-all"><ShoppingCart className="h-5 w-5 mr-2" />Pedidos</button>
                    <button className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-indigo-50 focus:bg-indigo-50 transition-all"><Heart className="h-5 w-5 mr-2" />Favoritos</button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button className="flex items-center w-full px-4 py-2 text-base text-red-600 hover:bg-red-50 focus:bg-red-50 transition-all"><LogOut className="h-5 w-5 mr-2" />Cerrar sesión</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors shadow-md text-base font-semibold min-w-[160px]" aria-label="Iniciar sesión" style={{ height: 44 }}>
              <User className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </motion.button>
            <div className="ml-1"><LanguageSelectorStyled /></div>
          </div>
          <div className="flex md:hidden items-center gap-1.5">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200" aria-label={t("cart")}>
              <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.button>
            <LanguageSelectorStyled isMobile />
            <button className="ml-1 p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menú móvil">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md" variants={overlayVariants} initial="closed" animate="open" exit="closed" onClick={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="fixed inset-0 z-[101] flex flex-col h-full w-full max-w-[100vw] bg-white/98 shadow-2xl p-0 md:hidden" variants={mobileMenuVariants} initial="closed" animate="open" exit="closed" style={{ WebkitBackdropFilter: 'blur(18px)', backdropFilter: 'blur(18px)' }}>
            <div className="flex items-center justify-between px-5 pt-safe-top pb-2 h-20 border-b border-indigo-50 bg-white/90 sticky top-0 z-10">
              <div className="flex items-center gap-1 group cursor-pointer select-none"> 
                <Image src="/LogoAunClic.svg" alt="Logo" width={44} height={44} className="h-12 w-12" />
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-lg tracking-tight leading-none group-hover:underline">A un clic la</span>
              </div>
              <button className="p-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú móvil">
                <X className="h-8 w-8 text-indigo-500" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 px-2 py-6 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <button key={link.key} className={`flex items-center w-full text-left px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${pathname === link.href ? "bg-indigo-50 text-indigo-700 shadow-md" : "hover:bg-indigo-50 text-gray-800"}`} aria-current={pathname === link.href ? "page" : undefined} style={{ minHeight: 52 }}>
                  {t(link.key)}
                  {pathname === link.href && <ChevronRight className="ml-auto h-6 w-6 text-indigo-500" />}
                </button>
              ))}
            </nav>
            <div className="px-2 pb-8 pt-2 flex flex-col gap-4">
              <div className="w-full flex flex-col gap-2">
                <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"><User className="h-7 w-7" /> <span>Perfil</span></button>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"><ShoppingCart className="h-7 w-7" /> <span>Pedidos</span></button>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-indigo-50 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"><Heart className="h-7 w-7" /> <span>Favoritos</span></button>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 rounded-2xl text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"><LogOut className="h-7 w-7" /> <span>Cerrar sesión</span></button>
              </div>
              <div className="mt-2 flex justify-center"><LanguageSelectorStyled isMobile /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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