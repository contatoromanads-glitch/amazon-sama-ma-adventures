import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, MessageSquareQuote, Image, HelpCircle } from "lucide-react";

const cards = [
  { title: "Acomodações", icon: BedDouble, desc: "Gerencie quartos e suítes" },
  { title: "Depoimentos", icon: MessageSquareQuote, desc: "Avaliações dos hóspedes" },
  { title: "Banners", icon: Image, desc: "Imagens da home" },
  { title: "FAQs", icon: HelpCircle, desc: "Perguntas frequentes" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do painel administrativo.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Próximos passos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✅ Fase 1 concluída: backend conectado, autenticação e painel base.</p>
          <p>⏭️ Próximas fases: CRUDs de Acomodações, Depoimentos, Banners, FAQs e Configurações.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
