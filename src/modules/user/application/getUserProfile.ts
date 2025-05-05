import { supabase } from '../../../shared/lib/supabase/supabaseClient';

export async function getUserProfile(email: string) {
  // Obtener usuario
  const { data: usuario, error: err1 } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();
  if (err1 || !usuario) throw new Error('errorProfile');
  // Obtener direcciones
  const { data: direcciones, error: err2 } = await supabase
    .from('direcciones_envio')
    .select('*')
    .eq('usuario_id', usuario.id)
    .order('id', { ascending: true });
  if (err2) throw new Error('errorAddresses');
  return { usuario, direcciones };
}

export async function addUserAddress(usuario_id: number, address: any) {
  const { error, data } = await supabase
    .from('direcciones_envio')
    .insert([{ ...address, usuario_id }])
    .select()
    .single();
  if (error) throw new Error('addressAddError');
  return data;
}

export async function updateUserAddress(id: number, address: any) {
  const { error } = await supabase
    .from('direcciones_envio')
    .update(address)
    .eq('id', id);
  if (error) throw new Error('addressUpdateError');
  return true;
}

export async function deleteUserAddress(id: number) {
  const { error } = await supabase
    .from('direcciones_envio')
    .delete()
    .eq('id', id);
  if (error) throw new Error('addressDeleteError');
  return true;
} 