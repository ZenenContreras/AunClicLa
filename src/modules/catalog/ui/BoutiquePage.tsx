'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getProductsByCategory } from '../application/getProducts';
import { getSubcategoriesByCategory } from '../application/getSubcategories';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import ProductSkeleton from './ProductSkeleton';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getProductsByCategory(CATEGORY_ID),
      getSubcategoriesByCategory(CATEGORY_ID)
    ])
      .then(([prods, subs]) => {
        setProducts(prods);
        setSubcategories(subs);
        setHasMore(prods.length === PAGE_SIZE);
      })
      .catch(() => setError(t('catalog.error')))
      .finally(() => setLoading(false));
  }, [t]);

  const filteredProducts = useMemo(() => (
    selectedSub ? products.filter(p => p.subcategoria_id === selectedSub) : products
  ), [products, selectedSub]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const more = await getProductsByCategory(CATEGORY_ID);
      setProducts(prev => [...prev, ...more]);
      setHasMore(more.length === PAGE_SIZE);
    } catch {
      setError(t('catalog.error'));
    } finally {
      setLoadingMore(false);
    }
  }, [products, t]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('catalog.boutique')}</h1>
      <motion.div layout className="flex gap-2 mb-8 overflow-x-auto" role="tablist">
        <motion.button
          layout
          aria-label={t('catalog.all')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-sm sm:text-base ${
            selectedSub === null
              ? 'bg-purple-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
          }`}
          onClick={() => setSelectedSub(null)}
          tabIndex={0}
          role="tab"
          aria-selected={selectedSub === null}
        >
          {t('catalog.all')}
        </motion.button>
        {subcategories.map((sub: any) => (
          <motion.button
            layout
            key={sub.id}
            aria-label={sub.nombre}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-sm sm:text-base ${
              selectedSub === sub.id
                ? 'bg-purple-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
            }`}
            onClick={() => setSelectedSub(sub.id)}
            tabIndex={0}
            role="tab"
            aria-selected={selectedSub === sub.id}
          >
            {sub.nombre}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)
            : filteredProducts.length === 0
              ? (
                <div className="col-span-full text-center text-gray-500 py-12">
                  {t('catalog.noProducts')}
                </div>
              )
              : filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  type="boutique"
                  onOpenDetail={setSelected}
                  compact
                />
              ))
          }
        </div>
      </AnimatePresence>
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label={t('catalog.loadMore')}
          >
            {loadingMore ? t('common.loading') : t('catalog.loadMore')}
          </button>
        </div>
      )}
      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          type="boutique"
        />
      )}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default BoutiquePage;
