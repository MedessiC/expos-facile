import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-gold text-midnight shadow-gold">
        <GraduationCap size={18} strokeWidth={2.5} />
      </span>
      {!mark && (
        <span className="font-semibold tracking-tight text-lg">
          Exposé<span className="text-gold-shimmer">Tché</span>
        </span>
      )}
    </div>
  );
}
