import { useEffect, useState } from "react";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

export type TocItem = {
  id: string;
  label: string;
};

type Props = {
  items: TocItem[];
};

/**
 * TableOfContents — sticky right-rail nav that highlights the active section
 * as the user scrolls. Uses IntersectionObserver and animates the active
 * indicator with transform/opacity only.
 */
export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Soft mount-in
    const t = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // Pick the most-visible section
        let best: { id: string; ratio: number } | null = null;
        for (const [id, ratio] of visible) {
          if (!best || ratio > best.ratio) best = { id, ratio };
        }
        if (best) setActiveId(best.id);
      },
      {
        // Trigger near the top third of the viewport
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const els: Element[] = [];
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) {
        obs.observe(el);
        els.push(el);
      }
    }
    return () => {
      els.forEach((el) => obs.unobserve(el));
      obs.disconnect();
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update hash without jumping
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Page sections"
      className="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 z-40"
      style={{
        opacity: mounted ? 1 : 0,
        transform: `translate3d(0, -50%, 0) translate3d(${mounted ? 0 : 8}px, 0, 0)`,
        transition: `opacity 360ms ${EASE_OUT}, transform 420ms ${EASE_OUT}`,
        willChange: "transform, opacity",
      }}
    >
      <ul className="flex flex-col gap-1 border-l border-border/60 pl-3">
        {items.map((it) => {
          const isActive = activeId === it.id;
          return (
            <li key={it.id} className="relative">
              {/* Active indicator dash */}
              <span
                aria-hidden="true"
                className="absolute -left-3 top-1/2 h-px bg-foreground"
                style={{
                  width: isActive ? 10 : 4,
                  opacity: isActive ? 1 : 0.25,
                  transform: "translate3d(0,-50%,0)",
                  transition: `width 240ms ${EASE_OUT}, opacity 240ms ${EASE_OUT}`,
                }}
              />
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                className="font-pixel block py-1.5 pl-2 pr-1 text-[10px] uppercase tracking-[0.16em] transition-colors"
                style={{
                  color: isActive
                    ? "hsl(var(--foreground))"
                    : "hsl(var(--muted-foreground))",
                  transition: `color 200ms ${EASE_OUT}, transform 240ms ${EASE_OUT}`,
                  transform: isActive ? "translate3d(2px,0,0)" : "translate3d(0,0,0)",
                }}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
