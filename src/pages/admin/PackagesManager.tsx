import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

type Package = {
  id: string;
  num: string;
  name: string;
  emoji: string;
  days_text: string;
  nights_text: string;
  price: string;
  installments: string;
  interest: string;
  subtitle: string;
  description: string;
  itinerary: any[];
  highlights: any[];
  is_active: boolean;
  sort_order: number;
};

export default function PackagesManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const [formData, setFormData] = useState<Partial<Package>>({
    num: "", name: "", emoji: "", days_text: "", nights_text: "",
    price: "", installments: "1x", interest: "", subtitle: "", description: "",
    itinerary: [], highlights: [], is_active: true, sort_order: 0
  });

  const { data: packages, isLoading } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("sort_order");
      if (error) throw error;
      return (data || []) as Package[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (pkg: Partial<Package>) => {
      if (pkg.id) {
        const { error } = await supabase.from("packages").update(pkg).eq("id", pkg.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("packages").insert([pkg]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      queryClient.invalidateQueries({ queryKey: ["public-packages"] });
      toast.success("Pacote salvo com sucesso!");
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar pacote: " + err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      queryClient.invalidateQueries({ queryKey: ["public-packages"] });
      toast.success("Pacote excluído!");
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("packages").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      queryClient.invalidateQueries({ queryKey: ["public-packages"] });
    }
  });

  const openNew = () => {
    setEditingPackage(null);
    setFormData({
      num: "", name: "", emoji: "", days_text: "", nights_text: "",
      price: "", installments: "1x", interest: "", subtitle: "", description: "",
      itinerary: [], highlights: [], is_active: true, sort_order: (packages?.length || 0) + 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData(pkg);
    setIsModalOpen(true);
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...(formData.itinerary || []), { day: "Dia X", text: "", icon: "UserCheck" }]
    });
  };

  const removeItineraryDay = (index: number) => {
    const newItin = [...(formData.itinerary || [])];
    newItin.splice(index, 1);
    setFormData({ ...formData, itinerary: newItin });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-forest">Pacotes</h2>
          <p className="text-muted-foreground mt-1">Gerencie os pacotes de ecoturismo do site.</p>
        </div>
        <Button onClick={openNew} className="bg-forest hover:bg-forest-light text-white">
          <Plus className="mr-2 h-4 w-4" /> Novo Pacote
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Num</TableHead>
              <TableHead>Pacote</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-center">Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Carregando...</TableCell></TableRow>
            ) : packages?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center">Nenhum pacote cadastrado.</TableCell></TableRow>
            ) : (
              packages?.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.num}</TableCell>
                  <TableCell className="font-semibold">{pkg.emoji} {pkg.name}</TableCell>
                  <TableCell>{pkg.days_text} / {pkg.nights_text}</TableCell>
                  <TableCell>R$ {pkg.price}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pkg.is_active}
                      onCheckedChange={(v) => toggleActiveMutation.mutate({ id: pkg.id, is_active: v })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(pkg)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (window.confirm("Deseja realmente excluir este pacote?")) {
                        deleteMutation.mutate(pkg.id);
                      }
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Editar Pacote" : "Novo Pacote"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nº (Ex: 01)</label>
                <Input value={formData.num || ""} onChange={e => setFormData({ ...formData, num: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Nome do Pacote</label>
                <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Emoji</label>
                <Input value={formData.emoji || ""} onChange={e => setFormData({ ...formData, emoji: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dias (Ex: 3 dias)</label>
                <Input value={formData.days_text || ""} onChange={e => setFormData({ ...formData, days_text: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Noites (Ex: 2 noites)</label>
                <Input value={formData.nights_text || ""} onChange={e => setFormData({ ...formData, nights_text: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço (Ex: 1.690)</label>
                <Input value={formData.price || ""} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parcelas (Ex: 3x)</label>
                <Input value={formData.installments || ""} onChange={e => setFormData({ ...formData, installments: e.target.value })} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assunto para o WhatsApp (Interest)</label>
              <Input value={formData.interest || ""} onChange={e => setFormData({ ...formData, interest: e.target.value })} placeholder="Ex: Pacote Arara" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtítulo (Opcional)</label>
              <Input value={formData.subtitle || ""} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Completa (Opcional)</label>
              <Textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Roteiro Dia-a-Dia</h3>
                <Button variant="outline" size="sm" onClick={addItineraryDay}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Dia
                </Button>
              </div>

              {formData.itinerary?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum dia cadastrado no roteiro.</p>
              ) : (
                <div className="space-y-3">
                  {formData.itinerary?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded border">
                      <GripVertical className="h-5 w-5 mt-2 text-slate-400 cursor-grab" />
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <div className="col-span-3">
                          <Input 
                            value={item.day} 
                            onChange={(e) => {
                              const newItin = [...formData.itinerary!];
                              newItin[index].day = e.target.value;
                              setFormData({ ...formData, itinerary: newItin });
                            }} 
                            placeholder="Dia 01"
                          />
                        </div>
                        <div className="col-span-6">
                          <Input 
                            value={item.text} 
                            onChange={(e) => {
                              const newItin = [...formData.itinerary!];
                              newItin[index].text = e.target.value;
                              setFormData({ ...formData, itinerary: newItin });
                            }} 
                            placeholder="Recepção do turista..."
                          />
                        </div>
                        <div className="col-span-3">
                          <Input 
                            value={item.icon} 
                            onChange={(e) => {
                              const newItin = [...formData.itinerary!];
                              newItin[index].icon = e.target.value;
                              setFormData({ ...formData, itinerary: newItin });
                            }} 
                            placeholder="Ex: UserCheck"
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItineraryDay(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Para o nome do ícone, use nomes válidos da biblioteca Lucide (Ex: Footprints, Sunrise, TreePine, Moon).
                  </p>
                </div>
              )}
            </div>

            <Button 
              className="mt-4 bg-forest hover:bg-forest-light text-white w-full" 
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar Pacote"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
