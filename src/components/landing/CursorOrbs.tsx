import { useEffect, useRef } from "react";

type Props = { className?: string };

/**
 * CursorOrbs — neon cyan + magenta orbs that drift toward the cursor.
 * rAF-driven lerp, transform-only (GPU-friendly).
 */
export function CursorOrbs({ className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0.5, y: 0.4 });
  const current = useRef({ x: 0.5, y: 0.4 });
  const ambientT = useRef(0);
  const hovering = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const tick = () => {
      if (!hovering.current) {
        ambientT.current += 0.004;
        target.current.x = 0.5 + Math.sin(ambientT.current * 0.7) * 0.22;
        target.current.y = 0.45 + Math.cos(ambientT.current * 0.5) * 0.18;
      }
      const k = 0.045;
      current.current.x += (target.current.x - current.current.x) * k;
      current.current.y += (target.current.y - current.current.y) * k;

      const rect = wrap.getBoundingClientRect();
      const px = current.current.x * rect.width;
      const py = current.current.y * rect.height;

      const a = orbARef.current;
      const b = orbBRef.current;
      if (a) a.style.transform = `translate3d(${px - 320}px, ${py - 320}px, 0)`;
      if (b)
        b.style.transform = `translate3d(${rect.width - px - 260}px, ${
          rect.height - py - 260
        }px, 0)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) {
        hovering.current = false;
        return;
      }
      hovering.current = true;
      target.current.x = Math.max(0, Math.min(1, x));
      target.current.y = Math.max(0, Math.min(1, y));
    };
    const onLeave = () => { hovering.current = false; };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={orbARef}
        className="absolute h-[640px] w-[640px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, hsl(0 0% 100% / 0.05), transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={orbBRef}
        className="absolute h-[520px] w-[520px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, hsl(0 0% 100% / 0.035), transparent 65%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
