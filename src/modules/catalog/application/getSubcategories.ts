import { supabase } from '@/shared/lib/supabase/supabaseClient';

export async function getSubcategoriesByCategory(categoriaId: number) {
  const { data, error } = await supabase
    .from('subcategorias')
    .select('id, nombre')
    .eq('categoria_id', categoriaId)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
}
