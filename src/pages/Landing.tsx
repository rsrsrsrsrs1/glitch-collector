import { Link } from "react-router-dom";
import { ArrowRight, Moon, Sun, Database, Filter, Code2, Search, Plus, ChevronDown, Play, Circle, Download, Apple, Terminal, Copy, Check, Command, X, Table as TableIcon, Code, Zap } from "lucide-react";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { PlatformCard } from "@/components/landing/PlatformCard";
import { SupportedDbCard } from "@/components/landing/SupportedDbCard";
import { TableOfContents } from "@/components/landing/TableOfContents";
import { CursorOrbs } from "@/components/landing/CursorOrbs";
import { MainframeBackdrop } from "@/components/landing/MainframeBackdrop";
import { SchemaDiagram } from "@/components/landing/SchemaDiagram";
import { TerminalStrip } from "@/components/landing/TerminalStrip";
import { MetricsTicker } from "@/components/landing/MetricsTicker";
import { InteractiveCube } from "@/components/landing/InteractiveCube";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState, useRef } from "react";
import doraLogo from "@/assets/dora-logo.png";
import { useInView } from "@/hooks/use-in-view";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IOS = "cubic-bezier(0.32, 0.72, 0, 1)";

const DEMO_PATH = "/dashboard";

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Force dark — minimal monochrome is dark-native
  useEffect(() => {
    if (theme !== "dark") setTheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DoraMark = ({ size = 20 }: { size?: number }) => (
    <img
      src={doraLogo}
      alt="Dora"
      style={{ width: size, height: size, filter: "drop-shadow(0 0 8px hsl(var(--neon-cyan) / 0.5))" }}
      className="object-contain transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-110"
    />
  );

  const [cmdOpen, setCmdOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav
        className="fixed top-0 z-50 w-full backdrop-blur-md px-6"
        style={{
          background: "hsl(240 12% 4% / 0.78)",
          borderBottom: "1px solid hsl(var(--neon-cyan) / 0.18)",
        }}
      >
        <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2 -ml-0.5 group">
            <DoraMark size={22} />
            <span
              className="text-[14px] font-bold tracking-[0.18em] uppercase transition-opacity group-hover:opacity-80"
              style={{ color: "hsl(var(--neon-cyan))", textShadow: "0 0 12px hsl(var(--neon-cyan) / 0.5)" }}
            >
              Dora
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
              · the database explorah
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 border text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              style={{ borderColor: "hsl(var(--neon-cyan) / 0.25)" }}
              title="Command palette"
            >
              <Search className="h-3 w-3" />
              <span>Search</span>
              <kbd className="ml-1 px-1 border border-border text-[10px]">⌘K</kbd>
            </button>
            <a href="#download" className="text-[13px] text-foreground/70 hover:text-foreground transition-colors h-8 px-3 inline-flex items-center">
              Download
            </a>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors relative"
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <Link to={DEMO_PATH}>
              <button className="text-[13px] text-foreground/70 hover:text-foreground transition-colors h-8 px-3">
                Log in
              </button>
            </Link>
            <Link to={DEMO_PATH}>
              <button
                className="group relative text-[13px] h-8 px-4 font-medium transition-all hover:brightness-110"
                style={{
                  background: "hsl(var(--neon-cyan))",
                  color: "hsl(240 12% 6%)",
                  boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.4), 0 0 18px hsl(var(--neon-cyan) / 0.45)",
                }}
              >
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <TableOfContents
        items={[
          { id: "hero", label: "Boot" },
          { id: "schema", label: "Schema" },
          { id: "features", label: "Features" },
          { id: "preview", label: "Preview" },
          { id: "download", label: "Download" },
          { id: "cta", label: "Engage" },
        ]}
      />

      {/* Hero */}
      <section id="hero" className="relative z-10 pt-16 pb-0 px-6 overflow-hidden">
        <MainframeBackdrop />
        <CursorOrbs />
        <div className="mx-auto max-w-[1200px] relative">
          <div className="pt-[64px] pb-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-center">
            <HeroText />
            <div className="relative z-[1] flex flex-col gap-6">
              {/* Centerpiece interactive cube — drag to rotate */}
              <div className="relative w-full aspect-square max-h-[480px] mx-auto">
                <InteractiveCube className="w-full h-full" />
              </div>
              {/* Compact terminal status strip — secondary detail */}
              <TerminalStrip />
            </div>
          </div>

          <div className="relative z-[1] -mx-6">
            <MetricsTicker />
          </div>

          <div className="mt-16">
            <PreviewWindow />
          </div>
        </div>
      </section>

      {/* Schema diagram — flagship */}
      <section id="schema" className="relative z-10 pt-24 pb-24 px-6 overflow-hidden">
        <MainframeBackdrop beam={false} intensity={0.6} />
        <div className="mx-auto max-w-[1200px] relative">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="font-pixel text-[12px] uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(var(--neon-cyan))" }}>
                Live schema introspection
              </p>
              <h2 className="font-pixel text-[clamp(1.8rem,3vw,2.6rem)] font-[400] tracking-[-0.01em] text-foreground max-w-[640px] leading-[1.12]">
                Your database, mapped.<br />
                <span className="neon-text-cyan">In real time.</span>
              </h2>
            </div>
            <p className="text-[14px] text-muted-foreground max-w-[380px]">
              Dora reads relationships, indexes, and constraints — then renders a live, interactive map of your schema. No drift, no surprises.
            </p>
          </div>
          <SchemaDiagram />
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--neon-cyan) / 0.4), transparent)" }} />

      {/* Features */}
      <section id="features" className="relative z-10 pt-24 pb-24 px-6 overflow-hidden">
        <MainframeBackdrop beam={false} intensity={0.5} />
        <div className="mx-auto max-w-[1200px] relative">
          <p className="font-pixel text-[12px] uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(var(--neon-magenta))" }}>
            Built for developers
          </p>
          <h2 className="font-pixel text-[clamp(1.8rem,3vw,2.5rem)] font-[400] tracking-[-0.01em] text-foreground max-w-[560px] leading-[1.15]">
            A database UI that<br /><span className="neon-text-magenta">gets out of your way.</span>
          </h2>
          <FeatureCards />
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--neon-magenta) / 0.4), transparent)" }} />

      <DownloadsSection />

      <div className="relative z-10 w-full h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--neon-cyan) / 0.4), transparent)" }} />

      <CtaSection isDark={isDark} />

      <div className="relative z-10 border-t" style={{ borderColor: "hsl(var(--neon-cyan) / 0.18)" }}>
        <div className="mx-auto max-w-[1200px] px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 -ml-0.5 group">
            <DoraMark size={18} />
            <span className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: "hsl(var(--neon-cyan))" }}>Dora</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-mono">[ © {new Date().getFullYear()} · all systems nominal ]</span>
        </div>
      </div>

      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Mocked Dora database UI — modeled after doradb.vercel.app                 */
/*  Vague, skeleton-faded rows give a "loading more" cinematic feel           */
/* ────────────────────────────────────────────────────────────────────────── */

type Row = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  created_at: string;
};

const FIRST_NAMES = ["James", "Mason", "Oliver", "Liam", "Lucas", "Sophia", "Emma", "Isabella", "Charlotte", "Noah", "Evelyn", "Alexander", "Ava", "Mia", "Benjamin", "Elijah"];
const LAST_NAMES = ["Taylor", "Martin", "Wilson", "Rodriguez", "Jackson", "Williams", "Davis", "Lopez", "Johnson", "Anderson", "Miller", "Martinez", "Brown", "Thomas", "Moore", "Jones"];
const CITIES = ["Chicago", "Philadelphia", "Jacksonville", "Houston", "San Antonio", "San Jose", "Dallas", "Austin", "Fort Worth", "Charlotte", "New York", "Phoenix"];
const COUNTRIES = ["Germany", "Denmark", "Sweden", "Norway", "Australia", "Canada", "Netherlands", "France", "USA", "UK"];

function genRows(n: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const city = CITIES[(i * 5) % CITIES.length];
    const country = COUNTRIES[(i * 7) % COUNTRIES.length];
    const phoneA = 100 + ((i * 137) % 900);
    const phoneB = 100 + ((i * 211) % 900);
    const phoneC = 1000 + ((i * 919) % 9000);
    const yyyy = 2025 + (i % 2);
    const mm = String(((i * 3) % 12) + 1).padStart(2, "0");
    const dd = String(((i * 7) % 28) + 1).padStart(2, "0");
    const hh = String((i * 11) % 24).padStart(2, "0");
    const mi = String((i * 13) % 60).padStart(2, "0");
    const ss = String((i * 17) % 60).padStart(2, "0");
    rows.push({
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      phone: `+1-${phoneA}-${phoneB}-${phoneC}`,
      city,
      country,
      created_at: `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`,
    });
  }
  return rows;
}

const ROWS = genRows(22);

const TABLES = [
  { name: "customers",    count: 50,  active: true },
  { name: "products",     count: 25 },
  { name: "orders",       count: 100 },
  { name: "order_items",  count: 150 },
  { name: "inventory",    count: 120 },
  { name: "transactions", count: 250 },
  { name: "subscriptions", count: 60 },
];

type DemoPhase = "connect" | "insert" | "bulk" | "query" | "context" | "delete";

const DEMO_PHASES: { id: DemoPhase; label: string; hint: string }[] = [
  { id: "connect", label: "Connect",     hint: "Switch database" },
  { id: "insert",  label: "Insert row",  hint: "Add record" },
  { id: "bulk",    label: "Bulk select", hint: "Shift-click range" },
  { id: "query",   label: "Run query",   hint: "⌘↵ SQL console" },
  { id: "context", label: "Context menu", hint: "Right-click" },
  { id: "delete",  label: "Delete row",  hint: "⌫ Backspace" },
];

const CONNECTIONS = [
  { id: "ecom",     name: "Demo E-Commerce",  sub: "PostgreSQL · localhost",     active: true  },
  { id: "analytics", name: "Analytics Warehouse", sub: "BigQuery · us-east-1",   active: false },
  { id: "cache",    name: "Session Cache",    sub: "Redis · 6379",              active: false },
  { id: "crm",      name: "CRM Replica",      sub: "MySQL · rds.prod",          active: false },
];

type Col = { key: keyof Row; label: string; type: string; width: string };
const COLUMNS: Col[] = [
  { key: "id",         label: "id",         type: "serial",       width: "70px"  },
  { key: "name",       label: "name",       type: "varchar(100)", width: "180px" },
  { key: "email",      label: "email",      type: "varchar(255)", width: "240px" },
  { key: "phone",      label: "phone",      type: "varchar(20)",  width: "150px" },
  { key: "city",       label: "city",       type: "varchar(50)",  width: "130px" },
  { key: "country",    label: "country",    type: "varchar(50)",  width: "130px" },
  { key: "created_at", label: "created_at", type: "timestamp",    width: "200px" },
];

function DoraMockUI({ autoplay = false }: { autoplay?: boolean }) {
  const [activeTable, setActiveTable] = useState("customers");
  const [search, setSearch] = useState("");
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  // Total visible rows = 22; first 14 are crisp, last 8 fade to skeleton vagueness
  const CRISP = 14;

  // ─── Fake-cursor demo state ────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const brandRef = useRef<HTMLButtonElement>(null);
  const connOptionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean; click: number; label: string }>({
    x: 40, y: 40, visible: false, click: 0, label: "",
  });
  const [insertedRow, setInsertedRow] = useState<Row | null>(null);
  const [insertFlash, setInsertFlash] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; rowId: number } | null>(null);
  const [ctxHighlight, setCtxHighlight] = useState<"copy" | "edit" | "delete" | null>(null);
  const [btnPulse, setBtnPulse] = useState(false);
  const userActiveRef = useRef(false);

  // Bulk-select state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

  // SQL console / query state
  const [view, setView] = useState<"table" | "sql">("table");
  const [queryText, setQueryText] = useState<string>("");
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResults, setQueryResults] = useState<Row[] | null>(null);
  const [queryMeta, setQueryMeta] = useState<{ rows: number; total: number; ms: number } | null>(null);
  const sqlRailRef = useRef<HTMLButtonElement>(null);
  const tableRailRef = useRef<HTMLButtonElement>(null);
  const runBtnRef = useRef<HTMLButtonElement>(null);

  // Phase + connector + keycap state
  const [phase, setPhase] = useState<DemoPhase>("connect");
  const phaseRef = useRef<DemoPhase>("connect");
  const [jumpToken, setJumpToken] = useState(0);
  const [activeConn, setActiveConn] = useState<string>("ecom");
  const [connOpen, setConnOpen] = useState(false);
  const [connSwap, setConnSwap] = useState(false);
  const [keycap, setKeycap] = useState<{ key: string; label?: string; token: number } | null>(null);
  const keycapToken = useRef(0);
  const flashKey = (key: string, label?: string) => {
    keycapToken.current += 1;
    setKeycap({ key, label, token: keycapToken.current });
  };

  const filtered = useMemo(() => {
    const base = search.trim()
      ? ROWS.filter((r) => {
          const q = search.toLowerCase();
          return [r.name, r.email, r.city, r.country].some((v) => v.toLowerCase().includes(q));
        })
      : ROWS;
    const withInsert = insertedRow ? [insertedRow, ...base] : base;
    return withInsert.filter((r) => !removedIds.has(r.id));
  }, [search, insertedRow, removedIds]);

  // Drive scripted demo when section is in view & user is idle
  useEffect(() => {
    if (!autoplay) return;
    let cancelled = false;
    const waitMs = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    const stopped = () => cancelled || userActiveRef.current;

    const moveTo = async (tx: number, ty: number, label = "", steps = 22) => {
      for (let i = 0; i < steps; i++) {
        if (stopped()) return;
        setCursor((c) => {
          const t = (i + 1) / steps;
          const e = 1 - Math.pow(1 - t, 3);
          return { ...c, x: c.x + (tx - c.x) * e, y: c.y + (ty - c.y) * e, visible: true, label };
        });
        await waitMs(16);
      }
      setCursor((c) => ({ ...c, x: tx, y: ty }));
    };

    const click = async () => {
      setCursor((c) => ({ ...c, click: c.click + 1 }));
      flashKey("click");
      await waitMs(140);
    };

    const targetCenter = (el: Element | null, offset = { x: 0, y: 0 }) => {
      const wrap = wrapRef.current;
      if (!el || !wrap) return null;
      const a = el.getBoundingClientRect();
      const b = wrap.getBoundingClientRect();
      return { x: a.left - b.left + a.width / 2 + offset.x, y: a.top - b.top + a.height / 2 + offset.y };
    };

    // ── Phase runners ─────────────────────────────────────────────────────
    const runConnect = async () => {
      setConnOpen(false);
      const brandPos = targetCenter(brandRef.current);
      if (!brandPos) return;
      await moveTo(brandPos.x, brandPos.y, "switch connection", 24);
      if (stopped()) return;
      await click();
      setConnOpen(true);
      await waitMs(420);
      if (stopped()) return;

      // Cycle through options, land on "ecom" to keep demo state consistent
      const pickOrder = ["analytics", "crm", "ecom"];
      for (const id of pickOrder) {
        if (stopped()) return;
        const el = connOptionRefs.current.get(id);
        const pos = targetCenter(el ?? null);
        if (!pos) continue;
        await moveTo(pos.x, pos.y, id === "ecom" ? "click: connect" : "", 14);
        await waitMs(id === "ecom" ? 360 : 220);
      }
      if (stopped()) return;
      await click();
      flashKey("↵", "Enter");
      setActiveConn("ecom");
      setConnSwap(true);
      setTimeout(() => setConnSwap(false), 600);
      setConnOpen(false);
      await waitMs(700);
    };

    const runInsert = async () => {
      setCtxMenu(null);
      setInsertedRow(null);
      const addPos = targetCenter(addBtnRef.current);
      if (!addPos) return;
      await moveTo(addPos.x, addPos.y, "click: add record", 26);
      if (stopped()) return;
      setBtnPulse(true);
      await click();
      flashKey("⌘N", "New");
      setTimeout(() => setBtnPulse(false), 400);

      const newRow: Row = {
        id: 9001,
        name: "Ada Lovelace",
        email: "ada.lovelace@example.com",
        phone: "+1-415-867-5309",
        city: "London",
        country: "UK",
        created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
      setInsertedRow(newRow);
      setInsertFlash(true);
      await waitMs(900);
      setInsertFlash(false);
      await waitMs(500);
    };

    const runBulk = async () => {
      setCtxMenu(null);
      setSelectedIds(new Set());
      setLastSelectedId(null);

      // Pick two visible rows a few apart (skip the inserted row + the context target)
      const firstId = ROWS[5].id;
      const lastId  = ROWS[9].id;

      const firstEl = rowRefs.current.get(firstId);
      const firstPos = targetCenter(firstEl ?? null, { x: -140, y: 0 });
      if (!firstPos) return;

      // Click the first row's checkbox
      await moveTo(firstPos.x, firstPos.y, "select row", 22);
      if (stopped()) return;
      setHoverRow(firstId);
      await click();
      setSelectedIds(new Set([firstId]));
      setLastSelectedId(firstId);
      await waitMs(320);

      // Shift-click the later row → range selection
      const lastEl = rowRefs.current.get(lastId);
      const lastPos = targetCenter(lastEl ?? null, { x: -140, y: 0 });
      if (!lastPos) return;
      await moveTo(lastPos.x, lastPos.y, "shift + click", 20);
      if (stopped()) return;
      flashKey("⇧", "Shift");
      await waitMs(180);
      setHoverRow(lastId);
      await click();

      // Range selection across the visible rows between firstId and lastId
      const a = ROWS.findIndex((r) => r.id === firstId);
      const b = ROWS.findIndex((r) => r.id === lastId);
      if (a !== -1 && b !== -1) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        setSelectedIds(new Set(ROWS.slice(lo, hi + 1).map((r) => r.id)));
      }
      setLastSelectedId(lastId);
      await waitMs(1100);

      // Clear selection on the way out
      setSelectedIds(new Set());
      setLastSelectedId(null);
      setHoverRow(null);
      await waitMs(300);
    };

    const runQuery = async () => {
      setCtxMenu(null);
      setSelectedIds(new Set());
      setQueryResults(null);
      setQueryMeta(null);
      setQueryText("");

      // 1. Move to the SQL icon in the left rail and click → open SQL console
      const sqlPos = targetCenter(sqlRailRef.current);
      if (!sqlPos) return;
      await moveTo(sqlPos.x, sqlPos.y, "open SQL console", 22);
      if (stopped()) return;
      await click();
      setView("sql");
      await waitMs(420);

      // 2. Type a query into the editor (char-by-char)
      const q = "SELECT name, email, city, country\nFROM customers\nWHERE country = 'UK'\nLIMIT 15;";
      for (let i = 1; i <= q.length; i++) {
        if (stopped()) return;
        setQueryText(q.slice(0, i));
        // Slight jitter; faster on whitespace
        const ch = q[i - 1];
        await waitMs(ch === " " || ch === "\n" ? 18 : 26);
      }
      await waitMs(260);

      // 3. Move to the Run button and "press ⌘↵"
      if (stopped()) return;
      const runPos = targetCenter(runBtnRef.current);
      if (runPos) {
        await moveTo(runPos.x, runPos.y, "run query", 18);
      }
      if (stopped()) return;
      flashKey("⌘↵", "Run");
      await click();

      // 4. Show running state, then populate results
      setQueryRunning(true);
      await waitMs(560);
      if (stopped()) return;

      const uk = ROWS.filter((r) => r.country === "UK").slice(0, 15);
      // If dataset doesn't have 15 UK rows, backfill with a mix so the grid looks full
      const results = uk.length >= 6 ? uk : ROWS.slice(0, 15);
      setQueryResults(results);
      setQueryMeta({ rows: results.length, total: 50, ms: 213 });
      setQueryRunning(false);
      await waitMs(1400);

      // 5. Head back to the table view
      if (stopped()) return;
      const tablePos = targetCenter(tableRailRef.current);
      if (tablePos) {
        await moveTo(tablePos.x, tablePos.y, "back to table", 20);
        if (stopped()) return;
        await click();
      }
      setView("table");
      await waitMs(500);
    };

    const runContext = async () => {
      const targetRowId = ROWS[2].id;
      const rowEl = rowRefs.current.get(targetRowId);
      const rowPos = targetCenter(rowEl ?? null, { x: -40, y: 0 });
      if (!rowPos) return;
      await moveTo(rowPos.x, rowPos.y, "right-click row", 24);
      if (stopped()) return;
      setHoverRow(targetRowId);
      await click();
      flashKey("RMB", "Right-click");
      setCtxMenu({ x: rowPos.x + 6, y: rowPos.y + 6, rowId: targetRowId });
      await waitMs(500);

      // Hover copy, edit (without deleting yet)
      for (const item of ["copy", "edit"] as const) {
        if (stopped()) return;
        setCtxHighlight(item);
        const dx = ctxMenuItemOffset(item);
        await moveTo(rowPos.x + 6 + 90, rowPos.y + 6 + dx, "", 12);
        await waitMs(260);
      }

      // Escape briefly to show Esc closes menu, then reopen for delete phase
      if (stopped()) return;
      flashKey("Esc");
      setCtxMenu(null);
      setCtxHighlight(null);
      await waitMs(520);
      return { rowPos, targetRowId };
    };

    const runDelete = async (ctx?: { rowPos: { x: number; y: number }; targetRowId: number }) => {
      // If context menu wasn't opened (jumping directly into delete), open it now.
      let rowPos = ctx?.rowPos;
      let targetRowId = ctx?.targetRowId;
      if (!rowPos || targetRowId == null) {
        targetRowId = ROWS[2].id;
        const rowEl = rowRefs.current.get(targetRowId);
        const p = targetCenter(rowEl ?? null, { x: -40, y: 0 });
        if (!p) return;
        rowPos = p;
        await moveTo(rowPos.x, rowPos.y, "right-click row", 20);
        if (stopped()) return;
        setHoverRow(targetRowId);
        await click();
        flashKey("RMB", "Right-click");
        setCtxMenu({ x: rowPos.x + 6, y: rowPos.y + 6, rowId: targetRowId });
        await waitMs(380);
      } else {
        // Reopen menu at same spot
        setCtxMenu({ x: rowPos.x + 6, y: rowPos.y + 6, rowId: targetRowId });
        await waitMs(260);
      }

      if (stopped()) return;
      setCtxHighlight("delete");
      await moveTo(rowPos.x + 6 + 90, rowPos.y + 6 + ctxMenuItemOffset("delete"), "click: delete", 14);
      await waitMs(300);
      if (stopped()) return;
      await click();
      flashKey("⌫", "Backspace");
      setCtxMenu(null);
      setCtxHighlight(null);

      setDeletingId(targetRowId);
      await waitMs(550);
      setRemovedIds((s) => new Set(s).add(targetRowId!));
      setDeletingId(null);
      setHoverRow(null);
      await waitMs(900);
    };

    const resetState = () => {
      setRemovedIds(new Set());
      setInsertedRow(null);
      setCtxMenu(null);
      setCtxHighlight(null);
      setDeletingId(null);
      setHoverRow(null);
      setConnOpen(false);
      setSelectedIds(new Set());
      setLastSelectedId(null);
      setView("table");
      setQueryText("");
      setQueryRunning(false);
      setQueryResults(null);
      setQueryMeta(null);
    };

    const runFrom = async (start: DemoPhase) => {
      const order: DemoPhase[] = ["connect", "insert", "bulk", "query", "context", "delete"];
      const startIdx = order.indexOf(start);
      resetState();
      await waitMs(400);
      let ctx: { rowPos: { x: number; y: number }; targetRowId: number } | void = undefined;
      for (let i = startIdx; i < order.length; i++) {
        if (stopped()) return;
        const p = order[i];
        phaseRef.current = p;
        setPhase(p);
        if (p === "connect") await runConnect();
        else if (p === "insert") await runInsert();
        else if (p === "bulk") await runBulk();
        else if (p === "query") await runQuery();
        else if (p === "context") ctx = await runContext();
        else if (p === "delete") await runDelete(ctx || undefined);
      }
      if (stopped()) return;
      setCursor((c) => ({ ...c, visible: false, label: "" }));
      await waitMs(1100);
      if (!cancelled) runFrom("connect");
    };

    const t = setTimeout(() => runFrom(phaseRef.current || "connect"), 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, jumpToken]);

  // Jump to a phase (scrubber). Force-resumes the demo even if the user is hovering.
  const jumpToPhase = (p: DemoPhase) => {
    phaseRef.current = p;
    setPhase(p);
    userActiveRef.current = false;
    setJumpToken((t) => t + 1);
  };

  // Pause when the user actually interacts with the preview
  const onUserEnter = () => {
    userActiveRef.current = true;
    setCursor((c) => ({ ...c, visible: false, label: "" }));
    setCtxMenu(null);
    setCtxHighlight(null);
  };
  const onUserLeave = () => {
    userActiveRef.current = false;
  };

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onUserEnter}
      onMouseLeave={onUserLeave}
      className="relative select-none flex bg-[hsl(240_12%_5%)] text-foreground"
    >
      {/* Mini icon rail */}
      <div className="w-[44px] shrink-0 border-r border-border/60 flex flex-col items-center py-2 gap-1 bg-[hsl(240_12%_4%)]">
        {[Database, TableIcon, Code, Filter, Terminal, Zap].map((Icon, i) => {
          const isTable = i === 1;
          const isSql = i === 4;
          const active = (isTable && view === "table") || (isSql && view === "sql");
          return (
            <button
              key={i}
              ref={isTable ? tableRailRef : isSql ? sqlRailRef : undefined}
              onClick={() => {
                if (isTable) setView("table");
                else if (isSql) setView("sql");
              }}
              className={`h-8 w-8 flex items-center justify-center transition-colors ${
                active
                  ? "text-foreground bg-foreground/10 border-l-2 border-[hsl(var(--neon-cyan))]"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>

      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-border/60 bg-[hsl(240_12%_4.5%)] flex flex-col">
        {/* Brand row — connector switcher */}
        <div className="relative">
          <button
            ref={brandRef}
            onClick={() => setConnOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-3 h-[52px] border-b border-border/60 text-left transition-colors hover:bg-foreground/[0.03]"
            style={{
              background: connOpen ? "hsl(var(--neon-cyan) / 0.06)" : undefined,
            }}
          >
            <div
              className="h-7 w-7 flex items-center justify-center border shrink-0 transition-all"
              style={{
                borderColor: "hsl(var(--neon-cyan) / 0.4)",
                background: "hsl(var(--neon-cyan) / 0.08)",
                boxShadow: connSwap
                  ? "0 0 0 2px hsl(var(--neon-cyan) / 0.45), 0 0 24px hsl(var(--neon-cyan) / 0.55)"
                  : "0 0 10px hsl(var(--neon-cyan) / 0.3)",
              }}
            >
              <Database className="h-3.5 w-3.5" style={{ color: "hsl(var(--neon-cyan))" }} />
            </div>
            <div
              key={activeConn}
              className="flex flex-col leading-tight min-w-0 animate-fade-in"
            >
              <span className="text-[12px] text-foreground truncate">
                {CONNECTIONS.find((c) => c.id === activeConn)?.name ?? "Demo E-Commerce"} …
              </span>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {CONNECTIONS.find((c) => c.id === activeConn)?.sub ?? "PostgreSQL · localhost"}
              </span>
            </div>
            <ChevronDown
              className="h-3 w-3 text-muted-foreground ml-auto shrink-0 transition-transform"
              style={{ transform: connOpen ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {/* Connector dropdown */}
          {connOpen && (
            <div
              className="absolute z-30 left-2 right-2 top-[52px] border border-border bg-[hsl(240_12%_6%)] shadow-2xl animate-in fade-in zoom-in-95 duration-150"
              style={{
                boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.18), 0 12px 32px hsl(0 0% 0% / 0.6)",
              }}
            >
              <div className="px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70 font-mono border-b border-border/60">
                Connections · {CONNECTIONS.length}
              </div>
              {CONNECTIONS.map((c) => {
                const isActive = c.id === activeConn;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      if (el) connOptionRefs.current.set(c.id, el);
                      else connOptionRefs.current.delete(c.id);
                    }}
                    onClick={() => {
                      setActiveConn(c.id);
                      setConnSwap(true);
                      setTimeout(() => setConnSwap(false), 600);
                      setConnOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-foreground/[0.05]"
                    style={{
                      background: isActive ? "hsl(var(--neon-cyan) / 0.08)" : undefined,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{
                        background: isActive
                          ? "hsl(var(--neon-cyan))"
                          : "hsl(0 0% 40%)",
                        boxShadow: isActive
                          ? "0 0 8px hsl(var(--neon-cyan) / 0.7)"
                          : undefined,
                      }}
                    />
                    <div className="flex flex-col leading-tight min-w-0 flex-1">
                      <span
                        className="text-[11.5px] truncate"
                        style={{ color: isActive ? "hsl(var(--neon-cyan))" : "hsl(0 0% 88%)" }}
                      >
                        {c.name}
                      </span>
                      <span className="text-[9.5px] text-muted-foreground font-mono truncate">
                        {c.sub}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="h-3 w-3 shrink-0" style={{ color: "hsl(var(--neon-cyan))" }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-1 px-2 py-2 border-b border-border/60">
          <div className="relative flex-1">
            <Search className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-7 w-full pl-7 pr-2 bg-background/40 border border-border/60 text-[11px] font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--neon-cyan)/0.5)] transition-colors"
            />
          </div>
          <button className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/60">
            <Filter className="h-3 w-3" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/60">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
          </button>
        </div>

        {/* Tables list */}
        <ul className="flex-1 overflow-hidden p-1.5 space-y-px">
          {TABLES.map((t) => {
            const active = t.name === activeTable;
            return (
              <li key={t.name}>
                <button
                  onClick={() => setActiveTable(t.name)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-[12px] font-mono transition-colors ${
                    active
                      ? "bg-foreground/[0.07] text-foreground border-l-2 border-[hsl(var(--neon-cyan))]"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] border-l-2 border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <TableIcon className="h-3 w-3 shrink-0 opacity-70" />
                    {t.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 tabular-nums">{t.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main pane */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top toolbar */}
        <div className="flex items-center gap-1 px-3 h-[44px] border-b border-border/60 bg-[hsl(240_12%_5.5%)]">
          <button className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
          </button>
          <div className="h-5 w-px bg-border/60 mx-1" />
          <button className="h-7 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-foreground border-b-2 border-[hsl(var(--neon-cyan))] transition-colors">
            <TableIcon className="h-3 w-3" />
            Filters
          </button>
          <button className="h-7 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            <Code className="h-3 w-3" />
            Columns
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button className="h-7 px-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors">
              <Code className="h-3 w-3" />
              Dry Edit
            </button>
            <button
              ref={addBtnRef}
              className="h-7 px-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono transition-all"
              style={{
                background: btnPulse ? "hsl(var(--neon-cyan) / 0.28)" : "hsl(var(--neon-cyan) / 0.12)",
                color: "hsl(var(--neon-cyan))",
                border: "1px solid hsl(var(--neon-cyan) / 0.45)",
                boxShadow: btnPulse
                  ? "0 0 0 2px hsl(var(--neon-cyan) / 0.35), 0 0 24px hsl(var(--neon-cyan) / 0.55)"
                  : "0 0 12px hsl(var(--neon-cyan) / 0.25)",
                transform: btnPulse ? "scale(0.97)" : "scale(1)",
              }}
            >
              <Plus className="h-3 w-3" />
              Add record
            </button>
            <div className="h-5 w-px bg-border/60 mx-1" />
            {[
              <svg key="r" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /></svg>,
              <Download key="d" className="h-3 w-3" />,
              <Copy key="c" className="h-3 w-3" />,
            ].map((icon, i) => (
              <button key={i} className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {view === "table" && (
        <div className="relative flex-1 overflow-hidden">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-[11.5px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-[hsl(240_12%_5%)]">
                  <th className="w-[34px] px-2 py-2 text-left">
                    {selectedIds.size > 0 ? (
                      <span
                        className="inline-flex items-center justify-center h-3 w-3 border"
                        style={{
                          borderColor: "hsl(var(--neon-cyan) / 0.7)",
                          background: "hsl(var(--neon-cyan) / 0.18)",
                        }}
                      >
                        <span
                          className="block h-[5px] w-[5px]"
                          style={{ background: "hsl(var(--neon-cyan))" }}
                        />
                      </span>
                    ) : (
                      <span className="inline-block h-3 w-3 border border-border/70" />
                    )}
                  </th>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.key}
                      className="text-left font-normal px-3 py-2 whitespace-nowrap"
                      style={{ minWidth: c.width }}
                    >
                      <span className="text-foreground">{c.label}</span>{" "}
                      <span className="text-muted-foreground/60">{c.type}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const isHover = hoverRow === r.id;
                  const isInserted = insertedRow && r.id === insertedRow.id;
                  const isDeleting = deletingId === r.id;
                  const isSelected = selectedIds.has(r.id);
                  const beyondCrisp = idx - CRISP;
                  const isVague = beyondCrisp >= 0 && !isInserted;
                  const vagueOpacity = isVague
                    ? Math.max(0.08, 1 - (beyondCrisp + 1) * 0.12)
                    : 1;
                  const blur = isVague ? Math.min(2.5, (beyondCrisp + 1) * 0.35) : 0;
                  const flashBg = isInserted && insertFlash
                    ? "hsl(var(--neon-cyan) / 0.18)"
                    : isDeleting
                    ? "hsl(var(--neon-magenta) / 0.16)"
                    : isSelected
                    ? "hsl(var(--neon-cyan) / 0.10)"
                    : isHover && !isVague
                    ? "hsl(0 0% 100% / 0.04)"
                    : undefined;
                  return (
                    <tr
                      key={r.id}
                      ref={(el) => {
                        if (el) rowRefs.current.set(r.id, el);
                        else rowRefs.current.delete(r.id);
                      }}
                      onMouseEnter={() => setHoverRow(r.id)}
                      onMouseLeave={() => setHoverRow(null)}
                      onContextMenu={(e) => e.preventDefault()}
                      className="border-b border-border/40"
                      style={{
                        opacity: isDeleting ? 0 : vagueOpacity,
                        filter: blur ? `blur(${blur}px)` : undefined,
                        background: flashBg,
                        transition:
                          "opacity 480ms cubic-bezier(0.22,1,0.36,1), background 380ms ease, transform 480ms cubic-bezier(0.22,1,0.36,1)",
                        transform: isDeleting ? "translateX(-12px)" : "translateX(0)",
                        boxShadow: isInserted && insertFlash
                          ? "inset 3px 0 0 hsl(var(--neon-cyan))"
                          : isDeleting
                          ? "inset 3px 0 0 hsl(var(--neon-magenta))"
                          : isSelected
                          ? "inset 2px 0 0 hsl(var(--neon-cyan) / 0.8)"
                          : undefined,
                      }}
                    >
                      <td className="px-2 py-1.5">
                        {isSelected ? (
                          <span
                            className="inline-flex items-center justify-center h-3 w-3 border"
                            style={{
                              borderColor: "hsl(var(--neon-cyan) / 0.8)",
                              background: "hsl(var(--neon-cyan) / 0.22)",
                              boxShadow: "0 0 6px hsl(var(--neon-cyan) / 0.4)",
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden>
                              <path
                                d="M1.5 5.2 L4 7.6 L8.5 2.6"
                                fill="none"
                                stroke="hsl(var(--neon-cyan))"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-block h-3 w-3 border border-border/70" />
                        )}
                      </td>
                      {COLUMNS.map((c) => (
                        <td
                          key={c.key}
                          className={`px-3 py-1.5 whitespace-nowrap ${
                            c.key === "id"
                              ? "text-muted-foreground tabular-nums text-right pr-6"
                              : c.key === "created_at"
                              ? "text-foreground/80"
                              : "text-foreground/90"
                          }`}
                        >
                          {c.key === "created_at" ? (
                            <>
                              <span>{(r[c.key] as string).slice(0, 10)}</span>{" "}
                              <span className="text-muted-foreground/70">{(r[c.key] as string).slice(11)}</span>
                            </>
                          ) : (
                            r[c.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {/* Pure skeleton rows — no data, just shimmering bars */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-border/30" style={{ opacity: Math.max(0.05, 0.18 - i * 0.04) }}>
                    <td className="px-2 py-1.5">
                      <Skeleton className="h-3 w-3 bg-foreground/10" />
                    </td>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="px-3 py-1.5">
                        <Skeleton
                          className="h-3 bg-foreground/10"
                          style={{ width: `${40 + ((i * 13 + c.label.length * 7) % 50)}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom fade — vagueness emphasis */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, hsl(240 12% 5%) 0%, hsl(240 12% 5% / 0.85) 35%, transparent 100%)",
            }}
          />
          {/* Loading hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: "hsl(var(--neon-cyan))" }} />
            streaming rows · {filtered.length} of 12,408
          </div>
        </div>
        )}

        {/* SQL console view */}
        {view === "sql" && (
          <SqlConsole
            queryText={queryText}
            running={queryRunning}
            results={queryResults}
            meta={queryMeta}
            runBtnRef={runBtnRef}
          />
        )}

        {/* Status bar */}
        <div className="flex items-center justify-between px-3 h-7 border-t border-border/60 bg-[hsl(240_12%_4.5%)] text-[10px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "hsl(var(--neon-cyan))" }} />
            connected · 33ms
          </span>
          <span className="tabular-nums">
            {view === "sql" ? "sql-console · ⌘↵ run" : `public.${activeTable} · ⌘K for commands`}
          </span>
        </div>
      </main>

      {/* Timeline scrubber — jump to demo phases */}
      <div
        className="absolute z-40 left-1/2 -translate-x-1/2 bottom-20 flex items-center gap-1 px-2 py-1.5 border border-border bg-[hsl(240_12%_6%/0.95)] backdrop-blur-md pointer-events-auto"
        style={{
          boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.2), 0 8px 28px hsl(0 0% 0% / 0.5)",
        }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80 pl-1.5 pr-2">
          Demo
        </span>
        {DEMO_PHASES.map((p, i) => {
          const active = phase === p.id;
          return (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                jumpToPhase(p.id);
              }}
              onMouseEnter={(e) => e.stopPropagation()}
              title={p.hint}
              className="group relative h-6 px-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
              style={{
                color: active ? "hsl(var(--neon-cyan))" : "hsl(0 0% 70%)",
                background: active ? "hsl(var(--neon-cyan) / 0.12)" : "transparent",
                border: `1px solid ${active ? "hsl(var(--neon-cyan) / 0.5)" : "hsl(var(--border))"}`,
                boxShadow: active ? "0 0 12px hsl(var(--neon-cyan) / 0.35)" : undefined,
              }}
            >
              <span
                className="tabular-nums text-[9px] opacity-70"
                style={{ color: active ? "hsl(var(--neon-cyan))" : undefined }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Keycap overlay — shows ⌫, Esc, ⌘N, etc. during the demo */}
      <KeycapOverlay keycap={keycap} />

      {/* Context menu (driven by demo) */}
      {ctxMenu && (
        <div
          className="absolute z-30 min-w-[180px] border border-border bg-[hsl(240_12%_6%)] shadow-2xl font-mono text-[11px] animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: ctxMenu.x,
            top: ctxMenu.y,
            boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.18), 0 12px 32px hsl(0 0% 0% / 0.6)",
          }}
        >
          {[
            { id: "copy" as const, label: "Copy row", hint: "⌘ C" },
            { id: "edit" as const, label: "Edit inline", hint: "↵" },
            { id: "delete" as const, label: "Delete row", hint: "⌫", destructive: true },
          ].map((it) => {
            const active = ctxHighlight === it.id;
            return (
              <div
                key={it.id}
                className="flex items-center justify-between px-3 py-1.5 transition-colors"
                style={{
                  background: active
                    ? it.destructive
                      ? "hsl(var(--neon-magenta) / 0.18)"
                      : "hsl(var(--neon-cyan) / 0.12)"
                    : undefined,
                  color: it.destructive
                    ? active
                      ? "hsl(var(--neon-magenta))"
                      : "hsl(var(--neon-magenta) / 0.85)"
                    : active
                    ? "hsl(var(--neon-cyan))"
                    : "hsl(0 0% 88%)",
                }}
              >
                <span>{it.label}</span>
                <kbd className="text-[9px] text-muted-foreground border border-border/60 px-1">{it.hint}</kbd>
              </div>
            );
          })}
        </div>
      )}

      {/* Fake cursor overlay */}
      <FakeCursor cursor={cursor} />
    </div>
  );
}

/** Vertical offsets within the demo context menu */
function ctxMenuItemOffset(item: "copy" | "edit" | "delete") {
  const map = { copy: 12, edit: 36, delete: 60 };
  return map[item];
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  SQL Console — mimics the real app's query editor + result grid            */
/* ────────────────────────────────────────────────────────────────────────── */

type SqlRow = Row;
function SqlConsole({
  queryText,
  running,
  results,
  meta,
  runBtnRef,
}: {
  queryText: string;
  running: boolean;
  results: SqlRow[] | null;
  meta: { rows: number; total: number; ms: number } | null;
  runBtnRef: React.RefObject<HTMLButtonElement>;
}) {
  const lines = (queryText.length ? queryText : " ").split("\n");
  // Always reserve at least 6 visible lines so the editor doesn't collapse
  const visibleLines = lines.length < 6 ? [...lines, ...Array(6 - lines.length).fill("")] : lines;
  const resultCols: { key: keyof Row; label: string }[] = [
    { key: "name",    label: "name"    },
    { key: "email",   label: "email"   },
    { key: "city",    label: "city"    },
    { key: "country", label: "country" },
  ];

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Query tab strip */}
      <div className="flex items-center gap-0 px-3 h-[34px] border-b border-border/60 bg-[hsl(240_12%_5%)]">
        <div className="h-full inline-flex items-center gap-1.5 px-2.5 text-[11px] font-mono text-foreground border-b-2 border-[hsl(var(--neon-cyan))]">
          <Terminal className="h-3 w-3" style={{ color: "hsl(var(--neon-cyan))" }} />
          SQL
          <span className="text-[9px] text-muted-foreground/70 ml-1 tabular-nums">§</span>
        </div>
        <div className="h-full inline-flex items-center gap-1.5 px-2.5 text-[11px] font-mono text-muted-foreground/80">
          Drizzle
          <span className="text-[9px] text-muted-foreground/50 ml-1 tabular-nums">0</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            ref={runBtnRef}
            className="h-6 px-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono transition-all"
            style={{
              background: "hsl(142 70% 40% / 0.2)",
              color: "hsl(142 70% 55%)",
              border: "1px solid hsl(142 70% 40% / 0.5)",
              boxShadow: "0 0 10px hsl(142 70% 40% / 0.25)",
            }}
          >
            <Play className="h-2.5 w-2.5 fill-current" />
            Run
            <kbd className="text-[9px] ml-0.5 px-1 border border-current/30 opacity-70">⌘↵</kbd>
          </button>
          <div className="h-5 w-px bg-border/60 mx-0.5" />
          <button className="h-6 px-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-border/60 font-mono">
            <span>Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-[hsl(240_12%_4.5%)]">
        <div className="flex-1 min-h-0 overflow-auto font-mono text-[12px] leading-[1.55] py-2">
          {visibleLines.map((line, i) => (
            <div key={i} className="flex">
              <span
                className="select-none shrink-0 w-10 pr-3 text-right text-muted-foreground/40 tabular-nums"
                style={{ color: i === 0 ? "hsl(var(--neon-cyan) / 0.7)" : undefined }}
              >
                {i + 1}
              </span>
              <span className="flex-1 whitespace-pre pr-4">
                <SqlLine text={line} />
                {/* blinking caret on the last non-empty line */}
                {i === lines.length - 1 && (
                  <span
                    className="inline-block w-[7px] h-[14px] align-[-2px] ml-[1px]"
                    style={{
                      background: "hsl(var(--neon-cyan))",
                      animation: "terminalCursor 1s steps(2) infinite",
                      boxShadow: "0 0 6px hsl(var(--neon-cyan) / 0.6)",
                    }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Result meta bar */}
        <div className="flex items-center justify-between px-3 h-7 border-t border-border/60 bg-[hsl(240_12%_5.5%)] text-[10px] font-mono text-muted-foreground">
          {running ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "hsl(var(--neon-cyan))", boxShadow: "0 0 8px hsl(var(--neon-cyan))" }}
              />
              executing query…
            </span>
          ) : meta ? (
            <span>
              <span className="text-foreground tabular-nums">{meta.rows}</span> / {meta.total} rows ·{" "}
              <span className="text-foreground tabular-nums">{meta.ms}ms</span> backend · 0.00ms filtering
            </span>
          ) : (
            <span className="opacity-60">Press ⌘↵ to run</span>
          )}
          <span className="inline-flex items-center gap-2">
            <Download className="h-3 w-3" />
            <span className="tabular-nums">query_01.sql</span>
          </span>
        </div>

        {/* Result grid */}
        <div className="h-[220px] overflow-auto border-t border-border/60 bg-[hsl(240_12%_4%)]">
          {results && !running ? (
            <table className="w-full text-[11.5px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-[hsl(240_12%_5%)]">
                  <th className="w-[40px] px-2 py-1.5 text-left text-muted-foreground/70">#</th>
                  {resultCols.map((c) => (
                    <th key={c.key} className="text-left font-normal px-3 py-1.5 text-foreground whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/30"
                    style={{
                      animation: `rowIn 420ms ${EASE_OUT} both`,
                      animationDelay: `${i * 22}ms`,
                    }}
                  >
                    <td className="px-2 py-1 text-muted-foreground tabular-nums">{i + 1}</td>
                    {resultCols.map((c) => (
                      <td key={c.key} className="px-3 py-1 text-foreground/90 whitespace-nowrap">
                        {r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex items-center justify-center text-[11px] font-mono text-muted-foreground/60">
              {running ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: "hsl(var(--neon-cyan))" }}
                  />
                  streaming rows…
                </span>
              ) : (
                "No results yet — run a query"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Lightweight SQL syntax highlighter for the fake editor. */
function SqlLine({ text }: { text: string }) {
  if (!text) return <span>&nbsp;</span>;
  const KEYWORDS = /\b(SELECT|FROM|WHERE|LIMIT|AND|OR|ORDER BY|GROUP BY|JOIN|LEFT|INNER|ON|AS|DESC|ASC|INSERT|UPDATE|DELETE|INTO|VALUES|SET)\b/g;
  // Split into segments while preserving matches
  const parts: { type: "kw" | "str" | "num" | "plain"; value: string }[] = [];
  const regex = /(\b(?:SELECT|FROM|WHERE|LIMIT|AND|OR|JOIN|LEFT|INNER|ON|AS|DESC|ASC|INSERT|UPDATE|DELETE|INTO|VALUES|SET)\b)|('[^']*')|(\b\d+\b)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "plain", value: text.slice(last, m.index) });
    if (m[1]) parts.push({ type: "kw", value: m[1] });
    else if (m[2]) parts.push({ type: "str", value: m[2] });
    else if (m[3]) parts.push({ type: "num", value: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "plain", value: text.slice(last) });
  void KEYWORDS;

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "kw")
          return (
            <span key={i} style={{ color: "hsl(var(--neon-cyan))" }}>
              {p.value}
            </span>
          );
        if (p.type === "str")
          return (
            <span key={i} style={{ color: "hsl(38 92% 62%)" }}>
              {p.value}
            </span>
          );
        if (p.type === "num")
          return (
            <span key={i} style={{ color: "hsl(285 70% 70%)" }}>
              {p.value}
            </span>
          );
        return (
          <span key={i} style={{ color: "hsl(0 0% 82%)" }}>
            {p.value}
          </span>
        );
      })}
    </>
  );
}


function FakeCursor({
  cursor,
}: {
  cursor: { x: number; y: number; visible: boolean; click: number; label: string };
}) {
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    setPulseKey((k) => k + 1);
  }, [cursor.click]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-40"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
        opacity: cursor.visible ? 1 : 0,
        transition: "opacity 240ms ease",
        willChange: "transform, opacity",
      }}
    >
      <span
        key={pulseKey}
        className="absolute -left-1 -top-1 block h-6 w-6 rounded-full"
        style={{
          border: "1.5px solid hsl(var(--neon-cyan))",
          animation: "fakeCursorPing 600ms ease-out",
          opacity: 0,
        }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        style={{ filter: "drop-shadow(0 0 6px hsl(var(--neon-cyan) / 0.6))" }}
      >
        <path
          d="M5 3 L19 12 L12 13 L9 20 Z"
          fill="hsl(0 0% 98%)"
          stroke="hsl(240 12% 6%)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      {cursor.label && (
        <span
          className="absolute left-5 top-4 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 border"
          style={{
            background: "hsl(240 12% 6% / 0.92)",
            borderColor: "hsl(var(--neon-cyan) / 0.5)",
            color: "hsl(var(--neon-cyan))",
            boxShadow: "0 0 12px hsl(var(--neon-cyan) / 0.25)",
          }}
        >
          {cursor.label}
        </span>
      )}
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Keycap overlay — animates keyboard shortcuts during demo steps             */
/* ────────────────────────────────────────────────────────────────────────── */

function KeycapOverlay({
  keycap,
}: {
  keycap: { key: string; label?: string; token: number } | null;
}) {
  const [visible, setVisible] = useState<typeof keycap>(null);
  useEffect(() => {
    if (!keycap) return;
    setVisible(keycap);
    const t = setTimeout(() => setVisible(null), 900);
    return () => clearTimeout(t);
  }, [keycap?.token]);

  if (!visible) return null;

  const isClick = visible.key === "click" || visible.key === "RMB";
  const label = visible.label ?? (isClick ? (visible.key === "RMB" ? "Right-click" : "Click") : undefined);

  return (
    <div
      aria-hidden
      key={visible.token}
      className="pointer-events-none absolute z-50 left-1/2 top-4 flex items-center gap-2"
      style={{
        animation: "keycapPop 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        transform: "translate(-50%, 0)",
      }}
    >
      <div
        className="inline-flex items-center justify-center min-w-[32px] h-9 px-2.5 font-mono text-[13px] font-semibold border"
        style={{
          borderColor: "hsl(var(--neon-cyan) / 0.35)",
          background: "hsl(240 12% 6% / 0.95)",
          color: "hsl(var(--neon-cyan) / 0.95)",
          boxShadow:
            "inset 0 -2px 0 hsl(var(--neon-cyan) / 0.2), 0 0 0 1px hsl(var(--neon-cyan) / 0.15), 0 0 10px hsl(var(--neon-cyan) / 0.18)",
          textShadow: "0 0 3px hsl(var(--neon-cyan) / 0.35)",
        }}
      >
        {isClick ? (
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "hsl(var(--neon-cyan))",
                boxShadow: "0 0 8px hsl(var(--neon-cyan))",
              }}
            />
            <span className="text-[10px] uppercase tracking-[0.14em]">{visible.key === "RMB" ? "RMB" : "LMB"}</span>
          </span>
        ) : (
          visible.key
        )}
      </div>
      {label && (
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 border"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(240 12% 6% / 0.85)",
            color: "hsl(0 0% 82%)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Downloads section                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const PLATFORMS = [
  { id: "mac-arm",  os: "macOS",   sub: "Apple Silicon", ext: ".dmg",      url: "https://github.com/remcostoeten/dora/releases/latest" },
  { id: "mac-x64",  os: "macOS",   sub: "Intel",         ext: ".dmg",      url: "https://github.com/remcostoeten/dora/releases/latest" },
  { id: "win",      os: "Windows", sub: "x64",           ext: ".msi",      url: "https://github.com/remcostoeten/dora/releases/latest" },
  { id: "deb",      os: "Linux",   sub: "Debian / Ubuntu", ext: ".deb",    url: "https://github.com/remcostoeten/dora/releases/latest/download/Dora_0.0.103_amd64.deb" },
  { id: "rpm",      os: "Linux",   sub: "Fedora / RHEL", ext: ".rpm",      url: "https://github.com/remcostoeten/dora/releases/latest/download/Dora-0.0.103-1.x86_64.rpm" },
  { id: "appimage", os: "Linux",   sub: "AppImage",      ext: ".AppImage", url: "https://github.com/remcostoeten/dora/releases/latest/download/Dora_0.0.103_amd64.AppImage" },
];

const INSTALL_TABS = [
  { id: "snap",    label: "Snap",      cmd: "sudo snap install dora" },
  { id: "brew",    label: "Homebrew",  cmd: "brew install --cask remcostoeten/dora/dora" },
  { id: "winget",  label: "Winget",    cmd: "winget install remcostoeten.dora" },
  { id: "deb",     label: "apt",       cmd: "wget https://github.com/remcostoeten/dora/releases/latest/download/Dora_0.0.103_amd64.deb\nsudo apt install ./Dora_0.0.103_amd64.deb" },
];

function detectOS(): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || "";
  const isMac = /Mac/i.test(platform) || /Mac OS X/i.test(ua);
  const isWin = /Win/i.test(platform) || /Windows/i.test(ua);
  const isLinux = /Linux/i.test(platform) && !/Android/i.test(ua);
  if (isMac) {
    const isArm =
      (navigator as any).userAgentData?.architecture === "arm" ||
      navigator.maxTouchPoints > 1 ||
      /Apple M[1-9]/i.test(ua);
    return isArm ? "mac-arm" : "mac-x64";
  }
  if (isWin) return "win";
  if (isLinux) return "deb";
  return null;
}

function DownloadsSection() {
  const [tab, setTab] = useState(INSTALL_TABS[0].id);
  const [copied, setCopied] = useState(false);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);
  const active = INSTALL_TABS.find((t) => t.id === tab)!;

  useEffect(() => {
    setRecommendedId(detectOS());
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section id="download" className="relative z-10 pt-24 pb-24 px-6 overflow-hidden">
      <MainframeBackdrop beam={false} intensity={0.5} />
      <div className="mx-auto max-w-[1200px] relative">
        <p className="font-pixel text-[12px] uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(var(--neon-cyan))" }}>Download</p>
        <h2 className="font-pixel text-[clamp(1.8rem,3vw,2.5rem)] font-[400] tracking-[-0.01em] text-foreground max-w-[680px] leading-[1.15]">
          Native everywhere.<br /><span className="neon-text-cyan">~10 MB. No Electron.</span>
        </h2>
        <p className="mt-4 text-[14px] text-muted-foreground max-w-[520px] font-mono">
          $ Built with Tauri. A real desktop app for macOS, Windows, and Linux.
        </p>

        {/* Platform grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 border border-border">
          {PLATFORMS.map((p, i) => {
            const borderClasses = `${i % 3 !== 2 ? "md:border-r" : ""} ${
              i % 2 === 0 ? "border-r" : ""
            } ${i >= 2 ? "border-t" : ""} border-border`;
            return (
              <PlatformCard
                key={p.id}
                platform={p}
                index={i}
                isRecommended={p.id === recommendedId}
                borderClasses={borderClasses}
              />
            );
          })}
        </div>

        {/* Install via package manager */}
        <InstallPane tab={tab} setTab={setTab} active={active} copied={copied} copy={copy} />


        {/* Supported DBs */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {[
            { name: "PostgreSQL", note: "LISTEN/NOTIFY · SSH tunnel" },
            { name: "MySQL",      note: "Pooling · live polling" },
            { name: "SQLite",     note: "Native file picker" },
            { name: "LibSQL · Turso", note: "Local & remote" },
          ].map((db, i) => (
            <SupportedDbCard key={db.name} name={db.name} note={db.note} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Command palette (⌘K)                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const CMD_ITEMS = [
  { icon: TableIcon, label: "Browse tables",         hint: "G T" },
  { icon: Code,      label: "Open SQL editor",       hint: "G E" },
  { icon: Filter,    label: "Add filter",            hint: "F" },
  { icon: Download,  label: "Download Dora",         hint: "↵" },
  { icon: Database,  label: "New connection",        hint: "⌘ N" },
  { icon: Terminal,  label: "Open Docker container", hint: "⌘ D" },
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const items = CMD_ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4 bg-background/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] border border-border bg-card shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-200"
      >
        <div className="flex items-center gap-2 px-3 h-11 border-b border-border">
          <Command className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[340px] overflow-y-auto py-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.label}>
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-foreground/90 hover:bg-foreground/[0.06] transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1 text-left">{it.label}</span>
                  <kbd className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">{it.hint}</kbd>
                </button>
              </li>
            );
          })}
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-[12px] text-muted-foreground">No matches.</li>
          )}
        </ul>
        <div className="flex items-center justify-between px-3 h-8 border-t border-border text-[10px] font-mono text-muted-foreground">
          <span>↑↓ navigate · ↵ select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Hero text — staggered scroll-in (badge, headline, paragraph, buttons)      */
/* ────────────────────────────────────────────────────────────────────────── */

function HeroText() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const enter = (delay: number, y = 14) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
    transition: `opacity 520ms ${EASE_OUT} ${delay}ms, transform 560ms ${EASE_OUT} ${delay}ms`,
    willChange: "transform, opacity",
  });

  return (
    <div ref={ref} className="relative z-[3] min-w-0 max-w-[560px]">
      <div
        className="font-pixel inline-flex items-center gap-2 px-2.5 py-1 border text-[11px] uppercase tracking-[0.16em] mb-6"
        style={{
          ...enter(0, 8),
          borderColor: "hsl(var(--neon-cyan) / 0.4)",
          color: "hsl(var(--neon-cyan))",
          background: "hsl(var(--neon-cyan) / 0.06)",
          boxShadow: "0 0 18px hsl(var(--neon-cyan) / 0.15)",
        }}
      >
        <Zap className="h-3 w-3" />
        v0.8 · overclocked beta
      </div>
      <h1
        className="font-pixel text-[clamp(2.2rem,4.6vw,3.6rem)] font-[400] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[560px]"
        style={enter(90)}
      >
        The database<br />
        <span style={{ animation: "neonFlicker 7s ease-in-out infinite" }} className="neon-text-cyan">
          explorah.
        </span>
      </h1>
      <p
        className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-[460px] font-mono"
        style={enter(200)}
      >
        Dora is a native, keyboard-first SQL workbench for developers who think in tables. Browse millions of rows, edit live, ship faster.
      </p>
      <div className="mt-10 flex items-center gap-4 flex-wrap" style={enter(310)}>
        <Link to={DEMO_PATH}>
          <button
            className="group relative inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium transition-all duration-200 hover:gap-3 active:scale-[0.97]"
            style={{
              background: "hsl(var(--neon-cyan))",
              color: "hsl(240 12% 6%)",
              boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.4), 0 0 24px hsl(var(--neon-cyan) / 0.5), 0 0 56px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            Boot the demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </Link>
        <a
          href="#download"
          className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-mono uppercase tracking-[0.14em] border transition-colors hover:bg-foreground/[0.04]"
          style={{ borderColor: "hsl(var(--neon-magenta) / 0.4)", color: "hsl(var(--neon-magenta))" }}
        >
          <Download className="h-3.5 w-3.5" />
          Download .dmg
        </a>
      </div>

      {/* Tech stack chips */}
      <div className="mt-8 flex items-center gap-2 flex-wrap font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground" style={enter(420)}>
        <span>$ supports</span>
        {["postgres", "mysql", "sqlite", "libsql"].map((db) => (
          <span
            key={db}
            className="px-2 py-1 border border-border text-foreground/80 hover:border-foreground/40 transition-colors"
          >
            {db}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Preview window — rises and scales in from below                            */
/* ────────────────────────────────────────────────────────────────────────── */

function PreviewWindow() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  return (
    <div id="preview" ref={ref} className="relative" style={{ overflow: "visible" }}>
      <div
        className="relative z-10 rounded-t-xl border border-b-0 border-border bg-card overflow-hidden shadow-2xl"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? "translate3d(0,0,0) scale(1)"
            : "translate3d(0,40px,0) scale(0.97)",
          transition: `opacity 700ms ${EASE_OUT} 140ms, transform 800ms ${EASE_IOS} 140ms`,
          willChange: "transform, opacity",
        }}
      >
        <DoraMockUI autoplay={inView} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Install pane — animated tab indicator, typewriter, spring check            */
/* ────────────────────────────────────────────────────────────────────────── */

function InstallPane({
  tab,
  setTab,
  active,
  copied,
  copy,
}: {
  tab: string;
  setTab: (id: string) => void;
  active: { id: string; label: string; cmd: string };
  copied: boolean;
  copy: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Measure active tab for sliding underline
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLButtonElement>(`[data-tab-id="${tab}"]`);
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [tab]);

  // Typewriter effect on active.cmd — restarts when tab changes or pane enters view
  const [typed, setTyped] = useState("");
  const [caret, setCaret] = useState(true);
  useEffect(() => {
    if (!inView) return;
    setTyped("");
    let i = 0;
    const target = active.cmd;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [active.cmd, inView]);

  useEffect(() => {
    const id = window.setInterval(() => setCaret((v) => !v), 540);
    return () => window.clearInterval(id);
  }, []);

  // Tab slide-in stagger
  const tabEnter = (i: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : "translate3d(-10px,0,0)",
    transition: `opacity 320ms ${EASE_OUT} ${i * 70}ms, transform 360ms ${EASE_OUT} ${i * 70}ms`,
  });

  return (
    <div
      ref={ref}
      className="mt-8 border border-border bg-card/30"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
        transition: `opacity 520ms ${EASE_OUT}, transform 560ms ${EASE_OUT}`,
      }}
    >
      <div ref={tabsRef} className="relative flex items-center gap-1 px-2 border-b border-border bg-background/40">
        {INSTALL_TABS.map((t, i) => (
          <button
            key={t.id}
            data-tab-id={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 h-9 text-[12px] font-mono transition-colors ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={tabEnter(i)}
          >
            {t.label}
          </button>
        ))}

        {/* Sliding underline indicator */}
        <span
          aria-hidden
          className="absolute bottom-[-1px] h-px bg-foreground"
          style={{
            left: indicator.left + 8,
            width: Math.max(0, indicator.width - 16),
            opacity: inView && indicator.width > 0 ? 1 : 0,
            transition: `left 320ms ${EASE_IOS}, width 320ms ${EASE_IOS}, opacity 200ms ${EASE_OUT}`,
            willChange: "left, width",
          }}
        />

        <button
          onClick={copy}
          className="relative ml-auto inline-flex items-center gap-1.5 h-7 px-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors active:scale-[0.96]"
          style={{ transition: `color 200ms ${EASE_OUT}, transform 120ms ${EASE_OUT}` }}
        >
          <span className="relative inline-flex h-3 w-3 items-center justify-center">
            <Copy
              className="absolute h-3 w-3"
              style={{
                opacity: copied ? 0 : 1,
                transform: copied ? "scale(0.6)" : "scale(1)",
                transition: `opacity 160ms ${EASE_OUT}, transform 200ms ${EASE_OUT}`,
              }}
            />
            <Check
              key={copied ? "on" : "off"}
              className="absolute h-3 w-3 text-success"
              style={{
                opacity: copied ? 1 : 0,
                animation: copied ? `checkPop 360ms ${EASE_IOS} forwards` : undefined,
                willChange: "transform, opacity",
              }}
            />
          </span>
          <span
            key={copied ? "copied" : "copy"}
            style={{ animation: `featureChipSwap 220ms ${EASE_OUT}` }}
          >
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>

      <pre className="px-4 py-4 text-[12px] font-mono text-foreground/90 leading-relaxed overflow-x-auto whitespace-pre">
        <span className="text-muted-foreground"># Install Dora</span>
        {"\n"}
        <span>{typed}</span>
        <span
          className="inline-block w-[7px] h-[1.05em] align-[-2px] ml-0.5 bg-foreground/80"
          style={{
            opacity: typed.length < active.cmd.length || caret ? 1 : 0,
            transition: `opacity 80ms ${EASE_OUT}`,
          }}
        />
      </pre>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CTA section — animated diagonal pattern background                         */
/* ────────────────────────────────────────────────────────────────────────── */

function CtaSection({ isDark }: { isDark: boolean }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.25 });
  const lineColor = isDark ? "rgba(180,180,200,0.18)" : "rgba(40,40,60,0.18)";
  const lineColorStrong = isDark ? "rgba(200,200,220,0.32)" : "rgba(40,40,60,0.30)";

  const enter = (delay: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
    transition: `opacity 540ms ${EASE_OUT} ${delay}ms, transform 580ms ${EASE_OUT} ${delay}ms`,
  });

  return (
    <section id="cta" ref={ref as React.RefObject<HTMLElement>} className="relative z-10 pt-32 pb-40 px-6 overflow-hidden">
      {/* Layer 1 — drifting diagonal lines */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent 14px)`,
          backgroundSize: "56px 56px",
          animation: inView ? `patternDrift 18s linear infinite` : undefined,
          opacity: inView ? 1 : 0,
          transition: `opacity 800ms ${EASE_OUT}`,
          willChange: "background-position",
        }}
      />
      {/* Layer 2 — counter-drifting denser lines, breathing opacity */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${lineColorStrong} 0px, ${lineColorStrong} 1px, transparent 1px, transparent 28px)`,
          backgroundSize: "56px 56px",
          animation: inView
            ? `patternDrift 26s linear infinite reverse, patternPulse 6s ease-in-out infinite`
            : undefined,
          opacity: inView ? 0.5 : 0,
          transition: `opacity 800ms ${EASE_OUT} 120ms`,
          willChange: "background-position, opacity",
        }}
      />
      {/* Radial vignette to focus the center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 80%)"
            : "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 80%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] text-center relative">
        <h2
          className="font-pixel text-[clamp(2rem,4vw,3.4rem)] font-[400] tracking-[-0.01em] text-foreground leading-[1.08] mx-auto max-w-[680px]"
          style={enter(0)}
        >
          Stop fighting your database UI.<br />
          <span className="neon-text-cyan">Start exploring.</span>
        </h2>
        <p
          className="mt-5 text-[15px] text-muted-foreground max-w-[460px] mx-auto font-mono"
          style={enter(120)}
        >
          $ Free to start. No credit card. Connect in under 60 seconds.
        </p>
        <div className="mt-10 flex justify-center" style={enter(220)}>
          <Link to={DEMO_PATH}>
            <button
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 text-[15px] font-medium transition-all duration-200 hover:gap-3.5 active:scale-[0.97]"
              style={{
                background: "hsl(var(--neon-cyan))",
                color: "hsl(240 12% 6%)",
                boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.4), 0 0 32px hsl(var(--neon-cyan) / 0.5), 0 0 80px hsl(var(--neon-cyan) / 0.3)",
              }}
            >
              Engage demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Landing;

