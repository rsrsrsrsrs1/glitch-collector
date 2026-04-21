/**
 * MetricsTicker — infinite marquee of mainframe-style telemetry.
 * Pure CSS transform animation, GPU-friendly.
 */
const ITEMS = [
  { k: "throughput",   v: "12.4k req/s" },
  { k: "p50 latency",  v: "1.8ms" },
  { k: "p99 latency",  v: "9.2ms" },
  { k: "active conns", v: "847" },
  { k: "rows scanned", v: "8.1B" },
  { k: "cache hit",    v: "97.3%" },
  { k: "uptime",       v: "99.998%" },
  { k: "schema lock",  v: "0ms" },
];

export function MetricsTicker() {
  const row = (
    <div className="flex shrink-0 items-center gap-10 px-5 font-mono text-[11px]">
      {ITEMS.map((it) => (
        <span key={it.k} className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="h-1 w-1 rounded-full" style={{ background: "hsl(var(--neon-cyan))" }} />
          <span className="uppercase tracking-[0.16em] text-muted-foreground">{it.k}</span>
          <span className="text-foreground">{it.v}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden border-y border-border bg-background/40"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex h-9 items-center"
        style={{
          width: "max-content",
          animation: "marquee 38s linear infinite",
          willChange: "transform",
        }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
