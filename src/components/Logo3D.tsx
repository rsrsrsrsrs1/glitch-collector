import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

// Default dark colors — can be overridden via props
const DEFAULT_BG_HEX = "#0e0e10";
const DEFAULT_LINE_HEX = "#58585e";
const LINE_WIDTH = 1.2;

// Module-level color refs so inner components can read them
let activeBgHex = DEFAULT_BG_HEX;
let activeLineHex = DEFAULT_LINE_HEX;
let activeStripeOpacityBase = 0.35;

// SQL-ish glyphs to scatter across faces — keeps things abstract but database-y
type Glyph =
  | "SELECT"
  | "JOIN"
  | "WHERE"
  | "FROM"
  | "*"
  | ";"
  | "table"
  | "rows"
  | "key";

// Generate a horizontal-line texture via canvas, optionally overlaid with a SQL glyph
function makeStripeTexture(opacity = 0.35, glyph?: Glyph) {
  const size = 256; // higher res so text reads cleanly
  const lineSpacing = 14;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const isDefault = activeLineHex === DEFAULT_LINE_HEX;
  const lineRgb = isDefault ? "88, 88, 94" : "120, 120, 130";
  ctx.strokeStyle = `rgba(${lineRgb}, ${opacity})`;
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }

  // Glyph overlay — abstract SQL/table marks
  if (glyph) {
    const glyphAlpha = Math.min(1, opacity * 2.4 + 0.15);
    ctx.fillStyle = `rgba(${lineRgb}, ${glyphAlpha})`;
    ctx.strokeStyle = `rgba(${lineRgb}, ${glyphAlpha})`;
    ctx.lineWidth = 2;

    if (glyph === "table" || glyph === "rows") {
      // Mini table grid
      const cols = 3;
      const rows = glyph === "rows" ? 5 : 4;
      const pad = 48;
      const w = size - pad * 2;
      const h = size - pad * 2;
      const cw = w / cols;
      const rh = h / rows;
      ctx.strokeRect(pad, pad, w, h);
      // header fill
      ctx.fillStyle = `rgba(${lineRgb}, ${glyphAlpha * 0.55})`;
      ctx.fillRect(pad, pad, w, rh);
      ctx.fillStyle = `rgba(${lineRgb}, ${glyphAlpha})`;
      for (let c = 1; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(pad + c * cw, pad);
        ctx.lineTo(pad + c * cw, pad + h);
        ctx.stroke();
      }
      for (let r = 1; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(pad, pad + r * rh);
        ctx.lineTo(pad + w, pad + r * rh);
        ctx.stroke();
      }
    } else if (glyph === "key") {
      // Primary-key style: circle + shaft + teeth
      const cx = size * 0.38;
      const cy = size * 0.5;
      const r = 28;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + r, cy);
      ctx.lineTo(size - 40, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size - 70, cy);
      ctx.lineTo(size - 70, cy + 18);
      ctx.moveTo(size - 50, cy);
      ctx.lineTo(size - 50, cy + 12);
      ctx.stroke();
    } else {
      // Text glyphs: SELECT / JOIN / WHERE / FROM / * / ;
      const isSymbol = glyph === "*" || glyph === ";";
      ctx.font = `${isSymbol ? 700 : 600} ${isSymbol ? 140 : 44}px ui-monospace, "SF Mono", Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(glyph, size / 2, size / 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function useStripeMaterial(opacity = 0.35) {
  const texture = useMemo(() => makeStripeTexture(opacity), [opacity]);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    [texture]
  );
  return mat;
}

// Shared slow rotation
function SlowSpin({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.3;
  });
  return <group ref={ref}>{children}</group>;
}

// Helper: a face mesh that uses canvas-based stripes (optionally with a SQL glyph)
function StripeFace({
  position,
  rotation,
  args,
  opacity = 0.35,
  glyph,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  args?: [number, number];
  opacity?: number;
  glyph?: Glyph;
}) {
  const texture = useMemo(() => makeStripeTexture(opacity, glyph), [opacity, glyph]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args || [1.3, 1.3]} />
      <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} depthWrite={false} />
    </mesh>
  );
}

// Box with stripes on all 6 faces, optionally with per-face SQL glyphs
function StripedBox({
  width = 1.3,
  height = 1.3,
  depth = 1.3,
  opacity = 0.25,
  glyphs,
}: {
  width?: number;
  height?: number;
  depth?: number;
  opacity?: number;
  glyphs?: (Glyph | undefined)[];
}) {
  const hx = width / 2 + 0.01;
  const hy = height / 2 + 0.01;
  const hz = depth / 2 + 0.01;
  const faces: { pos: [number, number, number]; rot: [number, number, number]; args: [number, number] }[] = [
    { pos: [0, 0, hz], rot: [0, 0, 0], args: [width, height] },
    { pos: [0, 0, -hz], rot: [0, Math.PI, 0], args: [width, height] },
    { pos: [hx, 0, 0], rot: [0, Math.PI / 2, 0], args: [depth, height] },
    { pos: [-hx, 0, 0], rot: [0, -Math.PI / 2, 0], args: [depth, height] },
    { pos: [0, hy, 0], rot: [-Math.PI / 2, 0, 0], args: [width, depth] },
    { pos: [0, -hy, 0], rot: [Math.PI / 2, 0, 0], args: [width, depth] },
  ];
  return (
    <>
      {faces.map((f, i) => (
        <StripeFace
          key={i}
          position={f.pos}
          rotation={f.rot}
          args={f.args}
          opacity={opacity}
          glyph={glyphs?.[i]}
        />
      ))}
    </>
  );
}

// 1. Single cube with SQL/database glyphs etched into each face
function CubeHighlight() {
  // faces order: front, back, right, left, top, bottom
  const glyphs: (Glyph | undefined)[] = ["SELECT", "table", "JOIN", "key", "*", "WHERE"];
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial transparent opacity={0} />
          <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
        </mesh>
        <StripedBox width={1.3} height={1.3} depth={1.3} opacity={0.3} glyphs={glyphs} />
      </group>
    </SlowSpin>
  );
}

// 2. Three stacked offset cubes (priority tiers)
function StackedCubes() {
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        {[0.5, 0, -0.5].map((y, i) => (
          <group key={i} position={[i * 0.12, y, -i * 0.12]}>
            <mesh>
              <boxGeometry args={[0.7, 0.35, 0.7]} />
              <meshBasicMaterial color={activeBgHex} toneMapped={false} />
              <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
            </mesh>
            <StripedBox width={0.7} height={0.35} depth={0.7} opacity={0.2} />
          </group>
        ))}
      </group>
    </SlowSpin>
  );
}

// 3. Triangular prism
function Prism() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const s = 0.75;
    shape.moveTo(0, s);
    shape.lineTo(-s * 0.866, -s * 0.5);
    shape.lineTo(s * 0.866, -s * 0.5);
    shape.closePath();
    const extrudeSettings = { depth: 0.8, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const mat = useStripeMaterial(0.25);

  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        <mesh geometry={geometry} position={[0, 0, -0.4]} material={mat} />
        <mesh geometry={geometry} position={[0, 0, -0.4]}>
          <meshBasicMaterial transparent opacity={0} />
          <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
        </mesh>
      </group>
    </SlowSpin>
  );
}

// 4. Open cube with inner diagonal plane
function OpenCube() {
  const diagMat = useStripeMaterial(0.15);
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial transparent opacity={0} />
          <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
        </mesh>
        <StripedBox width={1.3} height={1.3} depth={1.3} opacity={0.2} />
        <mesh rotation={[0, Math.PI * 0.25, 0]} material={diagMat}>
          <planeGeometry args={[1.8, 1.3]} />
        </mesh>
      </group>
    </SlowSpin>
  );
}

// 5. Three converging planes
function ConvergingPlanes() {
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.1, Math.PI * 0.2, 0]}>
        {[0, 1, 2].map((i) => (
          <StripeFace
            key={i}
            rotation={[0, (Math.PI * 2 * i) / 3, 0]}
            position={[
              Math.sin((Math.PI * 2 * i) / 3) * 0.15,
              0,
              Math.cos((Math.PI * 2 * i) / 3) * 0.15,
            ]}
            args={[1, 1.3]}
            opacity={i === 0 ? 0.35 : i === 1 ? 0.2 : 0.1}
          />
        ))}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.5} />
        </mesh>
      </group>
    </SlowSpin>
  );
}

const LOGOS = [
  { name: "Cube", component: CubeHighlight },
  { name: "Stacked", component: StackedCubes },
  { name: "Prism", component: Prism },
  { name: "Open Cube", component: OpenCube },
  { name: "Planes", component: ConvergingPlanes },
];

function CameraZoomController({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = zoom;
    ortho.updateProjectionMatrix();
  }, [camera, zoom]);

  return null;
}

export { LOGOS };

export function Logo3D({ variant = 0, size = 28, zoom: zoomOverride, bgHex, lineHex }: { variant?: number; size?: number; zoom?: number; bgHex?: string; lineHex?: string }) {
  const LogoComponent = LOGOS[variant]?.component || CubeHighlight;

  // Update module-level colors so inner components pick them up
  activeBgHex = bgHex || DEFAULT_BG_HEX;
  activeLineHex = lineHex || DEFAULT_LINE_HEX;

  const zoom = zoomOverride ?? size * (200 / 28);

  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <Canvas
        flat
        orthographic
        dpr={[2, 3]}
        camera={{ position: [0, 0, 4], zoom: zoom }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraZoomController zoom={zoom} />
        <LogoComponent />
      </Canvas>
    </div>
  );
}
