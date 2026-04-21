import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const BOOT_LINES = [
  { t: "$ ", c: "dora --connect postgres://prod", color: "cyan" },
  { t: "[ok] ", c: "tcp handshake · 18ms", color: "green" },
  { t: "[ok] ", c: "ssl handshake · 22ms", color: "green" },
  { t: "[ok] ", c: "auth scram-sha-256", color: "green" },
  { t: "[~] ", c: "introspecting schema…", color: "amber" },
  { t: "[ok] ", c: "42 tables · 318 cols · 14 indexes", color: "green" },
  { t: "[~] ", c: "subscribing to LISTEN/NOTIFY", color: "amber" },
  { t: "[ok] ", c: "ready · 187ms", color: "magenta" },
];

const COLORS: Record<string, string> = {
  cyan: "hsl(var(--neon-cyan))",
  green: "hsl(var(--success))",
  amber: "hsl(var(--neon-amber))",
  magenta: "hsl(var(--neon-magenta))",
};

/**
 * TerminalHero — cinematic boot sequence panel.
 * Lines reveal sequentially with a typewriter feel; final cursor blinks.
 */
export function TerminalHero() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setShown(0);
    setTyped("");
    setDone(false);

    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return;
        const line = BOOT_LINES[i].c;
        // typewriter
        for (let j = 1; j <= line.length; j++) {
          if (cancelled) return;
          setTyped(line.slice(0, j));
          await wait(i === 0 ? 28 : 14);
        }
        if (cancelled) return;
        setShown((s) => s + 1);
        setTyped("");
        await wait(i === 0 ? 320 : 180);
      }
      if (!cancelled) setDone(true);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative border border-border bg-card/70 backdrop-blur-md"
      style={{
        boxShadow:
          "0 0 0 1px hsl(var(--neon-cyan) / 0.15), 0 0 60px hsl(var(--neon-cyan) / 0.12), 0 0 120px hsl(var(--neon-magenta) / 0.06)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0) scale(1)" : "translate3d(0,18px,0) scale(0.97)",
        transition: `opacity 700ms ${EASE_OUT}, transform 800ms ${EASE_OUT}`,
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 h-9 border-b border-border bg-background/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(var(--destructive) / 0.7)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(var(--neon-amber) / 0.7)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(var(--success) / 0.7)" }} />
        </div>
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          dora · /tmp/session
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "hsl(var(--neon-cyan))" }}
          />
          <span style={{ color: "hsl(var(--neon-cyan))" }}>online</span>
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 font-mono text-[12px] leading-[1.7] min-h-[260px]">
        {BOOT_LINES.slice(0, shown).map((l, i) => (
          <div key={i} className="text-foreground/85">
            <span style={{ color: COLORS[l.color] }}>{l.t}</span>
            {l.c}
          </div>
        ))}
        {shown < BOOT_LINES.length && (
          <div className="text-foreground/85">
            <span style={{ color: COLORS[BOOT_LINES[shown].color] }}>{BOOT_LINES[shown].t}</span>
            {typed}
            <span
              className="inline-block w-[7px] h-[1.05em] align-[-2px] ml-0.5"
              style={{
                background: "hsl(var(--neon-cyan))",
                animation: "terminalCursor 800ms steps(2) infinite",
              }}
            />
          </div>
        )}
        {done && (
          <div className="mt-2 text-foreground/85">
            <span style={{ color: COLORS.cyan }}>$ </span>
            <span
              className="inline-block w-[7px] h-[1.05em] align-[-2px] ml-0.5"
              style={{
                background: "hsl(var(--neon-cyan))",
                animation: "terminalCursor 800ms steps(2) infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Faint scanlines layer over terminal only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 2px,
            hsl(var(--neon-cyan) / 0.08) 2px,
            hsl(var(--neon-cyan) / 0.08) 3px
          )`,
        }}
      />
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
