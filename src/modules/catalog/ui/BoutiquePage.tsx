'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getProductsByCategory, getTotalProductCount } from '../application/getProducts';
import { getSubcategoriesByCategory } from '../application/getSubcategories';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import ProductSkeleton from './ProductSkeleton';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Shirt, ArrowRight, Sparkles, Heart, Tag } from 'lucide-react';
import Image from 'next/image';

const CATEGORY_ID = 3;
const PAGE_SIZE = 12;

const BoutiquePage = () => {
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    subcategory: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'nameAsc'
  });

  // Cargar productos y subcategorías iniciales
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      getProductsByCategory(CATEGORY_ID, 1, PAGE_SIZE, filters),
      getSubcategoriesByCategory(CATEGORY_ID),
      getTotalProductCount(CATEGORY_ID, filters)
    ])
      .then(([prods, subs, count]) => {
        setProducts(prods);
        setSubcategories(subs);
        setTotalProducts(count || 0);
        setHasMore(prods.length === PAGE_SIZE);
        setCurrentPage(1);
      })
      .catch(() => setError(t('catalog.error')))
      .finally(() => setLoading(false));
  }, [t, filters]);

  // Cambiar subcategoría
  const handleSubcategoryChange = (subId: number | null) => {
    if (subId !== selectedSub) {
      setSelectedSub(subId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Actualizar filtros
      setFilters(prev => ({
        ...prev,
        subcategory: subId
      }));
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Resetear todos los filtros
  const handleResetFilters = () => {
    setFilters({
      search: '',
      subcategory: null,
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'nameAsc'
    });
    setSelectedSub(null);
    setSearchTerm('');
  };

  // Manejar búsqueda
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchTerm);
  };

  // Cargar más productos
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const more = await getProductsByCategory(CATEGORY_ID, nextPage, PAGE_SIZE, filters);
      
      if (more.length > 0) {
        setProducts(prev => [...prev, ...more]);
        setCurrentPage(nextPage);
        setHasMore(more.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch {
      setError(t('catalog.error'));
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, t, filters]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return filters.search || filters.subcategory || filters.minPrice > 0 || filters.maxPrice < 1000 || filters.sortBy !== 'nameAsc';
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Hero section con estilo de boutique */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-fuchsia-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/patterns/geometric-pattern.svg" 
            alt="Background pattern" 
            layout="fill" 
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-pink-300" />
                <span className="text-pink-200 uppercase tracking-wider text-sm font-medium">Colección exclusiva</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                {t('catalog.boutiqueHero')}
              </h1>
              <p className="text-purple-100 max-w-xl">
                {t('catalog.boutiqueDescription')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                  <Shirt className="h-4 w-4 mr-1" />
                  {t('catalog.quality')}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                  <Tag className="h-4 w-4 mr-1" />
                  {t('catalog.shipping')}
                </span>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-5 max-w-md mx-auto md:mx-0 border border-white/20">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('catalog.searchBoutique')}
                      value={searchTerm}
                      onChange={(e) => handleSearchTermChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border-0 focus:ring-2 focus:ring-pink-400 text-white placeholder-purple-200"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          if (filters.search) {
                            setFilters(prev => ({ ...prev, search: '' }));
                          }
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="ml-2 bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 transition-colors flex-shrink-0 shadow-md"
                  >
                    {t('catalog.search')}
                  </button>
                </form>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="text-sm text-purple-200 hover:text-white flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    {t('catalog.filters')}
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="text-sm text-pink-300 hover:text-pink-200"
                    >
                      {t('catalog.clearFilters')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y resultados */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Panel de filtros (desktop) */}
        <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-pink-500" />
                {t('catalog.filterOptions')}
              </h2>
              <button
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Subcategorías */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">{t('catalog.subcategory')}</h3>
              <div className="space-y-2">
                <div 
                  className={`flex items-center cursor-pointer p-2 rounded-lg ${
            selectedSub === null
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                      : 'hover:bg-gray-50 text-gray-700'
          }`}
          onClick={() => handleSubcategoryChange(null)}
                >
                  <span className={`w-4 h-4 rounded-full mr-2 ${
                    selectedSub === null 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'border border-gray-300'
                  }`}></span>
                  <span>{t('catalog.all')}</span>
                </div>
                
                {subcategories.map(sub => (
                  <div 
            key={sub.id}
                    className={`flex items-center cursor-pointer p-2 rounded-lg ${
              selectedSub === sub.id
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                        : 'hover:bg-gray-50 text-gray-700'
            }`}
            onClick={() => handleSubcategoryChange(sub.id)}
                  >
                    <span className={`w-4 h-4 rounded-full mr-2 ${
                      selectedSub === sub.id 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'border border-gray-300'
                    }`}></span>
                    <span>{sub.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rango de precios */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">{t('catalog.priceRange')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-24">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      max={filters.maxPrice}
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="relative w-24">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                    <input
                      type="number"
                      min={filters.minPrice}
                      max="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        left: `${(filters.minPrice / 1000) * 100}%`,
                        width: `${((filters.maxPrice - filters.minPrice) / 1000) * 100}%`
                      }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                    className="absolute top-0 h-1 w-full appearance-none bg-transparent pointer-events-auto"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="absolute top-0 h-1 w-full appearance-none bg-transparent pointer-events-auto"
                  />
                </div>
              </div>
            </div>
            
            {/* Ordenar por */}
            <div className="p-4">
              <h3 className="font-medium text-gray-700 mb-3">{t('catalog.sortBy')}</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="nameAsc">{t('catalog.nameAsc')}</option>
                <option value="nameDesc">{t('catalog.nameDesc')}</option>
                <option value="priceAsc">{t('catalog.priceAsc')}</option>
                <option value="priceDesc">{t('catalog.priceDesc')}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Resumen de resultados */}
          <div className="flex flex-wrap items-center justify-between mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Shirt className="h-5 w-5 mr-2 text-pink-500" />
                {t('catalog.boutique')}
              </h2>
              <p className="text-sm text-gray-600">
                {loading 
                  ? t('catalog.loading') 
                  : t('catalog.showingResults', { count: products.length, total: totalProducts })}
              </p>
            </div>
            
            <div className="flex items-center mt-2 sm:mt-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 mr-2"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('catalog.filters')}
              </button>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="nameAsc">{t('catalog.nameAsc')}</option>
                <option value="nameDesc">{t('catalog.nameDesc')}</option>
                <option value="priceAsc">{t('catalog.priceAsc')}</option>
                <option value="priceDesc">{t('catalog.priceDesc')}</option>
              </select>
            </div>
          </div>
          
          {/* Chips de filtros activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {filters.search && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm">
                  <Search className="h-3 w-3 mr-1" />
                  <span>{filters.search}</span>
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 p-0.5 hover:bg-pink-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filters.subcategory && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm">
                  {subcategories.find(s => s.id === filters.subcategory)?.nombre}
                  <button
                    onClick={() => handleSubcategoryChange(null)}
                    className="ml-1 p-0.5 hover:bg-pink-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm">
                  ${filters.minPrice} - ${filters.maxPrice}
                  <button
                    onClick={() => {
                      handleFilterChange('minPrice', 0);
                      handleFilterChange('maxPrice', 1000);
                    }}
                    className="ml-1 p-0.5 hover:bg-pink-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              <button
                onClick={handleResetFilters}
                className="text-sm text-pink-600 hover:text-pink-800 flex items-center"
              >
                {t('catalog.clearAll')}
              </button>
            </div>
          )}
          
          {/* Grilla de productos */}
      <AnimatePresence>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
                  <Search className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('catalog.noResults')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">{t('catalog.tryAdjusting')}</p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {t('catalog.clearFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                <ProductCard
                  product={product}
                  type="boutique"
                  onOpenDetail={setSelected}
                  compact
                />
                    </motion.div>
                  ))}
        </div>
                
                {/* Paginación */}
                {hasMore && !loading && (
                  <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {loadingMore ? (
              <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t('common.loading')}
              </>
            ) : (
                        <>
                          {t('catalog.loadMore')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
            )}
          </button>
        </div>
      )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Modal de detalle */}
      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          type="boutique"
        />
      )}
      
      {/* Error */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default BoutiquePage;
