import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProductsByCategory(categoriaId: number) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, descripcion, precio, stock, imagen_principal, categoria_id, subcategoria_id,
      subcategorias (nombre),
      categorias (nombre)
    `)
    .eq('categoria_id', categoriaId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}
