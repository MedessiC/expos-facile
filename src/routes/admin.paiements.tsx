import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/admin/paiements")({
  component: () => <AppLayout requireRole="admin"><Paie /></AppLayout>,
});

function Paie() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-paiements"],
    queryFn: async () => {
      const { data } = await supabase.from("paiements_redacteurs").select("*, profiles!paiements_redacteurs_redacteur_id_fkey(prenom, nom), commandes(sujet)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const marquerPaye = async (id: string) => {
    const { error } = await supabase.from("paiements_redacteurs").update({ statut: "paye", date_paiement: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Marqué comme payé"); qc.invalidateQueries({ queryKey: ["admin-paiements"] }); }
  };

  const enAttente = rows.filter((p: any) => p.statut === "en_attente");
  const payes = rows.filter((p: any) => p.statut === "paye");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Paiements rédacteurs</h1>
      <section>
        <h2 className="font-semibold mb-2">À décaisser ({enAttente.length})</h2>
        <div className="space-y-2">
          {enAttente.map((p: any) => (
            <div key={p.id} className="rounded-xl border bg-card p-4 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="font-medium">{p.profiles?.prenom} {p.profiles?.nom}</p>
                <p className="text-xs text-muted-foreground">{p.commandes?.sujet}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold">{p.montant.toLocaleString()} F</p>
                <Button size="sm" className="bg-midnight text-midnight-foreground" onClick={() => marquerPaye(p.id)}>Marquer payé</Button>
              </div>
            </div>
          ))}
          {enAttente.length === 0 && <p className="text-sm text-muted-foreground">Aucun paiement en attente.</p>}
        </div>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Historique ({payes.length})</h2>
        <div className="space-y-2">
          {payes.map((p: any) => (
            <div key={p.id} className="rounded-xl border bg-card p-3 flex items-center justify-between text-sm">
              <span>{p.profiles?.prenom} {p.profiles?.nom} — {p.commandes?.sujet}</span>
              <span className="text-muted-foreground">{p.montant.toLocaleString()} F · {format(new Date(p.date_paiement), "d MMM", { locale: fr })}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
