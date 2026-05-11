import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/validation")({
  component: () => <AppLayout requireRole="admin"><Valid /></AppLayout>,
});

function Valid() {
  const qc = useQueryClient();
  const [retours, setRetours] = useState<Record<string, string>>({});

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-validation"],
    queryFn: async () => {
      const { data } = await supabase.from("commandes").select("*, profiles!commandes_eleve_id_fkey(prenom, nom), notations(*)").eq("statut", "en_validation").order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const dl = async (path: string) => {
    const { data } = await supabase.storage.from("livrables").createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const valider = async (id: string) => {
    const { error } = await supabase.from("commandes").update({ statut: "livre" }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Livraison validée"); qc.invalidateQueries({ queryKey: ["admin-validation"] }); }
  };

  const refuser = async (id: string) => {
    const msg = retours[id]?.trim();
    if (!msg) { toast.error("Ajoutez un message de retour"); return; }
    const { error } = await supabase.from("commandes").update({ statut: "en_cours", message_retour: msg }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Refusé, retour envoyé"); qc.invalidateQueries({ queryKey: ["admin-validation"] }); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Validation des livrables</h1>
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Aucun livrable en attente.</p>}
      {rows.map((c: any) => (
        <div key={c.id} className="rounded-xl border bg-card p-5 space-y-3">
          <div>
            <p className="font-semibold">{c.sujet}</p>
            <p className="text-xs text-muted-foreground">{c.matiere} · {c.profiles?.prenom} {c.profiles?.nom}</p>
          </div>
          {c.plan && (
            <details className="text-sm">
              <summary className="cursor-pointer text-midnight">Instructions élève</summary>
              <p className="bg-secondary p-2 mt-1 rounded whitespace-pre-wrap">{c.plan}</p>
            </details>
          )}
          {c.fichier_livrable_url && (
            <Button variant="outline" onClick={() => dl(c.fichier_livrable_url)}>
              <Download size={16} /> Télécharger livrable
            </Button>
          )}
          <Textarea rows={2} placeholder="Message de retour si refus…" value={retours[c.id] ?? ""} onChange={(e) => setRetours((s) => ({ ...s, [c.id]: e.target.value }))} />
          <div className="flex gap-2">
            <Button className="flex-1 bg-success text-success-foreground" onClick={() => valider(c.id)}>
              <CheckCircle2 size={16} /> Valider
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => refuser(c.id)}>
              <XCircle size={16} /> Refuser
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
