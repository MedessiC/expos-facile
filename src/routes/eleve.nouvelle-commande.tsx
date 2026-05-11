import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  MATIERES, NIVEAUX, PAGES_OPTIONS, FORMAT_PHYSIQUE, calculerPrix, FRAIS_LIVRAISON, REDUCTION_SANS_IMAGES,
} from "@/lib/constants";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/eleve/nouvelle-commande")({
  component: () => <AppLayout requireRole="eleve"><NewOrder /></AppLayout>,
});

interface FormState {
  matiere: string;
  sujet: string;
  niveau: string;
  pages: string;
  plan: string;
  date_limite: string;
  reference?: File | null;
  format_images: boolean;
  format_physique: string;
  livraison: boolean;
  adresse: string;
}

const initial: FormState = {
  matiere: "",
  sujet: "",
  niveau: "",
  pages: "6-8",
  plan: "",
  date_limite: "",
  reference: null,
  format_images: true,
  format_physique: "numerique",
  livraison: false,
  adresse: "",
};

function NewOrder() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setData((d) => ({ ...d, [k]: v }));

  const prix = calculerPrix({
    pages: data.pages,
    avecImages: data.format_images,
    formatPhysique: data.format_physique,
    livraison: data.livraison,
  });

  const canNext = () => {
    if (step === 1) return !!data.matiere && !!data.sujet && !!data.niveau && !!data.pages && !!data.date_limite;
    if (step === 3 && data.format_physique !== "numerique" && data.livraison) return data.adresse.length > 4;
    return true;
  };

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    let referenceUrl: string | null = null;
    if (data.reference) {
      const path = `${user.id}/${Date.now()}-${data.reference.name}`;
      const { error } = await supabase.storage.from("references-eleves").upload(path, data.reference);
      if (!error) referenceUrl = path;
    }
    const { data: row, error } = await supabase.from("commandes").insert({
      eleve_id: user.id,
      matiere: data.matiere,
      sujet: data.sujet,
      niveau: data.niveau,
      pages: data.pages,
      plan: data.plan || null,
      date_limite: data.date_limite,
      format_images: data.format_images,
      format_physique: data.format_physique,
      adresse_livraison: data.livraison ? data.adresse : null,
      fichier_reference_url: referenceUrl,
      prix_total: prix,
      statut: "en_attente",
    }).select().single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Commande créée !");
    nav({ to: "/eleve/commande/$id", params: { id: row.id } });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nouvelle commande</h1>
        <p className="text-sm text-muted-foreground">Étape {step} sur 4</p>
        <div className="flex gap-1.5 mt-3">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-gold" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-elegant/30 space-y-4">
        {step === 1 && (
          <>
            <h2 className="font-semibold">Détails de l'exposé</h2>
            <div>
              <Label>Matière</Label>
              <Select value={data.matiere} onValueChange={(v) => set("matiere", v)}>
                <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                <SelectContent>
                  {MATIERES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sujet / titre</Label>
              <Input value={data.sujet} onChange={(e) => set("sujet", e.target.value)} placeholder="Ex: La photosynthèse" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Niveau scolaire</Label>
                <Select value={data.niveau} onValueChange={(v) => set("niveau", v)}>
                  <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                  <SelectContent>{NIVEAUX.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nombre de pages</Label>
                <Select value={data.pages} onValueChange={(v) => set("pages", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAGES_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Plan ou instructions (optionnel)</Label>
              <Textarea rows={3} value={data.plan} onChange={(e) => set("plan", e.target.value)} placeholder="Précisions, plan souhaité, sources à utiliser…" />
            </div>
            <div>
              <Label>Date limite</Label>
              <Input type="date" value={data.date_limite} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("date_limite", e.target.value)} />
            </div>
            <div>
              <Label>Documents de référence (optionnel)</Label>
              <Input type="file" onChange={(e) => set("reference", e.target.files?.[0] ?? null)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold">Format numérique</h2>
            <p className="text-sm text-muted-foreground">Choisissez si vous souhaitez des images dans votre exposé.</p>
            <div className="grid gap-2">
              <Choice
                active={data.format_images}
                onClick={() => set("format_images", true)}
                title="Avec images"
                desc="Illustrations pertinentes incluses"
                priceTag="Inclus"
              />
              <Choice
                active={!data.format_images}
                onClick={() => set("format_images", false)}
                title="Sans images"
                desc="Texte uniquement"
                priceTag={`-${REDUCTION_SANS_IMAGES} F`}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold">Version physique (optionnel)</h2>
            <div className="grid gap-2">
              {FORMAT_PHYSIQUE.map((f) => (
                <Choice
                  key={f.value}
                  active={data.format_physique === f.value}
                  onClick={() => set("format_physique", f.value)}
                  title={f.label}
                  desc={f.value === "numerique" ? "PDF uniquement" : f.value === "impression" ? "A4 imprimé" : "Couverture cartonnée + reliure"}
                  priceTag={f.prix === 0 ? "Inclus" : `+${f.prix} F`}
                />
              ))}
            </div>
            {data.format_physique !== "numerique" && (
              <div className="space-y-3 pt-2 border-t">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={data.livraison} onChange={(e) => set("livraison", e.target.checked)} />
                  Livraison à domicile (+{FRAIS_LIVRAISON} F)
                </label>
                {data.livraison && (
                  <div>
                    <Label>Adresse de livraison</Label>
                    <Textarea rows={2} value={data.adresse} onChange={(e) => set("adresse", e.target.value)} placeholder="Quartier, ville, repère…" />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-gold" /> Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <Row k="Matière" v={data.matiere} />
              <Row k="Sujet" v={data.sujet} />
              <Row k="Niveau" v={data.niveau} />
              <Row k="Pages" v={data.pages} />
              <Row k="Date limite" v={data.date_limite} />
              <Row k="Images" v={data.format_images ? "Oui" : "Non"} />
              <Row k="Format" v={FORMAT_PHYSIQUE.find((f) => f.value === data.format_physique)?.label ?? ""} />
              {data.livraison && <Row k="Livraison" v={data.adresse} />}
            </div>
            <div className="rounded-xl bg-midnight text-midnight-foreground p-4 mt-2">
              <p className="text-xs opacity-80">Total à payer</p>
              <p className="text-3xl font-bold text-gold">{prix.toLocaleString()} F</p>
            </div>
            <div className="rounded-xl border border-dashed p-4 text-sm">
              <p className="font-medium">Paiement Mobile Money (FedaPay)</p>
              <p className="text-muted-foreground text-xs mt-1">
                Mode démo — la commande est créée immédiatement. L'intégration FedaPay sera branchée prochainement.
              </p>
            </div>
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold" disabled={busy} onClick={submit}>
              <CheckCircle2 size={16} /> {busy ? "Validation…" : `Confirmer & payer ${prix.toLocaleString()} F`}
            </Button>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft size={16} /> Précédent
        </Button>
        {step < 4 && (
          <Button className="bg-midnight text-midnight-foreground" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            Suivant <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

function Choice({ active, onClick, title, desc, priceTag }: { active: boolean; onClick: () => void; title: string; desc: string; priceTag: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-3 transition-colors ${active ? "border-midnight bg-secondary" : "hover:border-midnight/40"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <span className="text-xs font-semibold rounded-full bg-gold/20 text-gold-foreground px-2 py-0.5">{priceTag}</span>
      </div>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b last:border-b-0 py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v || "—"}</span>
    </div>
  );
}
