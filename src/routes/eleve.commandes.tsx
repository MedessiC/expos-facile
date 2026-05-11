import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  FileText,
  Award,
  BarChart3,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/eleve/commandes")({
  component: () => <AppLayout requireRole="eleve"><CommandesPage /></AppLayout>
});

function CommandesPage() {
  const { user } = useAuth();

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

  const commandesLivrees = commandes.filter(c => c.statut === "livre");
  const autresCommandes = commandes.filter(c => c.statut !== "livre");

  const handleDownload = (commandeId: string, fileName: string) => {
    // Simulation du téléchargement - à remplacer par la vraie logique
    console.log(`Téléchargement de la commande ${commandeId}: ${fileName}`);
    // Ici vous pouvez implémenter la logique de téléchargement réel
  };

  return (
    <>
      <div className="space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Mes commandes</h1>
        <p className="text-muted-foreground text-sm">
          {commandes.length} commande{commandes.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <FileText size={16} className="text-blue-600" />
            Total
          </div>
          <p className="text-2xl font-bold">{commandes.length}</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            Livrées
          </div>
          <p className="text-2xl font-bold text-green-600">{commandesLivrees.length}</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Clock size={16} className="text-yellow-600" />
            En cours
          </div>
          <p className="text-2xl font-bold text-yellow-600">{autresCommandes.length}</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CreditCard size={16} className="text-purple-600" />
            Total dépensé
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {commandes.reduce((sum, c) => sum + (c.prix_total || 0), 0).toLocaleString()} F
          </p>
        </div>
      </div>

      {/* Commandes livrées */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-green-600" />
          <h2 className="text-xl font-semibold">Commandes livrées ({commandesLivrees.length})</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : commandesLivrees.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-muted p-8 text-center bg-gradient-to-br from-muted/20 to-muted/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucune commande livrée</h3>
            <p className="text-muted-foreground mb-4">
              Vos commandes apparaîtront ici une fois qu'elles seront terminées.
            </p>
            <Link to="/eleve/nouvelle-commande">
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
                Commander maintenant
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {commandesLivrees.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border bg-card p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={24} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate mb-1">{c.sujet}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Award size={14} />
                              {c.matiere}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 size={14} />
                              {c.niveau}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText size={14} />
                              {c.pages} pages
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {format(new Date(c.created_at), "d MMM yyyy", { locale: fr })}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge statut={c.statut as CommandeStatut} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 font-medium text-green-600">
                            <CheckCircle2 size={16} />
                            Livrée le {format(new Date(c.updated_at || c.created_at), "d MMM yyyy", { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <CreditCard size={16} />
                            {c.prix_total.toLocaleString()} F
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/eleve/commande/${c.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye size={16} className="mr-2" />
                              Détails
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleDownload(c.id, `${c.sujet}.pdf`)}
                          >
                            <Download size={16} className="mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Autres commandes */}
      {autresCommandes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-yellow-600" />
            <h2 className="text-xl font-semibold">Commandes en cours ({autresCommandes.length})</h2>
          </div>

          <div className="space-y-3">
            {autresCommandes.map((c) => (
              <Link
                key={c.id}
                to={`/eleve/commande/${c.id}`}
                className="block rounded-xl border bg-card p-4 hover:shadow-md hover:border-midnight transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-yellow-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{c.sujet}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Award size={12} />
                          {c.matiere}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 size={12} />
                          {c.niveau}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(c.created_at), "d MMM", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <StatusBadge statut={c.statut as CommandeStatut} />
                    <p className="text-xs font-medium">{c.prix_total.toLocaleString()} F</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}