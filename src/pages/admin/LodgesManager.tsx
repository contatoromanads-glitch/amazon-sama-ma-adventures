import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, X, BedDouble, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

type Lodge = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  hero_image: string | null;
  images: string[] | null;
  amenities: string[] | null;
  is_active: boolean | null;
  sort_order: number | null;
};

const ALL_AMENITIES = [
  "Wi-Fi Starlink", "Restaurante Incluso", "Deck sobre o Rio", "Ar-Condicionado",
  "Água Quente", "Gerador 24h", "Passeio de Barco", "Guia Especializado",
  "Pesca Esportiva", "Ecoturismo", "Transfer incluso", "Frigobar",
];

const EMPTY = {
  name: "", slug: "", description: "", location: "",
  hero_image: "", images: [] as string[], amenities: [] as string[], is_active: true, sort_order: 0,
};

/** Gera slug a partir do nome: "2ª Pousada Flutuante" → "2a-pousada-flutuante" */
function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function LodgesManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: lodges = [], isLoading } = useQuery<Lodge[]>({
    queryKey: ["lodges-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lodges" as any).select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Lodge[];
    },
  });

  const { data: roomCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ["lodges-room-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accommodations" as any)
        .select("lodge_id")
        .not("lodge_id", "is", null);
      if (error) return {};
      const counts: Record<string, number> = {};
      (data as { lodge_id: string }[]).forEach(({ lodge_id }) => {
        counts[lodge_id] = (counts[lodge_id] ?? 0) + 1;
      });
      return counts;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        images: form.images,
        amenities: form.amenities,
        updated_at: new Date().toISOString(),
      };
      if (editId) {
        const { error } = await supabase.from("lodges" as any).update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lodges" as any).insert({ ...payload, sort_order: lodges.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lodges-admin"] });
      toast({ title: editId ? "Pousada atualizada!" : "Pousada criada!" });
      closeForm();
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lodges" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lodges-admin"] });
      toast({ title: "Pousada excluída." });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("lodges" as any).update({ is_active, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lodges-admin"] }),
  });

  const openEdit = (lodge: Lodge) => {
    setForm({
      name: lodge.name, slug: lodge.slug,
      description: lodge.description ?? "", location: lodge.location ?? "",
      hero_image: lodge.hero_image ?? "", images: lodge.images ?? [],
      amenities: lodge.amenities ?? [], is_active: lodge.is_active ?? true,
      sort_order: lodge.sort_order ?? 0,
    });
    setEditId(lodge.id);
    setShowForm(true);
  };

  const closeForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const uploadImage = async (file: File, isHero = false) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `lodges/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
    if (isHero) {
      setForm((f) => ({ ...f, hero_image: publicUrl }));
    } else {
      setForm((f) => ({ ...f, images: [...f.images, publicUrl] }));
    }
    setUploading(false);
  };

  const removeImage = (url: string) => setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  const toggleAmenity = (a: string) =>
    setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Pousadas</h1>
          <p className="text-muted-foreground">Cadastre e gerencie as pousadas do grupo</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={16} /> Nova Pousada
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{editId ? "Editar Pousada" : "Nova Pousada"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lodge-name">Nome da Pousada *</Label>
                <Input
                  id="lodge-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })}
                  placeholder="Ex: Amazon Samaúma Lodge"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lodge-slug">
                  Slug (URL) *
                  <span className="text-xs text-muted-foreground ml-2">gerado automaticamente</span>
                </Label>
                <Input
                  id="lodge-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="Ex: amazon-samauma-lodge"
                />
                <p className="text-xs text-muted-foreground">URL: /acomodacoes/{form.slug || "..."}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lodge-location">Localização</Label>
              <Input
                id="lodge-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Paraná do Mamori, Careiro Castanho – AM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lodge-desc">Descrição *</Label>
              <Textarea
                id="lodge-desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva a pousada com detalhes que irão aparecer no site..."
              />
            </div>

            {/* Foto de capa */}
            <div className="space-y-2">
              <Label>Foto de Capa (Hero)</Label>
              {form.hero_image ? (
                <div className="relative w-full h-40 rounded overflow-hidden border">
                  <img src={form.hero_image} alt="Hero" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setForm((f) => ({ ...f, hero_image: "" }))}
                    className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-32 border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold hover:bg-muted/50 transition-colors">
                  <ImagePlus size={24} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Enviando..." : "Clique para adicionar foto de capa"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], true)} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Galeria */}
            <div className="space-y-2">
              <Label>Galeria de Fotos</Label>
              <div className="flex flex-wrap gap-3">
                {form.images.map((url) => (
                  <div key={url} className="relative w-24 h-24 rounded overflow-hidden border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/80"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold hover:bg-muted/50 transition-colors">
                  <ImagePlus size={20} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{uploading ? "..." : "Adicionar"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Comodidades */}
            <div className="space-y-2">
              <Label>Comodidades da Pousada</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="rounded" />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="lodge-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label htmlFor="lodge-active">Visível no site</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => save.mutate()}
                disabled={save.isPending || !form.name || !form.slug}
              >
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Pousada"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : lodges.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma pousada cadastrada ainda. Clique em "Nova Pousada" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {lodges.map((lodge) => (
            <Card key={lodge.id} className={!lodge.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                {lodge.hero_image ? (
                  <img src={lodge.hero_image} alt={lodge.name} className="w-20 h-16 object-cover rounded shrink-0" />
                ) : (
                  <div className="w-20 h-16 bg-muted rounded shrink-0 flex items-center justify-center">
                    <BedDouble size={20} className="text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{lodge.name}</p>
                    {!lodge.is_active && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Oculta</span>
                    )}
                    <span className="text-xs bg-sand-light text-forest px-2 py-0.5 rounded-full">
                      {roomCounts[lodge.id] ?? 0} quarto{(roomCounts[lodge.id] ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {lodge.location && (
                    <p className="text-xs text-muted-foreground">{lodge.location}</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">{lodge.description}</p>
                  <p className="text-xs text-gold mt-0.5">/acomodacoes/{lodge.slug}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Link para gerenciar quartos desta pousada */}
                  <Button variant="outline" size="sm" asChild className="gap-1 text-xs hidden sm:flex">
                    <Link to={`/admin/acomodacoes?lodge=${lodge.id}`}>
                      <BedDouble size={14} /> Quartos <ArrowRight size={12} />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" title={lodge.is_active ? "Ocultar" : "Mostrar"} onClick={() => toggleActive.mutate({ id: lodge.id, is_active: !lodge.is_active })}>
                    {lodge.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(lodge)}>
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
                        <AlertDialogTitle>Excluir pousada?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A pousada "{lodge.name}" será removida. Os quartos vinculados a ela não serão excluídos, mas perderão o vínculo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(lodge.id)} className="bg-destructive hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
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
