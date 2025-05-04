import { supabase } from '@/shared/lib/supabase/supabaseClient';

// Obtener reseñas de un producto
export async function getProductReviews(productId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, 
      estrellas, 
      comentario, 
      fecha_creacion,
      usuario_id,
      usuarios (id, nombre, email)
    `)
    .eq('producto_id', productId)
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
  return data || [];
}

// Obtener promedio de estrellas y cantidad de reseñas
export async function getProductRatingStats(productId: number) {
  const { data, error, count } = await supabase
    .from('reviews')
    .select('estrellas', { count: 'exact' })
    .eq('producto_id', productId);

  if (error) {
    console.error('Error fetching rating stats:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }
  
  const sum = data.reduce((acc, review) => acc + review.estrellas, 0);
  const average = sum / data.length;
  
  return {
    averageRating: parseFloat(average.toFixed(1)),
    reviewCount: count || 0
  };
}

// Añadir una nueva reseña
export async function addProductReview(
  productId: number, 
  userId: string, 
  rating: number, 
  comment: string
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        producto_id: productId,
        usuario_id: userId,
        estrellas: rating,
        comentario: comment
      }
    ])
    .select();

  if (error) {
    console.error('Error adding review:', error);
    throw error;
  }
  return data?.[0];
}

// Verificar si un usuario ya ha dejado una reseña
export async function hasUserReviewed(productId: number, userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('producto_id', productId)
    .eq('usuario_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking if user reviewed:', error);
    throw error;
  }
  return !!data;
} 