# Clarissa Builds: reverse engineering and local MVP

Target: https://www.clarissabuilds.com/ — inspected 22 October 2026, Asia/Jakarta.

The homepage is a **Three.js r178 / WebGL2 visualization inside Next.js 15.5.9**, with custom GLSL and small Canvas 2D helpers. The source is sufficiently exposed to recover the lens equation and shaders. A crucial correction to the brief: the four object names are projected annotations, and **brightness/time are graph axes, not sliders**. The original interactions are camera orbiting and text visibility. The supplied prototype deliberately adds the requested controls.

This report uses exactly three finding classifications. Proposed implementation choices live under Inferred and are explicitly distinguished from findings.

## Proven from Client Files

### Evidence and reproducibility

The downloaded HTML, CSS and twelve initial JS/CSS assets are retained in `client/`. Exact URL-to-file relationships follow their `/_next/` paths. `architecture.md` records zero-based decoded character offsets for minified files; these are not byte offsets. `shaders/index.json` records each literal shader's location. No bundle bootstrap was executed to extract its strings.

REA evidence:

| Evidence | Scope |
| --- | --- |
| `ev_569dba88ccdd6ced9b2db30ab16aba25d3215aad77c39212d127426c71621ac7` | Live desktop navigation, DOM/accessibility/screenshot, network, console and page-error capture; reduced motion; 1440×1000 |
| `ev_37c184efe03b889acebf7dd32dddd6ca72972ba9cb1a0dbdc8a5a799b7e97d94` | REA static application graph for exact layout/page/176 chunks; 3 parsed files, 24 modules, zero parse failures; other inventory sources unselected |
| `ev_c15a3ee205dc1b705a73d31755e070f6547d356a47c650d2252808bb076a2a67` | REA performed hide/show-text and projects/writing/cabinet navigation at 390×844 with normal motion; every declared step completed |

The original desktop capture is exported in `rea-evidence.json`; all investigation records at export time are in `rea-evidence-complete.json`. Seven captured route bodies were decoded and hash-verified into `runtime-client/`, with URL/digest provenance in its manifest. These are separate from independently downloaded client assets. `network-summary.json` contains transaction-level evidence. `reference-desktop.png` is the observed original.

### The rendering engine

The dependency chain is explicit, despite symbol minification:

- `bd904a5c-8bd26ce904b58ad0.js`, module 5339: revision literal `"178"` near character 2877, used to register with Three DevTools and `window.__THREE__`.
- `b536a0f1-7811349744a45aca.js`, module 7548: export `JeP → nC`; its class sets `isWebGLRenderer=true` near character 290211. The implementation rejects WebGL1.
- `app/layout-113c514e53b9114b.js`, module 6326: imports those modules as `r` and `l`, creates `new l.JeP({antialias:true,powerPreference:"low-power"})`, and caps pixel ratio at 2.
- Scene code constructs Three Scene, PerspectiveCamera, ShaderMaterial, Mesh, PlaneGeometry, BufferGeometry, Line/LineSegments, Sprite/CanvasTexture and GLTFLoader objects. It does not use React Three Fiber for this scene. A React effect owns an imperative Three renderer.

The scene comprises: distant shader stars; a segmented ground grid; a blue spiral source sprite at `(0,2.6,-10)`; an orange lens crossing the plane `z=-1.5`; Earth at `(0,2.6,6)`; warm curved rays and dashed apparent-image extensions; and a rectangular **lensed image panel**, 4.6×3.1 world units, at `(4.6,3,-11)`. The camera starts at `(7.5,6.8,15)` and looks at `(-.6,.7,-2)`.

The glowing sprite textures are generated with Canvas 2D radial gradients. The source texture uses two logarithmic spiral arms, random clumps, rotation −0.35 radians and vertical compression 0.5. Earth is loaded from `/earth_small.glb`; a successful network response for that asset was observed. The lensed panel generates its galaxy procedurally in GLSL rather than sampling a downloaded galaxy photograph.

**The grid deformation and the lens image are separate effects.** The grid is a visual potential-well metaphor. Its vertex shader lowers each point by:

```glsl
vec2 d = p.xz - uLens;
float well = uDepth / (1.0 + dot(d, d) / 1.6);
p.y -= well;
```

The panel performs backward image-to-source mapping. In normalized Einstein-radius units, the exposed shader implements:

```glsl
vec2 th = (vUv * 2.0 - 1.0) * uHalf;
vec2 t = th - uLens;
float t2 = max(dot(t, t), 1e-5);
vec2 b = th - uLensFade * t / t2;
```

For each image pixel θ, it evaluates source brightness at β = θ − f(θ−θL)/|θ−θL|². The small denominator floor prevents division by zero. `uLensFade` fades both deflection and the orange lens emission during entrance/exit. It is a normalized thin point lens; the shader does not supply mass, gravitational constant or cosmological distances in physical units.

The source spiral uses radius `r`, angle `a`, phase `a − 2.1 log(max(r,1)/8)`, and a two-arm profile `[0.5+0.5 cos(2 phase)]^6`. Four-octave value-noise FBM modulates its clumps. A warm core and blue halo complete the source. Additional hashed field galaxies pass through the same inverse mapping. The lens light is added separately as orange exponential falloffs plus a concentrated core. A vignette dims the panel edges.

Full exact recovered shader literals:

| Files in `shaders/` | Purpose |
| --- | --- |
| `00-vertexShader.glsl`, `01-fragmentShader.glsl` | Spacetime grid well, edge fading and color |
| `02-vertexShader.glsl`, `03-fragmentShader.glsl` | Image-panel UV projection and complete gravitational lensing fragment shader |
| `08-vertexShader.glsl`, `09-fragmentShader.glsl` | Shared point-star sizing, twinkle and soft circular point fragment |
| `04`–`07` | Cabinet detector effects also present in the shared bundle; not lensing code |

The 3D light paths use analytic image positions plus straight segments joined with quadratic Bézier bends. They are **illustrative curves**, not numerical integration of relativistic geodesics. The panel's image mapping is where the optical distortion actually happens.

### Animation, state and UI bindings

Original time progression is `progress = (elapsedSeconds/24 + .32) % 1`. Lens horizontal position is a cubic easing:

```js
q = 2 * progress - 1;
x = 7.5 * (.3 * q + .7 * q * q * q);
fade = smoothstep(0,.06,progress) * (1-smoothstep(.94,1,progress));
```

The same animation function updates the lens position and opacity, grid uniforms `(uLens=(x,-1.5), uDepth=1.5*fade)`, star `uTime`, Earth rotation, ray buffer positions and panel uniforms `(uLens=(x/.7,.15), uLensFade=fade)`. GPU attributes are marked `needsUpdate`. It then renders the scene and draws the 2D graph. Parameters live in the effect's closure and Three objects; React does not rerender on every frame.

For ray positions, the impact parameter is `u=hypot(x,.105)/.7`. The signed image radii are `.7*(u ± sqrt(u*u+4))/2`. The .105 offset avoids exact central alignment. The analytic total point-source magnification is:

```js
A(u) = (u*u+2) / (u*Math.sqrt(u*u+4));
```

The bottom-right chart precomputes 401 values, paints the entire light curve faintly and the elapsed portion in the accent color. This curve models a point source; it does not numerically integrate the displayed extended spiral's flux. Its 156×72 canvas has `pointer-events:none`; “brightness” and “time” are axis captions. There are no range inputs in this recovered homepage UI.

Likewise the four object names are `pointer-events:none` spans projected from world coordinates with camera `.project()`. Their opacity is reduced when their bounding boxes overlap `[data-no-orbit]` content. They are annotations, not toggle buttons.

Original interactive state:

| Input | State → effect |
| --- | --- |
| Pointer drag outside `a,button,[data-no-orbit]` | Custom target spherical theta/phi; increments −0.005/−0.004 radians per pixel, clamps azimuth ±0.7 and elevation; current values ease toward targets by 0.12 per frame |
| Double-click outside protected content | Resets target orbit offsets to zero |
| Text eye button | React `useState(false)` sets/removes root `data-text-hidden`; CSS fades/hides `.hideable`; button moves to a recoverable fixed position and updates accessible state |
| Reduced motion preference | Uses fixed progress .485 and event-driven redraw; no normal continuous animation loop |
| ResizeObserver | Updates renderer dimensions, camera projection and chart pixel dimensions |

Cleanup cancels RAF, disconnects observers, removes listeners and disposes tracked geometries/materials/textures/renderer. Async model load has an unmount guard.

### Framework, navigation and layout

The shipped versions are **Next.js 15.5.9**, **React 19.2.0-canary-0bdb9206-20250818**, **Three.js r178**, and **Tailwind CSS 4.1.11**. These come from explicit version literals/banners, not stylistic guesses. Webpack chunk registration/runtime is visible. HTML contains React Flight `__next_f` and App Router client references.

Navigation uses Next Link plus `usePathname()`, with `/` matching exactly and other sections using prefix matching. The shared layout selects different visualization components:

| Route | Scene |
| --- | --- |
| `/` | Gravitational lensing |
| `/projects` | Robotics scene |
| `/writing` and descendants | Shared background returns null; writing page supplies its own orbital Canvas 2D visualization and small Three Earth thumbnail |
| `/cabinet` | IceCube detector scene |

The full-screen canvas is fixed at the bottom layer. A pointer-transparent radial dark wash sits at z=1; text at z=10 uses `h-svh`, a centered max width of 26rem and an independently scrolling body under a nonshrinking header. This keeps long content from displacing the universe. Pointer filtering lets reading and links coexist with orbit controls.

The text is 14px at line-height 1.7. Palette: background `#0c0b0a`, ink `#e9e2d3`, muted `#8f877a`, faint `#3a3631`, accent `#d98b5f`. Body is Libertinus Serif; display/nav Libertinus Sans; labels Archivo Narrow. Inter and Libertinus Mono are shipped too. `architecture.md` lists all nine WOFF2 URLs and exact faces/weights. Fonts use `font-display:swap`.

At the 40rem breakpoint, horizontal text padding disappears and vertical padding increases; the chart is hidden below that breakpoint. The scene also fits its perspective camera using aspect ratio, applies a 12%-width view offset in portrait, and caps DPR at 2. Other CSS breakpoints include 48rem, 64rem and 80rem. Body uses `touch-action:pinch-zoom`; reduced motion and keyboard focus styling are explicit.

### Network and content delivery

The 4.793-second desktop capture recorded 32 successful GET transactions, no failed requests or page errors: document, stylesheet, 9 fonts, 14 scripts and 7 fetches. Every recorded origin was the site's origin, including three blob URLs. Three `text/x-component` RSC prefetches loaded `/projects`, `/writing`, `/cabinet`; request header names included `rsc` and `next-router-prefetch`. These prefetches are distinct from the later mobile route-click replay.

Prefetched payloads contain serialized project, writing and cabinet content props. Cabinet code can assign an external iTunes audio preview URL and call `play()` on a user's click; that audio was not requested by the homepage capture. A project's displayed “supabase” stack label is not evidence that this portfolio uses Supabase as its backend. See `network.md` for request identities, route bodies and limitations.

## Inferred

### Development and source organization

App Router source probably uses `app/layout` with a client background switcher, a mostly server-rendered `app/page`, small Navigation/Tooltip/HideText components, and route directories for projects/writing/cabinet. These names and `.tsx` extensions are a proposed reconstruction, not recovered filenames. Generated font classes, fallback metrics and local media outputs strongly suggest `next/font`. The Vercel-branded response header names suggest Vercel delivery; header values and deployment configuration were not recovered.

### Proposed clean local MVP — implementation choices

Use **plain ES modules + Three.js + CSS** for the small prototype. The only runtime dependency is pinned `three@0.180.0`; the reference's revision is r178. The starter intentionally uses a newer pinned compatible API rather than claiming its dependency is the recovered original. Node's built-in HTTP server provides local serving. No React, routing library, physics engine, state library or asset service is required to explain the technique. A production multi-page portfolio can use Next.js App Router with the same imperative renderer owned by a client effect; that is an optional later step.

```text
package.json / package-lock.json    pinned Three dependency and scripts
server.mjs                         local static server
prototype/
  index.html                       overlay, inputs, import map
  styles.css                       responsive dark typography and layering
  main.js                          state, UI events, hash-section navigation
  lensing.js                       scene, orbit, animation, magnification chart
  shaders.js                       independently written starter GLSL
  fonts/                           three reference-served font subsets
analysis/
  REPORT.md                        this report
  architecture.md / network.md      supporting findings
  client/ / runtime-client/         original evidence
  shaders/                         exact recovered GLSL strings
  qa/                              screenshots and verification results
```

State is a single mutable object read by the render loop. Event handlers modify booleans, brightness and normalized time; RAF reads those values and updates uniforms, visibility and geometry. Time scrubbing pauses playback. Reduced motion starts paused. Sliders and checkboxes remain keyboard operable. The prototype keeps the same scene between hash sections to stay small; it does not implement the reference's three additional scene systems.

| Added MVP control | State and rendering binding |
| --- | --- |
| Background galaxy | `state.source` → source Group visibility and fragment `uSource` |
| Foreground galaxy | `state.foreground` → lens Group visibility, `uStrength`, `uForeground`, grid `uDepth`, primary rays and chart baseline |
| Earth | `state.earth` → observer Group and ray visibility |
| What Earth sees | `state.panel` → panel Mesh visibility |
| Brightness | input event → `state.brightness` → fragment `uBrightness` and lens-sprite opacity |
| Time | input event → `state.time`, paused playback → CPU lensX/time calculation → `uLens`, ray buffers, chart, Earth rotation |
| Play/pause | `state.playing` gates time advancement; unchanged paused state skips GPU rendering |

For an exact aesthetic reconstruction, the original camera fitter is also recoverable from module 8696: when aspect is below 2, compute `i=(2/aspect)*tan(32°/2)`, cap the vertical half-FOV tangent at `tan(50°/2)`, and multiply orbit radius by `max(1,i/tan(25°))`. The starter implements that fit plus the portrait view offset.

Core shader flow in the implemented starter:

```glsl
vec2 theta=(vUv*2.0-1.0)*vec2(3.412903,2.3);
vec2 d=theta-uLens;
vec2 beta=theta-uStrength*d/max(dot(d,d),1e-5);
vec3 color=galaxy(beta)*uSource;
// Add foreground light independently, then multiply displayed radiance.
gl_FragColor=vec4(vec3(.008)+color*uBrightness*vignette,.96);
```

The full working shader is `prototype/shaders.js`; all control bindings are in `prototype/main.js`. The source and lens toggles affect image/light visibility, foreground additionally removes deflection and grid depth, Earth toggles its model/rays, and panel toggles the observer image. Brightness scales displayed lens-image radiance and lens sprites. These controls are additions requested in the brief, not recovered original UI. The starter uses a simple sphere instead of the original Earth GLB, a rewritten procedural spiral/noise shader, two primary rays and simplified stars/grid. It preserves the reference's concept and palette, not a pixel-exact clone or a general relativity solver.

Run from the workspace:

```powershell
npm install
npm start
# Open http://127.0.0.1:4173/
```

No build step, account, API key or internet access at runtime is needed after install. Original placeholder prose clearly describes the study; replace it and add your own portfolio work before publication. The fonts were retrieved from the public CSS URLs for the local study; check the respective font licenses when distributing the project. No original biography, project media, audio, Earth GLB or original JS bundle is used by the prototype.

## Hidden / Obfuscated

- The JS is minified, but the lensing GLSL strings are readable and recoverable. Most original JS symbol names, component boundaries/types, repository structure, source comments and authored TS/JS choice remain unknown. No source-map marker was found in the downloaded initial JS; unadvertised source maps were not exhaustively probed.
- The browser receives server-produced HTML and Flight payloads. That does not determine whether each route was statically generated, dynamically SSR-rendered, revalidated, or sourced from a CMS at build time. Server code, secrets, lockfiles, original dependency constraints, build scripts and private content integrations cannot be recovered from this client snapshot.
- No custom CMS/API integration was observed in the bounded homepage requests or extracted route code. This does not rule out server-side CMS calls, later user-triggered requests or other pages. The original development OS, Node version, package manager and editor are not established.
- The large static library chunks were independently downloaded, not recovered completely from the live network body's capture. Eight selected bodies were unavailable in the desktop evidence: five allocation-limit omissions including the GLB, three blob body-read failures. All of those requests still completed successfully. REA marks this capture incomplete; zero dropped events does not imply complete body coverage.
- REA scenario traffic has no request initiator stacks. Recorded order alone does not establish causality. Playwright `Response.body()` may use a follow-up load and is not guaranteed to represent wire bytes of the original transaction. A short, clean capture does not prove the site never sends analytics or external requests.
- Static REA analysis was limited to three exact application chunks. Its graph is partial, includes dynamic/minified relationship unknowns, and does not establish that every function was executed. The exact shader formulas are direct client-file evidence; recovered component hierarchy and development assumptions remain inferred.
- The visible physics uses a normalized point lens and a decorative potential well. Neither the original nor this MVP establishes calibrated masses/distances, extended-source photometry, multiple-lens caustics, relativistic ray tracing, or scientific simulation accuracy beyond these exposed approximations.

Final verification: browser checks passed at 1440×900, 768×1024 and 390×844 for time/brightness controls, all visibility toggles, hide/show text, sample navigation, play and reset; no JavaScript or shader console errors were recorded. Syntax and independent lens-equation numeric checks passed. `qa/VERIFICATION.md` records visual critique, explicit reference-specific inspector exceptions, screenshots, limits and remaining MVP differences. No hardware performance benchmark or full scientific-accuracy validation was performed.
