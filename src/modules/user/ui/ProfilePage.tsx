"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../../shared/hooks/useUser";
import { useTranslations } from "next-intl";
import { getUserProfile, updateUserAddress } from "../application/usecases/getUserProfile";
import { useNotification } from "../../../shared/ui/Navbar";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Shield, Bell } from "lucide-react";

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUser();
  const notify = useNotification();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: false });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          setIsLoading(true);
          setError(null);
          const { usuario, direcciones } = await getUserProfile(user.email);
          setProfile(usuario);
          setFormData({
            id: direcciones?.[0]?.id || null,
            nombre: usuario.nombre || "",
            email: usuario.email || "",
            telefono: direcciones?.[0]?.telefono || "",
            direccion: direcciones?.[0]?.direccion || "",
            ciudad: direcciones?.[0]?.ciudad || "",
            estado: direcciones?.[0]?.estado || "",
            codigo_postal: direcciones?.[0]?.codigo_postal || "",
            pais: direcciones?.[0]?.pais || ""
          });
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!formData.id) {
      setError(t("profile.errorAddresses"));
      return;
    }
    try {
      // Solo actualiza la dirección, no el email
      await updateUserAddress(formData.id, {
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        estado: formData.estado,
        codigo_postal: formData.codigo_postal,
        pais: formData.pais,
        telefono: formData.telefono
      });
      setSuccess(t("profile.addressUpdated"));
      notify && notify(t("profile.addressUpdated"), "success");
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
      notify && notify(t("profile.addressUpdateError"), "error");
    }
  };

  const tabs = [
    {
      id: "personal",
      label: t("profile.tabs.personal"),
      icon: <User className="h-4 w-4 sm:h-5 sm:w-5" />,
      mobileLabel: t("profile.tabs.personalShort")
    },
    {
      id: "security",
      label: t("profile.tabs.security"),
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
      mobileLabel: t("profile.tabs.securityShort")
    },
    {
      id: "notifications",
      label: t("profile.tabs.notifications"),
      icon: <Bell className="h-4 w-4 sm:h-5 sm:w-5" />,
      mobileLabel: t("profile.tabs.notificationsShort")
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{t("auth.login.title")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("auth.login.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Encabezado */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-indigo-200">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.email}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-200">
                      <span className="text-indigo-600 font-medium text-3xl">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("profile.title")}</h1>
                  <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  {isEditing ? (
                    <>
                      <X className="h-5 w-5" />
                      <span>{t("profile.cancel")}</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-5 w-5" />
                      <span>{t("profile.edit")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pestañas */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">{tab.mobileLabel}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            <div className="p-4 sm:p-6">
              {activeTab === "personal" && (
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {t("profile.name")}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="text"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {t("profile.email")}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              disabled={true}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {t("profile.phone")}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="tel"
                              name="telefono"
                              value={formData.telefono}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {t("profile.address")}
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="text"
                              name="direccion"
                              value={formData.direccion}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {t("profile.city")}
                            </label>
                            <input
                              type="text"
                              name="ciudad"
                              value={formData.ciudad}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {t("profile.state")}
                            </label>
                            <input
                              type="text"
                              name="estado"
                              value={formData.estado}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {t("profile.postalCode")}
                            </label>
                            <input
                              type="text"
                              name="codigo_postal"
                              value={formData.codigo_postal}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {t("profile.country")}
                            </label>
                            <input
                              type="text"
                              name="pais"
                              value={formData.pais}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Save className="h-5 w-5" />
                          <span>{t("profile.save")}</span>
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <p className="ml-3 text-sm text-yellow-700">
                        {t("profile.security.warning")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t("profile.security.password.title")}</h3>
                      <p className="text-sm text-gray-600 mb-4">{t("profile.security.password.description")}</p>
                      <button
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        {t("profile.security.password.changeButton")}
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t("profile.security.twoFactor.title")}</h3>
                      <p className="text-sm text-gray-600 mb-4">{t("profile.security.twoFactor.description")}</p>
                      <button
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        disabled={true}
                      >
                        {t("profile.security.twoFactor.setupButton")}
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">Próximamente</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Bell className="h-5 w-5 text-green-400 mt-0.5" />
                      <p className="ml-3 text-sm text-green-700">
                        {t("profile.notifications.info")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{t("profile.notifications.email.title")}</h3>
                          <p className="text-sm text-gray-600 mt-1">{t("profile.notifications.email.description")}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={notifPrefs.email} onChange={() => setNotifPrefs(p => ({ ...p, email: !p.email }))} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{t("profile.notifications.push.title")}</h3>
                          <p className="text-sm text-gray-600 mt-1">{t("profile.notifications.push.description")}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={notifPrefs.push} onChange={() => setNotifPrefs(p => ({ ...p, push: !p.push }))} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowPasswordModal(false)}>
              ×
            </button>
            <ForgotPasswordForm onLogin={() => setShowPasswordModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 