# 3D Web Resources — Lusion-tier reference

Curated research compiled 2026-05-15. Sources: web research across studios, GitHub orgs, skills.sh, course platforms. Star counts and "last pushed" dates were live at compile time.

This is FutureLine's permanent reference for everything immersive-3D-web related — studios producing this work, the open-source ecosystem, learning paths, asset sources, and what specifically applies to this codebase.

---

## 1. Top studios producing this work

### Lusion — [lusion.co](https://lusion.co/)
Bristol, UK. Founded 2017 by **Edan Kwan**. Cinematic real-time WebGL, custom GLSL, Blender + Houdini-style pipelines. Builds from scratch rather than templates.
- GitHub: [lusionltd](https://github.com/lusionltd), [edankwan](https://github.com/edankwan)
- Study: [Oryzo AI](https://lusion.co/projects/oryzo_ai/), Porsche: Dream Machine, Lusion Labs
- [Codrops profile (April 2026)](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
- [Lusion v3 case study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html)

### Active Theory — [activetheory.net](https://activetheory.net/)
Venice Beach. Webby + FWA juggernaut since 2012. Runs **Hydra**, their proprietary WebGL framework (particle physics simulator + native iOS/Android bridges). Not open source.
- [Story of Tech at Active Theory (Medium)](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)

### Studio Freight / darkroom.engineering — [darkroom.engineering](https://darkroom.engineering)
The single most important open-source contributor in this space after pmndrs. Maintained by Clément Roche, Guido Fier, Leandro Soengas, Franco Arza:
- [**Lenis**](https://github.com/darkroomengineering/lenis) — the smooth-scroll standard (13.9K⭐)
- [**Tempus**](https://github.com/darkroomengineering) — single rAF loop everything syncs to
- [**Hamo**](https://www.npmjs.com/package/@darkroom.engineering/hamo) — React hooks (useIsVisible, useRect)
- [**Satus**](https://github.com/darkroomengineering/satus) — production starter (943⭐, active Apr 2026)
- [**Compono**](https://github.com/darkroomengineering/compono) — marquee, parallax, sticky, slider components
- Site to study: [Dragonfly case study](https://www.awwwards.com/case-study-dragonfly-by-studio-freight.html)

### 14islands — [14islands.com](https://14islands.com)
Barcelona/Stockholm. The R3F ↔ DOM bridge specialists.
- [**@14islands/r3f-scroll-rig**](https://github.com/14islands/r3f-scroll-rig) (932⭐) — sync 3D meshes to DOM elements during scroll. Essential for "WebGL layer over normal HTML" sites.
- [Marco Fugaro's GitHub](https://github.com/marcofugaro) — 117 repos of weird 3D stuff

### Resn — [resn.co.nz](https://resn.co.nz)
Wellington, NZ. Surreal/irreverent WebGL. Heavy GLSL shader work. Study: GOOD Meat project.

### Locomotive — [locomotive.ca](https://locomotive.ca/en)
Montreal. 7× Awwwards Agency of the Year. Created [locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) (8.7K⭐, now largely superseded by Lenis).
- [SOTM case study with their flag-shader technique](https://www.awwwards.com/locomotive-by-locomotive-wins-site-of-the-month-june-a-case-study.html)

### Hello Monday — [hellomonday.com](https://hellomonday.com)
NYC/Copenhagen/Aarhus. Strong on narrative + game-feel. Study: [Google Cloud Infrastructure SOTM](https://www.awwwards.com/google-cloud-infrastructure-by-hello-monday-wins-site-of-the-month-october.html)

### Bruno Simon — [bruno-simon.com](https://bruno-simon.com)
The reference 3D portfolio (driveable car landing page). Stack: three.js + cannon.js + Blender.
- Founder of [**Three.js Journey**](https://threejs-journey.com/) (paid, ~$95) — the most-cited training in the industry
- Portfolio source: [folio-2019](https://github.com/brunosimon/folio-2019) (4.7K⭐, MIT licensed, Blender files included)

### Poimandres (pmndrs) — [github.com/pmndrs](https://github.com/pmndrs)
Open-source collective founded by **Paul Henschel (drcmda / 0xca0a)**. 91 repos. The single most important org for the React 3D ecosystem. Maintainers include Henschel, [Cody Bennett](https://github.com/CodyJasonBennett), Josh Ellis.
- Docs hub: [docs.pmnd.rs](https://docs.pmnd.rs/)
- Discord: [discord.com/invite/poimandres](https://discord.com/invite/poimandres) (~10.7K members)

### Theatre.js — [theatrejs.com](https://www.theatrejs.com/)
Visual keyframe editor for the web. **Aria Minaei**, $4.5M seed. AGPL studio + open-core runtime.
- [theatre-js/theatre](https://github.com/theatre-js/theatre) (12.4K⭐)
- ⚠️ Last commit August 2024 — development has slowed. Still works.

---

## 2. Common ingredients that separate Lusion-tier from mid-tier

1. **Single rAF loop** — one `requestAnimationFrame` driving scroll + animation + physics + render (Tempus pattern)
2. **DOM ↔ WebGL sync layer** — 3D meshes positioned to match DOM elements (r3f-scroll-rig pattern) so designers keep HTML/CSS workflow
3. **Custom GLSL on everything** — vertex displacement with 3D Perlin/simplex noise + `u_time`, fBm for organic materials, custom post-processing (chromatic aberration, RGB shift, bloom)
4. **Composite rendering** — multiple render targets stacked with shader transitions instead of CSS crossfades
5. **Scroll-coupled cameras** — PerspectiveCamera position keyframed to scroll via GSAP ScrollTrigger `scrub` — lerped, never linear
6. **Physics for "weight"** — Rapier (via react-three-rapier) or Cannon. Even non-game sites use light physics for inertia
7. **Magnetic / inertial cursors** — lerp-based, not CSS transitions
8. **Baked lighting + light probes** — long Blender/Houdini bake pipelines, re-imported as GLB with optimized texture atlases
9. **TSL (Three Shading Language)** — writing shaders in JS, not GLSL strings. Bruno Simon's 2025 portfolio rebuild uses this.
10. **Lenis everywhere** — replacing native scroll with physics-based smoothing is now table stakes

---

## 3. Open-source repos — the canonical kit

### Engine + R3F core
| Repo | Stars | Status | What it does |
|---|---|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 112K | Active | The engine |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 30.8K | Active | React renderer for Three.js |
| [pmndrs/drei](https://github.com/pmndrs/drei) | 9.6K | Active | The "everything-helpers" pack |
| [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | 2.8K | Active | Bloom, DOF, chromatic aberration, etc. |
| [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | 1.3K | Stable | R3F wrapper for above |
| [pmndrs/leva](https://github.com/pmndrs/leva) | 5.9K | Stable | Debug GUI panel — tweak shader uniforms live |
| [pmndrs/uikit](https://github.com/pmndrs/uikit) | 3.1K | Active | Yoga-flexbox UI rendered inside the 3D canvas |
| [pmndrs/react-three-rapier](https://github.com/pmndrs/react-three-rapier) | 1.4K | Stable | Rust-based physics |
| [pmndrs/react-three-offscreen](https://github.com/pmndrs/react-three-offscreen) | 523 | Stable | Worker-based rendering (huge perf win) |
| [yomotsu/camera-controls](https://github.com/yomotsu/camera-controls) | 2.4K | Active | Smooth-tweening OrbitControls replacement |
| [oframe/ogl](https://github.com/oframe/ogl) | 4.5K | Stable | Minimal WebGL — when you outgrow Three.js |
| [FarazzShaikh/THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) | 1.3K | Stable | Extend Three's PBR shaders with your own GLSL |
| [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | 3.4K | Active | Spatial queries / fast raycasting |

### Starter templates
| Repo | Stars | Status | Notes |
|---|---|---|---|
| [pmndrs/react-three-next](https://github.com/pmndrs/react-three-next) | 2.8K | Active | **Official R3F + Next.js starter.** Single persistent canvas across routes. |
| [darkroomengineering/satus](https://github.com/darkroomengineering/satus) | 943 | Active | **Studio Freight's** App Router starter — Lenis + Hamo + GSAP wired up |
| [Epiczzor/r3f-template](https://github.com/Epiczzor/r3f-template) | 301 | Stable | Vite-based, cleaner learning |

### Scroll + animation
| Repo | Stars | Status | Notes |
|---|---|---|---|
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | 13.9K | Active | **Use this.** The de-facto smooth-scroll. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | 24.7K | Active | ScrollTrigger + Flip + MorphSVG. **Free as of 2024** (Webflow acquired). |
| [motiondivision/motion](https://github.com/motiondivision/motion) | 31.9K | Active | Framer Motion (renamed). Includes Motion-3D for R3F. |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | 12.4K | Stale | Visual timeline editor. Slowing dev. |
| [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) | 932 | Active | **Sync DOM elements to WebGL meshes** — Awwwards signature |
| [pmndrs/use-gesture](https://github.com/pmndrs/use-gesture) | 9.6K | Stable | Mouse/touch/pointer gestures |
| [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | 29.1K | Active | Spring physics — composes with R3F |

### Shader libraries + materials
| Repo | Stars | Status | Notes |
|---|---|---|---|
| [patriciogonzalezvivo/lygia](https://github.com/patriciogonzalezvivo/lygia) | 3.3K | Active | **THE** modular shader function library. GLSL/HLSL/Metal/WGSL. |
| [spite/THREE.MeshLine](https://github.com/spite/THREE.MeshLine) | 2.3K | Stale | Still the best for thick lines |
| [evanw/glfx.js](https://github.com/evanw/glfx.js) | 3.4K | Stale | Image-effect WebGL — classic reference |
| [shader-park/shader-park-core](https://github.com/shader-park/shader-park-core) | 817 | Stale | Write shaders in JS |
| [mattdesl/canvas-sketch](https://github.com/mattdesl/canvas-sketch) | 5.3K | Stale | Generative art framework |

### High-end effects
| Repo | Stars | Status | Notes |
|---|---|---|---|
| [0beqz/realism-effects](https://github.com/0beqz/realism-effects) | 1.7K | Stale | SSGI, Motion Blur, TRAA |
| [0beqz/screen-space-reflections](https://github.com/0beqz/screen-space-reflections) | 589 | Stale | SSR — wet-floor effect |
| [gkjohnson/three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | 1.8K | Active | Real path tracing in the browser |
| [Ameobea/three-good-godrays](https://github.com/Ameobea/three-good-godrays) | 221 | Active | Volumetric light rays |

### Performance + debug
| Repo | Stars | Status | Notes |
|---|---|---|---|
| [utsuboco/r3f-perf](https://github.com/utsuboco/r3f-perf) | 773 | Stable | R3F perf overlay — drop-in |
| [BabylonJS/Spector.js](https://github.com/BabylonJS/Spector.js) | 1.6K | Active | Capture every WebGL call for a frame |
| [mrdoob/stats.js](https://github.com/mrdoob/stats.js) | 9.1K | Stale | Classic FPS counter |
| [cocopon/tweakpane](https://github.com/cocopon/tweakpane) | 4.5K | Active | Lighter Leva alternative |
| [pmndrs/triplex](https://github.com/pmndrs/triplex) | 1.3K | Active | Visual editor for R3F scenes (Unity-ish IDE) |
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | 1.9K | Active | **Install this.** CLI to compress glTF (Draco, Meshopt, KTX2) — 5–20× size reduction |

---

## 4. Open-source portfolio sites to clone and study

| Repo | Stars | What to learn from it |
|---|---|---|
| [brunosimon/folio-2019](https://github.com/brunosimon/folio-2019) | 4.7K | The legendary driveable car portfolio. MIT + Blender files. Gold standard reference. |
| [brunosimon/my-room-in-3d](https://github.com/brunosimon/my-room-in-3d) | 4.4K | Canonical "how to bake light maps for the web" reference |
| [brunosimon/infinite-world](https://github.com/brunosimon/infinite-world) | 583 | Procedurally generated infinite WebGL terrain — chunking/LOD patterns |
| [adrianhajdin/3D_portfolio](https://github.com/adrianhajdin/3D_portfolio) | 1.3K | Beginner-friendly R3F + Tailwind |
| [adrianhajdin/award-winning-website](https://github.com/adrianhajdin/award-winning-website) | 995 | Zentry/Awwwards SOTM clone tutorial. GSAP-heavy. |
| [coldi/r3f-game-demo](https://github.com/coldi/r3f-game-demo) | 655 | Tile-based R3F game — clean architecture for interactive scenes |

---

## 5. Asset sources (free, commercial-OK)

- **[polyhaven.com](https://polyhaven.com/)** — CC0 HDRIs, PBR textures, models. **Use this first, always.**
- **[poly.pizza](https://poly.pizza/)** — low-poly models, mostly CC-BY
- **[kenney.nl](https://kenney.nl/assets)** — CC0 game-art kits
- **[quaternius.com](https://quaternius.com/)** — CC0 low-poly characters and props
- **[KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)** — official glTF reference models for material testing
- **[google/model-viewer](https://github.com/google/model-viewer)** — easiest way to embed a hero glTF outside R3F
- Sketchfab — mixed licensing, filter by "Downloadable" + "CC"

---

## 6. Skill packages (`npx skills add ...`)

Direct 3D / WebGL:
- `cloudai-x/threejs-skills` — 8 sub-skills (~4.4K installs): fundamentals, animation, shaders, textures, geometry, interaction, materials, postprocessing
- `doyoonear/skills-and-agents/3d-web-experience` — R3F + Spline + perf + product configurators
- `dgreenheck/webgpu-claude-skill` — WebGPU + TSL (2026 forward-compat)
- `heygen-com/hyperframes` — already installed; relevant sub-skills: `three`, `gsap`, `animejs`, `waapi`, `css-animations`, `lottie`, `typegpu`

Supporting motion / design:
- `emilkowalski/skill/emil-design-eng` — Emil Kowalski's motion principles
- `pbakaus/impeccable/delight` — micro-interaction polish
- `leonxlnx/taste-skill/high-end-visual-design` — luxury/editorial sensibility

---

## 7. Courses (90-day path)

| Resource | Best for |
|---|---|
| **[Three.js Journey](https://threejs-journey.com)** (Bruno Simon, ~$95) | The gold standard. 90+ lessons, R3F module, growing WebGPU coverage. |
| **[Wawa Sensei — React Three Fiber](https://wawasensei.dev/courses/react-three-fiber)** | Project-based R3F: hooks, controls, models, physics, shaders, particles |
| **[SimonDev — GLSL Shaders From Scratch](https://courses.simondev.io/p/glsl-shaders-from-scratch)** | Deep GLSL course from a 20+ yr graphics engineer |
| **[Awwwards Academy — Merging WebGL & HTML](https://www.awwwards.com/academy/course/merging-webgl-and-html-worlds)** | The Lusion-style DOM/WebGL sync technique, by Yuri Artiukh |
| **[The Book of Shaders](https://thebookofshaders.com)** (free) | Patricio Gonzalez Vivo's fragment-shader bible |
| **[WebGL2 Fundamentals](https://webgl2fundamentals.org)** (free) | Lower-level mental model when R3F leaks |
| **[Codrops WebGL tag](https://tympanus.net/codrops/tag/webgl/)** (free, with source) | The primary case-study publisher; standouts: composite rendering, dissolve effects, GSAP+Astro+Barba scroll gallery |
| **[Maxime Heckel's blog](https://blog.maximeheckel.com)** | The most rigorous R3F+shader writing online |
| **[GM Shaders Mini](https://mini.gmshaders.com)** | Shader patterns, optimization recipes |

90-day path:
1. **Weeks 1–4** — Three.js Journey core, no skipping
2. **Weeks 5–8** — Three.js Journey R3F module + Wawa Sensei in parallel + Maxime Heckel's "Study of Shaders with R3F" end-to-end
3. **Weeks 9–10** — SimonDev GLSL + Book of Shaders. Build one fragment shader a day.
4. **Weeks 11–12** — Rebuild a Codrops tutorial from scratch, add Lenis, ship to portfolio

---

## 8. YouTube channels

- **[akella (Yuri Artiukh)](https://www.youtube.com/@akella_)** — Awwwards-style live breakdowns. **The single best channel for this register.**
- **[Bruno Simon](https://www.youtube.com/@BrunoSimon)** — Three.js Journey author
- **[SimonDev](https://www.youtube.com/@simondev758)** — graphics deep-dives, perf, GPU
- **Wawa Sensei** — R3F walkthroughs
- Visionnn, Yusuf Beyazıt, Chris Courses, Joy of Code, The Real Tim S — confirmed active

---

## 9. Inspiration galleries

- **[Awwwards WebGL](https://www.awwwards.com/websites/webgl/)** — primary
- **[The FWA](https://thefwa.com)** — daily SOTD
- **[Godly](https://godly.website)** — taste-curated
- **[Lapa Ninja](https://www.lapa.ninja)** — landing-page library
- **[httpster](https://www.httpster.net)** — daily curation, agency-leaning
- **[SiteInspire](https://www.siteinspire.com)** — clean filtering

---

## 10. Documentation hubs

- [threejs.org/docs](https://threejs.org/docs) — three.js canonical
- [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs) — React Three Fiber
- [drei.docs.pmnd.rs](https://drei.docs.pmnd.rs) — drei storybook + docs
- [docs.pmnd.rs](https://docs.pmnd.rs) — Poimandres umbrella
- [gsap.com/docs/v3](https://gsap.com/docs/v3) — GSAP, especially ScrollTrigger + Observer
- [lenis.darkroom.engineering](https://lenis.darkroom.engineering) — Lenis docs
- [webgl2fundamentals.org](https://webgl2fundamentals.org) — WebGL2 reference

---

## 11. Communities

- **[Poimandres Discord](https://discord.com/invite/poimandres)** (~10.7K members) — R3F, drei, zustand, jotai. **THE place.**
- **[Three.js Discourse](https://discourse.threejs.org)** — vendor-of-record for engine questions
- Wawa Sensei private Discord — included with the R3F course

---

## 12. X / Twitter accounts to follow

- **@0xca0a** (drcmda) — R3F creator
- **@CodyJasonBennett** — drei maintainer
- **@bruno_simon** — Three.js Journey
- **@MaximeHeckel** — shader/R3F deep-dives
- **@darkroomdevs** — Lenis + darkroom.engineering
- **@akella** — shader breakdowns
- **@awwwards / @thefwa** — daily inspiration
- **@_pmndrs** — Poimandres collective

---

## 13. Conference talks + case studies

- [**Three.js Paris Conference 2026**](https://threejs-journey.com) — Sept 10–11, 2026
- [Codrops](https://tympanus.net/codrops/) — primary case-study publisher
  - "Cinematic 3D Scroll with GSAP" (Nov 2025)
  - "Composite Rendering" (Feb 2026)
  - "Lusion profile" (April 2026)
  - "Implementing a Dissolve Effect with Shaders" (Feb 2025)
- [Awwwards three.js collection](https://www.awwwards.com/websites/three-js/)

---

## 14. Specific recommendations for FutureLine

The site already has the foundational stack (Next.js + R3F + drei + postprocessing + GSAP + Lenis). Three concrete upgrades to push it toward Lusion-tier:

1. **Add [`@14islands/r3f-scroll-rig`](https://github.com/14islands/r3f-scroll-rig)** — sync DOM service-card images to shader-driven WebGL meshes (the classic Awwwards "image with shader effect" pattern)
2. **Install `gltf-transform` + run on every GLB asset** — the hero.mp4 could eventually be replaced by a baked Blender scene exported as a tiny optimized GLB
3. **Pull custom shader functions from [lygia](https://github.com/patriciogonzalezvivo/lygia)** — add `fbm` or `noise` to the existing DualWalkway ribbon shader for organic data-flow rather than just bands (~20 lines of GLSL)

The canonical 2026 stack target:
> Next.js + React Three Fiber + drei + react-three-rapier + Theatre.js + Lenis + GSAP ScrollTrigger + Tempus + r3f-scroll-rig + custom GLSL/TSL shaders + Blender source assets

Bruno Simon's Three.js Journey is the single best paid resource. pmndrs + darkroom.engineering + 14islands GitHub orgs are the free curriculum.
