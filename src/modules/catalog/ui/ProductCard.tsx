'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getSupabaseImageUrl } from '@/shared/lib/supabase/getPublicUrl';

const typeConfig = {
  product: {
    accent: 'indigo',
    gradient: 'from-indigo-50 to-blue-50'
  },
  food: {
    accent: 'amber',
    gradient: 'from-amber-50 to-orange-50'
  },
  boutique: {
    accent: 'purple',
    gradient: 'from-purple-50 to-pink-50'
  }
};

const ProductCard = ({ product, type = 'product', onOpenDetail }: any) => {
  const t = useTranslations();

  const config = typeConfig[type as keyof typeof typeConfig];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={() => onOpenDetail(product)}
      className={`bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 border border-${config.accent}-100 hover:border-${config.accent}-300 cursor-pointer relative`}
    >
      {/* Contenedor de imagen cuadrado */}
      <div className="aspect-square relative overflow-hidden group">
        <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
          <img
            src={getSupabaseImageUrl(product.imagen_principal)}
            alt={product.nombre}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-xl"
            loading="lazy"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.png';
            }}
            aria-label={product.nombre}
          />
        </div>
        {product.stock < 30 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t('common.lowStock', { default: 'Pocas unidades' })}
          </div>
        )}
        {/* Rating simulado */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">
            {product.rating ? product.rating.toFixed(1) : '0.0'}
          </span>
        </div>
      </div>

      {/* Contenido del card */}
      <div className="p-3 flex flex-col">
        {product.categorias?.nombre && (
          <span className={`text-xs font-medium text-${config.accent}-600 bg-${config.accent}-50 px-2 py-0.5 rounded-full inline-block mb-1 truncate`}>
            {product.categorias.nombre}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-2">
          {product.nombre}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-gray-900">
            ${Number(product.precio).toFixed(2)}
          </span>
          <button
            disabled={product.stock === 0}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-medium
              ${product.stock === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : `bg-${config.accent}-600 hover:bg-${config.accent}-700`}
              disabled:opacity-50
            `}
          >
            <ShoppingCart className="h-3 w-3" />
            <span className="hidden sm:inline">
              {product.stock === 0 
                ? t('product.outOfStock', { default: 'Agotado' })
                : t('product.addToCart', { default: 'Agregar' })}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
