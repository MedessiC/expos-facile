export const MATIERES = [
  "SVT",
  "Histoire-Géo",
  "Physique-Chimie",
  "Français",
  "Mathématiques",
  "Anglais",
  "Philosophie",
  "Économie",
  "Autre",
] as const;

export const NIVEAUX = [
  "CM1/CM2",
  "6e/5e",
  "4e/3e",
  "2nde",
  "1ère",
  "Terminale",
] as const;

export const PAGES_OPTIONS = [
  { value: "4-5", label: "4-5 pages", prix: 2000 },
  { value: "6-8", label: "6-8 pages", prix: 3000 },
  { value: "8-10+", label: "8-10+ pages", prix: 4500 },
] as const;

export const FORMAT_PHYSIQUE = [
  { value: "numerique", label: "Numérique uniquement", prix: 0 },
  { value: "impression", label: "Impression sans reliure", prix: 1000 },
  { value: "reliure", label: "Impression avec reliure", prix: 2500 },
] as const;

export const FRAIS_LIVRAISON = 500;
export const REDUCTION_SANS_IMAGES = 500;

export type CommandeStatut =
  | "en_attente"
  | "en_cours"
  | "en_validation"
  | "livre"
  | "annule"
  | "refuse";

export const STATUT_LABEL: Record<CommandeStatut, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  en_validation: "En validation",
  livre: "Livré",
  annule: "Annulé",
  refuse: "Refusé",
};

export const STATUT_VARIANT: Record<CommandeStatut, string> = {
  en_attente: "bg-warning/15 text-warning border-warning/30",
  en_cours: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  en_validation: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  livre: "bg-success/15 text-success border-success/30",
  annule: "bg-muted text-muted-foreground border-border",
  refuse: "bg-destructive/15 text-destructive border-destructive/30",
};

export type Role = "eleve" | "redacteur" | "admin";

export function calculerPrix(opts: {
  pages: string;
  avecImages: boolean;
  formatPhysique: string;
  livraison?: boolean;
}) {
  const base = PAGES_OPTIONS.find((p) => p.value === opts.pages)?.prix ?? 0;
  const fp = FORMAT_PHYSIQUE.find((f) => f.value === opts.formatPhysique)?.prix ?? 0;
  const images = opts.avecImages ? 0 : -REDUCTION_SANS_IMAGES;
  const liv = opts.livraison && opts.formatPhysique !== "numerique" ? FRAIS_LIVRAISON : 0;
  return base + fp + images + liv;
}
