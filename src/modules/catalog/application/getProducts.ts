import { supabase } from '@/shared/lib/supabase/supabaseClient';

// Cache para productos por categoría
const productCache = new Map();

export async function getProductsByCategory(
  categoriaId: number, 
  page = 1, 
  pageSize = 12,
  filters = {
    search: '',
    subcategory: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'nameAsc'
  }
) {
  // Clave de caché única para esta consulta con filtros
  const cacheKey = `cat_${categoriaId}_page_${page}_size_${pageSize}_filters_${JSON.stringify(filters)}`;
  
  // Verificar si los datos ya están en caché
  if (productCache.has(cacheKey)) {
    return productCache.get(cacheKey);
  }
  
  // Calcular el rango para paginación
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  // Iniciar la consulta
  let query = supabase
    .from('productos')
    .select(`
      id, nombre, descripcion, precio, stock, imagen_principal, categoria_id, subcategoria_id,
      subcategorias (nombre),
      categorias (nombre)
    `)
    .eq('categoria_id', categoriaId);
  
  // Aplicar filtros
  if (filters.search) {
    query = query.ilike('nombre', `%${filters.search}%`);
  }
  
  if (filters.subcategory) {
    query = query.eq('subcategoria_id', filters.subcategory);
  }
  
  if (filters.minPrice > 0) {
    query = query.gte('precio', filters.minPrice);
  }
  
  if (filters.maxPrice < 1000) {
    query = query.lte('precio', filters.maxPrice);
  }
  
  // Aplicar ordenamiento
  switch (filters.sortBy) {
    case 'nameAsc':
      query = query.order('nombre', { ascending: true });
      break;
    case 'nameDesc':
      query = query.order('nombre', { ascending: false });
      break;
    case 'priceAsc':
      query = query.order('precio', { ascending: true });
      break;
    case 'priceDesc':
      query = query.order('precio', { ascending: false });
      break;
    default:
      query = query.order('fecha_creacion', { ascending: false });
  }
  
  // Aplicar paginación
  query = query.range(from, to);
  
  // Ejecutar la consulta
  const { data, error } = await query;

  if (error) throw error;
  
  // Guardar en caché para futuras solicitudes
  productCache.set(cacheKey, data);
  
  return data;
}

// Función para limpiar la caché cuando sea necesario
export function clearProductCache() {
  productCache.clear();
}

// Función para obtener el total de productos (para paginación)
export async function getTotalProductCount(
  categoriaId: number,
  filters = {
    search: '',
    subcategory: null,
    minPrice: 0,
    maxPrice: 1000
  }
) {
  // Clave de caché para el conteo
  const cacheKey = `count_cat_${categoriaId}_filters_${JSON.stringify(filters)}`;
  
  if (productCache.has(cacheKey)) {
    return productCache.get(cacheKey);
  }
  
  let query = supabase
    .from('productos')
    .select('id', { count: 'exact' })
    .eq('categoria_id', categoriaId);
  
  // Aplicar los mismos filtros que en la consulta principal
  if (filters.search) {
    query = query.ilike('nombre', `%${filters.search}%`);
  }
  
  if (filters.subcategory) {
    query = query.eq('subcategoria_id', filters.subcategory);
  }
  
  if (filters.minPrice > 0) {
    query = query.gte('precio', filters.minPrice);
  }
  
  if (filters.maxPrice < 1000) {
    query = query.lte('precio', filters.maxPrice);
  }
  
  const { count, error } = await query;
  
  if (error) throw error;
  
  productCache.set(cacheKey, count);
  
  return count;
}
