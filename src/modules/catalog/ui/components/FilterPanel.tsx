'use client';
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ShoppingBag, UtensilsCrossed, Shirt, Sparkles, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const typeConfig = {
  product: {
    accent: 'indigo',
    hover: 'indigo',
    button: 'indigo',
    gradient: 'from-indigo-600 to-blue-500',
    icon: ShoppingBag
  },
  food: {
    accent: 'amber',
    hover: 'amber',
    button: 'amber',
    gradient: 'from-amber-600 to-orange-500',
    icon: UtensilsCrossed
  },
  boutique: {
    accent: 'pink',
    hover: 'purple',
    button: 'purple',
    gradient: 'from-purple-600 to-pink-500',
    icon: Shirt
  }
};

interface FilterPanelProps {
  type?: 'product' | 'food' | 'boutique';
  filters: {
    search: string;
    subcategory: number | null;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
  };
  searchTerm: string;
  selectedSub: number | null;
  subcategories: any[];
  isFilterOpen: boolean;
  hasActiveFilters: boolean;
  totalProducts: number;
  onFilterChange: (key: string, value: any) => void;
  onSearchTermChange: (value: string) => void;
  onSubcategoryChange: (subId: number | null) => void;
  onResetFilters: () => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onToggleFilter: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  type = 'product',
  filters,
  searchTerm,
  selectedSub,
  subcategories,
  isFilterOpen,
  hasActiveFilters,
  totalProducts,
  onFilterChange,
  onSearchTermChange,
  onSubcategoryChange,
  onResetFilters,
  onSearchSubmit,
  onToggleFilter
}) => {
  const t = useTranslations();
  const config = typeConfig[type];
  const Icon = config.icon;
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice, filters.maxPrice]);
  
  // Función para manejar cambios en el rango de precios
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  
  // Aplicar el rango de precios a los filtros
  const applyPriceRange = () => {
    onFilterChange('minPrice', priceRange[0]);
    onFilterChange('maxPrice', priceRange[1]);
  };

  // Iconos adicionales según el tipo
  const getExtraIcon = () => {
    if (type === 'boutique') return <Heart className="h-5 w-5 text-pink-400" />;
    if (type === 'food') return <Sparkles className="h-5 w-5 text-amber-400" />;
    return null;
  };

  return (
    <>
      {/* Hero section */}
      <div className={`relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r ${config.gradient}`}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image 
            src="/images/patterns/geometric-pattern.svg" 
            alt="Background pattern" 
            layout="fill" 
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <div className="flex items-center mb-2">
                {getExtraIcon()}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {t(`catalog.${type}Hero`)}
                </h1>
              </div>
              <p className="text-white/90 max-w-xl">
                {t(`catalog.${type}Description`)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  <Icon className="h-4 w-4 mr-1" />
                  {t('catalog.quality')}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {t('catalog.shipping')}
                </span>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto md:mx-0"
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={onSearchSubmit} className="flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t(`catalog.search${type.charAt(0).toUpperCase() + type.slice(1)}s`)}
                      value={searchTerm}
                      onChange={(e) => onSearchTermChange(e.target.value)}
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border-0 
                        focus:ring-2 focus:ring-${config.accent}-500 
                        placeholder:text-gray-400 
                        text-gray-900
                        transition-colors
                      `}
                    />
                    {searchTerm && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          onSearchTermChange('');
                          if (filters.search) {
                            onFilterChange('search', '');
                          }
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    className={`ml-2 bg-${config.accent}-600 text-white px-4 py-3 rounded-lg hover:bg-${config.accent}-700 transition-colors flex-shrink-0`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('catalog.search')}
                  </motion.button>
                </form>
                <div className="mt-3 flex items-center justify-between">
                  <motion.button
                    onClick={onToggleFilter}
                    className={`text-sm text-gray-600 hover:text-${config.accent}-600 flex items-center`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    {t('catalog.filters')}
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  {hasActiveFilters && (
                    <motion.button
                      onClick={onResetFilters}
                      className={`text-sm text-${config.accent}-600 hover:text-${config.accent}-800`}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('catalog.clearFilters')}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <motion.div 
        className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isFilterOpen ? 1 : 0,
          height: isFilterOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"
          whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{t('catalog.filterOptions')}</h3>
          </div>
          
          {/* Subcategorías */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">{t('catalog.subcategory')}</h4>
            <div className="space-y-2">
              <motion.div 
                className={`flex items-center cursor-pointer p-2 rounded-lg ${selectedSub === null ? `bg-${config.accent}-50 text-${config.accent}-700` : 'hover:bg-gray-50'}`}
                onClick={() => onSubcategoryChange(null)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  id="sub-all"
                  name="subcategory"
                  checked={selectedSub === null}
                  onChange={() => onSubcategoryChange(null)}
                  className={`form-radio text-${config.accent}-600 focus:ring-${config.accent}-500 h-4 w-4`}
                />
                <label htmlFor="sub-all" className="ml-2 text-sm cursor-pointer">
                  {t('catalog.all')}
                </label>
              </motion.div>
              
              {subcategories.map((sub) => (
                <motion.div 
                  key={sub.id}
                  className={`flex items-center cursor-pointer p-2 rounded-lg ${selectedSub === sub.id ? `bg-${config.accent}-50 text-${config.accent}-700` : 'hover:bg-gray-50'}`}
                  onClick={() => onSubcategoryChange(sub.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    id={`sub-${sub.id}`}
                    name="subcategory"
                    checked={selectedSub === sub.id}
                    onChange={() => onSubcategoryChange(sub.id)}
                    className={`form-radio text-${config.accent}-600 focus:ring-${config.accent}-500 h-4 w-4`}
                  />
                  <label htmlFor={`sub-${sub.id}`} className="ml-2 text-sm cursor-pointer">
                    {sub.nombre}
                  </label>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Rango de precio */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">{t('catalog.priceRange')}</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="5"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${config.accent}-600`}
                  />
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${config.accent}-600 -mt-2`}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                    className="w-16 p-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <span className="text-sm text-gray-500">-</span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-16 p-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <motion.button
                onClick={applyPriceRange}
                className={`w-full py-2 bg-${config.accent}-600 text-white rounded-lg text-sm font-medium hover:bg-${config.accent}-700`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('catalog.apply')}
              </motion.button>
            </div>
          </div>
          
          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <div className="p-4 bg-gray-50">
              <motion.button
                onClick={onResetFilters}
                className={`w-full py-2 border border-${config.accent}-600 text-${config.accent}-600 rounded-lg text-sm font-medium hover:bg-${config.accent}-50`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('catalog.clearAll')}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default FilterPanel; 