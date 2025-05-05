import { useEffect, useState } from 'react';
import { getFavorite, deleteFavorite } from '../application/getFavorite';
import { useAuth } from '../';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../../shared/lib/supabase/getPublicUrl';
import { Loader2, Heart, Trash2, ShoppingCart } from 'lucide-react';

const FavoritePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user) {
      getFavorite(user.email)
        .then((data) => {
          setFavorites(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleDelete = async (productId: number) => {
    try {
      if (user) {
        await deleteFavorite(user.email, productId);
        setFavorites(favorites.filter((fav: any) => fav.product_id !== productId));
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <Heart className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-xl font-medium text-gray-600">{t('error.favorite')}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t('common.retry')}
      </button>
    </div>
  );

  if (favorites.length === 0) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <Heart className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-xl font-medium text-gray-600">{t('favorite.empty')}</p>
      <a 
        href="/products"
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t('favorite.explore')}
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('favorite.title')} 
            <span className="ml-2 text-lg text-gray-500">({favorites.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav: any) => (
            <div 
              key={fav.product_id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={getSupabaseImageUrl(fav.imagen_principal)} 
                  alt={fav.nombre}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <button
                  onClick={() => handleDelete(fav.product_id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors"
                  title={t('favorite.remove')}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fav.nombre}</h3>
                <p className="text-gray-500 mb-2 line-clamp-2">{fav.descripcion}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-primary">
                    ${fav.precio}
                  </span>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t('favorite.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
