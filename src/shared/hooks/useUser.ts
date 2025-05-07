"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/shared/lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';

// Crear un almacén global para el estado del usuario
type UserState = {
  user: User | null;
  loading: boolean;
};

// Variable global para almacenar el estado del usuario
let globalUserState: UserState = {
  user: null,
  loading: true
};

// Lista de callbacks para notificar cambios
const listeners = new Set<(state: UserState) => void>();

// Función para actualizar el estado global y notificar a los listeners
const updateGlobalUserState = (newState: Partial<UserState>) => {
  globalUserState = { ...globalUserState, ...newState };
  listeners.forEach(listener => listener(globalUserState));
};

// Iniciar la escucha de cambios de autenticación una sola vez
let authListenerInitialized = false;
const initAuthListener = () => {
  if (authListenerInitialized) return;
  
  authListenerInitialized = true;
  
  // Verificar el estado inicial de la sesión
  supabase.auth.getSession().then(({ data: { session } }) => {
    updateGlobalUserState({ 
      user: session?.user || null,
      loading: false
    });
  });
  
  // Suscribirse a cambios de autenticación
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      updateGlobalUserState({ 
        user: session?.user || null,
        loading: false
      });
    }
  );
  
  // Limpiar suscripción al desmontar la aplicación
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      subscription.unsubscribe();
    });
  }
};

/**
 * Hook para acceder al estado de autenticación del usuario
 * @param {boolean} skipInitialFetch - Si es true, no realizará la verificación inicial de sesión
 * @returns {Object} Estado del usuario y funciones de autenticación
 */
export const useUser = (skipInitialFetch = false) => {
  const [state, setState] = useState<UserState>(globalUserState);
  
  // Inicializar el listener de autenticación si no se ha hecho ya
  useEffect(() => {
    if (!skipInitialFetch) {
      initAuthListener();
    }
    
    // Suscribirse a cambios en el estado global
    const handleChange = (newState: UserState) => {
      setState(newState);
    };
    
    listeners.add(handleChange);
    
    // Proporcionar el estado actual inmediatamente
    if (globalUserState.user !== state.user || globalUserState.loading !== state.loading) {
      setState(globalUserState);
    }
    
    // Limpiar al desmontar
    return () => {
      listeners.delete(handleChange);
    };
  }, [skipInitialFetch, state.user, state.loading]);
  
  // Funciones de autenticación memorizadas
  const signOut = useCallback(async () => {
    updateGlobalUserState({ loading: true });
    await supabase.auth.signOut();
  }, []);
  
  const refreshSession = useCallback(async () => {
    updateGlobalUserState({ loading: true });
    const { data } = await supabase.auth.refreshSession();
    updateGlobalUserState({ 
      user: data.session?.user || null,
      loading: false
    });
    return data.session;
  }, []);
  
  // Devolver valores memorizados para evitar re-renderizados innecesarios
  return useMemo(() => ({
    user: state.user,
    loading: state.loading,
    signOut,
    refreshSession,
    isLoggedIn: !!state.user
  }), [state.user, state.loading, signOut, refreshSession]);
};

export default useUser;
