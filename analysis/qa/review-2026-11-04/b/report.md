# Assessment B / technical audit — 2026-11-04

Target: Website Portofolio, http://127.0.0.1:3000. Read-only source/runtime review. AGENTS.md owner-approved pills, warm workbench 3D, terminal opening and success vignette were treated as requirements. Assessment B was conducted independently of A until the parent reported A complete; parent subsequently supplied A observations for synthesis. Parent sent some A observations late in B, but B findings below derive from B's earlier source/runtime evidence.

## Integrity verdict

PASS: coherent subject-specific system, with a single warm personal electronics lab, route-specific viewpoints, real project content, restrained reusable controls and independent HTML reading/navigation. No verified systemic detector issue.

## Audit score

| Dimension | Score /4 | Evidence / limit |
|---|---:|---|
| Accessibility | 3 | Labels, headings, native dialog, keyboard return and 44px principal controls work; static scene instructions need correction. No full screen-reader or pixel contrast certification. |
| Performance | 3 | Shared capped renderer, pause/hidden stopping, optimized Next images; original ID textures unnecessarily heavy. No production performance measurement. |
| Theming | 3 | Ground/ink/muted/accent/surface tokens, fixed intentional dark theme; repeated dialog literals remain. |
| Responsive design | 3 | Home checked at 1440/768/390, project collections at all three, About/Experience/Writing/Cabinet phone semantics. No overflow on inspected settled layouts; principal controls >=44px. Actual touch gestures untested. |
| Implementation integrity | 4 | Empty deterministic detector; taste flags explained against actual implementation and approved brief. |
| Total | 16/20 | Good; finite improvements below. |

## Verified findings

### [P2] Static scene gives instructions for unavailable rotation

Location: src/components/scene/scene-host.tsx:142, 141 and 164-170.
Category: Accessibility / implementation behavior.
Evidence: selected Use static view on Home, navigated to About, activated Hide text with Enter. Accessibility tree announced “Electronics lab. Drag or use left and right arrow keys to rotate; Escape returns to reading.” The scene state was static, the scene host had no tab stop because `interactive` was false, and rotate/reset controls were absent. Escape did correctly restore Hide text focus. The label branches on `exploration` alone rather than `interactive && exploration`.
Impact: assistive technology users receive instructions that cannot work in the selected static mode.
Recommendation: static overview label should describe the image and Escape return only; give rotation instructions only while interactive. Suggested command: $impeccable harden.

### [P2] Small scene badges download full original PNGs

Location: src/lib/scene/scene-photos.ts:13-23; src/data/scene-photo-slots.json:2-4; src/lib/scene/create-personal-lab-scene.ts:201.
Category: Performance.
Evidence: loader immediately assigns each configured original path to `new Image().src`, then uploads the original image as THREE.Texture with UV cropping, without an image size derivative. public/photos/digilab-id.png is 586,490 bytes, exercise-id.png 547,590, kominfo-ime-id.png 635,552; total 1,769,632 bytes. These are three small background badge portraits in a shared scene. Next Image optimization used for HTML imagery does not apply to this loader.
Impact: avoidable transfer and texture decode/upload cost during 3D preparation, particularly on phones. This is a source/asset finding, not a claimed production CWV regression.
Recommendation: pre-size dedicated WebP or AVIF badge texture derivatives, preserving originals for real content. Suggested command: $impeccable optimize.

### [P3] Dialog surface bypasses available theme tokens

Location: src/app/globals.css:390,393 (also local toolbar/control colors).
Category: Theming.
Evidence: detail-dialog and sticky dialog-toolbar each repeat #1c1a16 instead of a shared semantic surface token; root surface tokens exist at line254.
Impact: future palette adjustment can leave toolbar/body mismatched. No current visible failure or dark-mode requirement inferred.
Recommendation: use a semantic dialog surface token when polishing the stylesheet. Suggested command: $impeccable polish.

Counts: P0=0, P1=0, P2=2, P3=1.

## Verified positive runtime evidence

- Fresh IAB tab, desktop 1440x900, tablet 768x1024 and phone 390x844.
- Home one h1, meaningful identity/body description, labelled GitHub/LinkedIn/Instagram/email links, 44x44 social targets.
- Header links >=44px; phone header rearranges into six equal controls over two rows.
- Home static preference persisted on route navigation. Static posters selected appropriate route and resolution.
- Project heading remains outside a bounded native scroll collection: tablet collection client702/scroll1035; phone client438/scroll1349. No horizontal document overflow in observed Projects layouts.
- ArduiMania detail opened using keyboard Enter; native dialog initial focus Close detail; Tab advances into gallery track; Escape closes and returns to originating card. Verified desktop and phone. Sticky Close remains visible in phone dialog.
- Hide text Enter hides reading content; Escape restores focus to Hide text on About.
- About lower links are keyboard reachable after native document scrolling. B did not establish an unreachable/footer obstruction defect. Reading boundary measured top136px/bottom142px at phone, last Cabinet link visible above footer.
- Writing one h1 and linked article h2. Cabinet one h1 and titled h2 items, play buttons labelled, no audio autoplay (`preload=none`).
- HTML images have meaningful alt text; decorative scene poster alt is empty under described role=img container. Project and portrait images use lazy Next Image optimized variants.
- Source guards: motion-provider.tsx32-43 honors reduced-motion, CSS globals124 disables CSS motion, navigation animation guards pause/reduced/hidden, shared scene loop stops via setAnimationLoop(null) on paused/hidden and caps at30fps idle/60fps transitions (create-personal-lab-scene.ts104-116). Browser reduced-motion emulation was unavailable; this part is source evidence.

## Detector and taste accounting

`impeccable.cmd detect --json src` returned [] and completed. Saved detector.json. No count inflated into findings.

Taste source lint scoped to src: 49 files, 3 FAIL and1 WARN. globals.css523/527 linear gradients are functional article reading fade masks; create-personal-lab-scene.ts134 “shadow” is a comment about existing 3D shadow cadence, not a decorative box shadow; em-dash aggregate is not a demonstrated defect. These are not recommendations to remove approved visuals.

Taste inspector first sandbox attempt failed with Chrome crashpad named-pipe error, exit4294930433. One elevated retry succeeded at1440/768/390 and saved taste/report.json and six images. It captured approved opening terminal at1.2s, so no-title/no-hero/late-title are timing/brief mismatches, not missing HTML.

A second elevated inspection at documented hash-skip URL /#main covered settled Home, saved taste-settled/report.json and six images. All widths show visible h1, zero horizontal overflow. Body is17px/17px/16px with1.6 leading. Inspector reports body contrast15.2, but this is CSS-ground contrast and must NOT be taken as pixel contrast certification over the 3D backdrop.

Settled findings: pill-nav (approved), palette-terracotta (approved warm accent), few-pictures/no-footage (3D portfolio concept deliberately replaces photo/video bands), still-page (DOM movement count misses canvas animation), name-only-title (false positive; body explicitly says Computer Engineering student at Universitas Indonesia and software/robotics). No stylistic blanket flag promoted to a verified issue.

## Run notes / limitations

Target slug should be assigned by parent synthesis. Ignore list: no detector CLI ignore list used; owner exceptions reviewed manually. Independence: source/runtime evidence collected before A completion; see qualification above regarding parent late observations. CLI detector usable. IAB viewport testing was background, no user-visible overlay claimed. IAB evaluate is documented read-only, so mutable script injection unavailable; live detector helper server not started, no stop needed. Existing Next server left running. IAB viewport override reset and own tab closed. Inspector processes exited naturally. Persistent review reports/screenshots retained intentionally; no source edits.

No physical device, touch gesture synthesis, full screen reader, browser zoom200%, production bundle/CWV, sustained GPU profile or rendered pixel contrast matrix completed. Native UI screenshots taken immediately after route clicks sometimes show in-progress fades; those transient screenshots were not classified as missing content. No report of AA failure is made without demonstrated evidence.

Recommended order: $impeccable harden (static instructions), $impeccable optimize (badge derivatives), $impeccable polish (surface token). Re-run focused audit after changes.
