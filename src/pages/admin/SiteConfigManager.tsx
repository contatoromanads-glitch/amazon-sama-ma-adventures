import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ConfigMap {
  whatsapp_number: string;
  instagram_handle: string;
  best_fishing_season: string;
  lodge_tagline: string;
}

const DEFAULTS: ConfigMap = {
  whatsapp_number: "5592993839110",
  instagram_handle: "amazon_samauma_lodge",
  best_fishing_season: "Setembro a Janeiro",
  lodge_tagline: "Pousada flutuante no coração da Amazônia",
};

const CONFIG_LABELS: Record<keyof ConfigMap, { label: string; desc: string; placeholder: string }> = {
  whatsapp_number: { label: "Número do WhatsApp", desc: "Somente números, com código do país. Ex: 5592993839110", placeholder: "5592993839110" },
  instagram_handle: { label: "Instagram (usuário)", desc: "Somente o @ sem o arroba. Ex: amazon_samauma_lodge", placeholder: "amazon_samauma_lodge" },
  best_fishing_season: { label: "Melhor Época para Pesca", desc: "Exibido no rodapé e na página de pesca", placeholder: "Setembro a Janeiro" },
  lodge_tagline: { label: "Tagline do Lodge", desc: "Frase curta exibida no rodapé", placeholder: "Pousada flutuante no coração da Amazônia" },
};

export default function SiteConfigManager() {
  const qc = useQueryClient();
  const [config, setConfig] = useState<ConfigMap>(DEFAULTS);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["site-config"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("site_config").select("*");
      if (error) throw error;
      return data as { key: string; value: string }[];
    },
  });

  useEffect(() => {
    if (rows.length > 0) {
      const map: Partial<ConfigMap> = {};
      rows.forEach((r) => { if (r.key in DEFAULTS) (map as Record<string, string>)[r.key] = r.value; });
      setConfig((prev) => ({ ...prev, ...map }));
    }
  }, [rows]);

  const save = useMutation({
    mutationFn: async () => {
      const upserts = (Object.keys(config) as (keyof ConfigMap)[]).map((key) => ({
        key,
        value: config[key],
        updated_at: new Date().toISOString(),
      }));
      const { error } = await (supabase as any).from("site_config").upsert(upserts, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-config"] }); toast({ title: "Configurações salvas!" }); },
    onError: (e: Error) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif">Configurações do Site</h1>
        <p className="text-muted-foreground">Informações de contato e configurações gerais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Informações de Contato</CardTitle>
          <CardDescription>Estas informações aparecem em todo o site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              {(Object.keys(CONFIG_LABELS) as (keyof ConfigMap)[]).map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`cfg-${key}`}>{CONFIG_LABELS[key].label}</Label>
                  <Input
                    id={`cfg-${key}`}
                    value={config[key]}
                    onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))}
                    placeholder={CONFIG_LABELS[key].placeholder}
                  />
                  <p className="text-xs text-muted-foreground">{CONFIG_LABELS[key].desc}</p>
                </div>
              ))}

              <div className="pt-2">
                <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
                  <Save size={16} />
                  {save.isPending ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Links Diretos</CardTitle>
          <CardDescription>Visualize como as configurações ficam no site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>WhatsApp: <a href={`https://wa.me/${config.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">wa.me/{config.whatsapp_number}</a></p>
          <p>Instagram: <a href={`https://instagram.com/${config.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">@{config.instagram_handle}</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
