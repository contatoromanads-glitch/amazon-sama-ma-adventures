import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos de inatividade

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Verifica se o usuário tem role admin no Supabase (busca dados frescos do servidor) */
const checkIsAdmin = (u: User | null): boolean => {
  if (!u) return false;
  return (
    u.user_metadata?.role === "admin" ||
    u.app_metadata?.role === "admin"
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
    }, SESSION_TIMEOUT_MS);
  };

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  /** Busca dados frescos do usuário no servidor (não do JWT cacheado) */
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    const freshUser = data?.user ?? null;
    setUser(freshUser);
    setIsAdmin(checkIsAdmin(freshUser));
    return freshUser;
  };

  useEffect(() => {
    // Ouve mudanças de sessão (login / logout / refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        resetTimeout();
        // Após login, busca dados frescos para garantir que user_metadata está atualizado
        setTimeout(() => { refreshUser(); }, 0);
      } else {
        setUser(null);
        setIsAdmin(false);
        clearTimer();
      }
    });

    // Carrega sessão existente ao inicializar
    supabase.auth.getSession().then(async ({ data: { session: current } }) => {
      setSession(current);
      if (current) {
        resetTimeout();
        await refreshUser();
      }
      setLoading(false);
    });

    // Reset timeout em atividade do usuário
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    const userRef = { current: user };
    const onActivity = () => { if (userRef.current) resetTimeout(); };
    activityEvents.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      subscription.unsubscribe();
      clearTimer();
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    clearTimer();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
