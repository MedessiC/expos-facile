import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { FilePlus2, Inbox, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/eleve/dashboard")({ component: () => <AppLayout requireRole="eleve"><Dashboard /></AppLayout> });

function Dashboard() {
  const { user, profile } = useAuth();
  const { data: commandes = [], isLoading } = useQuery({
    queryKey: ["eleve-commandes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commandes")
        .select("*")
        .eq("eleve_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const total = commandes.length;
  const enCours = commandes.filter((c) => ["en_attente", "en_cours", "en_validation"].includes(c.statut)).length;
  const livres = commandes.filter((c) => c.statut === "livre").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Bonjour {profile?.prenom} 👋</h1>
          <p className="text-muted-foreground text-sm">Voici un aperçu de vos exposés.</p>
        </div>
        <Link to="/eleve/nouvelle-commande">
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
            <FilePlus2 size={16} /> Commander
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Inbox} label="Total" value={total} />
        <Stat icon={Clock} label="En cours" value={enCours} />
        <Stat icon={CheckCircle2} label="Livrés" value={livres} />
      </div>

      <div>
        <h2 className="font-semibold mb-3">Mes commandes</h2>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : commandes.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-muted-foreground">Aucune commande pour le moment.</p>
            <Link to="/eleve/nouvelle-commande">
              <Button className="mt-4 bg-midnight text-midnight-foreground">Passer ma première commande</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {commandes.map((c) => (
              <Link
                key={c.id}
                to="/eleve/commande/$id"
                params={{ id: c.id }}
                className="block rounded-xl border bg-card p-4 hover:border-midnight transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.sujet}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.matiere} · {c.niveau} · {c.pages} pages · {format(new Date(c.created_at), "d MMM", { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge statut={c.statut as CommandeStatut} />
                    <p className="text-xs mt-1 font-medium">{c.prix_total.toLocaleString()} F</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card border p-3 md:p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon size={14} /> {label}
      </div>
      <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
