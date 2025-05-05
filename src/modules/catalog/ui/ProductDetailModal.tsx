// ProductDetailModal rediseñado con reviews en tiempo real y sección para añadir reseñas inline
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight,
  UtensilsCrossed, Shirt, Minus, Plus, ShoppingCart,
  ZoomIn, Shield, Truck, MessageCircle, PenLine, ArrowLeft
} from 'lucide-react';
import { getSupabaseImageUrl } from '@/shared/lib/supabase/getPublicUrl';
import ReviewSection from './components/ReviewSection';
import { getProductRatingStats } from '../application/getReviews';
import { useUser } from '@/shared/hooks/useUser';
import { useNotification } from '@/shared/ui/Navbar';
import { addFavorite, deleteFavorite, getFavorite } from '@/modules/user/application/getFavorite';

const typeConfig = {
  product: {
    accent: 'indigo',
    gradient: 'from-indigo-600 to-blue-500',
    icon: ShoppingBag
  },
  food: {
    accent: 'amber',
    gradient: 'from-amber-600 to-orange-500',
    icon: UtensilsCrossed
  },
  boutique: {
    accent: 'pink',
    gradient: 'from-purple-600 to-pink-500',
    icon: Shirt
  }
};

const ProductDetailModal = ({ product, onClose, type = 'product' }) => {
  const t = useTranslations();
  const config = typeConfig[type];
  const Icon = config.icon;
  const user = useUser();
  
  // Manejo seguro de useNotification
  const notificationContext = useNotification();
  const notify = notificationContext ? 
    (notificationContext.notify || function(msg: string, type: string) { console.log(msg, type); }) : 
    function(msg: string, type: string) { console.log(msg, type); };

  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [showReviews, setShowReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const imgs = [product.imagen_principal];
    if (Array.isArray(product.imagenes_adicionales)) {
      imgs.push(...product.imagenes_adicionales);
    }
    setImages(imgs.filter(Boolean).map(getSupabaseImageUrl));
  }, [product]);

  const updateRatingStats = async () => {
    const stats = await getProductRatingStats(product.id);
    setRatingStats(stats);
  };

  useEffect(() => {
    updateRatingStats();
  }, [product.id]);

  // Verificar si el producto está en favoritos
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsFavorite(false);
        return;
      }
      
      try {
        const favorites = await getFavorite(user.email);
        const isProductFavorite = favorites.some(
          (fav: any) => fav.producto_id === product.id
        );
        setIsFavorite(isProductFavorite);
      } catch (error) {
        console.error('Error al verificar favoritos:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [user, product.id]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Manejar clic en favorito
  const handleToggleFavorite = async () => {
    if (!user) {
      notify('Inicia sesión para guardar favoritos', 'error');
      return;
    }
    
    if (isTogglingFavorite) return;
    
    try {
      setIsTogglingFavorite(true);
      
      if (isFavorite) {
        await deleteFavorite(user.email, product.id);
        setIsFavorite(false);
        notify('Producto eliminado de favoritos', 'success');
      } else {
        await addFavorite(user.email, product.id);
        setIsFavorite(true);
        notify('Producto añadido a favoritos', 'success');
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      notify('Error al gestionar favorito', 'error');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const renderStars = (rating, size = 'sm') => {
    const sizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5' };
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`${sizeMap[size]} ${i <= rating ? `text-${config.accent}-500 fill-${config.accent}-500` : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const benefits = [
    { icon: Truck, label: t('catalog.shipping') },
    { icon: Shield, label: t('catalog.quality') },
    { icon: Star, label: t('product.featured') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="w-full h-[95vh] md:h-auto max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
      >
        <div className="relative flex flex-col md:flex-row h-full">
          <div className="absolute top-3 right-3 z-10 md:hidden">
            <button onClick={onClose} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Sección lateral completa para reseñas si está activado */}
          {showReviews ? (
            <div className="w-full flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 bg-gray-50 relative">
                {images[currentImageIndex] && (
                  <img
                    src={images[currentImageIndex]}
                    alt="Producto"
                    onLoad={() => setImageLoaded(true)}
                    className={`object-contain max-h-[400px] w-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}
              </div>
              <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setShowReviews(false)} className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                    <ArrowLeft className="h-4 w-4 mr-1" /> {t('product.back')}
                  </button>
                  <button onClick={onClose} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <ReviewSection
                  productId={product.id}
                  accentColor={config.accent}
                  onReviewAdded={updateRatingStats}
                  compactMode={false}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Galería de imágenes */}
              <div className="w-full md:w-1/2 bg-gray-50 p-4 relative">
                {images[currentImageIndex] && (
                  <img
                    src={images[currentImageIndex]}
                    alt="Producto"
                    onLoad={() => setImageLoaded(true)}
                    className={`object-contain max-h-[400px] w-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                      <ChevronLeft className="h-4 w-4 text-gray-700" />
                    </button>
                    <button onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    </button>
                  </>
                )}
                <motion.button 
                  onClick={handleToggleFavorite}
                  className={`absolute top-3 left-3 p-2 rounded-full shadow ${
                    isFavorite 
                      ? `bg-red-100 text-red-600` 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isTogglingFavorite}
                >
                  {isTogglingFavorite ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                  )}
                </motion.button>
              </div>

              {/* Información del producto */}
              <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-y-auto">
                <div className="hidden md:flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-5 w-5 text-${config.accent}-600`} />
                      <span className="text-xs text-gray-500 font-medium">{product.subcategoria}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 leading-snug">{product.nombre}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(ratingStats.averageRating)}
                      <span className="text-xs text-gray-400">({ratingStats.reviewCount})</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold text-${config.accent}-600`}>${product.precio.toFixed(2)}</span>
                    {product.precio_anterior && (
                      <span className="text-sm line-through text-gray-400">${product.precio_anterior.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-5">{product.descripcion}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {benefits.map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-800">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className={`ml-auto flex-1 flex justify-center items-center gap-2 py-2 px-4 rounded bg-${config.accent}-600 text-white hover:bg-${config.accent}-700`}>
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t('product.addToCart')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button onClick={() => setShowReviews(true)} className="py-2 px-4 rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 flex justify-center items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {t('product.viewReviews')} ({ratingStats.reviewCount})
                  </button>
                  <button
                    id="add-review-button"
                    onClick={() => setShowReviews(true)}
                    className={`py-2 px-4 rounded bg-${config.accent}-100 hover:bg-${config.accent}-200 text-sm text-${config.accent}-700 flex justify-center items-center gap-2`}
                  >
                    <PenLine className="h-4 w-4" />
                    {t('product.addReview')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailModal;
