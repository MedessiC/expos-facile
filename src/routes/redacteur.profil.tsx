import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/shared/StarRating";
import { Award, Trophy, Clock, BookCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/redacteur/profil")({
  component: () => <AppLayout requireRole="redacteur"><Profil /></AppLayout>,
});

function Profil() {
  const { user, profile } = useAuth();

  const { data: notations = [] } = useQuery({
    queryKey: ["red-profil-notations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("notations").select("*, profiles!notations_eleve_id_fkey(prenom, nom)").eq("redacteur_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: missions = [] } = useQuery({
    queryKey: ["red-profil-missions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("commandes").select("matiere, statut, date_limite, updated_at").eq("redacteur_id", user!.id).eq("statut", "livre");
      return data ?? [];
    },
  });

  const moy = notations.length ? notations.reduce((a, n: any) => a + n.note_globale, 0) / notations.length : 0;
  const repartition = [1, 2, 3, 4, 5].map((n) => notations.filter((x: any) => x.note_globale === n).length);
  const moyCrit = (k: string) => {
    const arr = notations.filter((n: any) => n[k]).map((n: any) => n[k]);
    return arr.length ? (arr.reduce((a: number, b: number) => a + b, 0) / arr.length).toFixed(1) : "—";
  };

  const matiereCounts: Record<string, number> = {};
  missions.forEach((m) => { matiereCounts[m.matiere] = (matiereCounts[m.matiere] ?? 0) + 1; });
  const onTime = missions.length ? missions.every((m) => new Date(m.updated_at) <= new Date(m.date_limite)) : false;

  const badges: { icon: any; label: string; got: boolean }[] = [
    { icon: Trophy, label: "Top rédacteur", got: notations.length >= 5 && moy >= 4.5 },
    { icon: Clock, label: "Toujours à l'heure", got: missions.length >= 3 && onTime },
    { icon: BookCheck, label: "20 missions", got: missions.length >= 20 },
    { icon: Sparkles, label: "Note parfaite", got: notations.length >= 3 && moy >= 5 },
    ...Object.entries(matiereCounts).filter(([_, n]) => n >= 5).map(([m]) => ({ icon: Award, label: `Expert ${m}`, got: true })),
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-brand text-midnight-foreground p-6">
        <h1 className="text-2xl font-bold">{profile?.prenom} {profile?.nom}</h1>
        <p className="text-sm opacity-80 mt-1">{profile?.matieres?.join(" · ")}</p>
        <div className="mt-3 flex items-center gap-2">
          <StarRating value={Math.round(moy)} readOnly size={20} />
          <span className="text-gold font-bold text-lg">{moy ? moy.toFixed(1) : "—"}</span>
          <span className="text-xs opacity-70">({notations.length} avis)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.filter((b) => b.got).length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2">Aucun badge obtenu pour le moment. Continuez à livrer du bon travail !</p>
        )}
        {badges.filter((b) => b.got).map((b) => (
          <div key={b.label} className="rounded-xl border bg-card p-3 flex items-center gap-2">
            <b.icon size={18} className="text-gold" />
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold mb-3">Répartition des notes</h2>
        {[5, 4, 3, 2, 1].map((n) => (
          <div key={n} className="flex items-center gap-2 text-sm mb-1">
            <span className="w-4">{n}★</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gold" style={{ width: `${notations.length ? (repartition[n - 1] / notations.length) * 100 : 0}%` }} />
            </div>
            <span className="w-8 text-right text-muted-foreground">{repartition[n - 1]}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold mb-3">Notes par critère</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Contenu", "note_contenu"],
            ["Structure", "note_structure"],
            ["Images", "note_images"],
            ["Délai", "note_delai"],
          ].map(([l, k]) => (
            <div key={k} className="flex items-center justify-between"><span>{l}</span><strong>{moyCrit(k)}</strong></div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold mb-3">Derniers avis</h2>
        {notations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p>
        ) : notations.slice(0, 5).map((n: any) => (
          <div key={n.id} className="border-b last:border-b-0 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{n.profiles?.prenom} {n.profiles?.nom?.[0]}.</p>
              <StarRating value={n.note_globale} readOnly size={14} />
            </div>
            {n.commentaire && <p className="text-xs text-muted-foreground mt-1">{n.commentaire}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
