import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({ value, onChange, size = 20, readOnly, className }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const Comp = readOnly ? "span" : "button";
        return (
          <Comp
            key={n}
            type={readOnly ? undefined : "button"}
            onClick={readOnly ? undefined : () => onChange?.(n)}
            className={cn(
              "transition-transform",
              !readOnly && "hover:scale-110 cursor-pointer",
            )}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={cn(
                filled ? "fill-gold text-gold" : "fill-transparent text-muted-foreground/40",
              )}
            />
          </Comp>
        );
      })}
    </div>
  );
}
