'use client';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Loader2, Star, Tag, Clock, ArrowRight, Gift, Search } from 'lucide-react';
import { useLocale } from 'next-intl';
import { supabase } from '../../../shared/lib/supabase/supabaseClient';
import { useUser } from '../../../shared/hooks/useUser';
import { useSession } from '@/shared/hooks/useSession';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFavorite, getFavorite } from '../application/getFavorite';
import { useNotification } from '../../../shared/ui/Navbar';
import Link from 'next/link';

// Usar un objeto simple para las traducciones
const t = {
  title: "Mis Favoritos",
  empty: "No tienes favoritos guardados",
  startExploring: "Explora nuestros productos y guarda tus favoritos para comprarlos más tarde",
  explore: "Explorar productos",
  remove: "Eliminar de favoritos",
  addToCart: "Añadir",
  addAllToCart: "Añadir todos al carrito",
  continueShopping: "Seguir comprando",
  inStock: "Disponible para envío inmediato",
  discoverProducts: "Descubre productos",
  recommendations: "Recomendaciones para ti",
  recommendationsDescription: "Basado en tus favoritos, te recomendamos estos productos",
  viewRecommendations: "Ver recomendaciones",
  search: "Buscar en favoritos",
  filterByCategory: "Filtrar por categoría",
  allCategories: "Todas las categorías",
  sortBy: "Ordenar por",
  priceHighToLow: "Precio: Mayor a menor",
  priceLowToHigh: "Precio: Menor a mayor",
  newest: "Más recientes",
  oldest: "Más antiguos"
};

const tCommon = {
  loading: "Cargando...",
  retry: "Reintentar"
};

const tProduct = {
  category: "Categoría",
  new: "Nuevo"
};

const tError = {
  favorite: "Ocurrió un error al cargar tus favoritos",
  tryAgain: "Por favor, intenta nuevamente más tarde o contacta a soporte"
};

// Definir la interfaz para el producto favorito
interface FavoriteProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_principal: string;
  categoria_id: number;
  subcategoria_id: number;
  categorias: { nombre: string };
  subcategorias: { nombre: string };
}

// Definir la interfaz para el favorito
interface Favorite {
  id: any;
  producto_id: any;
  fecha_agregado: any;
  productos: FavoriteProduct;
}

const getImageUrl = (path: string) => {
  if (!path) return '/placeholder-product.jpg';
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${path}`;
};

const FavoritePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const notify = useNotification();
  const locale = useLocale();

  useEffect(() => {
    // Solo cargar favoritos cuando tengamos información del usuario
    if (userLoading) return;
    
    // Si no hay usuario después de cargar, redirigir al login
    if (!user && !userLoading) {
      router.push(`/${locale}/login?redirect=/${locale}/favoritos`);
      return;
    }
    
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoritesData = await getFavorite(user);
        
        // Convertir los datos a formato Favorite[]
        const typedFavorites: Favorite[] = favoritesData.map((fav: any) => ({
          id: fav.id,
          producto_id: fav.producto_id,
          fecha_agregado: fav.fecha_agregado,
          productos: fav.productos
        }));
        
        setFavorites(typedFavorites);
        setFilteredFavorites(typedFavorites);
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(typedFavorites.map((fav: Favorite) => 
          fav.productos?.categorias?.nombre || ''
        ))].filter(Boolean);
        
        setCategories(uniqueCategories);
        setError(false);
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, userLoading, locale, router]);

  // Filtrar y ordenar favoritos
  useEffect(() => {
    if (!favorites.length) return;
    
    let result = [...favorites];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(fav => {
        const producto = fav.productos;
        return producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
               producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(fav => {
        const producto = fav.productos;
        return producto.categorias.nombre === selectedCategory;
      });
    }
    
    // Ordenar
    if (sortOption) {
      switch (sortOption) {
        case 'price-high-low':
          result.sort((a, b) => b.productos.precio - a.productos.precio);
          break;
        case 'price-low-high':
          result.sort((a, b) => a.productos.precio - b.productos.precio);
          break;
        case 'newest':
          result.sort((a, b) => {
            return new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime();
          });
          break;
        case 'oldest':
          result.sort((a, b) => {
            return new Date(a.fecha_agregado).getTime() - new Date(b.fecha_agregado).getTime();
          });
          break;
      }
    }
    
    setFilteredFavorites(result);
  }, [favorites, searchTerm, selectedCategory, sortOption]);

  // Función para eliminar un favorito
  const onDeleteFavorite = async (productId: number) => {
    if (!user) return;
    
    try {
      await deleteFavorite(user, productId);
      const updatedFavorites = favorites.filter(fav => fav.producto_id !== productId);
      setFavorites(updatedFavorites);
      setFilteredFavorites(
        filteredFavorites.filter(fav => fav.producto_id !== productId)
      );
      
      notify({
        title: "Eliminado de favoritos",
        message: "El producto ha sido eliminado de tus favoritos",
        type: "success"
      });
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      notify({
        title: "Error",
        message: "No se pudo eliminar el producto de favoritos",
        type: "error"
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">{tCommon.loading}</p>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <div className="text-red-500 mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{tError.favorite}</h2>
        <p className="text-gray-600 mb-6">{tError.tryAgain}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-md"
        >
          {tCommon.retry}
        </motion.button>
      </motion.div>
    </div>
  );

  if (!user && !userLoading) {
    return null; // No renderizar nada, el useEffect se encargará de la redirección
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <Heart className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </motion.div>
        
        {favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center mt-8 border border-indigo-100"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <Heart className="w-16 h-16 text-indigo-200" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.empty}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{t.startExploring}</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/${locale}/productos`)}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t.explore}
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Filtros y búsqueda */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-4 mb-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-300"
                  />
                </div>
                
                {/* Filtro por categoría */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-300"
                  >
                    <option value="">{t.allCategories}</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Ordenar */}
                <div>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-300"
                  >
                    <option value="">{t.sortBy}</option>
                    <option value="price-high-low">{t.priceHighToLow}</option>
                    <option value="price-low-high">{t.priceLowToHigh}</option>
                    <option value="newest">{t.newest}</option>
                    <option value="oldest">{t.oldest}</option>
                  </select>
                </div>
              </div>
            </motion.div>
            
            {/* Botón para añadir todos al carrito */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-between items-center mb-6"
            >
              <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                {filteredFavorites.length} productos
              </p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px -2px rgba(79, 70, 229, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-all duration-300 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.addAllToCart}
              </motion.button>
            </motion.div>
            
            {/* Lista de favoritos */}
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filteredFavorites.map((fav: Favorite, index: number) => {
                const producto = fav.productos;
                
                return (
                  <motion.div 
                    key={fav.producto_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-indigo-50"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <motion.img 
                        src={getImageUrl(producto.imagen_principal)} 
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteFavorite(fav.producto_id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors duration-300 shadow-sm"
                        title={t.remove}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </motion.button>
                    </div>

                    <div className="p-3">
                      <Link href={`/${locale}/productos/${producto.id}`} className="block">
                        <h3 className="text-sm font-bold text-gray-900 mb-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">{producto.nombre}</h3>
                      </Link>
                      
                      <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">{producto.descripcion}</p>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 10})</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1.5">
                          <motion.span 
                            className="text-sm font-bold text-indigo-600"
                            whileHover={{ scale: 1.05 }}
                          >
                            ${producto.precio}
                          </motion.span>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            {t.addToCart}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Recomendaciones */}
            {filteredFavorites.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10"
              >
                <motion.h2 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="text-xl font-bold text-gray-900 mb-4 flex items-center"
                >
                  <Gift className="w-5 h-5 mr-2 text-indigo-500" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t.recommendations}
                  </span>
                </motion.h2>
                <motion.div 
                  whileHover={{ boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
                  className="bg-white rounded-xl p-4 shadow-md border border-indigo-100 transition-all duration-300"
                >
                  <p className="text-sm text-gray-600 mb-3">{t.recommendationsDescription}</p>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-all duration-300 flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {t.viewRecommendations}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default FavoritePage; 