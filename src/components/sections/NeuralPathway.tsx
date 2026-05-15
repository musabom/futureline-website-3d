/**
 * NeuralPathway — FL Academy 3D learning network.
 *
 * A scroll-driven neural network in WebGL. 4 topic nodes (course tracks)
 * are positioned around a central hub, connected by glowing synapses
 * with flowing particles. As the user scrolls through the pinned
 * section, the camera orbits to focus on each topic in turn — and that
 * topic's HTML card appears with its course detail.
 *
 * The whole section is amber-dominant (#F5A623, FL Academy pole) to
 * contrast with the teal Lab corridor (DualWalkway). Click any topic
 * node → that course's detail page.
 */
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Shield,
  Cloud,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Vector3,
} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ACADEMY = '#F5A623';
const ACADEMY_LIGHT = '#FFB84D';
const ACADEMY_RGB = [245 / 255, 166 / 255, 35 / 255] as const;

// ── Network data ───────────────────────────────────────────────────────
type TopicData = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  position: [number, number, number];
  // cardSide drives the zig-zag layout: card on this side, highlights
  // on the opposite. Card is anchored on the OPPOSITE side from where
  // the 3D node sits, so the user's eye flows card → 3D node → highlights.
  cardSide: 'left' | 'right';
  highlights: {
    stat: { value: string; label: string };
    bullets: string[];
  };
};

const TOPICS: TopicData[] = [
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    description:
      'From neural-network foundations to production models. Learn how to think with AI — and ship it.',
    href: '/courses/ai-fundamentals-machine-learning',
    icon: Brain,
    position: [3.6, 2.2, 0.6], // 3D node sits on the right
    cardSide: 'left',          // card anchors left, highlights right
    highlights: {
      stat: { value: '8+ wks', label: 'Cohort length' },
      bullets: [
        'Neural-network foundations',
        'Production ML, not toy notebooks',
        'Real datasets · real outputs',
        'Ship models that pay their way',
      ],
    },
  },
  {
    id: 'cyber',
    label: 'Cybersecurity Essentials',
    description:
      'Threat models, defence patterns, and compliance — taught by operators who break and build systems.',
    href: '/courses/cybersecurity-essentials',
    icon: Shield,
    position: [-3.6, 2.2, -0.4], // 3D node sits on the left
    cardSide: 'right',           // card anchors right, highlights left
    highlights: {
      stat: { value: 'Live', label: 'Hands-on labs' },
      bullets: [
        'Threat models for operators',
        'Defence patterns by domain',
        'Compliance without the boredom',
        'Red team / blue team thinking',
      ],
    },
  },
  {
    id: 'cloud',
    label: 'Cloud Architecture',
    description:
      'Scalable infrastructure on AWS, GCP, and Azure. Patterns for systems that grow without breaking.',
    href: '/courses',
    icon: Cloud,
    position: [3.6, -2.0, -0.4], // right
    cardSide: 'left',            // card left, highlights right
    highlights: {
      stat: { value: 'Multi-cloud', label: 'AWS · GCP · Azure' },
      bullets: [
        'Scalable infrastructure patterns',
        'Cost-aware architecture',
        'Disaster recovery fundamentals',
        'Infrastructure as code',
      ],
    },
  },
  {
    id: 'data',
    label: 'Data Analytics with Python',
    description:
      'From messy data to dashboards your leadership can act on. SQL, pandas, plotly — the operator stack.',
    href: '/courses/data-analytics-python',
    icon: BarChart3,
    position: [-3.6, -2.0, 0.6], // left
    cardSide: 'right',           // card right, highlights left
    highlights: {
      stat: { value: 'Operator', label: 'First, not academic' },
      bullets: [
        'SQL for everyday operators',
        'Pandas + numpy fundamentals',
        'Plotly dashboards leadership uses',
        'From messy query to clear insight',
      ],
    },
  },
];

// Satellite nodes — atmosphere only, no interaction. Positioned to
// make the network feel dense without overwhelming.
const SATELLITES: Array<[number, number, number]> = [
  [1.8, 3.4, 1.2],
  [-1.8, 3.4, -1.0],
  [2.6, 0.4, -1.6],
  [-2.6, 0.4, 1.6],
  [1.8, -3.2, -1.4],
  [-1.8, -3.2, 1.0],
  [0.6, 1.4, -2.0],
  [-0.6, -1.4, 2.0],
  [4.4, 0.8, 0.0],
  [-4.4, -0.8, 0.0],
];

// Connection topology — node IDs ('hub' is the origin).
// Each connection produces a glowing line + 1-2 flowing particles.
const CONNECTIONS: Array<[string, string]> = [
  // Hub → every topic
  ['hub', 'ai'],
  ['hub', 'cyber'],
  ['hub', 'cloud'],
  ['hub', 'data'],
  // Cross-topic relationships
  ['ai', 'data'],
  ['ai', 'cloud'],
  ['cyber', 'cloud'],
  ['cyber', 'data'],
  // Satellites
  ['ai', 'sat0'],
  ['cyber', 'sat1'],
  ['cloud', 'sat4'],
  ['data', 'sat5'],
  ['ai', 'sat2'],
  ['cyber', 'sat3'],
  ['cloud', 'sat6'],
  ['data', 'sat7'],
  ['ai', 'sat8'],
  ['cyber', 'sat9'],
];

// Resolve an id → 3D position
function nodePos(id: string): Vector3 {
  if (id === 'hub') return new Vector3(0, 0, 0);
  if (id.startsWith('sat')) {
    const idx = Number(id.slice(3));
    const p = SATELLITES[idx];
    return new Vector3(p[0], p[1], p[2]);
  }
  const t = TOPICS.find((t) => t.id === id);
  if (!t) return new Vector3(0, 0, 0);
  return new Vector3(t.position[0], t.position[1], t.position[2]);
}

// ── Scene components ──────────────────────────────────────────────────

function Hub({ pulseRef }: { pulseRef: React.MutableRefObject<number> }) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const pulse = pulseRef.current;
    const breath = 0.55 + 0.08 * Math.sin(t * 0.8);
    const s = 0.55 * (1 + pulse * 0.4);
    ref.current.scale.set(s, s, s);
    if (ref.current.material) {
      ref.current.material.opacity = breath + pulse * 0.3;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 18]} />
      <meshBasicMaterial
        color={ACADEMY_LIGHT}
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

function TopicNode({
  topic,
  isActive,
  activeProgressRef,
  onClick,
}: {
  topic: TopicData;
  isActive: boolean;
  activeProgressRef: React.MutableRefObject<number>;
  onClick: () => void;
}) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    // Active progress: 0..1, lerped externally. Used here to scale + brighten
    // the topic when it's the focus.
    const activeBoost = isActive ? activeProgressRef.current : 0;
    const hoverBoost = hovered ? 0.25 : 0;
    const breath = 0.92 + 0.08 * Math.sin(t * 1.4 + topic.position[0]);
    const s = (0.42 + activeBoost * 0.35 + hoverBoost) * breath;
    ref.current.scale.set(s, s, s);
    if (ref.current.material) {
      ref.current.material.opacity = 0.65 + activeBoost * 0.3 + hoverBoost * 0.2;
    }
  });

  return (
    <mesh
      ref={ref}
      position={topic.position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
    >
      <sphereGeometry args={[1, 20, 16]} />
      <meshBasicMaterial
        color={ACADEMY_LIGHT}
        transparent
        opacity={0.65}
        toneMapped={false}
      />
    </mesh>
  );
}

function Satellites() {
  const ref = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    SATELLITES.forEach((p, i) => {
      const drift = Math.sin(t * 0.6 + i) * 0.08;
      const s = 0.14 + 0.03 * Math.sin(t * 1.1 + i);
      matrix.makeScale(s, s, s);
      matrix.setPosition(p[0], p[1] + drift, p[2]);
      ref.current!.setMatrixAt(i, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, SATELLITES.length]}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshBasicMaterial
        color="#cbd5e1"
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Connections() {
  // Pre-compute LineSegments geometry once.
  const positions = useMemo(() => {
    const arr: number[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      const pa = nodePos(a);
      const pb = nodePos(b);
      arr.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    });
    return new Float32Array(arr);
  }, []);

  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(ACADEMY),
        transparent: true,
        opacity: 0.22,
        toneMapped: false,
      }),
    [],
  );

  const linesRef = useRef<LineSegments>(null);
  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    // Subtle breathing in opacity
    const breath = 0.18 + 0.06 * Math.sin(clock.elapsedTime * 0.5);
    (linesRef.current.material as LineBasicMaterial).opacity = breath;
  });

  return <lineSegments ref={linesRef} args={[geo, mat]} />;
}

// Flowing particles — small spheres that travel along each connection
// from start to end, looping. ~2 particles per connection.
const PARTICLES_PER_CONNECTION = 2;
const TOTAL_FLOW_PARTICLES = CONNECTIONS.length * PARTICLES_PER_CONNECTION;

function FlowParticles() {
  const ref = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);

  // Precompute connection endpoints + per-particle offsets.
  const flow = useMemo(() => {
    const arr: Array<{
      from: Vector3;
      to: Vector3;
      phase: number;
      speed: number;
    }> = [];
    CONNECTIONS.forEach(([a, b]) => {
      const pa = nodePos(a);
      const pb = nodePos(b);
      for (let i = 0; i < PARTICLES_PER_CONNECTION; i++) {
        arr.push({
          from: pa,
          to: pb,
          phase: (i / PARTICLES_PER_CONNECTION) + Math.random() * 0.2,
          speed: 0.18 + Math.random() * 0.12,
        });
      }
    });
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < flow.length; i++) {
      const f = flow[i];
      // Parametric position along connection: 0..1, wrapping
      const param = (f.phase + t * f.speed) % 1;
      const x = f.from.x + (f.to.x - f.from.x) * param;
      const y = f.from.y + (f.to.y - f.from.y) * param;
      const z = f.from.z + (f.to.z - f.from.z) * param;
      const s = 0.08;
      matrix.makeScale(s, s, s);
      matrix.setPosition(x, y, z);
      ref.current.setMatrixAt(i, matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, TOTAL_FLOW_PARTICLES]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial
        color={ACADEMY_LIGHT}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Camera orbits to focus on the active topic node. As scroll progresses
// through the section, activeTopic changes and the camera lerps to
// frame the new focus.
function CameraRig({
  activeTopicRef,
  activeProgressRef,
}: {
  activeTopicRef: React.MutableRefObject<number>;
  activeProgressRef: React.MutableRefObject<number>;
}) {
  const focusX = useRef(0);
  const focusY = useRef(0);
  const camX = useRef(0);
  const camY = useRef(0);

  useFrame(({ camera, clock }) => {
    const i = activeTopicRef.current;
    const target = TOPICS[i].position;
    // Lerp camera lookAt toward the active topic position
    focusX.current += (target[0] - focusX.current) * 0.04;
    focusY.current += (target[1] - focusY.current) * 0.04;

    // Camera orbits subtly + offsets toward the opposite quadrant of
    // the active topic so the topic appears in the right part of frame
    const targetCamX = -target[0] * 0.18 + Math.sin(clock.elapsedTime * 0.12) * 0.4;
    const targetCamY = -target[1] * 0.18 + Math.cos(clock.elapsedTime * 0.1) * 0.25;
    camX.current += (targetCamX - camX.current) * 0.03;
    camY.current += (targetCamY - camY.current) * 0.03;

    camera.position.x = camX.current;
    camera.position.y = camY.current;
    camera.position.z = 8.5;
    camera.lookAt(focusX.current * 0.4, focusY.current * 0.4, 0);
  });
  return null;
}

// ── Card + Highlights blocks (reused on either side per topic) ────────

function TopicCard({
  topic,
  index,
  isActive,
}: {
  topic: TopicData;
  index: number;
  isActive: boolean;
}) {
  const Icon = topic.icon;
  return (
    <Link
      href={topic.href}
      data-cursor="magnetic"
      data-cursor-strength="16"
      tabIndex={isActive ? 0 : -1}
      className={[
        'pointer-events-auto group block h-full rounded-2xl border border-academy/25 bg-black/55 p-7 backdrop-blur-md transition-all duration-500',
        'hover:border-academy/60 hover:shadow-[0_30px_80px_-20px_rgba(245,166,35,0.45)]',
        isActive ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
      style={{
        boxShadow: isActive
          ? '0 30px 80px -20px rgba(245, 166, 35, 0.35), 0 0 0 1px rgba(245, 166, 35, 0.18)'
          : 'none',
      }}
    >
      {/* Top accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245, 166, 35, 0.85) 35%, rgba(255, 184, 77, 0.6) 65%, transparent 100%)',
        }}
      />

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-academy/40 bg-academy/10 text-academy transition-all duration-300 group-hover:border-academy/70 group-hover:bg-academy/20 group-hover:shadow-[0_0_18px_rgba(245,166,35,0.4)]">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-academy/85">
          0{index + 1} · Track
        </span>
      </div>

      <h4 className="bg-gradient-to-r from-academy-light via-academy to-amber-300 bg-clip-text text-2xl font-black leading-tight tracking-tight text-transparent md:text-3xl">
        {topic.label}
      </h4>

      <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
        {topic.description}
      </p>

      <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          Tap to explore
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-academy transition-colors duration-300 group-hover:text-academy-light">
          Open track
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

function TopicHighlights({ topic }: { topic: TopicData }) {
  const { stat, bullets } = topic.highlights;
  return (
    <div className="flex h-full flex-col justify-center">
      {/* Stat */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-academy/85">
          What you&apos;ll learn
        </p>
        <div className="mt-3 flex items-baseline gap-3">
          <span
            className="bg-gradient-to-r from-academy-light via-academy to-amber-300 bg-clip-text text-5xl font-black leading-none tracking-tight text-transparent md:text-6xl"
            style={{
              textShadow: '0 0 28px rgba(245, 166, 35, 0.25)',
            }}
          >
            {stat.value}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
            {stat.label}
          </span>
        </div>
      </div>

      {/* Bullets */}
      <ul className="mt-8 space-y-3">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm leading-relaxed text-white/75 md:text-base"
          >
            <span
              aria-hidden
              className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-academy"
              style={{
                boxShadow: '0 0 8px rgba(245, 166, 35, 0.55)',
              }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Section component ─────────────────────────────────────────────────

export default function NeuralPathway() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeTopicRef = useRef(0);
  // 0..1 — how "settled" the active topic is. Spikes to 1 on change, lerped.
  const activeProgressRef = useRef(1);
  const pulseRef = useRef(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      anticipatePin: 1,
      scrub: reduced ? false : 0.9,
      onUpdate: (self) => {
        const idx = Math.min(
          TOPICS.length - 1,
          Math.floor(self.progress * TOPICS.length),
        );
        setActiveTopic((prev) => {
          if (prev === idx) return prev;
          activeTopicRef.current = idx;
          pulseRef.current = 1;
          return idx;
        });
      },
    });
    return () => {
      trigger.kill();
    };
  }, [reduced]);

  // Decay pulse + activeProgress in a separate rAF loop (the canvas has
  // its own loop but pulseRef needs to decay even when offscreen)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      pulseRef.current *= Math.pow(0.06, dt);
      if (pulseRef.current < 0.001) pulseRef.current = 0;
      activeProgressRef.current += (1 - activeProgressRef.current) * 0.06;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // When activeTopic changes, briefly drop activeProgress so the new
  // topic eases UP from 0 → 1 rather than appearing fully lit.
  useEffect(() => {
    activeProgressRef.current = 0.2;
  }, [activeTopic]);

  const handleTopicClick = (idx: number) => {
    const t = TOPICS[idx];
    if (t.href) {
      window.location.href = t.href;
    }
  };

  const topic = TOPICS[activeTopic];
  const TopicIcon = topic.icon;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="neural-heading"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* 3D canvas */}
      <div aria-hidden="true" className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          frameloop="always"
          camera={{ position: [0, 0, 8.5], fov: 55 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.04} />
          <CameraRig
            activeTopicRef={activeTopicRef}
            activeProgressRef={activeProgressRef}
          />
          <Hub pulseRef={pulseRef} />
          <Satellites />
          <Connections />
          <FlowParticles />
          {TOPICS.map((t, i) => (
            <TopicNode
              key={t.id}
              topic={t}
              isActive={activeTopic === i}
              activeProgressRef={activeProgressRef}
              onClick={() => handleTopicClick(i)}
            />
          ))}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.1}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.42}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.25} darkness={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Accessible heading */}
      <h2 id="neural-heading" className="sr-only">
        FL Academy learning paths — AI, Cybersecurity, Cloud, Data Analytics.
      </h2>

      {/* Top-left brand label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-8 z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] md:left-16"
      >
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{
            background: ACADEMY,
            boxShadow: '0 0 10px 2px rgba(245, 166, 35, 0.55)',
          }}
        />
        <span style={{ color: ACADEMY }}>FL · Academy</span>
      </div>

      {/* Top-right section eyebrow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-8 z-10 font-mono text-xs uppercase tracking-[0.4em] text-white/55 md:right-16"
      >
        How to learn AI
      </div>

      {/* Centered title (top of section) */}
      <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 text-center md:top-32">
        <h3
          className="bg-gradient-to-r from-academy-light via-academy to-amber-300 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Turn AI into income.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
          Stop consuming AI content. Start building with it — and getting paid. Tap any track to start your run.
        </p>
      </div>

      {/* Zig-zag overlay — two columns, left and right. For each topic,
          ONE column shows the marketing card and the OTHER shows
          curriculum highlights. cardSide on each topic drives which
          column gets which content. Cards alternate left/right per
          topic as the user scrolls, filling the dead space on both
          sides of the 3D network. */}

      {/* LEFT column */}
      <div className="pointer-events-none absolute inset-y-0 left-[4%] z-20 hidden flex-col justify-center md:flex xl:left-[8%]">
        <div className="relative h-[24rem] w-80 lg:w-96">
          {TOPICS.map((t, i) => {
            const isActive = activeTopic === i;
            // Slide-in direction: cards slide from their cardSide,
            // highlights from the opposite side
            const slideClass = isActive
              ? 'opacity-100 translate-x-0 translate-y-0'
              : activeTopic > i
              ? 'opacity-0 -translate-y-6'
              : t.cardSide === 'left'
              ? 'opacity-0 -translate-x-10' // card incoming from left
              : 'opacity-0 -translate-x-10'; // highlights incoming from left
            return (
              <div
                key={t.id}
                aria-hidden={!isActive}
                className={[
                  'absolute inset-0 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  slideClass,
                ].join(' ')}
                style={{ transform: `rotate(-1.5deg)` }}
              >
                {t.cardSide === 'left' ? (
                  <TopicCard topic={t} index={i} isActive={isActive} />
                ) : (
                  <TopicHighlights topic={t} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT column */}
      <div className="pointer-events-none absolute inset-y-0 right-[4%] z-20 hidden flex-col justify-center md:flex xl:right-[8%]">
        <div className="relative h-[24rem] w-80 lg:w-96">
          {TOPICS.map((t, i) => {
            const isActive = activeTopic === i;
            const slideClass = isActive
              ? 'opacity-100 translate-x-0 translate-y-0'
              : activeTopic > i
              ? 'opacity-0 -translate-y-6'
              : 'opacity-0 translate-x-10';
            return (
              <div
                key={t.id}
                aria-hidden={!isActive}
                className={[
                  'absolute inset-0 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  slideClass,
                ].join(' ')}
                style={{ transform: `rotate(1.5deg)` }}
              >
                {t.cardSide === 'right' ? (
                  <TopicCard topic={t} index={i} isActive={isActive} />
                ) : (
                  <TopicHighlights topic={t} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile card overlay — centered, smaller */}
      <div className="pointer-events-none absolute inset-x-4 bottom-24 z-20 md:hidden">
        {TOPICS.map((t, i) => {
          const Icon = t.icon;
          const isActive = activeTopic === i;
          if (!isActive) return null;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="pointer-events-auto block rounded-xl border border-academy/25 bg-black/60 p-5 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={14} className="text-academy" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-academy">
                  0{i + 1} · Track
                </span>
              </div>
              <h4 className="text-lg font-black tracking-tight text-academy-light">
                {t.label}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                {t.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* CTA to all courses — bottom right */}
      <div className="pointer-events-none absolute bottom-10 right-6 z-10 md:right-16">
        <Link
          href="/courses"
          data-cursor="magnetic"
          data-cursor-strength="20"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-academy/40 bg-academy/[0.08] px-5 py-2.5 text-sm font-medium text-academy transition-all duration-300 hover:border-academy/70 hover:bg-academy/[0.15]"
        >
          Browse all courses
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Progress dots */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2"
      >
        {TOPICS.map((_, i) => (
          <span
            key={i}
            className={[
              'block h-1 rounded-full transition-all duration-500',
              activeTopic >= i ? 'w-12 bg-academy/85' : 'w-4 bg-white/20',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  );
}
