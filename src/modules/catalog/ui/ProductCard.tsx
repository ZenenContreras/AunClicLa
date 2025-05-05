'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Heart, Star, UtensilsCrossed, Shirt, ShoppingCart } from 'lucide-react';
import { getSupabaseImageUrl } from '@/shared/lib/supabase/getPublicUrl';
import { useUser } from '@/shared/hooks/useUser';
import { useNotification } from '@/shared/ui/Navbar';
import { addFavorite, deleteFavorite, getFavorite } from '@/modules/user/application/getFavorite';

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

interface ProductCardProps {
  product: any;
  onOpenDetail: (product: any) => void;
  type?: 'product' | 'food' | 'boutique';
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onOpenDetail, 
  type = 'product',
  compact = false
}) => {
  const t = useTranslations();
  const config = typeConfig[type];
  const Icon = config.icon;
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const user = useUser();
  
  // Manejo seguro de useNotification
  const notificationContext = useNotification();
  const notify = notificationContext ? 
    (notificationContext.notify || function(msg: string, type: string) { console.log(msg, type); }) : 
    function(msg: string, type: string) { console.log(msg, type); };
  
  // Calcular el precio con descuento si existe
  const hasDiscount = product.descuento && product.descuento > 0;
  const discountedPrice = hasDiscount 
    ? (product.precio - (product.precio * product.descuento / 100)).toFixed(2) 
    : null;
  
  // Verificar si hay poco stock
  const lowStock = product.stock > 0 && product.stock <= 5;
  
  // Obtener la URL de la imagen
  const imageUrl = product.imagen_principal ? getSupabaseImageUrl(product.imagen_principal) : '/placeholder-product.png';
  
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
  
  // Manejar clic en añadir al carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    setIsAddingToCart(true);
    
    // Simulación de añadir al carrito
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
  };
  
  // Manejar clic en favorito
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    
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
  
  return (
    <motion.div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 h-full flex flex-col cursor-pointer`}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: `rgb(var(--color-${config.accent}-200))`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onOpenDetail(product)}
    >
      {/* Imagen del producto */}
      <div className="relative overflow-hidden aspect-square">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />
        
        {product.imagen_principal ? (
          <img
            src={imageUrl}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${config.gradient}`}>
            <Icon className="h-16 w-16 text-white/50" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {hasDiscount && (
            <span className={`px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white`}>
              -{product.descuento}%
            </span>
          )}
          
          {lowStock && (
            <span className="px-2 py-1 text-xs font-bold rounded-full bg-amber-500 text-white">
              {t('common.lowStock')}
            </span>
          )}
        </div>
        
        {/* Botón de favoritos */}
        <motion.button 
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full ${
            isFavorite 
              ? 'bg-red-50 text-red-500' 
              : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500'
          } transition-colors`}
          aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
          onClick={handleToggleFavorite}
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
      
      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Subcategoría */}
        <div className="text-xs text-gray-500 mb-1">
          {product.subcategorias?.nombre || ''}
        </div>
        
        {/* Nombre del producto */}
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {product.nombre}
        </h3>
        
        {/* Estrellas (si no es compacto) */}
        {!compact && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3.5 w-3.5 ${star <= (product.rating || 0) ? `text-${config.accent}-500 fill-${config.accent}-500` : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews_count || 0})
            </span>
          </div>
        )}
        
        {/* Precio */}
        <div className="mt-auto pt-2 flex items-baseline">
          {hasDiscount ? (
            <>
              <span className={`text-${config.accent}-600 font-semibold`}>${discountedPrice}</span>
              <span className="text-gray-400 text-sm line-through ml-1">${product.precio.toFixed(2)}</span>
            </>
          ) : (
            <span className={`text-${config.accent}-600 font-semibold`}>${product.precio.toFixed(2)}</span>
          )}
          
          {/* Stock */}
          <span className="ml-auto text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} ${t('product.available')}` : t('product.outOfStock')}
          </span>
        </div>
      </div>
      
      {/* Botón de añadir al carrito */}
      <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAddingToCart}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2
            ${product.stock > 0 
              ? `bg-${config.accent}-600 hover:bg-${config.accent}-700 text-white` 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
          whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;