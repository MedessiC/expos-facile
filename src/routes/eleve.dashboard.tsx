import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  FilePlus2,
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  CreditCard,
  BookOpen,
  Users,
  Award,
  Calendar,
  BarChart3,
  HelpCircle,
  Bell,
  Download,
  Eye,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/eleve/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord - ExposéTché | Espace élève" },
      { name: "description", content: "Accédez à votre espace élève sur ExposéTché. Consultez vos commandes et créez-en de nouvelles." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "canonical", href: "https://exposetche.com/eleve/dashboard" },
    ],
  }),
  component: () => <AppLayout requireRole="eleve"><Dashboard /></AppLayout>
});

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
      {/* En-tête amélioré */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
              <Users size={20} className="text-gold" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Bonjour {profile?.prenom} 👋</h1>
              <p className="text-muted-foreground text-sm">Bienvenue sur votre espace élève</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {format(new Date(), "HH:mm")}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/eleve/nouvelle-commande">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
              <FilePlus2 size={16} className="mr-2" />
              Nouvelle commande
            </Button>
          </Link>
          <Link to="/eleve/commandes">
            <Button variant="outline">
              <Inbox size={16} className="mr-2" />
              Mes commandes
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero de bienvenue */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-midnight via-midnight/95 to-midnight/80 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Bienvenue sur votre espace élève</h2>
            <p className="text-sm sm:text-base text-white/80 mb-4">
              Retrouvez vos commandes, suivez votre progression et accédez à l'accueil public d'ExposéTché en un clic.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/eleve/nouvelle-commande">
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
                  <FilePlus2 size={16} className="mr-2" />
                  Commander maintenant
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">Avantage</p>
              <h3 className="text-lg font-semibold">Rédacteurs sélectionnés</h3>
              <p className="text-sm text-white/70 mt-2">Vos exposés sont confiés à des rédacteurs spécialisés par matière.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">Service</p>
              <h3 className="text-lg font-semibold">Suivi en temps réel</h3>
              <p className="text-sm text-white/70 mt-2">Suivez l'avancement de chaque commande directement depuis votre tableau de bord.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Inbox} label="Total commandes" value={total} color="blue" />
        <Stat icon={Clock} label="En cours" value={enCours} color="yellow" />
        <Stat icon={CheckCircle2} label="Livrés" value={livres} color="green" />
      </div>

      {/* Section commandes améliorée */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-midnight" />
            <h2 className="font-semibold">Mes commandes récentes</h2>
          </div>
          <Link to="/eleve/commandes" className="text-sm text-gold hover:underline flex items-center gap-1">
            Voir tout <TrendingUp size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-muted-foreground/20 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : commandes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-muted p-8 text-center bg-gradient-to-br from-muted/20 to-muted/5">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FilePlus2 size={32} className="text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucune commande pour le moment</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Commencez votre première commande et laissez nos rédacteurs experts s'occuper de votre exposé.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/eleve/nouvelle-commande">
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
                  <Zap size={16} className="mr-2" />
                  Passer ma première commande
                </Button>
              </Link>
              <Button variant="outline">
                <HelpCircle size={16} className="mr-2" />
                Comment ça marche ?
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {commandes.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/eleve/commande/$id"
                params={{ id: c.id }}
                className="block rounded-xl border bg-card p-4 hover:border-midnight hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-midnight/10 to-gold/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen size={20} className="text-midnight" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate group-hover:text-gold transition-colors">{c.sujet}</p>
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
                          <FilePlus2 size={12} />
                          {c.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(c.created_at), "d MMM", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <StatusBadge statut={c.statut as CommandeStatut} />
                    <div className="flex items-center gap-1 text-sm font-medium text-gold">
                      <CreditCard size={14} />
                      {c.prix_total.toLocaleString()} F
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye size={14} />
                      </Button>
                      {c.statut === 'livre' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Section d'aide rapide */}
      {commandes.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-midnight/5 to-gold/5 border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-midnight" />
              <span className="text-sm font-medium">Besoin d'aide ?</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <HelpCircle size={14} className="mr-1" />
                FAQ
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare size={14} className="mr-1" />
                Support
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color = "mid" }: { icon: any; label: string; value: number | string; color?: string }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    gold: "bg-gold/10 border-gold/30 text-gold",
    mid: "bg-midnight/5 border-midnight/20 text-midnight"
  };

  const iconColors = {
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
    gold: "text-gold",
    mid: "text-midnight"
  };

  return (
    <div className={`rounded-xl border p-3 md:p-4 ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-200 hover:shadow-md hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon size={16} className={iconColors[color as keyof typeof iconColors]} />
          <span>{label}</span>
        </div>
        <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
      </div>
      <p className="text-2xl md:text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
