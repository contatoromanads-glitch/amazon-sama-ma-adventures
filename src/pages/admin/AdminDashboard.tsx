import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BedDouble, MessageSquareQuote, Image, HelpCircle, Settings, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const sections = [
  { title: "Acomodações", icon: BedDouble, desc: "Gerencie quartos, suítes e preços", url: "/admin/acomodacoes", color: "text-blue-500", queryKey: "accommodations" },
  { title: "Banners", icon: Image, desc: "Imagens de destaque da home", url: "/admin/banners", color: "text-purple-500", queryKey: "banners" },
  { title: "Depoimentos", icon: MessageSquareQuote, desc: "Avaliações dos hóspedes", url: "/admin/depoimentos", color: "text-green-500", queryKey: "testimonials" },
  { title: "Perguntas Frequentes", icon: HelpCircle, desc: "FAQs exibidas no site", url: "/admin/faqs", color: "text-amber-500", queryKey: "faqs" },
];

function useCounts() {
  const acc = useQuery({ queryKey: ["accommodations-count"], queryFn: async () => { const { count } = await (supabase as any).from("accommodations").select("*", { count: "exact", head: true }).eq("is_active", true); return count ?? 0; } });
  const ban = useQuery({ queryKey: ["banners-count"], queryFn: async () => { const { count } = await (supabase as any).from("banners").select("*", { count: "exact", head: true }).eq("is_active", true); return count ?? 0; } });
  const tes = useQuery({ queryKey: ["testimonials-count"], queryFn: async () => { const { count } = await (supabase as any).from("testimonials").select("*", { count: "exact", head: true }).eq("is_active", true); return count ?? 0; } });
  const faq = useQuery({ queryKey: ["faqs-count"], queryFn: async () => { const { count } = await (supabase as any).from("faqs").select("*", { count: "exact", head: true }).eq("is_active", true); return count ?? 0; } });
  return { accommodations: acc.data, banners: ban.data, testimonials: tes.data, faqs: faq.data };
}

export default function AdminDashboard() {
  const counts = useCounts();
  const countMap: Record<string, number | undefined> = {
    accommodations: counts.accommodations,
    banners: counts.banners,
    testimonials: counts.testimonials,
    faqs: counts.faqs,
  };

  const supabaseOk = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel do Amazon Samaúma Lodge</p>
      </div>

      {/* Status Supabase */}
      {!supabaseOk && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-800">Configuração necessária</p>
              <p className="text-sm text-amber-700">Adicione as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> para ativar todas as funcionalidades.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {supabaseOk && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500 shrink-0" size={20} />
            <p className="text-sm text-green-800 font-medium">Supabase conectado — todas as funcionalidades estão ativas.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <Card key={s.url} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-serif font-light mb-1">
                {countMap[s.queryKey] !== undefined ? countMap[s.queryKey] : "—"}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{s.desc}</p>
              <Button asChild variant="ghost" size="sm" className="p-0 h-auto text-xs gap-1 hover:text-gold">
                <Link to={s.url}>Gerenciar <ArrowRight size={12} /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick access */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          {sections.map((s) => (
            <Button key={s.url} asChild variant="outline" className="h-auto py-3 justify-start gap-3">
              <Link to={s.url}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <div className="text-left">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground font-normal">{s.desc}</p>
                </div>
              </Link>
            </Button>
          ))}
          <Button asChild variant="outline" className="h-auto py-3 justify-start gap-3">
            <Link to="/admin/configuracoes">
              <Settings className="h-4 w-4 text-gray-500" />
              <div className="text-left">
                <p className="font-medium text-sm">Configurações</p>
                <p className="text-xs text-muted-foreground font-normal">WhatsApp, Instagram e mais</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
