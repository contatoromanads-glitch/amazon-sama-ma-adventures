import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, X, Building2 } from "lucide-react";
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Accommodation = {
  id: string; lodge_id: string | null; name: string; description: string;
  capacity: string; price_info: string | null; amenities: string[] | null;
  images: string[] | null; is_active: boolean | null; sort_order: number | null;
};

type Lodge = { id: string; name: string; slug: string };

const ALL_AMENITIES = [
  "Ar-Condicionado", "Wi-Fi Starlink", "Água Quente", "Cama de Casal",
  "Cama de Solteiro", "Banheiro Privativo", "Vista para o Rio",
  "Limpeza Diária", "Restaurante Incluso", "Frigobar",
];

const EMPTY = {
  lodge_id: "" as string | null,
  name: "", description: "", capacity: "", price_info: "",
  amenities: [] as string[], images: [] as string[], is_active: true, sort_order: 0,
};

export default function AccommodationsManager() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedLodge = searchParams.get("lodge");

  const [form, setForm] = useState({ ...EMPTY, lodge_id: preselectedLodge ?? null });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterLodge, setFilterLodge] = useState<string>(preselectedLodge ?? "all");

  useEffect(() => {
    if (preselectedLodge) {
      setFilterLodge(preselectedLodge);
      setForm((f) => ({ ...f, lodge_id: preselectedLodge }));
    }
  }, [preselectedLodge]);

  // Busca todas as pousadas para o seletor
  const { data: lodges = [] } = useQuery<Lodge[]>({
    queryKey: ["lodges-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lodges" as any).select("id, name, slug").order("sort_order");
      if (error) return [];
      return (data ?? []) as unknown as Lodge[];
    },
  });

  const { data: accommodations = [], isLoading } = useQuery<Accommodation[]>({
    queryKey: ["accommodations-admin", filterLodge],
    queryFn: async () => {
      let query = supabase.from("accommodations" as any).select("*").order("sort_order");
      if (filterLodge !== "all") {
        query = filterLodge === "none"
          ? query.is("lodge_id", null)
          : query.eq("lodge_id", filterLodge);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as Accommodation[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        lodge_id: form.lodge_id || null,
        updated_at: new Date().toISOString(),
      };
      if (editId) {
        const { error } = await supabase.from("accommodations" as any).update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("accommodations" as any).insert({ ...payload, sort_order: accommodations.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accommodations-admin"] });
      qc.invalidateQueries({ queryKey: ["accommodations-public"] });
      qc.invalidateQueries({ queryKey: ["lodges-room-counts"] });
      toast({ title: editId ? "Quarto atualizado!" : "Quarto criado!" });
      closeForm();
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("accommodations" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accommodations-admin"] });
      qc.invalidateQueries({ queryKey: ["lodges-room-counts"] });
      toast({ title: "Quarto excluído." });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("accommodations" as any).update({ is_active, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accommodations-admin"] });
      qc.invalidateQueries({ queryKey: ["accommodations-public"] });
    },
  });

  const openEdit = (acc: Accommodation) => {
    setForm({
      lodge_id: acc.lodge_id,
      name: acc.name, description: acc.description,
      capacity: acc.capacity, price_info: acc.price_info ?? "",
      amenities: acc.amenities ?? [], images: acc.images ?? [],
      is_active: acc.is_active ?? true, sort_order: acc.sort_order ?? 0,
    });
    setEditId(acc.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setForm({ ...EMPTY, lodge_id: filterLodge !== "all" && filterLodge !== "none" ? filterLodge : null });
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

  const lodgeName = (id: string | null) => lodges.find((l) => l.id === id)?.name ?? "Sem pousada";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Quartos</h1>
          <p className="text-muted-foreground">Gerencie os quartos de cada pousada</p>
        </div>
        <div className="flex gap-2">
          {lodges.length === 0 && (
            <Button variant="outline" asChild>
              <Link to="/admin/pousadas">
                <Building2 size={16} className="mr-2" /> Criar Pousada Primeiro
              </Link>
            </Button>
          )}
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={16} /> Novo Quarto
          </Button>
        </div>
      </div>

      {/* Filtro por pousada */}
      <div className="flex items-center gap-3">
        <Label className="shrink-0">Filtrar por pousada:</Label>
        <Select value={filterLodge} onValueChange={setFilterLodge}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Todas as pousadas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as pousadas</SelectItem>
            <SelectItem value="none">Sem pousada vinculada</SelectItem>
            {lodges.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{editId ? "Editar Quarto" : "Novo Quarto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Vincular à pousada */}
            <div className="space-y-2">
              <Label>Pousada *</Label>
              <Select
                value={form.lodge_id ?? "none"}
                onValueChange={(v) => setForm({ ...form, lodge_id: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a pousada..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Sem pousada (avulso) —</SelectItem>
                  {lodges.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lodges.length === 0 && (
                <p className="text-xs text-amber-600">
                  Você ainda não tem pousadas. <Link to="/admin/pousadas" className="underline">Criar uma pousada →</Link>
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acc-name">Nome do Quarto *</Label>
                <Input id="acc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Quarto Standard" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-capacity">Capacidade *</Label>
                <Input id="acc-capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Ex: 2 pessoas" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acc-price">Informação de Preço (opcional)</Label>
              <Input id="acc-price" value={form.price_info ?? ""} onChange={(e) => setForm({ ...form, price_info: e.target.value })} placeholder="Ex: A partir de R$ 350/noite por pessoa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acc-desc">Descrição *</Label>
              <Textarea id="acc-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva o quarto com detalhes..." />
            </div>

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
                {save.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Quarto"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : accommodations.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum quarto encontrado. Clique em "Novo Quarto" para começar.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {accommodations.map((acc) => (
            <Card key={acc.id} className={!acc.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                {(acc.images ?? [])[0] && (
                  <img src={(acc.images ?? [])[0]} alt={acc.name} className="w-16 h-16 object-cover rounded shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{acc.name}</p>
                    <span className="text-xs bg-sand-light text-forest px-2 py-0.5 rounded-full">{acc.capacity}</span>
                    {acc.lodge_id && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{lodgeName(acc.lodge_id)}</span>
                    )}
                    {!acc.lodge_id && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Sem pousada</span>
                    )}
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
                        <AlertDialogTitle>Excluir quarto?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita. O quarto "{acc.name}" será removido permanentemente.</AlertDialogDescription>
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
