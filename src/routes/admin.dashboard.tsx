import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ClipboardList, ShieldCheck, Wallet, Star, Users } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => <AppLayout requireRole="admin"><Dash /></AppLayout>,
});

function Dash() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = startOfDay(new Date()).toISOString();
      const [{ count: jourCount }, { count: validCount }, { data: paiements }, { data: notations }, { count: redCount }, { data: cmdRecent }] = await Promise.all([
        supabase.from("commandes").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("commandes").select("id", { count: "exact", head: true }).eq("statut", "en_validation"),
        supabase.from("paiements_redacteurs").select("montant").eq("statut", "en_attente"),
        supabase.from("notations").select("note_globale"),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "redacteur"),
        supabase.from("commandes").select("created_at").gte("created_at", subDays(new Date(), 7).toISOString()),
      ]);
      const aDecaisser = (paiements ?? []).reduce((a, p) => a + p.montant, 0);
      const moy = notations?.length ? (notations.reduce((a, n) => a + n.note_globale, 0) / notations.length).toFixed(1) : "—";
      const byDay: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "dd/MM");
        byDay[d] = 0;
      }
      (cmdRecent ?? []).forEach((c) => {
        const d = format(new Date(c.created_at), "dd/MM");
        if (d in byDay) byDay[d]++;
      });
      return {
        jour: jourCount ?? 0, valid: validCount ?? 0, decaisser: aDecaisser,
        note: moy, redacteurs: redCount ?? 0,
        chart: Object.entries(byDay).map(([day, n]) => ({ day, n })),
      };
    },
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Tableau de bord MIDEESSI</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={ClipboardList} label="Aujourd'hui" value={stats?.jour ?? "—"} />
        <Stat icon={ShieldCheck} label="À valider" value={stats?.valid ?? "—"} />
        <Stat icon={Wallet} label="À décaisser" value={`${(stats?.decaisser ?? 0).toLocaleString()} F`} />
        <Stat icon={Star} label="Note moyenne" value={stats?.note ?? "—"} />
        <Stat icon={Users} label="Rédacteurs" value={stats?.redacteurs ?? "—"} />
      </div>
      <div className="rounded-2xl bg-card border p-5">
        <h2 className="font-semibold mb-3">Commandes des 7 derniers jours</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats?.chart ?? []}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="n" fill="oklch(0.84 0.16 85)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-xl bg-card border p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon size={14} /> {label}</div>
      <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
