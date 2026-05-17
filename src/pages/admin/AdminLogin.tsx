import { useState, FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutos
const STORAGE_KEY = "admin_login_attempts";

interface AttemptData {
  count: number;
  lockedUntil: number | null;
}

function getAttempts(): AttemptData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    return JSON.parse(raw) as AttemptData;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttempts(data: AttemptData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetAttempts() {
  localStorage.removeItem(STORAGE_KEY);
}

function getLockoutMessage(lockedUntil: number): string {
  const remaining = Math.ceil((lockedUntil - Date.now()) / 60000);
  return `Muitas tentativas. Tente novamente em ${remaining} minuto${remaining !== 1 ? "s" : ""}.`;
}

const AdminLogin = () => {
  const { user, isAdmin, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Rate limiting
    const attempts = getAttempts();
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      toast({ title: "Bloqueado", description: getLockoutMessage(attempts.lockedUntil), variant: "destructive" });
      return;
    }
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      resetAttempts();
    }

    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      const current = getAttempts();
      const newCount = (current.lockedUntil && Date.now() < current.lockedUntil ? current.count : current.count) + 1;
      const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
      saveAttempts({ count: newCount, lockedUntil });

      if (lockedUntil) {
        toast({ title: "Conta bloqueada", description: getLockoutMessage(lockedUntil), variant: "destructive" });
      } else {
        const remaining = MAX_ATTEMPTS - newCount;
        toast({
          title: "Falha no login",
          description: `E-mail ou senha incorretos. ${remaining} tentativa${remaining !== 1 ? "s" : ""} restante${remaining !== 1 ? "s" : ""}.`,
          variant: "destructive",
        });
      }
      return;
    }

    resetAttempts();
    toast({ title: "Bem-vindo!", description: "Login efetuado com sucesso." });
    navigate("/admin", { replace: true });
  };

  const attempts = getAttempts();
  const isLocked = !!(attempts.lockedUntil && Date.now() < attempts.lockedUntil);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>Amazon Samaúma Lodge</CardDescription>
        </CardHeader>
        <CardContent>
          {isLocked && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive text-center">
              {getLockoutMessage(attempts.lockedUntil!)}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLocked}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || isLocked}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
