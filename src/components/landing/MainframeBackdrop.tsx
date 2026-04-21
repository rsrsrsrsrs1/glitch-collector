/**
 * MainframeBackdrop — Overclocked Mainframe ambient layer.
 *
 * Composes:
 *  • Gradient mesh (cyan + magenta radial blobs, slow drift)
 *  • Fine grid overlay
 *  • Horizontal scanlines (CRT)
 *  • Single sweeping scan-beam (ambient)
 *  • Subtle vignette
 *
 * GPU-friendly: pure CSS, transform/opacity/background-position only.
 */
type Props = {
  className?: string;
  /** Show the sweeping scan beam */
  beam?: boolean;
  /** Intensity multiplier 0..1 */
  intensity?: number;
};

export function MainframeBackdrop({ className = "", beam = true, intensity = 1 }: Props) {
  const i = Math.max(0, Math.min(1, intensity));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Soft monochrome wash — barely-there light from the top */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 40% at 50% 0%, hsl(0 0% 100% / ${0.05 * i}) 0%, transparent 70%),
            radial-gradient(50% 60% at 50% 100%, hsl(0 0% 100% / ${0.025 * i}) 0%, transparent 70%)
          `,
          filter: "blur(20px)",
          animation: "meshDrift 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 100% / 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 100% / 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 50%, hsl(0 0% 4% / 0.9) 100%)",
        }}
      />
    </div>
  );
}
