import { useInView } from "@/hooks/use-in-view";
import { Database, Key, Hash, Mail, Calendar, DollarSign, type LucideIcon } from "lucide-react";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

type Column = { name: string; type: string; icon?: LucideIcon; pk?: boolean; fk?: boolean };
type Table = {
  id: string;
  name: string;
  /** % position within the SVG viewbox (1000 x 600) */
  x: number;
  y: number;
  columns: Column[];
};

const TABLES: Table[] = [
  {
    id: "users",
    name: "users",
    x: 60,
    y: 80,
    columns: [
      { name: "id",         type: "uuid",        icon: Key, pk: true },
      { name: "email",      type: "text",        icon: Mail },
      { name: "created_at", type: "timestamptz", icon: Calendar },
    ],
  },
  {
    id: "orders",
    name: "orders",
    x: 410,
    y: 60,
    columns: [
      { name: "id",       type: "uuid",   icon: Key, pk: true },
      { name: "user_id",  type: "uuid",   icon: Hash, fk: true },
      { name: "total",    type: "numeric", icon: DollarSign },
      { name: "status",   type: "enum" },
    ],
  },
  {
    id: "order_items",
    name: "order_items",
    x: 760,
    y: 30,
    columns: [
      { name: "id",         type: "uuid",    icon: Key, pk: true },
      { name: "order_id",   type: "uuid",    icon: Hash, fk: true },
      { name: "product_id", type: "uuid",    icon: Hash, fk: true },
      { name: "qty",        type: "int4" },
    ],
  },
  {
    id: "products",
    name: "products",
    x: 410,
    y: 360,
    columns: [
      { name: "id",     type: "uuid",   icon: Key, pk: true },
      { name: "sku",    type: "text" },
      { name: "price",  type: "numeric", icon: DollarSign },
    ],
  },
  {
    id: "sessions",
    name: "sessions",
    x: 60,
    y: 380,
    columns: [
      { name: "id",      type: "uuid", icon: Key, pk: true },
      { name: "user_id", type: "uuid", icon: Hash, fk: true },
      { name: "ip",      type: "inet" },
    ],
  },
];

/** Rough column index → y-offset in px from table top (header=28, row=22) */
const colY = (i: number) => 28 + i * 22 + 11;

/** Connections expressed as fromTable.fromCol → toTable.toCol */
const RELATIONS = [
  { from: "orders.user_id",      to: "users.id" },
  { from: "order_items.order_id", to: "orders.id" },
  { from: "order_items.product_id", to: "products.id" },
  { from: "sessions.user_id",    to: "users.id" },
];

const TABLE_W = 240;
const ROW_H = 22;
const HEADER_H = 28;

function tableHeight(t: Table) {
  return HEADER_H + t.columns.length * ROW_H + 8;
}

function anchorPoint(tableId: string, colName: string, side: "left" | "right") {
  const t = TABLES.find((x) => x.id === tableId)!;
  const idx = t.columns.findIndex((c) => c.name === colName);
  const y = t.y + colY(idx);
  const x = side === "right" ? t.x + TABLE_W : t.x;
  return { x, y };
}

function buildPath(fromId: string, fromCol: string, toId: string, toCol: string) {
  // Pick sides based on relative x
  const tFrom = TABLES.find((x) => x.id === fromId)!;
  const tTo = TABLES.find((x) => x.id === toId)!;
  const fromSide = tFrom.x + TABLE_W / 2 < tTo.x + TABLE_W / 2 ? "right" : "left";
  const toSide = fromSide === "right" ? "left" : "right";
  const a = anchorPoint(fromId, fromCol, fromSide);
  const b = anchorPoint(toId, toCol, toSide);
  const dx = Math.max(40, Math.abs(b.x - a.x) * 0.45);
  const c1x = a.x + (fromSide === "right" ? dx : -dx);
  const c2x = b.x + (toSide === "right" ? dx : -dx);
  return `M ${a.x},${a.y} C ${c1x},${a.y} ${c2x},${b.y} ${b.x},${b.y}`;
}

export function SchemaDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="relative w-full overflow-hidden border border-border bg-background/60">
      {/* Inner grid (mainframe blueprint feel) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--neon-cyan) / 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--neon-cyan) / 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full" style={{ aspectRatio: "1000 / 620" }}>
        <svg
          viewBox="0 0 1000 620"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--neon-cyan))" />
            </marker>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--neon-cyan))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--neon-magenta))" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Connection lines */}
          {RELATIONS.map((r, i) => {
            const [fId, fCol] = r.from.split(".");
            const [tId, tCol] = r.to.split(".");
            const d = buildPath(fId, fCol, tId, tCol);
            return (
              <g key={i}>
                {/* Soft halo */}
                <path
                  d={d}
                  fill="none"
                  stroke="hsl(var(--neon-cyan))"
                  strokeWidth="6"
                  strokeOpacity={inView ? 0.12 : 0}
                  style={{ transition: `stroke-opacity 800ms ${EASE_OUT} ${i * 120}ms` }}
                />
                {/* Main line */}
                <path
                  d={d}
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth="1.4"
                  strokeDasharray="6 6"
                  strokeOpacity={inView ? 1 : 0}
                  markerEnd="url(#arrow-cyan)"
                  style={{
                    animation: inView ? `dashFlow ${4 + i * 0.6}s linear infinite` : undefined,
                    transition: `stroke-opacity 700ms ${EASE_OUT} ${i * 120 + 200}ms`,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Tables — absolutely positioned over the SVG */}
        {TABLES.map((t, i) => (
          <TableNode key={t.id} table={t} delay={i * 90} inView={inView} />
        ))}
      </div>
    </div>
  );
}

function TableNode({ table, delay, inView }: { table: Table; delay: number; inView: boolean }) {
  // Convert SVG coords to % of container (viewBox is 1000 x 620)
  const leftPct = (table.x / 1000) * 100;
  const topPct = (table.y / 620) * 100;
  const widthPct = (TABLE_W / 1000) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${widthPct}%`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0) scale(1)" : "translate3d(0,12px,0) scale(0.96)",
        transition: `opacity 540ms ${EASE_OUT} ${delay}ms, transform 600ms ${EASE_OUT} ${delay}ms`,
      }}
    >
      <div
        className="border border-border bg-card/90 backdrop-blur-sm"
        style={{
          boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.18), 0 0 32px hsl(var(--neon-cyan) / 0.10)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border bg-background/60">
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3" style={{ color: "hsl(var(--neon-cyan))" }} />
            <span className="font-mono text-[11px] text-foreground tracking-wide">{table.name}</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            public
          </span>
        </div>
        {/* Columns */}
        <ul className="text-[10px] font-mono">
          {table.columns.map((c, i) => (
            <li
              key={c.name}
              className="flex items-center justify-between px-2.5 py-1 border-b border-border/40 last:border-b-0 hover:bg-foreground/[0.04] transition-colors"
              style={{ height: ROW_H }}
            >
              <span className="flex items-center gap-1.5 truncate">
                {c.pk ? (
                  <Key className="h-2.5 w-2.5" style={{ color: "hsl(var(--neon-amber))" }} />
                ) : c.fk ? (
                  <Hash className="h-2.5 w-2.5" style={{ color: "hsl(var(--neon-magenta))" }} />
                ) : c.icon ? (
                  <c.icon className="h-2.5 w-2.5 text-muted-foreground" />
                ) : (
                  <span className="h-2.5 w-2.5" />
                )}
                <span className={c.pk ? "text-foreground" : "text-foreground/80"}>{c.name}</span>
              </span>
              <span className="text-muted-foreground/70 ml-2 shrink-0">{c.type}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
