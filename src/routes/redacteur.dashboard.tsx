import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Briefcase, CheckCircle2, Star, Wallet } from "lucide-react";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/redacteur/dashboard")({
  component: () => <AppLayout requireRole="redacteur"><Dash /></AppLayout>,
});

function Dash() {
  const { user, profile } = useAuth();

  const { data: missions = [] } = useQuery({
    queryKey: ["red-missions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("commandes").select("*").eq("redacteur_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: notations = [] } = useQuery({
    queryKey: ["red-notations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("notations").select("note_globale").eq("redacteur_id", user!.id);
      return data ?? [];
    },
  });

  const { data: paiements = [] } = useQuery({
    queryKey: ["red-paiements", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("paiements_redacteurs").select("*").eq("redacteur_id", user!.id);
      return data ?? [];
    },
  });

  const { data: dispoCount = 0 } = useQuery({
    queryKey: ["red-dispo-count", profile?.matieres],
    enabled: !!profile,
    queryFn: async () => {
      const { count } = await supabase.from("commandes").select("id", { count: "exact", head: true })
        .eq("statut", "en_attente").is("redacteur_id", null)
        .in("matiere", profile?.matieres ?? []);
      return count ?? 0;
    },
  });

  const enCours = missions.filter((m) => ["en_cours", "en_validation"].includes(m.statut)).length;
  const livrees = missions.filter((m) => m.statut === "livre").length;
  const note = notations.length ? (notations.reduce((a, n: any) => a + n.note_globale, 0) / notations.length).toFixed(1) : "—";
  const solde = paiements.filter((p) => p.statut === "en_attente").reduce((a, p) => a + p.montant, 0);

  if (profile?.statut === "pending") {
    return (
      <div className="max-w-md mx-auto rounded-2xl bg-card border p-6 text-center">
        <h2 className="font-bold text-lg">Compte en attente d'approbation</h2>
        <p className="text-sm text-muted-foreground mt-2">L'équipe MIDEESSI valide votre profil. Vous recevrez une notification.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Bonjour {profile?.prenom}</h1>
        <p className="text-muted-foreground text-sm">Votre espace rédacteur</p>
      </div>

      {dispoCount > 0 && (
        <Link to="/redacteur/missions" className="block rounded-xl bg-gold text-gold-foreground p-4 shadow-gold">
          <p className="font-semibold">🎯 {dispoCount} nouvelle{dispoCount > 1 ? "s" : ""} mission{dispoCount > 1 ? "s" : ""} disponible{dispoCount > 1 ? "s" : ""}</p>
          <p className="text-xs opacity-80 mt-1">Voir les missions correspondant à vos matières</p>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Stat icon={CheckCircle2} label="Livrées" value={livrees} />
        <Stat icon={Briefcase} label="En cours" value={enCours} />
        <Stat icon={Star} label="Note moyenne" value={note} />
        <Stat icon={Wallet} label="Solde" value={`${solde.toLocaleString()} F`} />
      </div>

      <div>
        <h2 className="font-semibold mb-3">Missions actives</h2>
        {missions.filter((m) => ["en_cours", "en_validation"].includes(m.statut)).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune mission active.</p>
        ) : (
          <div className="space-y-2">
            {missions.filter((m) => ["en_cours", "en_validation"].includes(m.statut)).map((m) => (
              <Link key={m.id} to="/redacteur/mission/$id" params={{ id: m.id }} className="block rounded-xl border bg-card p-4 hover:border-midnight">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{m.sujet}</p>
                    <p className="text-xs text-muted-foreground">{m.matiere} · {m.niveau} · {m.pages} pages</p>
                  </div>
                  <StatusBadge statut={m.statut as CommandeStatut} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-xl bg-card border p-3 md:p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon size={14} /> {label}</div>
      <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
