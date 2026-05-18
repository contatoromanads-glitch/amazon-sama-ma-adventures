import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Accommodation } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

const ALL_AMENITIES = [
  "Ar-Condicionado", "Wi-Fi Starlink", "Água Quente", "Cama de Casal",
  "Cama de Solteiro", "Banheiro Privativo", "Vista para o Rio",
  "Limpeza Diária", "Restaurante Incluso", "Frigobar",
];

const EMPTY: Omit<Accommodation, "id" | "created_at" | "updated_at"> = {
  name: "", description: "", capacity: "", price_info: "",
  amenities: [], images: [], is_active: true, sort_order: 0,
};

type FormState = typeof EMPTY;

export default function AccommodationsManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: accommodations = [], isLoading } = useQuery({
    queryKey: ["accommodations"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("accommodations")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Accommodation[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await (supabase as any).from("accommodations").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("accommodations").insert({ ...form, sort_order: accommodations.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accommodations"] });
      toast({ title: editId ? "Acomodação atualizada!" : "Acomodação criada!" });
      closeForm();
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("accommodations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accommodations"] });
      toast({ title: "Acomodação excluída." });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any).from("accommodations").update({ is_active, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accommodations"] }),
  });

  const openEdit = (acc: Accommodation) => {
    setForm({ name: acc.name, description: acc.description, capacity: acc.capacity, price_info: acc.price_info ?? "", amenities: acc.amenities, images: acc.images, is_active: acc.is_active, sort_order: acc.sort_order });
    setEditId(acc.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `accommodations/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
    setForm((f) => ({ ...f, images: [...f.images, publicUrl] }));
    setUploading(false);
  };

  const removeImage = (url: string) => setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const toggleAmenity = (a: string) =>
    setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Acomodações</h1>
          <p className="text-muted-foreground">Gerencie os quartos do lodge</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={16} /> Nova Acomodação
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{editId ? "Editar Acomodação" : "Nova Acomodação"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acc-name">Nome do Quarto *</Label>
                <Input id="acc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Quarto Standard" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-capacity">Capacidade *</Label>
                <Input id="acc-capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Ex: 2 pessoas" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acc-price">Informação de Preço (opcional)</Label>
              <Input id="acc-price" value={form.price_info ?? ""} onChange={(e) => setForm({ ...form, price_info: e.target.value })} placeholder="Ex: A partir de R$ 350/noite por pessoa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acc-desc">Descrição *</Label>
              <Textarea id="acc-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva o quarto com detalhes..." required />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Comodidades</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="rounded" />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Fotos</Label>
              <div className="flex flex-wrap gap-3">
                {form.images.map((url) => (
                  <div key={url} className="relative w-24 h-24 rounded overflow-hidden border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/80">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold hover:bg-muted/50 transition-colors">
                  <ImagePlus size={20} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{uploading ? "Enviando..." : "Adicionar"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="acc-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label htmlFor="acc-active">Visível no site</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending || !form.name || !form.capacity || !form.description}>
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Acomodação"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : accommodations.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma acomodação cadastrada ainda. Clique em "Nova Acomodação" para começar.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {accommodations.map((acc) => (
            <Card key={acc.id} className={!acc.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <GripVertical size={16} className="text-muted-foreground shrink-0" />
                {acc.images[0] && (
                  <img src={acc.images[0]} alt={acc.name} className="w-16 h-16 object-cover rounded shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{acc.name}</p>
                    <span className="text-xs bg-sand-light text-forest px-2 py-0.5 rounded-full">{acc.capacity}</span>
                    {!acc.is_active && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Oculto</span>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{acc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" title={acc.is_active ? "Ocultar" : "Mostrar"} onClick={() => toggleActive.mutate({ id: acc.id, is_active: !acc.is_active })}>
                    {acc.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(acc)}>
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir acomodação?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita. A acomodação "{acc.name}" será removida permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(acc.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
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
