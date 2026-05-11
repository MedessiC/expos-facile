import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/redacteur/paiements")({
  component: () => <AppLayout requireRole="redacteur"><Paiements /></AppLayout>,
});

function Paiements() {
  const { user } = useAuth();
  const { data: paiements = [] } = useQuery({
    queryKey: ["red-paiements-list", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("paiements_redacteurs").select("*, commandes(sujet)").eq("redacteur_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const total = paiements.filter((p) => p.statut === "paye").reduce((a, p) => a + p.montant, 0);
  const solde = paiements.filter((p) => p.statut === "en_attente").reduce((a, p) => a + p.montant, 0);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Mes paiements</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card border p-4">
          <p className="text-xs text-muted-foreground">Total gagné</p>
          <p className="text-2xl font-bold">{total.toLocaleString()} F</p>
        </div>
        <div className="rounded-xl bg-midnight text-midnight-foreground p-4">
          <p className="text-xs opacity-70">Solde disponible</p>
          <p className="text-2xl font-bold text-gold">{solde.toLocaleString()} F</p>
        </div>
      </div>
      <div className="space-y-2">
        {paiements.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun paiement pour le moment.</p>
        ) : paiements.map((p: any) => (
          <div key={p.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{p.commandes?.sujet ?? "Mission"}</p>
              <p className="text-xs text-muted-foreground">
                {p.statut === "paye" ? `Payé le ${format(new Date(p.date_paiement!), "d MMM yyyy", { locale: fr })}` : "En attente de décaissement"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{p.montant.toLocaleString()} F</p>
              <span className={`text-xs ${p.statut === "paye" ? "text-success" : "text-warning"}`}>
                {p.statut === "paye" ? "Payé" : "En attente"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
