import { Database, Filter, Code2, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

/* ──────────────────────────────────────────────────────────────────────────
   Animation tokens (Emil Kowalski best practices)
   - ease-out default, <300ms for UI
   - transform/opacity only (GPU-accelerated)
   - respect prefers-reduced-motion via globals in index.css
   ────────────────────────────────────────────────────────────────────────── */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"; // smooth ease-out
const EASE_IOS = "cubic-bezier(0.32, 0.72, 0, 1)"; // iOS-style for scale/spring feel

type FeatureGraphic = "rows" | "filter" | "code";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  graphic: FeatureGraphic;
};

const FEATURES: Feature[] = [
  {
    icon: Database,
    title: "Fast table browsing",
    desc: "Stream millions of rows without the spinner. Virtualized tables, instant pagination, zero lag — even on cold connections.",
    graphic: "rows",
  },
  {
    icon: Filter,
    title: "Smart filtering",
    desc: "Click any cell to filter by it. Compose complex WHERE clauses through the UI, or drop into raw SQL whenever you want.",
    graphic: "filter",
  },
  {
    icon: Code2,
    title: "Developer friendly",
    desc: "Keyboard-first navigation. Connection strings, not config wizards. Works with Postgres, MySQL, SQLite, and your local socket.",
    graphic: "code",
  },
];

export function FeatureCards() {
  return (
    <div className="mt-16 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  // Staggered enter: 0, 90ms, 180ms
  const enterDelay = index * 90;

  const borderClasses = `${index < 2 ? "md:border-r border-border" : ""} ${
    index > 0 ? "border-t md:border-t-0 border-border" : ""
  }`;

  return (
    <div
      ref={ref}
      className={`group relative p-8 transition-colors hover:bg-card/40 ${borderClasses}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
        transition: `opacity 480ms ${EASE_OUT} ${enterDelay}ms, transform 520ms ${EASE_OUT} ${enterDelay}ms`,
        willChange: "transform, opacity",
      }}
    >
      <div className="mb-6 h-32 rounded-lg border border-border bg-card/30 flex items-center justify-center overflow-hidden transition-colors group-hover:border-foreground/20">
        <div className="w-full px-6">
          {feature.graphic === "rows" && <RowsGraphic active={inView} startDelay={enterDelay + 200} />}
          {feature.graphic === "filter" && <FilterGraphic active={inView} startDelay={enterDelay + 200} />}
          {feature.graphic === "code" && <CodeGraphic active={inView} startDelay={enterDelay + 200} />}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Icon
          className="h-4 w-4 text-foreground/70 transition-colors duration-200 group-hover:text-foreground"
          style={{ transition: `color 200ms ${EASE_OUT}` }}
        />
        <h3 className="text-[15px] font-medium text-foreground">{feature.title}</h3>
      </div>
      <p className="text-[13px] leading-[1.6] text-muted-foreground">{feature.desc}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ROWS — bars draw in, then a soft scan shimmer loops
   ────────────────────────────────────────────────────────────────────────── */
function RowsGraphic({ active, startDelay }: { active: boolean; startDelay: number }) {
  const rows = [
    { id: "01", w: "60%" },
    { id: "02", w: "78%" },
    { id: "03", w: "48%" },
    { id: "04", w: "70%" },
  ];
  return (
    <div className="space-y-1.5 font-mono relative">
      {rows.map((row, j) => {
        const delay = startDelay + j * 70;
        return (
          <div
            key={j}
            className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-0.5"
            style={{ transitionDelay: `${j * 40}ms` }}
          >
            <span
              className="text-[10px] text-muted-foreground"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translate3d(0,0,0)" : "translate3d(-4px,0,0)",
                transition: `opacity 260ms ${EASE_OUT} ${delay}ms, transform 260ms ${EASE_OUT} ${delay}ms`,
              }}
            >
              {row.id}
            </span>
            <div
              className="h-1.5 rounded-full bg-foreground/20 transition-colors group-hover:bg-foreground/40 origin-left"
              style={{
                width: row.w,
                transform: active ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 420ms ${EASE_OUT} ${delay}ms`,
                willChange: "transform",
              }}
            />
            <div
              className="h-1.5 w-12 rounded-full bg-muted-foreground/15 ml-auto"
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 260ms ${EASE_OUT} ${delay + 120}ms`,
              }}
            />
          </div>
        );
      })}
      {/* Looping scan shimmer */}
      {active && (
        <div
          className="pointer-events-none absolute inset-y-0 -inset-x-2 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 bottom-0 w-1/4 bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent"
            style={{
              animation: `featureShimmer 3.4s ${EASE_OUT} ${startDelay + 600}ms infinite`,
              willChange: "transform",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FILTER — chips pop in, then a value cycles every few seconds
   ────────────────────────────────────────────────────────────────────────── */
const COUNTRIES = ["'USA'", "'JPN'", "'BRA'", "'DEU'"];

function FilterGraphic({ active, startDelay }: { active: boolean; startDelay: number }) {
  const [valueIdx, setValueIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => {
      const id = window.setInterval(() => setValueIdx((v) => (v + 1) % COUNTRIES.length), 2200);
      // store cleanup via a ref-like approach
      (FilterGraphic as unknown as { __id?: number }).__id = id as unknown as number;
    }, startDelay + 600);
    return () => {
      window.clearTimeout(t);
      const id = (FilterGraphic as unknown as { __id?: number }).__id;
      if (id) window.clearInterval(id);
    };
  }, [active, startDelay]);

  const chipBase = "flex items-center gap-1.5 px-2 py-1 border border-border w-fit transition-all group-hover:border-foreground/30 group-hover:bg-background/40";

  return (
    <div className="space-y-2">
      <div
        className={chipBase}
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translate3d(0,0,0) scale(1)" : "translate3d(-6px,0,0) scale(0.96)",
          transition: `opacity 260ms ${EASE_OUT} ${startDelay}ms, transform 320ms ${EASE_IOS} ${startDelay}ms`,
        }}
      >
        <span className="text-[10px] font-mono text-muted-foreground">country</span>
        <span className="text-[10px] font-mono text-foreground/60">=</span>
        <span
          key={valueIdx}
          className="text-[10px] font-mono text-success inline-block"
          style={{ animation: `featureChipSwap 280ms ${EASE_OUT}` }}
        >
          {COUNTRIES[valueIdx]}
        </span>
      </div>
      <div
        className={chipBase}
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translate3d(0,0,0) scale(1)" : "translate3d(-6px,0,0) scale(0.96)",
          transition: `opacity 260ms ${EASE_OUT} ${startDelay + 110}ms, transform 320ms ${EASE_IOS} ${startDelay + 110}ms`,
        }}
      >
        <span className="text-[10px] font-mono text-muted-foreground">created_at</span>
        <span className="text-[10px] font-mono text-foreground/60">{">"}</span>
        <span className="text-[10px] font-mono text-warning">'2025-01'</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CODE — lines reveal sequentially, then result row pulses
   ────────────────────────────────────────────────────────────────────────── */
function CodeGraphic({ active, startDelay }: { active: boolean; startDelay: number }) {
  const lines = [
    <>
      <span className="text-primary">SELECT</span> id, email
    </>,
    <>
      <span className="text-primary">FROM</span> customers
    </>,
    <>
      <span className="text-primary">WHERE</span> active = <span className="text-success">true</span>;
    </>,
  ];

  return (
    <div className="font-mono text-[10px] leading-[1.6]">
      {lines.map((line, i) => {
        const delay = startDelay + i * 130;
        return (
          <div
            key={i}
            className="text-muted-foreground"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translate3d(0,0,0)" : "translate3d(0,4px,0)",
              transition: `opacity 240ms ${EASE_OUT} ${delay}ms, transform 240ms ${EASE_OUT} ${delay}ms`,
            }}
          >
            {line}
          </div>
        );
      })}
      <div
        className="mt-1.5 flex items-center gap-1 text-muted-foreground"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translate3d(0,0,0)" : "translate3d(0,4px,0)",
          transition: `opacity 280ms ${EASE_OUT} ${startDelay + 520}ms, transform 280ms ${EASE_OUT} ${startDelay + 520}ms`,
        }}
      >
        <span className="h-1.5 w-1.5 bg-success rounded-full animate-pulse" />
        <span>50 rows · 33ms</span>
      </div>
    </div>
  );
}
