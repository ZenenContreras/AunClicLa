'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Heart, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getSupabaseImageUrl } from '@/shared/lib/supabase/getPublicUrl';

const typeConfig = {
  product: {
    accent: 'indigo',
    button: 'indigo'
  },
  food: {
    accent: 'amber',
    button: 'amber'
  },
  boutique: {
    accent: 'purple',
    button: 'purple'
  }
};

const ProductDetailModal = ({ product, onClose, type = 'product' }: any) => {
  const t = useTranslations();
  const config = typeConfig[type as keyof typeof typeConfig];

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Columna izquierda - Imagen */}
        <div className="md:w-1/2 bg-gray-100 relative flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          <img
            src={getSupabaseImageUrl(product.imagen_principal)}
            alt={product.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.png';
            }}
            aria-label={product.nombre}
          />
        </div>

        {/* Columna derecha - Información */}
        <div className="md:w-1/2 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-gray-200">
            {product.categorias?.nombre && (
              <span className={`text-sm font-medium text-${config.accent}-600 bg-${config.accent}-50 px-2 py-1 rounded-full`}>
                {product.categorias.nombre}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.nombre}</h1>
            <div className="flex items-center mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                (0 {t('product.reviews', { default: 'reseñas' })})
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('product.description', { default: 'Descripción' })}</h2>
                <p className="text-gray-600">{product.descripcion}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${Number(product.precio).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">
                      {product.stock > 0 
                        ? `${product.stock} ${t('product.available', { default: 'disponibles' })}`
                        : t('product.outOfStock', { default: 'Agotado' })}
                    </span>
                  </div>
                </div>
                <button
                  disabled={product.stock === 0}
                  className={`
                    w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                    ${product.stock === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : `bg-${config.button}-600 hover:bg-${config.button}-700`}
                    disabled:opacity-50
                  `}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {product.stock === 0 
                      ? t('product.outOfStock', { default: 'Agotado' })
                      : t('product.addToCart', { default: 'Agregar al carrito' })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailModal;
