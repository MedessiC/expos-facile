import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Upload } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/redacteur/mission/$id")({
  component: () => <AppLayout requireRole="redacteur"><Detail /></AppLayout>,
});

function Detail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: c } = useQuery({
    queryKey: ["mission", id],
    queryFn: async () => (await supabase.from("commandes").select("*").eq("id", id).maybeSingle()).data,
  });

  if (!c) return <p className="text-muted-foreground">Chargement…</p>;

  const submit = async () => {
    if (!file || !user) return;
    setBusy(true);
    const path = `${user.id}/${id}-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("livrables").upload(path, file);
    if (upErr) { setBusy(false); toast.error(upErr.message); return; }
    const { error } = await supabase.from("commandes").update({
      fichier_livrable_url: path, statut: "en_validation",
    }).eq("id", id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Livrable soumis pour validation !");
      qc.invalidateQueries({ queryKey: ["mission", id] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/redacteur/missions" className="text-sm text-muted-foreground inline-flex items-center"><ChevronLeft size={16} /> Retour</Link>

      <div className="rounded-2xl bg-card border p-5 shadow-elegant/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{c.sujet}</h1>
            <p className="text-sm text-muted-foreground">{c.matiere} · {c.niveau} · {c.pages} pages</p>
          </div>
          <StatusBadge statut={c.statut as CommandeStatut} />
        </div>
        <p className="text-sm mt-3">Échéance : <strong>{format(new Date(c.date_limite), "d MMM yyyy", { locale: fr })}</strong></p>
        <p className="text-sm">Rémunération : <strong className="text-gold-foreground">{Math.round(c.prix_total * 0.6).toLocaleString()} F</strong></p>
        {c.plan && (
          <div className="mt-3 rounded-lg bg-secondary p-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Instructions de l'élève</p>
            <p className="whitespace-pre-wrap">{c.plan}</p>
          </div>
        )}
        {c.message_retour && (
          <div className="mt-3 rounded-lg bg-warning/15 border border-warning/30 p-3 text-sm">
            <p className="text-xs font-medium mb-1">Retour de l'équipe MIDEESSI</p>
            <p>{c.message_retour}</p>
          </div>
        )}
      </div>

      {(c.statut === "en_cours" || c.statut === "refuse") && (
        <div className="rounded-2xl bg-card border p-5 space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Upload size={16} /> Soumettre le livrable</h2>
          <Input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold" onClick={submit} disabled={!file || busy}>
            {busy ? "Envoi…" : "Soumettre pour validation"}
          </Button>
        </div>
      )}
    </div>
  );
}
