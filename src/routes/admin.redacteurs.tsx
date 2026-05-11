import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/redacteurs")({
  component: () => <AppLayout requireRole="admin"><RedList /></AppLayout>,
});

function RedList() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-redacteurs"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "redacteur");
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const { data } = await supabase.from("profiles").select("*").in("id", ids).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatut = async (id: string, statut: string) => {
    const { error } = await supabase.from("profiles").update({ statut: statut as any }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Mis à jour"); qc.invalidateQueries({ queryKey: ["admin-redacteurs"] }); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rédacteurs</h1>
      {rows.map((r: any) => (
        <div key={r.id} className="rounded-xl border bg-card p-4 flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="font-medium">{r.prenom} {r.nom}</p>
            <p className="text-xs text-muted-foreground">{r.email} · {r.matieres?.join(", ")}</p>
            <p className="text-xs mt-1"><span className="rounded-full bg-secondary px-2 py-0.5">{r.statut}</span></p>
          </div>
          <div className="flex gap-2">
            {r.statut !== "actif" && <Button size="sm" className="bg-success text-success-foreground" onClick={() => updateStatut(r.id, "actif")}>Approuver</Button>}
            {r.statut !== "suspendu" && <Button size="sm" variant="outline" onClick={() => updateStatut(r.id, "suspendu")}>Suspendre</Button>}
          </div>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Aucun rédacteur inscrit.</p>}
    </div>
  );
}
