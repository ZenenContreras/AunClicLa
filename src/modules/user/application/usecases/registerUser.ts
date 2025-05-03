import { supabase } from '../../../../shared/lib/supabase/supabaseClient';

export async function registerUser(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre: name }
    }
  });
  if (error) throw error;
  return data;
}
