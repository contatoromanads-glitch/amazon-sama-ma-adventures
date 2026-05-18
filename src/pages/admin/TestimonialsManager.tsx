import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Testimonial } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EMPTY: Omit<Testimonial, "id" | "created_at"> = {
  author_name: "", location: "", text: "", stars: 5, is_active: true, sort_order: 0,
};

export default function TestimonialsManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await (supabase as any).from("testimonials").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("testimonials").insert({ ...form, sort_order: testimonials.length });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); toast({ title: editId ? "Depoimento atualizado!" : "Depoimento criado!" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await (supabase as any).from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); toast({ title: "Depoimento excluído." }); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });

  const openEdit = (t: Testimonial) => {
    setForm({ author_name: t.author_name, location: t.location ?? "", text: t.text, stars: t.stars, is_active: t.is_active, sort_order: t.sort_order });
    setEditId(t.id);
    setShowForm(true);
  };

  const closeForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Depoimentos</h1>
          <p className="text-muted-foreground">Avaliações dos hóspedes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={16} /> Novo Depoimento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="font-serif">{editId ? "Editar Depoimento" : "Novo Depoimento"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-author">Nome do Hóspede *</Label>
                <Input id="t-author" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Ex: Carlos M." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-location">Cidade / Estado</Label>
                <Input id="t-location" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: São Paulo, SP" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Avaliação</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, stars: n })} className="focus:outline-none">
                    <Star size={24} className={n <= form.stars ? "text-gold fill-gold" : "text-muted-foreground"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="t-text">Depoimento *</Label>
              <Textarea id="t-text" rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="O que o hóspede disse sobre a experiência..." required />
            </div>

            <div className="flex items-center gap-3">
              <Switch id="t-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label htmlFor="t-active">Visível no site</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending || !form.author_name || !form.text}>
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Depoimento"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : testimonials.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum depoimento cadastrado ainda.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <Card key={t.id} className={!t.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold">{t.author_name}</p>
                    {t.location && <span className="text-xs text-muted-foreground">{t.location}</span>}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} className="text-gold fill-gold" />)}
                    </div>
                    {!t.is_active && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Oculto</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate({ id: t.id, is_active: !t.is_active })}>
                    {t.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil size={15} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 size={15} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir depoimento?</AlertDialogTitle>
                        <AlertDialogDescription>O depoimento de "{t.author_name}" será removido permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(t.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
