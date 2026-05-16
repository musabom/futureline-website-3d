/**
 * HeroRibbon3D — reusable signature 3D moment for interior pages.
 *
 * One RibbonWall plane (verbatim shader from DualWalkway) + a small drifting
 * particle field + Bloom. Idle camera (no scroll trigger). Designed to drop
 * into the hero of /services, /courses, /ai, etc. as a brand-aligned visual
 * anchor without the cost of the full DualWalkway pinned canvas.
 *
 * The shader (vertical scrolling data stripes, soft horizontal falloff,
 * 0.8 Hz "breathing" pulse) is identical to the home DualWalkway —
 * preserving the design language per the "do not rewrite the 3D" directive.
 */
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import { Color, InstancedMesh, Matrix4, ShaderMaterial } from 'three';

function Ribbon({ color, tilt = 0.3 }: { color: string; tilt?: number }) {
  const matRef = useRef<ShaderMaterial>(null);
  const colorVec = useMemo(() => new Color(color), [color]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: colorVec } }),
    [colorVec],
  );

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0, 0]} rotation={[0, tilt, 0]}>
      <planeGeometry args={[3.6, 11, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        side={2}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;

          float bands(vec2 uv, float t) {
            float f = sin((uv.y * 80.0) - (t * 0.4 * 80.0));
            return smoothstep(0.6, 1.0, f * 0.5 + 0.5);
          }

          void main() {
            float horiz = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 1.6);
            float vert = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
            float scroll = bands(vUv, uTime);
            float baseGlow = horiz * vert * (0.4 + scroll * 0.6);
            float pulse = 0.85 + 0.15 * sin(uTime * 0.8);
            vec3 col = uColor * baseGlow * pulse * 1.4;
            gl_FragColor = vec4(col, baseGlow * 0.9);
          }
        `}
      />
    </mesh>
  );
}

const PARTICLE_COUNT = 90;
function Particles() {
  const meshRef = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);
  const dots = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; phase: number; speed: number; size: number }> = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 3.8,
        y: (Math.random() - 0.5) * 7,
        z: -Math.random() * 3 + 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.55,
        size: 0.014 + Math.random() * 0.034,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = dots[i];
      const dy = Math.sin(t * d.speed + d.phase) * 0.16;
      const dx = Math.cos(t * d.speed * 0.6 + d.phase) * 0.07;
      matrix.makeScale(d.size, d.size, d.size);
      matrix.setPosition(d.x + dx, d.y + dy, d.z);
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 5]} />
      <meshBasicMaterial color="#cbd5e1" transparent opacity={0.8} toneMapped={false} />
    </instancedMesh>
  );
}

function IdleCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    // Subtle parallax — camera breathes around the ribbon
    camera.position.x = Math.sin(t * 0.18) * 0.18;
    camera.position.y = Math.cos(t * 0.13) * 0.12;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeroRibbon3DProps {
  /** Hex color, defaults to brand-lab teal */
  color?: string;
  /** Plane rotation in radians around Y (default 0.3 — slight tilt) */
  tilt?: number;
  /** Bloom intensity (default 0.7) */
  bloom?: number;
  className?: string;
}

export default function HeroRibbon3D({
  color = '#18A999',
  tilt = 0.3,
  bloom = 0.7,
  className = 'absolute inset-0',
}: HeroRibbon3DProps) {
  // Convert hex → rgba so the CSS-gradient fallback matches the canvas tint
  // even when WebGL is unavailable. Real users with old GPUs / blocked
  // hardware acceleration / low-power mode see a brand-aligned gradient
  // instead of empty space.
  const rgba = (alpha: number) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div aria-hidden="true" className={`${className} pointer-events-none`}>
      {/* CSS-gradient fallback — always rendered behind the canvas. If
          WebGL initialises, the canvas covers it. If WebGL fails, this
          shows through so the right side of the hero is never empty. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 50% 50%, ${rgba(0.22)} 0%, transparent 65%),
            radial-gradient(ellipse 40% 100% at 50% 40%, ${rgba(0.12)} 0%, transparent 70%),
            radial-gradient(ellipse 20% 60% at 50% 50%, ${rgba(0.4)} 0%, transparent 60%),
            #000000
          `,
        }}
      />
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        // If WebGL context creation fails, canvas silently doesn't mount;
        // the fallback gradient behind us stays visible. No crash.
        onCreated={(state) => {
          // Defensive: if the GL context is lost (browser tab backgrounded
          // for a long time, GPU throttled), the fallback still shows.
          state.gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          });
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.05} />
        <IdleCamera />
        <Ribbon color={color} tilt={tilt} />
        <Particles />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloom}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.35} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
