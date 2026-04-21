import { ArrowUpRight, Download } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "@/hooks/use-in-view";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IOS = "cubic-bezier(0.32, 0.72, 0, 1)";

export type Platform = {
  id: string;
  os: string;
  sub: string;
  ext: string;
  url: string;
};

type Props = {
  platform: Platform;
  index: number;
  isRecommended: boolean;
  borderClasses: string;
};

/**
 * PlatformCard — chique micro-interactions:
 *  • Staggered scroll-in entry (transform/opacity only)
 *  • Cursor-tracked spotlight glow (radial gradient via CSS vars)
 *  • Spring-eased magnetic arrow that smoothly chases the cursor (rAF)
 *  • "FOR YOU" badge anchored to the top-left so it never collides w/ arrow
 *  • Subtle bottom shimmer line on hover (transform-only)
 */
export function PlatformCard({ platform, index, isRecommended, borderClasses }: Props) {
  const [ref, inView] = useInView<HTMLAnchorElement>({ threshold: 0.25 });
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const arrowWrapRef = useRef<HTMLSpanElement>(null);

  // Spring state for arrow (refs avoid React re-renders during pointer move)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const enterDelay = index * 70;

  // Combine refs
  const setRefs = (el: HTMLAnchorElement | null) => {
    cardRef.current = el;
    (ref as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
  };

  // Spring loop (lerp toward target — gives a natural "weighted" pull)
  useEffect(() => {
    const tick = () => {
      const k = 0.18; // stiffness
      current.current.x += (target.current.x - current.current.x) * k;
      current.current.y += (target.current.y - current.current.y) * k;
      const arrow = arrowWrapRef.current;
      if (arrow) {
        arrow.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
      }
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    };
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const ensureLoop = () => {
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(function loop() {
        const k = 0.18;
        current.current.x += (target.current.x - current.current.x) * k;
        current.current.y += (target.current.y - current.current.y) * k;
        const arrow = arrowWrapRef.current;
        if (arrow) {
          arrow.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
        }
        const dx = target.current.x - current.current.x;
        const dy = target.current.y - current.current.y;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          rafId.current = requestAnimationFrame(loop);
        } else {
          rafId.current = null;
        }
      });
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - card.left;
    const my = e.clientY - card.top;

    // Spotlight position (CSS vars for radial gradient)
    e.currentTarget.style.setProperty("--mx", `${mx}px`);
    e.currentTarget.style.setProperty("--my", `${my}px`);

    // Magnetic pull: relative to the card center, clamped & gentle
    const cx = card.width - 28; // arrow nominal x (top-right area)
    const cy = 28;
    const dx = mx - cx;
    const dy = my - cy;
    const max = 7;
    target.current.x = Math.max(-max, Math.min(max, dx * 0.14));
    target.current.y = Math.max(-max, Math.min(max, dy * 0.14));
    ensureLoop();
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => {
    setHovered(false);
    target.current.x = 0;
    target.current.y = 0;
    ensureLoop();
  };

  const cardStyle: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : "translate3d(0,18px,0)",
    transition: `opacity 460ms ${EASE_OUT} ${enterDelay}ms, transform 520ms ${EASE_OUT} ${enterDelay}ms, background-color 240ms ${EASE_OUT}`,
    willChange: "transform, opacity",
    // Cursor spotlight — uses HSL tokens so it adapts to theme
    backgroundImage: hovered
      ? `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--foreground) / 0.06), transparent 60%)`
      : undefined,
  };

  return (
    <a
      ref={setRefs}
      href={platform.url}
      target="_blank"
      rel="noreferrer noopener"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`group relative overflow-hidden p-5 pr-6 flex items-start justify-between ${
        isRecommended ? "bg-foreground/[0.04] hover:bg-foreground/[0.07]" : "hover:bg-card/40"
      } ${borderClasses}`}
      style={cardStyle}
    >
      {/* Recommended chip — anchored top-left so it never overlaps the arrow */}
      {isRecommended && (
        <span className="font-pixel absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-background bg-foreground z-10">
          <span className="h-1 w-1 bg-background animate-pulse" />
          For you
        </span>
      )}

      {/* Hover bottom shimmer line (transform-only) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: `transform 520ms ${EASE_OUT}`,
        }}
      />

      <div className={isRecommended ? "mt-5" : ""}>
        <div className="font-pixel text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {platform.os}
        </div>
        <div
          className="mt-1 text-[14px] font-medium text-foreground"
          style={{
            transform: hovered ? "translate3d(2px,0,0)" : "translate3d(0,0,0)",
            transition: `transform 380ms ${EASE_IOS}`,
          }}
        >
          {platform.sub}
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
          <Download
            className="h-3 w-3"
            style={{
              transform: hovered ? "translate3d(0,1px,0)" : "translate3d(0,0,0)",
              transition: `transform 420ms ${EASE_IOS}`,
            }}
          />
          {platform.ext}
        </div>
      </div>

      {/* Arrow: outer wrap = magnetic translate (rAF spring), inner = hover slide */}
      <span
        ref={arrowWrapRef}
        className="relative inline-flex h-5 w-5 items-center justify-center"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        <span
          className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground group-hover:text-foreground"
          style={{
            transform: hovered ? "translate3d(2px,-2px,0)" : "translate3d(0,0,0)",
            transition: `transform 420ms ${EASE_IOS}, color 200ms ${EASE_OUT}`,
          }}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </span>
    </a>
  );
}
