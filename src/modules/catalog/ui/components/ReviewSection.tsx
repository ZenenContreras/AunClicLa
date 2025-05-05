'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Star, User, Calendar, Send, ThumbsUp, Flag, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/shared/hooks/useUser';
import { getProductReviews, addProductReview, hasUserReviewed } from '@/modules/catalog/application/getReviews';
import { useLocale } from 'next-intl';

interface ReviewSectionProps {
  productId: number;
  accentColor: string;
  onReviewAdded: () => void;
  compactMode?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  productId, 
  accentColor,
  onReviewAdded,
  compactMode = false
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const userResult = useUser();
  const user = userResult?.user || null;
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});

  // Cargar reseñas
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewData = await getProductReviews(productId);
        setReviews(reviewData);
        
        // Verificar si el usuario ya ha dejado una reseña
        if (user) {
          const hasReviewed = await hasUserReviewed(productId, user.id);
          setUserHasReviewed(hasReviewed);
        }
      } catch (err) {
        setError(t('product.errorLoadingReviews'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviews();
  }, [productId, user, t]);

  // Manejar envío de reseña
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('product.loginToReview'));
      return;
    }
    
    if (newReview.rating < 1 || newReview.comment.trim() === '') {
      setError(t('product.invalidReview'));
      return;
    }
    
    try {
      setSubmitting(true);
      await addProductReview(
        productId,
        user.id,
        newReview.rating,
        newReview.comment
      );
      
      // Recargar reseñas
      const updatedReviews = await getProductReviews(productId);
      setReviews(updatedReviews);
      setUserHasReviewed(true);
      setShowAddReview(false);
      setNewReview({ rating: 5, comment: '' });
      onReviewAdded();
    } catch (err) {
      setError(t('product.errorAddingReview'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Marcar reseña como útil
  const handleMarkHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Renderizar estrellas para calificación
  const renderStars = (rating: number, size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      xs: 'h-2.5 w-2.5',
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${sizes[size]} ${star <= rating ? `text-${accentColor}-500 fill-${accentColor}-500` : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Título y botón para agregar reseña */}
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${compactMode ? 'text-base' : 'text-sm md:text-base'}`}>
          {t('product.reviewsTitle')}
        </h2>
        {user && !userHasReviewed && !showAddReview && (
          <motion.button
            onClick={() => setShowAddReview(true)}
            className={`px-2.5 py-1.5 text-xs font-medium bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700 shadow-sm`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('product.addReview')}
          </motion.button>
        )}
      </div>

      {/* Resumen de calificaciones */}
      {reviews.length > 0 && !compactMode && (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-gray-900">
            {(reviews.reduce((acc, r) => acc + r.estrellas, 0) / reviews.length).toFixed(1)}
          </div>
          <div className="flex justify-center">{renderStars((reviews.reduce((acc, r) => acc + r.estrellas, 0) / reviews.length), 'lg')}</div>
          <div className="text-sm text-gray-500">{reviews.length} {reviews.length === 1 ? t('product.review') : t('product.reviews')}</div>
        </div>
      )}

      {/* Formulario para añadir reseña */}
      <AnimatePresence>
        {showAddReview && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`bg-white rounded-lg p-4 overflow-hidden border border-${accentColor}-100 shadow-sm`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('product.shareYourThoughts')}</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.rateProduct')}</label>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-0.5 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= newReview.rating ? `text-${accentColor}-500 fill-${accentColor}-500` : 'text-gray-300'}`} 
                      />
                    </motion.button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder={t('product.writeReview')}
                  className={`w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent text-gray-700`}
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm"
                  disabled={submitting}
                >
                  {t('product.cancel')}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 bg-${accentColor}-600 text-white rounded-lg text-sm font-medium hover:bg-${accentColor}-700 shadow-sm`}
                >
                  {submitting ? (
                    <div className={`w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {t('product.submit')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mostrar reseñas */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className={`w-6 h-6 border-2 border-${accentColor}-500 border-t-transparent rounded-full animate-spin`}></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 rounded-full bg-${accentColor}-100 flex items-center justify-center`}>
                    <User className={`h-4 w-4 text-${accentColor}-600`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {review.usuarios?.nombre || 'Usuario'}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {renderStars(review.estrellas, 'xs')}
                        <span className="text-[10px] text-gray-500">{formatDate(review.fecha_creacion)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-${accentColor}-100 text-${accentColor}-800`}>
                        <CheckCircle className="h-2 w-2 mr-0.5" />
                        {t('product.verified')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 my-2">{review.comentario}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleMarkHelpful(review.id)}
                      className={`flex items-center gap-0.5 text-[10px] ${helpfulReviews[review.id] ? `text-${accentColor}-600 font-medium` : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <ThumbsUp className={`h-2.5 w-2.5 ${helpfulReviews[review.id] ? 'fill-current' : ''}`} />
                      {t('product.helpful')}
                    </button>
                    <button className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-0.5">
                      <Flag className="h-2.5 w-2.5" />
                      {t('product.reportReview')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className={`w-12 h-12 mx-auto rounded-full bg-${accentColor}-100 flex items-center justify-center mb-3`}>
            <Star className={`h-6 w-6 text-${accentColor}-500`} />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1.5">{t('product.noReviews')}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">{t('product.beFirst')}</p>
          {user && !userHasReviewed && !showAddReview && (
            <motion.button
              onClick={() => setShowAddReview(true)}
              className={`px-4 py-2 text-xs font-medium bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700 shadow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('product.addReview')}
            </motion.button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2.5 bg-red-100 text-red-700 rounded-lg text-xs flex items-start"
        >
          <div className="flex-shrink-0 mr-1.5">
            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default ReviewSection;
