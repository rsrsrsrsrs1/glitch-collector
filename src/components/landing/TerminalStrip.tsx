import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const LINE = "ready · 187ms · 42 tables · 318 cols · 14 indexes";

/**
 * TerminalStrip — compact one-line status detail.
 * Replaces the full TerminalHero panel; reads as a subtle footer-style detail.
 */
export function TerminalStrip() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setTyped("");
    (async () => {
      for (let i = 1; i <= LINE.length; i++) {
        if (cancelled) return;
        setTyped(LINE.slice(0, i));
        await new Promise((r) => setTimeout(r, 14));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 h-9 px-3 border border-border bg-card/40 backdrop-blur-sm font-mono text-[11px] overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
        style={{ background: "hsl(var(--neon-cyan))" }}
      />
      <span className="uppercase tracking-[0.16em] text-muted-foreground shrink-0">
        dora
      </span>
      <span className="text-border shrink-0">/</span>
      <span className="text-foreground/80 truncate">
        <span style={{ color: "hsl(var(--neon-cyan))" }}>$ </span>
        {typed}
        <span
          className="inline-block w-[6px] h-[1em] align-[-2px] ml-0.5"
          style={{
            background: "hsl(var(--neon-cyan))",
            animation: "terminalCursor 800ms steps(2) infinite",
          }}
        />
      </span>
    </div>
  );
}
