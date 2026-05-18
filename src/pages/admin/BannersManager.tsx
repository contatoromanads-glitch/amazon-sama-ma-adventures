import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Banner } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EMPTY: Omit<Banner, "id" | "created_at" | "updated_at"> = {
  title: "", subtitle: "", image_url: "", cta_text: "", cta_url: "", is_active: true, sort_order: 0,
};

type FormState = typeof EMPTY;

export default function BannersManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("banners").select("*").order("sort_order");
      if (error) throw error;
      return data as Banner[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.image_url) throw new Error("Adicione uma imagem para o banner.");
      if (editId) {
        const { error } = await (supabase as any).from("banners").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("banners").insert({ ...form, sort_order: banners.length });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banners"] }); toast({ title: editId ? "Banner atualizado!" : "Banner criado!" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await (supabase as any).from("banners").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banners"] }); toast({ title: "Banner excluído." }); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any).from("banners").update({ is_active, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });

  const openEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle ?? "", image_url: b.image_url, cta_text: b.cta_text ?? "", cta_url: b.cta_url ?? "", is_active: b.is_active, sort_order: b.sort_order });
    setEditId(b.id);
    setShowForm(true);
  };

  const closeForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Banners</h1>
          <p className="text-muted-foreground">Imagens de destaque do site</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={16} /> Novo Banner
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="font-serif">{editId ? "Editar Banner" : "Novo Banner"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Imagem do Banner *</Label>
              {form.image_url ? (
                <div className="relative">
                  <img src={form.image_url} alt="Preview" className="w-full max-h-48 object-cover rounded border" />
                  <button onClick={() => setForm((f) => ({ ...f, image_url: "" }))} className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded text-xs hover:bg-destructive/80">Remover</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded cursor-pointer hover:border-gold hover:bg-muted/50 transition-colors gap-2">
                  <ImagePlus size={28} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Enviando imagem..." : "Clique para selecionar imagem"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploading} />
                </label>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="b-title">Título</Label>
                <Input id="b-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do banner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-subtitle">Subtítulo</Label>
                <Input id="b-subtitle" value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Texto secundário" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-cta-text">Texto do Botão</Label>
                <Input id="b-cta-text" value={form.cta_text ?? ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="Ex: Reserve Agora" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-cta-url">Link do Botão</Label>
                <Input id="b-cta-url" value={form.cta_url ?? ""} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="Ex: /acomodacoes" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="b-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label htmlFor="b-active">Visível no site</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending || !form.image_url}>
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Banner"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : banners.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum banner cadastrado. Clique em "Novo Banner" para adicionar.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <Card key={b.id} className={!b.is_active ? "opacity-60" : ""}>
              <div className="relative">
                <img src={b.image_url} alt={b.title} className="w-full h-36 object-cover rounded-t" />
                {!b.is_active && <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Oculto</span>}
              </div>
              <CardContent className="p-3 space-y-2">
                {b.title && <p className="font-semibold text-sm">{b.title}</p>}
                {b.subtitle && <p className="text-xs text-muted-foreground">{b.subtitle}</p>}
                <div className="flex gap-2 pt-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate({ id: b.id, is_active: !b.is_active })}>
                    {b.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil size={15} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 size={15} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir banner?</AlertDialogTitle>
                        <AlertDialogDescription>Esta imagem será removida permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(b.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
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
