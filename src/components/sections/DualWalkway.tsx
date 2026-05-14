/**
 * DualWalkway — scroll-driven twin-ribbon corridor (FL Lab + FL Academy).
 *
 * Verbatim port from muayadkhamis96-sudo/futureline-3d. Only the beat copy
 * (LAB_BEATS / ACADEMY_BEATS) has been adapted to FutureLine content. The 3D
 * scene — shaders, geometry, camera rig, particle counts, scroll lengths, and
 * hardcoded pole colors (#7dd3fc cyan / #fbbf24 amber) — is unchanged.
 */
'use client'

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

function CameraRig({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>
}) {
  useFrame(({ camera, clock }) => {
    const p = progressRef.current
    camera.position.z = 5 + (-35) * p
    camera.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.12
    camera.position.y = 0.35 + p * 0.1
    camera.lookAt(0, 0.45, camera.position.z - 8)
  })
  return null
}

// Beats — three reveals per side. Content adapted to FutureLine; structure verbatim.
const LAB_BEATS = [
  { eyebrow: 'FL · Lab', label: 'Where FutureLine builds.' },
  {
    eyebrow: '01 · Build',
    label: 'Custom software, digitalisation, automation.',
  },
  { eyebrow: '02 · Ship', label: 'In weeks, not years. No recurring license tax.' },
] as const

const ACADEMY_BEATS = [
  { eyebrow: 'FL · Academy', label: 'Where FutureLine teaches.' },
  {
    eyebrow: '01 · Learn',
    label: 'AI, cybersecurity, cloud, data — taught by operators.',
  },
  { eyebrow: '02 · Apply', label: 'Online, in-person, hybrid. Built to finish.' },
] as const

export default function DualWalkway() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [activeBeat, setActiveBeat] = useState(0)
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
          LAB_BEATS.length - 1,
          Math.floor(self.progress * LAB_BEATS.length),
        )
        setActiveBeat((prev) => (prev === idx ? prev : idx))
      },
    })
    return () => {
      trigger.kill()
    }
  }, [reduced])

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
          <CameraRig progressRef={progressRef} />
          <RibbonWall side="left" color="#7dd3fc" />
          <RibbonWall side="right" color="#fbbf24" />
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
        FL Lab and FL Academy — two divisions of FutureLine.
      </h2>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1/2 flex-col items-start justify-center px-6 md:px-16">
        <div className="relative h-44 w-full max-w-sm md:h-52">
          {LAB_BEATS.map((b, i) => (
            <div
              key={i}
              aria-hidden={activeBeat !== i}
              className={[
                'absolute inset-x-0 top-0 transition-all duration-700 ease-out',
                activeBeat === i
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0',
              ].join(' ')}
            >
              <p
                className="mb-3 font-mono text-xs uppercase tracking-[0.4em]"
                style={{ color: '#7dd3fc' }}
              >
                {b.eyebrow}
              </p>
              <p className="text-3xl font-semibold leading-[1.0] tracking-[-0.02em] text-white md:text-[clamp(1.75rem,3vw,3rem)]">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-1/2 flex-col items-end justify-center px-6 text-right md:px-16">
        <div className="relative h-44 w-full max-w-sm md:h-52">
          {ACADEMY_BEATS.map((b, i) => (
            <div
              key={i}
              aria-hidden={activeBeat !== i}
              className={[
                'absolute inset-x-0 top-0 transition-all duration-700 ease-out',
                activeBeat === i
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0',
              ].join(' ')}
            >
              <p
                className="mb-3 font-mono text-xs uppercase tracking-[0.4em]"
                style={{ color: '#fbbf24' }}
              >
                {b.eyebrow}
              </p>
              <p className="text-3xl font-semibold leading-[1.0] tracking-[-0.02em] text-white md:text-[clamp(1.75rem,3vw,3rem)]">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-12 z-10 flex -translate-x-1/2 gap-2"
      >
        {LAB_BEATS.map((_, i) => (
          <span
            key={i}
            className={[
              'block h-1 rounded-full transition-all duration-500',
              activeBeat >= i ? 'w-10 bg-white/80' : 'w-4 bg-white/20',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}
