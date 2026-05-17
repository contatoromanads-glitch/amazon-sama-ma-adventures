import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { FAQ } from "@/integrations/supabase/types";
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

const EMPTY: Omit<FAQ, "id" | "created_at"> = {
  question: "", answer: "", is_active: true, sort_order: 0,
};

export default function FAQsManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data as FAQ[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("faqs").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faqs").insert({ ...form, sort_order: faqs.length });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faqs-admin"] }); toast({ title: editId ? "FAQ atualizada!" : "FAQ criada!" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("faqs").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faqs-admin"] }); toast({ title: "FAQ excluída." }); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("faqs").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs-admin"] }),
  });

  const openEdit = (f: FAQ) => {
    setForm({ question: f.question, answer: f.answer, is_active: f.is_active, sort_order: f.sort_order });
    setEditId(f.id);
    setShowForm(true);
  };

  const closeForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Perguntas Frequentes</h1>
          <p className="text-muted-foreground">Gerencie as dúvidas exibidas no site</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={16} /> Nova Pergunta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="font-serif">{editId ? "Editar Pergunta" : "Nova Pergunta"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-q">Pergunta *</Label>
              <Input id="faq-q" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Ex: Como funciona o acesso ao lodge?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-a">Resposta *</Label>
              <Textarea id="faq-a" rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Resposta completa da pergunta..." required />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="faq-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label htmlFor="faq-active">Visível no site</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending || !form.question || !form.answer}>
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Pergunta"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : faqs.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para adicionar.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <Card key={faq.id} className={!faq.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-start gap-3">
                <GripVertical size={16} className="text-muted-foreground mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm">{faq.question}</p>
                    {!faq.is_active && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Oculto</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate({ id: faq.id, is_active: !faq.is_active })}>
                    {faq.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Pencil size={15} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 size={15} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
                        <AlertDialogDescription>Esta pergunta será removida permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(faq.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
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
