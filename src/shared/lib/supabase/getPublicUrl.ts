import { supabase } from './supabaseClient';

// Cache para URL de imágenes para evitar recálculos
const imageUrlCache = new Map();

export const getPublicUrl = (bucket: string, path: string) => {
  if (!path) return null;
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export function getSupabaseImageUrl(path: string) {
  if (!path) return '/placeholder-product.png';
  
  // Verificar si la URL ya está en caché
  if (imageUrlCache.has(path)) {
    return imageUrlCache.get(path);
  }
  
  // Obtener la URL pública desde Supabase
  const url = supabase.storage
    .from('productos')
    .getPublicUrl(path).data.publicUrl;
  
  // Guardar en caché para uso futuro
  imageUrlCache.set(path, url);
  
  return url;
} 