/**
 * DualWalkway — scroll-driven twin-ribbon corridor with marketing cards.
 *
 * 3D scene: two RibbonWall planes flanking a corridor, 240 instanced
 * particles, scroll-coupled camera flying forward. Pole colors swapped
 * to brand teal (Lab) + amber (Academy).
 *
 * Overlay enhancements (May 2026):
 *   • 4 marketing cards (Digitalisation, Custom Software, Automations,
 *     Consultation) appear sequentially as the user scrolls
 *   • Each card enters from a different direction (left / right /
 *     bottom / top) with a 6° 3D tilt that settles flat
 *   • Camera counter-tilts toward the opposite side of the active
 *     card, creating spatial parallax (#5)
 *   • Huge faded number watermark behind the corridor (#8)
 *   • Per-card pole bias: when a card enters from the left, the
 *     left (teal) wall brightens; from the right, the right (amber)
 *     wall brightens. Driven by a `wallBoostRef` lerped each frame
 *     into the ribbon shader's uBoost uniform. (#6)
 *   • Scene flash on card transition: a global `pulseRef` spikes to
 *     1.0 every time activeCard changes, decaying exponentially via
 *     useFrame and amplifying the wall shader's uPulse uniform. (#7)
 */
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Color, InstancedMesh, Matrix4, ShaderMaterial } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// Wall side encoded as a sign (-1 for left, +1 for right). When uBoost
// has the matching sign, this wall brightens; otherwise it stays at
// baseline. Lets one uniform drive bias for BOTH walls from a single
// source-of-truth ref in the parent.
function RibbonWall({
  side,
  color,
  boostRef,
  pulseRef,
}: {
  side: 'left' | 'right'
  color: string
  boostRef: React.MutableRefObject<number>
  pulseRef: React.MutableRefObject<number>
}) {
  const matRef = useRef<ShaderMaterial>(null)
  const sign = side === 'left' ? -1 : 1

  const colorVec = useMemo(() => new Color(color), [color])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: colorVec },
      uWallSign: { value: sign },
      uBoost: { value: 0 },
      uPulse: { value: 0 },
    }),
    [colorVec, sign],
  )

  useFrame((_, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value += delta
    // Mirror the ref values into shader uniforms each frame. Refs are
    // updated by the parent based on activeCard transitions.
    matRef.current.uniforms.uBoost.value = boostRef.current
    matRef.current.uniforms.uPulse.value = pulseRef.current
  })

  return (
    <mesh
      position={[sign * 2.9, 0.4, -16]}
      rotation={[0, -sign * Math.PI / 2, 0]}
    >
      <planeGeometry args={[44, 6, 1, 1]} />
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
          uniform float uWallSign; // -1 left, +1 right
          uniform float uBoost;    // -1..+1, matches wall when same sign
          uniform float uPulse;    // 0..1, global transition flash
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

            // Pole bias: this wall brightens only when uBoost has the
            // same sign as this wall (i.e. the active card is on our side)
            float thisWallBoost = max(0.0, uBoost * uWallSign);

            // Multiplier stack: base × breath × pole bias × transition flash
            float boostFactor = 1.0 + thisWallBoost * 0.55 + uPulse * 0.35;

            vec3 col = uColor * baseGlow * pulse * 1.4 * boostFactor;
            gl_FragColor = vec4(col, baseGlow * 0.9 * (1.0 + uPulse * 0.25));
          }
        `}
      />
    </mesh>
  )
}

const PARTICLE_COUNT = 240
function Particles({
  pulseRef,
}: {
  pulseRef: React.MutableRefObject<number>
}) {
  const meshRef = useRef<InstancedMesh>(null)
  const matrix = useMemo(() => new Matrix4(), [])
  const dots = useMemo(() => {
    const arr: Array<{
      x: number
      y: number
      z: number
      phase: number
      speed: number
      size: number
    }> = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 4.8,
        y: (Math.random() - 0.5) * 4.5,
        z: -Math.random() * 38 + 4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        size: 0.018 + Math.random() * 0.04,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    // Pulse boost: scales every particle slightly larger on transition
    const pulse = pulseRef.current
    const scaleBoost = 1 + pulse * 0.6
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = dots[i]
      const dy = Math.sin(t * d.speed + d.phase) * 0.18
      const dx = Math.cos(t * d.speed * 0.6 + d.phase) * 0.08
      const s = d.size * scaleBoost
      matrix.makeScale(s, s, s)
      matrix.setPosition(d.x + dx, d.y + dy, d.z)
      meshRef.current.setMatrixAt(i, matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 6, 5]} />
      <meshBasicMaterial color="#cbd5e1" transparent opacity={0.85} toneMapped={false} />
    </instancedMesh>
  )
}

// Each card has an entry "side" — the camera counter-tilts the opposite way.
type CardSide = 'left' | 'right' | 'bottom' | 'top'

// Reusable single useFrame that runs ALL inter-frame logic that needs
// to read multiple refs and decay the pulse. Avoids per-component
// re-binding when components mount in different orders.
function SceneRig({
  progressRef,
  cardSideRef,
  wallBoostRef,
  pulseRef,
}: {
  progressRef: React.MutableRefObject<number>
  cardSideRef: React.MutableRefObject<CardSide>
  wallBoostRef: React.MutableRefObject<number>
  pulseRef: React.MutableRefObject<number>
}) {
  // Eased camera lookAt — lerped each frame toward target
  const tiltX = useRef(0)
  const tiltY = useRef(0)

  // Lerped target for wallBoost — lets us smoothly transition between
  // -1 (left wall) and +1 (right wall) for bias.
  const targetBoost = useRef(0)

  useFrame(({ camera, clock }, delta) => {
    const p = progressRef.current

    // ── Camera path (verbatim from reference) ─────────────────────────
    camera.position.z = 5 + (-35) * p
    camera.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.12
    camera.position.y = 0.35 + p * 0.1

    // ── Camera counter-tilt based on active card side ────────────────
    const side = cardSideRef.current
    const targetX = side === 'left' ? 0.6 : side === 'right' ? -0.6 : 0
    const targetY = side === 'top' ? -0.35 : side === 'bottom' ? 0.35 : 0
    tiltX.current += (targetX - tiltX.current) * 0.05
    tiltY.current += (targetY - tiltY.current) * 0.05
    camera.lookAt(tiltX.current, 0.45 + tiltY.current, camera.position.z - 8)

    // ── Wall pole bias: target wallBoost from active card side ──────
    // left entry → -1 (left wall brightens)
    // right entry → +1 (right wall brightens)
    // top/bottom entries → 0 (both equal; the pulse covers transition)
    const tgt =
      side === 'left' ? -1 : side === 'right' ? 1 : 0
    targetBoost.current = tgt
    wallBoostRef.current += (targetBoost.current - wallBoostRef.current) * 0.04

    // ── Pulse decay: exponential drop toward 0 per frame ────────────
    // Pulse is set to 1.0 by the parent onUpdate callback when activeCard
    // changes; here we decay it. Half-life ~250ms.
    pulseRef.current *= Math.pow(0.06, delta)
    if (pulseRef.current < 0.001) pulseRef.current = 0
  })

  return null
}

// Marketing cards — one per service. Each enters from a different
// direction for visual variety; pole accent stays Lab teal (these are
// all FL Lab services). Camera counter-tilts based on `side`.
type ServiceCardData = {
  num: string
  name: string
  headline: string
  body: string
  href: string
  side: CardSide
  // Side rails. pitch renders left (marketing tagline that closes the
  // sale). cta renders right (action button — usually routes to the
  // consultation / audit page for conversion).
  pitch: { tagline: string; caption: string }
  cta: { label: string; href: string; hint: string }
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    num: '01',
    name: 'Digitalisation',
    headline: 'Paper out. Systems in.',
    body:
      'Replace paper trails and disconnected spreadsheets with unified digital workflows. One source of truth. Live in weeks.',
    href: '/services/digitalisation',
    side: 'left',
    pitch: {
      tagline: 'Live in weeks.',
      caption: 'Not years. One source of truth, your team will actually use.',
    },
    cta: {
      label: 'Get a free audit',
      href: '/services/consultation',
      hint: 'No commitment · 30-min call',
    },
  },
  {
    num: '02',
    name: 'Custom Software',
    headline: 'Software that fits.',
    body:
      'Purpose-built platforms shaped around your team — no recurring licence fees, no workarounds, no vendor lock-in.',
    href: '/services/custom-software',
    side: 'right',
    pitch: {
      tagline: 'Own it forever.',
      caption: 'No licence tax. No vendor lock-in. Just software that fits.',
    },
    cta: {
      label: 'Design my system',
      href: '/services/consultation',
      hint: 'Free scoping call · No deck',
    },
  },
  {
    num: '03',
    name: 'Automations',
    headline: 'Robots do the boring.',
    body:
      'AI-powered workflows that route approvals, sync data, and write reports — freeing your team for work that matters.',
    href: '/services/automations',
    side: 'bottom',
    pitch: {
      tagline: 'Free your team.',
      caption: 'Approvals routed. Reports written. Days back in everyone’s week.',
    },
    cta: {
      label: 'Map my workflow',
      href: '/services/consultation',
      hint: 'Free workflow audit · Top 3 wins',
    },
  },
  {
    num: '04',
    name: 'Consultation',
    headline: 'Honest second opinion.',
    body:
      'A plain-English audit of your systems. No commission, no vendor bias — just an evidence-based read on what to fix first.',
    href: '/services/consultation',
    side: 'top',
    pitch: {
      tagline: 'No commission. Ever.',
      caption: 'Independent advice. Plain English. We tell you what to fix first.',
    },
    cta: {
      label: 'Book free session',
      href: '/services/consultation',
      hint: 'No pitch deck · No hard sell',
    },
  },
]

function transformForCard(state: 'active' | 'incoming' | 'outgoing', side: CardSide): string {
  if (state === 'active') {
    return 'translate-x-0 translate-y-0 opacity-100 scale-100'
  }
  switch (side) {
    case 'left':
      return state === 'incoming'
        ? '-translate-x-24 translate-y-0 opacity-0 scale-[0.96]'
        : 'translate-x-24 -translate-y-4 opacity-0 scale-[1.04]'
    case 'right':
      return state === 'incoming'
        ? 'translate-x-24 translate-y-0 opacity-0 scale-[0.96]'
        : '-translate-x-24 -translate-y-4 opacity-0 scale-[1.04]'
    case 'bottom':
      return state === 'incoming'
        ? 'translate-x-0 translate-y-24 opacity-0 scale-[0.96]'
        : 'translate-x-0 -translate-y-24 opacity-0 scale-[1.04]'
    case 'top':
      return state === 'incoming'
        ? 'translate-x-0 -translate-y-24 opacity-0 scale-[0.96]'
        : 'translate-x-0 translate-y-24 opacity-0 scale-[1.04]'
  }
}

function rotationForCard(state: 'active' | 'incoming' | 'outgoing', side: CardSide): string {
  if (state === 'active' || state === 'outgoing') return 'rotateY(0deg) rotateX(0deg)'
  switch (side) {
    case 'left':
      return 'rotateY(-8deg) rotateX(0deg)'
    case 'right':
      return 'rotateY(8deg) rotateX(0deg)'
    case 'bottom':
      return 'rotateY(0deg) rotateX(-6deg)'
    case 'top':
      return 'rotateY(0deg) rotateX(6deg)'
  }
}

export default function DualWalkway() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const cardSideRef = useRef<CardSide>(SERVICE_CARDS[0].side)
  const wallBoostRef = useRef(0) // -1..+1, lerped in SceneRig
  const pulseRef = useRef(0) // 0..1, set to 1 on transition, decayed in SceneRig
  const [activeCard, setActiveCard] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=320%',
      pin: true,
      anticipatePin: 1,
      scrub: reduced ? false : 0.9,
      onUpdate: (self) => {
        progressRef.current = self.progress
        const idx = Math.min(
          SERVICE_CARDS.length - 1,
          Math.floor(self.progress * SERVICE_CARDS.length),
        )
        setActiveCard((prev) => {
          if (prev === idx) return prev
          cardSideRef.current = SERVICE_CARDS[idx].side
          // Fire scene-wide pulse on every card change — decays in SceneRig.
          pulseRef.current = 1
          return idx
        })
      },
    })
    return () => {
      trigger.kill()
    }
  }, [reduced])

  const activeCardNum = SERVICE_CARDS[activeCard].num

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dualwalkway-heading"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          frameloop="always"
          camera={{ position: [0, 0.4, 5], fov: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.05} />
          <SceneRig
            progressRef={progressRef}
            cardSideRef={cardSideRef}
            wallBoostRef={wallBoostRef}
            pulseRef={pulseRef}
          />
          <RibbonWall
            side="left"
            color="#18A999"
            boostRef={wallBoostRef}
            pulseRef={pulseRef}
          />
          <RibbonWall
            side="right"
            color="#F5A623"
            boostRef={wallBoostRef}
            pulseRef={pulseRef}
          />
          <Particles pulseRef={pulseRef} />
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.3} darkness={0.85} />
          </EffectComposer>
        </Canvas>
      </div>

      <h2 id="dualwalkway-heading" className="sr-only">
        FutureLine services — Digitalisation, Custom Software, Automations, Consultation.
      </h2>

      {/* Top brand labels: FL · Lab and FL · Academy pole indicators */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-8 z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] md:left-16"
      >
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{
            background: '#18A999',
            boxShadow: '0 0 10px 2px rgba(24, 169, 153, 0.55)',
          }}
        />
        <span style={{ color: '#18A999' }}>FL · Lab</span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-8 z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] md:right-16"
      >
        <span style={{ color: '#F5A623' }}>FL · Academy</span>
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{
            background: '#F5A623',
            boxShadow: '0 0 10px 2px rgba(245, 166, 35, 0.55)',
          }}
        />
      </div>

      {/* Huge ghost number watermark — fades to match the active card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <span
          key={activeCardNum}
          className="select-none font-black tabular-nums text-white/[0.04] transition-all duration-700"
          style={{
            fontSize: 'clamp(20rem, 50vw, 44rem)',
            lineHeight: 1,
            letterSpacing: '-0.06em',
          }}
        >
          {activeCardNum}
        </span>
      </div>

      {/* Side rails — marketing pitch (left) + action CTA (right). The
          right column is interactive: pointer-events enabled on the CTA
          itself so users can click through to consultation. Hidden under
          md so they don't crowd mobile. */}
      <div className="pointer-events-none absolute inset-0 z-[8] hidden md:block">
        {/* Left: marketing pitch — big tagline + caption */}
        <div className="absolute inset-y-0 left-[4%] flex flex-col justify-center xl:left-[8%]">
          <div className="relative h-44 w-60 lg:w-72">
            {SERVICE_CARDS.map((card, i) => (
              <div
                key={card.num}
                aria-hidden={activeCard !== i}
                className={[
                  'absolute inset-0 flex flex-col justify-center transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  activeCard === i
                    ? 'opacity-100 translate-y-0'
                    : activeCard > i
                    ? 'opacity-0 -translate-y-6'
                    : 'opacity-0 translate-y-6',
                ].join(' ')}
                style={{ transform: `rotate(-2deg)` }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab/85">
                  FL · Lab
                </p>
                <p
                  className="mt-3 font-semibold leading-[0.95] tracking-[-0.02em] text-white [font-size:clamp(2rem,3.6vw,3.5rem)]"
                  style={{
                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {card.pitch.tagline}
                </p>
                <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-white/65">
                  {card.pitch.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: action CTA — pill button + hint underneath */}
        <div className="absolute inset-y-0 right-[4%] flex flex-col justify-center xl:right-[8%]">
          <div className="relative h-44 w-60 text-right lg:w-72">
            {SERVICE_CARDS.map((card, i) => (
              <div
                key={card.num}
                aria-hidden={activeCard !== i}
                className={[
                  'absolute inset-0 flex flex-col items-end justify-center transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  activeCard === i
                    ? 'opacity-100 translate-y-0'
                    : activeCard > i
                    ? 'opacity-0 -translate-y-6'
                    : 'opacity-0 translate-y-6',
                ].join(' ')}
                style={{ transform: `rotate(2deg)` }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-lab/85">
                  Start here
                </p>
                <Link
                  href={card.cta.href}
                  data-cursor="magnetic"
                  data-cursor-strength="24"
                  className={[
                    'pointer-events-auto group mt-4 inline-flex items-center gap-2.5 rounded-full bg-lab px-7 py-4 font-semibold text-black transition-all duration-300',
                    'hover:bg-lab-light hover:shadow-[0_0_36px_rgba(24,169,153,0.5)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-lab/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                    activeCard === i ? '' : 'pointer-events-none',
                  ].join(' ')}
                  style={{
                    boxShadow:
                      activeCard === i
                        ? '0 14px 40px -10px rgba(24, 169, 153, 0.55)'
                        : 'none',
                    fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                  }}
                  tabIndex={activeCard === i ? 0 : -1}
                >
                  {card.cta.label}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <p className="mt-3 max-w-[24ch] text-xs leading-relaxed text-white/55">
                  {card.cta.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centered marketing card overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4"
        style={{ perspective: '1400px' }}
      >
        <div className="relative h-[30rem] w-full max-w-xl md:h-[28rem]">
          {SERVICE_CARDS.map((card, i) => {
            const state: 'active' | 'incoming' | 'outgoing' =
              activeCard === i ? 'active' : activeCard > i ? 'outgoing' : 'incoming'

            return (
              <article
                key={card.num}
                aria-hidden={state !== 'active'}
                className={[
                  'absolute inset-0 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  transformForCard(state, card.side),
                ].join(' ')}
                style={{
                  transformStyle: 'preserve-3d',
                  ['--card-rotate' as string]: rotationForCard(state, card.side),
                }}
              >
                <div
                  className="flex h-full flex-col justify-center rounded-2xl border border-white/[0.12] bg-black/55 p-8 backdrop-blur-md md:p-10"
                  style={{
                    transform: `var(--card-rotate)`,
                    transformOrigin: 'center center',
                    transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow:
                      state === 'active'
                        ? '0 30px 80px -20px rgba(24, 169, 153, 0.25), 0 0 0 1px rgba(24, 169, 153, 0.08)'
                        : 'none',
                  }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.3em] text-lab">
                      {card.num}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
                      {card.name}
                    </span>
                  </div>

                  <h3 className="text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-white md:text-[clamp(2rem,3.4vw,3.25rem)]">
                    {card.headline}
                  </h3>

                  <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
                    {card.body}
                  </p>

                  <div className="mt-10 flex items-center justify-between border-t border-white/[0.1] pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                      Learn more
                    </span>
                    <Link
                      href={card.href}
                      data-cursor="magnetic"
                      data-cursor-strength="18"
                      className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-lab/60 hover:bg-lab/10 hover:text-lab"
                    >
                      Explore {card.name.toLowerCase()}
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Progress dots — one per card */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2"
      >
        {SERVICE_CARDS.map((_, i) => (
          <span
            key={i}
            className={[
              'block h-1 rounded-full transition-all duration-500',
              activeCard >= i ? 'w-12 bg-lab/85' : 'w-4 bg-white/20',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}
