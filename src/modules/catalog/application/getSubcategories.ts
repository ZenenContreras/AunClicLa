import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSubcategoriesByCategory(categoriaId: number) {
  const { data, error } = await supabase
    .from('subcategorias')
    .select('id, nombre')
    .eq('categoria_id', categoriaId)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
}
