import { type CSSProperties } from "react";

type Props = {
  /** Spacing between dots in px */
  spacing?: number;
  /** Dot size in px */
  dotSize?: number;
  /** Animation duration in seconds (drift speed) */
  duration?: number;
  /** Opacity of the dots (0-1) */
  opacity?: number;
  /** Optional className for sizing/positioning */
  className?: string;
  /** Mask style — radial fades center-out, none shows everything */
  mask?: "radial" | "top" | "bottom" | "none";
};

/**
 * DotGridBackdrop — chique drifting dot pattern.
 *
 * Pure CSS, GPU-friendly: animates background-position only.
 * Uses currentColor so it adapts to theme via the parent's text color.
 * Wrap in a positioned parent and color it with `text-foreground/[0.07]` etc.
 *
 * Inspired by Cloudflare/Vercel marketing pages.
 */
export function DotGridBackdrop({
  spacing = 22,
  dotSize = 1,
  duration = 60,
  opacity = 1,
  className = "",
  mask = "radial",
}: Props) {
  const style: CSSProperties = {
    backgroundImage: `radial-gradient(currentColor ${dotSize}px, transparent ${dotSize}px)`,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundPosition: "0 0",
    animation: `dotDrift ${duration}s linear infinite`,
    opacity,
    WebkitMaskImage:
      mask === "radial"
        ? "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)"
        : mask === "top"
        ? "linear-gradient(to bottom, black 0%, transparent 80%)"
        : mask === "bottom"
        ? "linear-gradient(to top, black 0%, transparent 80%)"
        : undefined,
    maskImage:
      mask === "radial"
        ? "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)"
        : mask === "top"
        ? "linear-gradient(to bottom, black 0%, transparent 80%)"
        : mask === "bottom"
        ? "linear-gradient(to top, black 0%, transparent 80%)"
        : undefined,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={style}
    />
  );
}
