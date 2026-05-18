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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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

  const clearTimeout_ = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const checkAdmin = async (uid: string | undefined) => {
    if (!uid) { setIsAdmin(false); return; }
    const { data } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession) {
        resetTimeout();
        // Defer Supabase call to avoid deadlock inside the auth callback
        setTimeout(() => { checkAdmin(newSession.user.id); }, 0);
      } else {
        clearTimeout_();
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setUser(current?.user ?? null);
      if (current) {
        resetTimeout();
        checkAdmin(current.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    const onActivity = () => { if (user) resetTimeout(); };
    activityEvents.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      subscription.unsubscribe();
      clearTimeout_();
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    clearTimeout_();
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
