"use client";

import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Utensils,
  Store,
  ChevronDown,
  ArrowRight,
  Package,
  Shirt,
  Watch,
  Gift
} from "lucide-react";

// Tipos para las props
interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

interface MobileCategoryCardProps {
  icon: React.ElementType;
  title: string;
  gradient: string;
}

interface SectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  children: React.ReactNode;
}

const CategoryCard = memo(({ icon: Icon, title, description, gradient }: CategoryCardProps) => (
  <motion.div
    className={`group relative bg-gradient-to-br ${gradient} p-4 sm:p-5 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace("/20", "/0")} group-hover:${gradient.replace("/20", "/10")} transition-all duration-300`} />
    <div className="relative z-10 flex items-center w-full">
      <div className="flex-shrink-0 mr-3">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex-grow">
        <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-0.5 drop-shadow-lg"
          style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)" }}>
          {title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md line-clamp-2"
          style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)" }}>
          {description}
        </p>
      </div>
    </div>
  </motion.div>
));

const MobileCategoryCard = memo(({ icon: Icon, title, gradient }: MobileCategoryCardProps) => (
  <motion.div
    className={`group relative bg-gradient-to-br ${gradient} p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-20 sm:h-24 border border-white/10 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace("/20", "/0")} group-hover:${gradient.replace("/20", "/10")} transition-all duration-300`} />
    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300" />
    <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-lg relative z-10 px-1"
      style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)" }}>
      {title}
    </span>
  </motion.div>
));

const Section = memo(({ title, description, icon: Icon, color, iconColor, children }: SectionProps) => (
  <section className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br ${color}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor} mr-2 sm:mr-3`} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>
      {children}
    </div>
  </section>
));

const LandingPage = () => {
  const t = useTranslations("landing");

  // Categorías principales para el hero
  const categories = [
    {
      icon: ShoppingBag,
      title: t("sections.products"),
      description: t("productSection.description"),
      gradient: "from-indigo-600/20 to-blue-600/20"
    },
    {
      icon: Utensils,
      title: t("sections.foods"),
      description: t("foodSection.description"),
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: Store,
      title: t("sections.boutique"),
      description: t("boutiqueSection.description"),
      gradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  // Categorías de productos
  const productCategories = [
    {
      id: "harina-masa",
      name: t("productSection.categories.flour"),
      icon: <Utensils className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500" />,
      description: t("productSection.categoryDescriptions.flour"),
      image: "/harinasMasas.png",
      color: "from-yellow-600 to-yellow-400",
      viewText: t("productSection.viewProducts"),
      subcategoria_id: "1"
    },
    {
      id: "salsas-aderezos",
      name: t("productSection.categories.sauces"),
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500" />,
      description: t("productSection.categoryDescriptions.sauces"),
      image: "/salsasAderezos.png",
      color: "from-red-600 to-red-400",
      viewText: t("productSection.viewProducts"),
      subcategoria_id: "2"
    },
    {
      id: "paquetes-snacks",
      name: t("productSection.categories.snacks"),
      icon: <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-500" />,
      description: t("productSection.categoryDescriptions.snacks"),
      image: "/paquetesSnacks.png",
      color: "from-green-600 to-green-400",
      viewText: t("productSection.viewProducts"),
      subcategoria_id: "3"
    }
  ];

  // Regiones de comida
  const foodRegions = [
    {
      id: "northAmerica",
      name: t("foodSection.regions.northAmerica.name"),
      description: t("foodSection.regions.northAmerica.description"),
      countries: t("foodSection.regions.northAmerica.countries"),
      image: "/norteAmerica.png",
      color: "from-blue-600 to-blue-400",
      viewText: t("foodSection.viewFood"),
      subcategoria_id: "4"
    },
    {
      id: "centralAmerica",
      name: t("foodSection.regions.centralAmerica.name"),
      description: t("foodSection.regions.centralAmerica.description"),
      countries: t("foodSection.regions.centralAmerica.countries"),
      image: "/centroAmerica.png",
      color: "from-emerald-600 to-emerald-400",
      viewText: t("foodSection.viewFood"),
      subcategoria_id: "5"
    },
    {
      id: "southAmerica",
      name: t("foodSection.regions.southAmerica.name"),
      description: t("foodSection.regions.southAmerica.description"),
      countries: t("foodSection.regions.southAmerica.countries"),
      image: "/surAmerica.png",
      color: "from-amber-600 to-amber-400",
      viewText: t("foodSection.viewFood"),
      subcategoria_id: "6"
    }
  ];

  // Categorías de boutique
  const boutiqueCategories = [
    {
      id: "clothing",
      name: t("boutiqueSection.categories.clothing"),
      icon: <Shirt className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-500" />,
      description: t("boutiqueSection.categoryDescriptions.clothing"),
      image: "/ropaBoutique.png",
      color: "from-purple-600 to-purple-400",
      viewText: t("boutiqueSection.viewMore"),
      subcategoria_id: "7"
    },
    {
      id: "accessories",
      name: t("boutiqueSection.categories.accessories"),
      icon: <Watch className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-pink-500" />,
      description: t("boutiqueSection.categoryDescriptions.accessories"),
      image: "/accesoriosBoutique.png",
      color: "from-pink-600 to-pink-400",
      viewText: t("boutiqueSection.viewMore"),
      subcategoria_id: "8"
    },
    {
      id: "souvenirs",
      name: t("boutiqueSection.categories.souvenirs"),
      icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-amber-500" />,
      description: t("boutiqueSection.categoryDescriptions.souvenirs"),
      image: "/souvenirBoutique.png",
      color: "from-amber-600 to-amber-400",
      viewText: t("boutiqueSection.viewMore"),
      subcategoria_id: "9"
    }
  ];

  // Componente memoizado para las tarjetas de categoría de sección
  const SectionCategoryCard = memo(({ category }: { category: any }) => (
    <motion.div
      key={category.id}
      className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-80"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[0.8px]"
          width="800"
          height="600"
          style={{
            aspectRatio: "4/3",
            backgroundColor: "#f3f4f6",
            minHeight: "inherit"
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
          <div className="flex items-center mb-3 sm:mb-4">
            {category.icon}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
              {category.name}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
            {category.description}
          </p>
          <div className="flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg inline-flex">
            <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
              {category.viewText}
            </span>
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="min-h-screen">
      {/* Hero principal */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] max-h-[900px] overflow-hidden">
        <div className="relative h-full">
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"
            style={{ width: "100%", height: "100%", minHeight: "inherit" }}
          >
            <picture className="block w-full h-full">
              <source media="(min-width: 1024px)" srcSet="/fondoEscritorio.png" />
              <source media="(min-width: 768px)" srcSet="/fondoTablet.png" />
              <source media="(max-width: 767px)" srcSet="/fondoMobile2.png" />
              <img
                src="/fondoEscritorio.png"
                alt="Fondo de la página"
                className="w-full h-full object-cover filter blur-[0.5px] transition-opacity duration-300 opacity-100"
                width={1920}
                height={1080}
                loading="eager"
                fetchPriority="high"
                style={{ backgroundColor: "#f3f4f6", objectPosition: "center" }}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center">
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                      <div className="flex flex-col items-start">
                        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", background: "linear-gradient(to right, #ffffff, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {t("heroTitle1")}
                        </h1>
                        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight relative"
                          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", background: "linear-gradient(to right, #ffffff, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {t("heroTitle2")}
                          <motion.div
                            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                          />
                        </h1>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.p
                    className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl leading-relaxed mt-8 sm:mt-10 md:mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {t("heroDescription")}
                  </motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mb-4 sm:mb-6 md:mb-0">
                    <motion.button
                      className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center space-x-3 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">{t("registerEarlyAccess")}</span>
                      <motion.div className="relative z-10" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown className="h-5 w-5 transform rotate-90" />
                      </motion.div>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={false} />
                    </motion.button>
                  </motion.div>
                </motion.div>
                {/* Columna derecha - Categorías en tablet y desktop */}
                <motion.div className="hidden md:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 max-w-md mx-auto">
                    {categories.map((cat, i) => (
                      <CategoryCard key={i} icon={cat.icon} title={cat.title} description={cat.description} gradient={cat.gradient} />
                    ))}
                  </div>
                </motion.div>
                {/* Categorías en móvil (3 columnas) */}
                <motion.div className="md:hidden w-full mt-6 sm:mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {categories.map((cat, i) => (
                      <MobileCategoryCard key={i} icon={cat.icon} title={cat.title} gradient={cat.gradient} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sección de Productos */}
      <Section
        title={t("sections.products")}
        description={t("productSection.description")}
        icon={ShoppingBag}
        color="from-indigo-50 to-blue-50"
        iconColor="text-indigo-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {productCategories.map(category => (
            <SectionCategoryCard key={category.id} category={category} />
          ))}
        </div>
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("productSection.viewCatalog")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>
      {/* Sección de Comidas */}
      <Section
        title={t("sections.foods")}
        description={t("foodSection.description")}
        icon={Utensils}
        color="from-amber-50 to-orange-50"
        iconColor="text-amber-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {foodRegions.map(region => (
            <SectionCategoryCard key={region.id} category={region} />
          ))}
        </div>
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-amber-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("foodSection.viewCatalog")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>
      {/* Sección de Boutique */}
      <Section
        title={t("sections.boutique")}
        description={t("boutiqueSection.description")}
        icon={Store}
        color="from-purple-50 to-pink-50"
        iconColor="text-purple-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {boutiqueCategories.map(category => (
            <SectionCategoryCard key={category.id} category={category} />
          ))}
        </div>
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("boutiqueSection.viewCatalog")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>
    </div>
  );
};

export default memo(LandingPage);