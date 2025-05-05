import { supabase } from '../../../shared/lib/supabase/supabaseClient';

// Función para obtener el ID de usuario de la tabla usuarios
async function getUserIdByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', authId)
    .single();
    
  if (error) throw error;
  return data?.id;
}

export async function getFavorite(email: string) {
  try {
    // Primero obtenemos el ID del usuario de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError) throw userError;
    if (!userData) return [];
    
    // Luego obtenemos los favoritos usando el ID de usuario
    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        producto_id,
        fecha_agregado,
        productos (*)
      `)
      .eq('usuario_id', userData.id);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error en getFavorite:', error);
    return [];
  }
}

export async function addFavorite(email: string, product_id: number) {
  try {
    // Primero obtenemos el ID del usuario de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError) throw userError;
    if (!userData) throw new Error('Usuario no encontrado');
    
    const { data, error } = await supabase
      .from('favoritos')
      .insert([{ usuario_id: userData.id, producto_id: product_id }]);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error en addFavorite:', error);
    throw error;
  }
}

export async function deleteFavorite(email: string, product_id: number) {
  try {
    // Primero obtenemos el ID del usuario de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError) throw userError;
    if (!userData) throw new Error('Usuario no encontrado');
    
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', userData.id)
      .eq('producto_id', product_id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error en deleteFavorite:', error);
    throw error;
  }
}

export async function getFavoriteCount(email: string) {
  try {
    // Primero obtenemos el ID del usuario de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError) throw userError;
    if (!userData) return 0;
    
    const { data, error } = await supabase
      .from('favoritos')
      .select('id', { count: 'exact' })
      .eq('usuario_id', userData.id);
      
    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error('Error en getFavoriteCount:', error);
    return 0;
  }
}



