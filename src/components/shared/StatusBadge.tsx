import { cn } from "@/lib/utils";
import { STATUT_LABEL, STATUT_VARIANT, type CommandeStatut } from "@/lib/constants";

export function StatusBadge({ statut, className }: { statut: CommandeStatut; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUT_VARIANT[statut],
        className,
      )}
    >
      {STATUT_LABEL[statut]}
    </span>
  );
}
