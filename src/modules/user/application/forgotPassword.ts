import { supabase } from '../../../shared/lib/supabase/supabaseClient';

export async function forgotPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}
