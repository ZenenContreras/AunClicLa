import { supabase } from '../../../shared/lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';

// Función para obtener el ID de usuario de la tabla usuarios
async function getUserIdByUser(user: User | null) {
  if (!user) return null;
  
  // Intentar obtener por auth_id primero
  const { data: authData, error: authError } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', user.id)
    .single();
    
  if (!authError && authData?.id) {
    return authData.id;
  }
  
  // Si no se encuentra por auth_id, intentar por email
  if (user.email) {
    const { data: emailData, error: emailError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', user.email)
      .single();
      
    if (!emailError && emailData?.id) {
      return emailData.id;
    }
  }
  
  return null;
}

export async function getFavorite(user: User | null) {
  try {
    if (!user) return [];
    
    // Obtener el ID del usuario
    const userId = await getUserIdByUser(user);
    if (!userId) return [];
    
    // Luego obtenemos los favoritos usando el ID de usuario
    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        producto_id,
        fecha_agregado,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          stock,
          imagen_principal,
          categoria_id,
          subcategoria_id,
          categorias (
            id,
            nombre
          ),
          subcategorias (
            id,
            nombre
          )
        )
      `)
      .eq('usuario_id', userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error en getFavorite:', error);
    return [];
  }
}

export async function addFavorite(user: User | null, product_id: number) {
  try {
    if (!user) throw new Error('Usuario no autenticado');
    
    // Obtener el ID del usuario
    const userId = await getUserIdByUser(user);
    if (!userId) throw new Error('Usuario no encontrado en la base de datos');
    
    // Verificar si ya existe el favorito
    const { data: existingFav, error: checkError } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', product_id)
      .single();
      
    if (!checkError && existingFav) {
      return existingFav; // Ya existe, devolver el existente
    }
    
    // Insertar nuevo favorito
    const { data, error } = await supabase
      .from('favoritos')
      .insert([{ usuario_id: userId, producto_id: product_id }])
      .select();
      
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error en addFavorite:', error);
    throw error;
  }
}

export async function deleteFavorite(user: User | null, product_id: number) {
  try {
    if (!user) throw new Error('Usuario no autenticado');
    
    // Obtener el ID del usuario
    const userId = await getUserIdByUser(user);
    if (!userId) throw new Error('Usuario no encontrado en la base de datos');
    
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', userId)
      .eq('producto_id', product_id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error en deleteFavorite:', error);
    throw error;
  }
}

export async function getFavoriteCount(user: User | null) {
  try {
    if (!user) return 0;
    
    // Obtener el ID del usuario
    const userId = await getUserIdByUser(user);
    if (!userId) return 0;
    
    const { data, error, count } = await supabase
      .from('favoritos')
      .select('id', { count: 'exact' })
      .eq('usuario_id', userId);
      
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error en getFavoriteCount:', error);
    return 0;
  }
}

// Verificar si un producto está en favoritos
export async function isProductFavorite(user: User | null, product_id: number) {
  try {
    if (!user) return false;
    
    // Obtener el ID del usuario
    const userId = await getUserIdByUser(user);
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', product_id)
      .single();
      
    return !error && !!data;
  } catch (error) {
    console.error('Error en isProductFavorite:', error);
    return false;
  }
}



