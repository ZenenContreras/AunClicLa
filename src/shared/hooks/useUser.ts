"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabaseClient";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  console.log("Estado de sesión en useUser:", { user, loading });

  return user;
}
