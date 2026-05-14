/**
 * DualWalkway — scroll-driven twin-ribbon corridor with marketing cards.
 *
 * 3D scene: two RibbonWall planes flanking a corridor, 240 instanced
 * particles, scroll-coupled camera flying forward. Pole colors swapped
 * to brand teal (Lab) + amber (Academy).
 *
 * Overlay enhancements (May 2026):
 *   • 4 marketing cards (Digitalisation, Custom Software, Automations,
 *     Consultation) appear sequentially as user scrolls through the
 *     pinned 320vh section
 *   • Each card enters from a different direction (left / right /
 *     bottom / top) with a 6° Y-axis 3D tilt that settles flat
 *   • Camera counter-tilts toward the opposite side as the active
 *     card enters, creating spatial parallax
 *   • Huge faded number watermark (01-04) sits behind the corridor,
 *     reinforcing the editorial card numbering
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

function RibbonWall({
  side,
  color,
}: {
  side: 'left' | 'right'
  color: string
}) {
  const matRef = useRef<ShaderMaterial>(null)
  const sign = side === 'left' ? -1 : 1

  const colorVec = useMemo(() => new Color(color), [color])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: colorVec },
    }),
    [colorVec],
  )

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta
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
  )
}

const PARTICLE_COUNT = 240
function Particles() {
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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = dots[i]
      const dy = Math.sin(t * d.speed + d.phase) * 0.18
      const dx = Math.cos(t * d.speed * 0.6 + d.phase) * 0.08
      matrix.makeScale(d.size, d.size, d.size)
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

// CameraRig now also smoothly counter-tilts toward the OPPOSITE side
// of where the active card is entering, creating spatial parallax.
function CameraRig({
  progressRef,
  cardSideRef,
}: {
  progressRef: React.MutableRefObject<number>
  cardSideRef: React.MutableRefObject<CardSide>
}) {
  // Eased tilt value — lerped each frame toward target
  const tiltX = useRef(0)
  const tiltY = useRef(0)

  useFrame(({ camera, clock }) => {
    const p = progressRef.current

    // Base camera path — unchanged from the verbatim reference scene
    camera.position.z = 5 + (-35) * p
    camera.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.12
    camera.position.y = 0.35 + p * 0.1

    // Target lookAt offset based on which side the active card entered.
    // The camera tilts AWAY from the card, so the card itself appears to
    // settle into the foreground while the corridor counter-shifts.
    const side = cardSideRef.current
    const targetX =
      side === 'left' ? 0.6 : side === 'right' ? -0.6 : 0
    const targetY =
      side === 'top' ? -0.35 : side === 'bottom' ? 0.35 : 0

    // Lerp toward target — ~250ms ease-out
    tiltX.current += (targetX - tiltX.current) * 0.05
    tiltY.current += (targetY - tiltY.current) * 0.05

    camera.lookAt(
      tiltX.current,
      0.45 + tiltY.current,
      camera.position.z - 8,
    )
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
  },
  {
    num: '02',
    name: 'Custom Software',
    headline: 'Software that fits.',
    body:
      'Purpose-built platforms shaped around your team — no recurring licence fees, no workarounds, no vendor lock-in.',
    href: '/services/custom-software',
    side: 'right',
  },
  {
    num: '03',
    name: 'Automations',
    headline: 'Robots do the boring.',
    body:
      'AI-powered workflows that route approvals, sync data, and write reports — freeing your team for work that matters.',
    href: '/services/automations',
    side: 'bottom',
  },
  {
    num: '04',
    name: 'Consultation',
    headline: 'Honest second opinion.',
    body:
      'A plain-English audit of your systems. No commission, no vendor bias — just an evidence-based read on what to fix first.',
    href: '/services/consultation',
    side: 'top',
  },
]

// Per-side transform classes — used for off-screen (enter from / exit to)
// and the resting active state. Includes a 3D Y-rotation tilt that
// settles to 0 when the card is active.
function transformForCard(state: 'active' | 'incoming' | 'outgoing', side: CardSide): string {
  if (state === 'active') {
    return 'translate-x-0 translate-y-0 rotate-y-0 opacity-100 scale-100'
  }
  // From the side the card was assigned: it ENTERS from that direction
  // and EXITS in the opposite (slightly upward-out) direction.
  const enter = state === 'incoming'
  const sign = enter ? 1 : -1
  switch (side) {
    case 'left':
      return enter
        ? '-translate-x-24 translate-y-0 opacity-0 scale-[0.96]'
        : 'translate-x-24 -translate-y-4 opacity-0 scale-[1.04]'
    case 'right':
      return enter
        ? 'translate-x-24 translate-y-0 opacity-0 scale-[0.96]'
        : '-translate-x-24 -translate-y-4 opacity-0 scale-[1.04]'
    case 'bottom':
      return enter
        ? 'translate-x-0 translate-y-24 opacity-0 scale-[0.96]'
        : 'translate-x-0 -translate-y-24 opacity-0 scale-[1.04]'
    case 'top':
      return enter
        ? 'translate-x-0 -translate-y-24 opacity-0 scale-[0.96]'
        : 'translate-x-0 translate-y-24 opacity-0 scale-[1.04]'
  }
}

// Inline 3D Y-rotation per side — Tailwind doesn't ship rotateY by
// default, so we use inline style and let the active state animate
// back to 0deg.
function rotationForCard(state: 'active' | 'incoming' | 'outgoing', side: CardSide): string {
  if (state === 'active') return 'rotateY(0deg) rotateX(0deg)'
  if (state === 'outgoing') return 'rotateY(0deg) rotateX(0deg)'
  // incoming — tilt away from entry direction
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
          <CameraRig progressRef={progressRef} cardSideRef={cardSideRef} />
          <RibbonWall side="left" color="#18A999" />
          <RibbonWall side="right" color="#F5A623" />
          <Particles />
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

      {/* Centered marketing card overlay — each card enters from a
          different direction with a 3D tilt. Camera counter-tilts. */}
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
                  // 3D rotation tilts in on entry, settles flat when active
                  transform: undefined,
                  // The Tailwind classes set translate + scale + opacity;
                  // we layer the rotation as an additional inline transform
                  // by appending it via CSS variable below.
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
