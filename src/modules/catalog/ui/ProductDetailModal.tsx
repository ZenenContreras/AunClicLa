'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, 
  UtensilsCrossed, Shirt, Minus, Plus, ShoppingCart, 
  ZoomIn, Share2, Shield, Truck, MessageCircle, PenLine
} from 'lucide-react';
import { getSupabaseImageUrl } from '@/shared/lib/supabase/getPublicUrl';
import ReviewSection from './components/ReviewSection';
import { getProductRatingStats } from '../application/getReviews';

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

interface ProductDetailModalProps {
  product: any;
  onClose: () => void;
  type?: 'product' | 'food' | 'boutique';
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  type = 'product'
}) => {
  const t = useTranslations();
  const config = typeConfig[type];
  const Icon = config.icon;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [showReviews, setShowReviews] = useState(false);
  
  // Preparar imágenes
  useEffect(() => {
    const productImages = [product.imagen_principal];
    
    if (product.imagenes_adicionales && Array.isArray(product.imagenes_adicionales)) {
      productImages.push(...product.imagenes_adicionales);
    }
    
    setImages(productImages.filter(Boolean).map(img => getSupabaseImageUrl(img)));
  }, [product]);
  
  // Cargar estadísticas de reseñas
  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const stats = await getProductRatingStats(product.id);
        setRatingStats(stats);
      } catch (error) {
        console.error('Error loading rating stats:', error);
      }
    };
    
    loadRatingStats();
  }, [product.id]);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // Implementación futura de carrito
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleUpdateQuantity = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    if (newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  // Manejar cambio de imagen
  const handleImageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  // Manejar actualización de reseñas
  const handleReviewAdded = async () => {
    try {
      const stats = await getProductRatingStats(product.id);
      setRatingStats(stats);
      setShowReviews(true);
    } catch (error) {
      console.error('Error updating rating stats:', error);
    }
  };

  // Renderizar estrellas para calificación
  const renderStars = (rating: number, size: 'xs' | 'sm' | 'md' = 'sm') => {
    const sizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5'
    };
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${sizes[size]} ${star <= rating ? `text-${config.accent}-500 fill-${config.accent}-500` : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  // Calcular precio anterior (simulado para demostración)
  const originalPrice = product.precio * 1.2;
  const discountPercentage = Math.round((1 - (product.precio / originalPrice)) * 100);
  const hasDiscount = discountPercentage > 0;

  // Determinar estado del stock
  const stockStatus = product.stock <= 0 
    ? 'outOfStock' 
    : product.stock < 5 
      ? 'lowStock' 
      : 'inStock';

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full h-[90vh] md:h-auto md:max-h-[90vh] md:max-w-4xl bg-white shadow-2xl rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón de cerrar (ahora dentro del card) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
        
        <AnimatePresence mode="wait">
          {!showReviews ? (
            <motion.div
              key="product-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Contenido principal con scroll */}
              <div className="flex-1 overflow-y-auto">
                {/* Sección superior: imagen e información del producto */}
                <div className="flex flex-col md:flex-row">
                  {/* Imagen del producto (más pequeña en móvil) */}
                  <div className="w-full md:w-2/5 relative bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="aspect-[3/2] md:aspect-[4/3] md:h-full relative">
                      {images.length > 0 && (
                        <img
                          src={images[currentImageIndex]}
                          alt={product.nombre}
                          className={`w-full h-full object-contain p-3 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageLoaded(true)}
                        />
                      )}
                      
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-8 h-8 border-3 border-${config.accent}-500 border-t-transparent rounded-full animate-spin`}></div>
                        </div>
                      )}
                      
                      {/* Controles de imagen */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleImageChange('prev'); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white z-10"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleImageChange('next'); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white z-10"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-700" />
                          </button>
                        </>
                      )}
                      
                      {/* Botón de favorito */}
                      <button
                        onClick={handleToggleFavorite}
                        className={`absolute top-3 left-3 p-2 rounded-full shadow-md z-10 
                          ${isFavorite ? `bg-${config.accent}-100 text-${config.accent}-600` : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'}`}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      
                      {/* Botón de zoom */}
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="absolute bottom-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white z-10"
                      >
                        <ZoomIn className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      {/* Indicadores de imagen */}
                      {images.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                              className={`w-2 h-2 rounded-full ${currentImageIndex === index ? `bg-${config.accent}-500` : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Información del producto */}
                  <div className="w-full md:w-3/5 p-4 md:p-5 flex flex-col">
                    {/* Encabezado */}
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={`h-4 w-4 text-${config.accent}-600`} />
                        <span className="text-xs font-medium text-gray-500">{product.subcategoria}</span>
                      </div>
                      <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{product.nombre}</h1>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(ratingStats.averageRating, 'xs')}
                          <span className="text-xs text-gray-500">
                            ({ratingStats.reviewCount} {ratingStats.reviewCount === 1 ? t('product.review') : t('product.reviews')})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Precio */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-xl md:text-2xl font-bold text-${config.accent}-600`}>
                          ${product.precio.toFixed(2)}
                        </span>
                        {product.precio_anterior && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.precio_anterior.toFixed(2)}
                          </span>
                        )}
                        {product.precio_anterior && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                            {Math.round((1 - product.precio / product.precio_anterior) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stock */}
                    <div className="mb-3">
                      <div className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm
                        ${stockStatus === 'outOfStock' 
                          ? 'bg-red-50 text-red-700' 
                          : stockStatus === 'lowStock' 
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-green-50 text-green-700'
                        }
                      `}>
                        <div className={`
                          w-2 h-2 rounded-full
                          ${stockStatus === 'outOfStock' 
                            ? 'bg-red-500' 
                            : stockStatus === 'lowStock' 
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }
                        `} />
                        <span className="font-medium">
                          {stockStatus === 'outOfStock' 
                            ? t('product.outOfStock')
                            : stockStatus === 'lowStock'
                              ? `${t('common.lowStock')} - ${product.stock} ${t('product.available')}`
                              : `${product.stock} ${t('product.available')}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    {/* Descripción */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{product.descripcion}</p>
                    </div>
                    
                    {/* Beneficios */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Truck className="h-3.5 w-3.5 text-gray-400" />
                        <span>{t('catalog.shipping')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Shield className="h-3.5 w-3.5 text-gray-400" />
                        <span>{t('catalog.quality')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Star className="h-3.5 w-3.5 text-gray-400" />
                        <span>{t('product.featured')}</span>
                      </div>
                    </div>
                    
                    {/* Controles de cantidad y botón de añadir al carrito */}
                    {product.stock > 0 && (
                      <div className="flex flex-row gap-2 mb-3">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(-1)}
                            disabled={quantity <= 1 || isLoading}
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Minus className="h-3.5 w-3.5 text-gray-600" />
                          </button>
                          <span className="px-3 py-1.5 text-sm text-gray-900 font-medium border-x border-gray-300 min-w-[40px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(1)}
                            disabled={isLoading || quantity >= product.stock}
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5 text-gray-600" />
                          </button>
                        </div>
                        
                        <button
                          onClick={handleAddToCart}
                          disabled={isLoading}
                          className={`
                            flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium
                            bg-${config.button}-600 hover:bg-${config.button}-700 shadow-sm
                            disabled:opacity-50 transition-all
                          `}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              <span>{t('product.addToCart')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Barra inferior fija con botones de reseñas (siempre visible) */}
              <div className="p-3 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => setShowReviews(true)}
                    className={`
                      flex-1 flex items-center text-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                      bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors
                    `}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t('product.viewReviews')} ({ratingStats.reviewCount})</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowReviews(true);
                      setTimeout(() => {
                        const addReviewButton = document.getElementById('add-review-button');
                        if (addReviewButton) addReviewButton.click();
                      }, 300);
                    }}
                    className={`
                      flex items-center text-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                      bg-${config.accent}-100 text-${config.accent}-700 hover:bg-${config.accent}-200 transition-colors
                    `}
                  >
                    <PenLine className="h-4 w-4" />
                    <span>{t('product.addReview')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reviews-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Encabezado de reseñas */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <button
                  onClick={() => setShowReviews(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{t('product.back')}</span>
                </button>
                <h2 className="text-base font-bold text-gray-900">
                  {t('product.reviewsTitle')} ({ratingStats.reviewCount})
                </h2>
                <div className="w-20"></div> {/* Espaciador para centrar el título */}
              </div>
              
              {/* Contenido de reseñas */}
              <div className="flex-1 overflow-y-auto p-4">
                <ReviewSection 
                  productId={product.id} 
                  accentColor={config.accent}
                  onReviewAdded={handleReviewAdded}
                  compactMode={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailModal;
