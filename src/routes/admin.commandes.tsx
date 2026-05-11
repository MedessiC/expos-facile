import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { CommandeStatut } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/admin/commandes")({
  component: () => <AppLayout requireRole="admin"><Liste /></AppLayout>,
});

const STATUTS: CommandeStatut[] = ["en_attente", "en_cours", "en_validation", "livre", "refuse", "annule"];

function Liste() {
  const qc = useQueryClient();
  const [filtre, setFiltre] = useState<string>("all");
  const [q, setQ] = useState("");

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-commandes", filtre],
    queryFn: async () => {
      let query = supabase.from("commandes").select("*, profiles!commandes_eleve_id_fkey(prenom, nom)").order("created_at", { ascending: false });
      if (filtre !== "all") query = query.eq("statut", filtre as any);
      const { data } = await query;
      return data ?? [];
    },
  });

  const filtered = rows.filter((r) => !q || r.sujet.toLowerCase().includes(q.toLowerCase()) || r.matiere.toLowerCase().includes(q.toLowerCase()));

  const updateStatut = async (id: string, statut: CommandeStatut) => {
    const { error } = await supabase.from("commandes").update({ statut }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Statut mis à jour"); qc.invalidateQueries({ queryKey: ["admin-commandes"] }); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Toutes les commandes</h1>
      <div className="flex gap-2">
        <Input placeholder="Recherche…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={filtre} onValueChange={setFiltre}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {filtered.map((c: any) => (
          <div key={c.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <p className="font-medium truncate">{c.sujet}</p>
                <p className="text-xs text-muted-foreground">
                  {c.profiles?.prenom} {c.profiles?.nom} · {c.matiere} · {c.niveau} · {format(new Date(c.created_at), "d MMM", { locale: fr })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge statut={c.statut as CommandeStatut} />
                <Select value={c.statut} onValueChange={(v) => updateStatut(c.id, v as CommandeStatut)}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
