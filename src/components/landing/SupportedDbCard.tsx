import { Database } from "lucide-react";
import { type CSSProperties } from "react";
import { useInView } from "@/hooks/use-in-view";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IOS = "cubic-bezier(0.32, 0.72, 0, 1)";

type Props = {
  name: string;
  note: string;
  index: number;
};

/**
 * SupportedDbCard — staggered scroll-in entry + subtle icon bounce on hover.
 * Transform/opacity only for GPU-friendly motion.
 */
export function SupportedDbCard({ name, note, index }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const enterDelay = index * 80;

  const cardStyle: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : "translate3d(0,14px,0)",
    transition: `opacity 440ms ${EASE_OUT} ${enterDelay}ms, transform 500ms ${EASE_OUT} ${enterDelay}ms, background-color 200ms ${EASE_OUT}`,
    willChange: "transform, opacity",
  };

  return (
    <div
      ref={ref}
      className="p-4 bg-background hover:bg-card/40 group"
      style={cardStyle}
    >
      <div className="flex items-center gap-2">
        <Database
          className="h-3.5 w-3.5 text-success transition-transform group-hover:-translate-y-0.5 group-hover:scale-110"
          style={{ transition: `transform 280ms ${EASE_IOS}` }}
        />
        <span className="text-[13px] font-medium text-foreground">{name}</span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
    </div>
  );
}
