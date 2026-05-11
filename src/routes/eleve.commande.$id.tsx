import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Download, Send, Star } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { CommandeStatut } from "@/lib/constants";

export const Route = createFileRoute("/eleve/commande/$id")({
  component: () => <AppLayout requireRole="eleve"><OrderDetail /></AppLayout>,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: commande } = useQuery({
    queryKey: ["commande", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("commandes").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: notation } = useQuery({
    queryKey: ["notation", id],
    queryFn: async () => {
      const { data } = await supabase.from("notations").select("*").eq("commande_id", id).maybeSingle();
      return data;
    },
  });

  const { data: livrableUrl } = useQuery({
    queryKey: ["livrable-url", commande?.fichier_livrable_url],
    enabled: !!commande?.fichier_livrable_url,
    queryFn: async () => {
      const { data } = await supabase.storage.from("livrables").createSignedUrl(commande!.fichier_livrable_url!, 3600);
      return data?.signedUrl;
    },
  });

  if (!commande) return <p className="text-muted-foreground">Chargement…</p>;

  const progress: Record<CommandeStatut, number> = {
    en_attente: 20, en_cours: 50, en_validation: 75, livre: 100, annule: 0, refuse: 50,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/eleve/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft size={16} /> Retour
      </Link>

      <div className="rounded-2xl bg-card border p-5 shadow-elegant/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{commande.sujet}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {commande.matiere} · {commande.niveau} · {commande.pages} pages
            </p>
          </div>
          <StatusBadge statut={commande.statut as CommandeStatut} />
        </div>
        <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress[commande.statut as CommandeStatut]}%` }} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Item k="Date limite" v={format(new Date(commande.date_limite), "d MMM yyyy", { locale: fr })} />
          <Item k="Prix" v={`${commande.prix_total.toLocaleString()} F`} />
          <Item k="Format" v={commande.format_physique} />
          <Item k="Images" v={commande.format_images ? "Oui" : "Non"} />
        </dl>
        {commande.plan && (
          <div className="mt-3 rounded-lg bg-secondary p-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Vos instructions</p>
            <p className="whitespace-pre-wrap">{commande.plan}</p>
          </div>
        )}
        {commande.message_retour && commande.statut === "en_cours" && (
          <div className="mt-3 rounded-lg bg-warning/15 border border-warning/30 p-3 text-sm">
            <p className="text-xs font-medium mb-1">Message de l'équipe au rédacteur</p>
            <p>{commande.message_retour}</p>
          </div>
        )}
      </div>

      {commande.statut === "livre" && livrableUrl && (
        <a href={livrableUrl} target="_blank" rel="noreferrer">
          <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
            <Download size={16} /> Télécharger l'exposé
          </Button>
        </a>
      )}

      {commande.statut === "livre" && !notation && commande.redacteur_id && (
        <RatingForm commandeId={commande.id} eleveId={user!.id} redacteurId={commande.redacteur_id} onDone={() => {
          qc.invalidateQueries({ queryKey: ["notation", id] });
          toast.success("Merci pour votre avis !");
        }} />
      )}

      {notation && (
        <div className="rounded-2xl bg-card border p-5">
          <h2 className="font-semibold flex items-center gap-2"><Star size={16} className="text-gold" /> Votre avis</h2>
          <StarRating value={notation.note_globale} readOnly className="mt-2" />
          {notation.commentaire && <p className="text-sm mt-2 text-muted-foreground">{notation.commentaire}</p>}
        </div>
      )}

      <Messagerie commandeId={commande.id} />
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function RatingForm({ commandeId, eleveId, redacteurId, onDone }: { commandeId: string; eleveId: string; redacteurId: string; onDone: () => void }) {
  const [globale, setGlobale] = useState(0);
  const [contenu, setContenu] = useState(0);
  const [structure, setStructure] = useState(0);
  const [images, setImages] = useState(0);
  const [delai, setDelai] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!globale) { toast.error("Note globale requise"); return; }
    setBusy(true);
    const { error } = await supabase.from("notations").insert({
      commande_id: commandeId,
      eleve_id: eleveId,
      redacteur_id: redacteurId,
      note_globale: globale,
      note_contenu: contenu || null,
      note_structure: structure || null,
      note_images: images || null,
      note_delai: delai || null,
      commentaire: commentaire || null,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else onDone();
  };

  return (
    <div className="rounded-2xl bg-card border p-5 space-y-3">
      <h2 className="font-semibold">Notez cet exposé</h2>
      <div>
        <p className="text-sm font-medium mb-1">Note globale *</p>
        <StarRating value={globale} onChange={setGlobale} size={28} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Crit label="Contenu" value={contenu} onChange={setContenu} />
        <Crit label="Structure" value={structure} onChange={setStructure} />
        <Crit label="Images" value={images} onChange={setImages} />
        <Crit label="Délai" value={delai} onChange={setDelai} />
      </div>
      <Textarea rows={3} placeholder="Commentaire (optionnel)" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
      <Button className="w-full bg-midnight text-midnight-foreground" disabled={busy} onClick={submit}>
        {busy ? "Envoi…" : "Envoyer mon avis"}
      </Button>
    </div>
  );
}

function Crit({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <StarRating value={value} onChange={onChange} size={18} />
    </div>
  );
}

function Messagerie({ commandeId }: { commandeId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("messages").select("*").eq("commande_id", commandeId).order("created_at").then(({ data }) => {
      setMessages(data ?? []);
    });
    const ch = supabase
      .channel(`msg-${commandeId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `commande_id=eq.${commandeId}` }, (p) => {
        setMessages((m) => [...m, p.new]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [commandeId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !user) return;
    const t = text;
    setText("");
    const { error } = await supabase.from("messages").insert({ commande_id: commandeId, auteur_id: user.id, contenu: t });
    if (error) toast.error(error.message);
  };

  return (
    <div className="rounded-2xl bg-card border p-5">
      <h2 className="font-semibold mb-3">Messagerie</h2>
      <div className="max-h-72 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">Aucun message. Posez vos questions à l'équipe.</p>}
        {messages.map((m) => {
          const mine = m.auteur_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-midnight text-midnight-foreground" : "bg-secondary"}`}>
                {m.contenu}
                <div className="text-[10px] opacity-60 mt-0.5">{format(new Date(m.created_at), "HH:mm")}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <Textarea rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre message…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <Button onClick={send} className="bg-midnight text-midnight-foreground"><Send size={16} /></Button>
      </div>
    </div>
  );
}
