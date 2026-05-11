import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";

export const Route = createFileRoute("/redacteur/missions")({
  component: () => <AppLayout requireRole="redacteur"><Missions /></AppLayout>,
});

function Missions() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();

  const { data: dispo = [] } = useQuery({
    queryKey: ["missions-dispo", profile?.matieres],
    enabled: !!profile,
    queryFn: async () => {
      const { data } = await supabase.from("commandes").select("*")
        .eq("statut", "en_attente").is("redacteur_id", null)
        .in("matiere", profile?.matieres ?? [])
        .order("date_limite");
      return data ?? [];
    },
  });

  const { data: enCoursCount = 0 } = useQuery({
    queryKey: ["mes-en-cours", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase.from("commandes").select("id", { count: "exact", head: true })
        .eq("redacteur_id", user!.id).eq("statut", "en_cours");
      return count ?? 0;
    },
  });

  const accept = async (id: string) => {
    if (enCoursCount >= 3) {
      toast.error("Maximum 3 missions en cours simultanément");
      return;
    }
    const { error } = await supabase.from("commandes").update({ redacteur_id: user!.id, statut: "en_cours" }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Mission acceptée !");
      qc.invalidateQueries({ queryKey: ["missions-dispo"] });
      qc.invalidateQueries({ queryKey: ["mes-en-cours"] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Missions disponibles</h1>
          <p className="text-sm text-muted-foreground">{enCoursCount}/3 missions en cours</p>
        </div>
      </div>
      {dispo.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          Aucune mission disponible dans vos matières pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {dispo.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{m.sujet}</p>
                    <p className="text-xs text-muted-foreground">{m.matiere} · {m.niveau} · {m.pages} pages</p>
                  </div>
                  <span className="text-sm font-bold text-gold-foreground bg-gold/20 rounded-full px-2 py-0.5">
                    {Math.round(m.prix_total * 0.6).toLocaleString()} F
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Échéance : {format(new Date(m.date_limite), "d MMM yyyy", { locale: fr })}
                </p>
                {m.plan && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-midnight">Voir le plan / instructions</summary>
                    <p className="mt-1 text-sm bg-secondary p-2 rounded whitespace-pre-wrap">{m.plan}</p>
                  </details>
                )}
              </div>
              <Button className="w-full bg-midnight text-midnight-foreground" onClick={() => accept(m.id)} disabled={enCoursCount >= 3}>
                Accepter la mission
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
