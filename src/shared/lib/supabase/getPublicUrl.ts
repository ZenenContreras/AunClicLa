const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getSupabaseImageUrl(path: string) {
  if (!path) return '/placeholder-product.png';
  return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
} 