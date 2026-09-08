# Sky Tablet — production takeover checkpoint

Date: 2026-09-08. Status: **inspection performed; implementation and preview acceptance blocked by unavailable WebGL in the supported QA browser**. This is not a completed production reconstruction.

## Recovery baseline

- Repository: `AndrewLamSingapore/sky-tablet`.
- Inspected source commit: `97cb87405c91791907f8dbedf5270344d5782b88` on `main`.
- Commit message: “Emergency restore working Sky Tablet v5 after empty v6 index”.
- Isolated working branch: `production/sky-tablet-takeover`.
- Vercel project: `prj_MniyVhjPHLiwQufvuqIjeYErQmEP`.
- Current production deployment reported READY: `dpl_BDcrtGjuZTP6cxU8k5ACy3kAJHFo`.
- Production deployment URL: `https://sky-tablet-2h2u9c3st-andrew-lam-singapore.vercel.app`.
- Public alias: `https://sky-tablet.vercel.app`.
- Vercel project listing reports `link: null`; do not assume pushing a GitHub branch creates a Vercel preview.
- Production, deployment aliases, access policy and application source have not been modified by this takeover checkpoint.
- An older local checkout contains uncommitted work. It was left intact; the takeover uses a fresh clone.

The Git commit and production deployment are independently observed recovery identifiers. Deployment metadata does not establish byte-for-byte equivalence between them. Preserve both and compare the deployed artifact before promotion.

## Material inspected

Read `index.html`, `README.md`, and `CINEMATIC_3D_SPEC.md` at the current repository baseline; inspected repository inventory, Vercel project and deployment history, and the live page DOM and console. Visually inspected recovered user screenshots:

- `IMG_5826.jpeg`: blue monumental gate illustration, animal reliefs, pale paving, varied procession and warm architectural accents. The image is a visual reference, not historical proof. Its formal approval status was not independently recovered.
- `IMG_5828.jpeg`: aerial city reconstruction with courtyards, varied roof levels and connected streets. Also a visual reference, not primary evidence.
- `IMG_5921.jpeg`: doorway fills the cinematic threshold frame.
- `IMG_5922.jpeg`: oversized tablet, elementary stepped city masses and isolated glowing lights.

These personal screenshots remain outside the public repository. No image reuse license or primary historical attribution was established by their inspection.

## Existing architecture to preserve

The public entry point is a buildless HTML page with an inline Three.js ES module imported from jsDelivr (`three@0.180.0`). It owns scene construction, procedural textures, scene provenance tags, the camera sequence, input handling and animation.

The application has `idle`, `tour`, and `free` states. A shot array stores positions, targets, field of view, duration and captions. The tour interpolates adjacent camera positions and targets with an ease function. Canonical reset, free exploration, Evidence Lens and the four named primary controls already exist. Preserve the interaction concepts and evidence/interpretation contract; do not assume every implementation detail is correct.

The current implementation does not load production environment meshes, sculpted figures, relief assets or material sets. Its buildings, people and vegetation are assembled from primitive geometry. The repository inventory has no Blender source, glTF scene, authored collision mesh or asset provenance manifest.

## Confirmed source defects and limits of observation

| Finding | Source evidence | Required correction |
| --- | --- | --- |
| Threshold is not an open passage | `gateFacade()` places a solid central 18 × 31 × 9 block across the route, plus solid recess, inner frame and door meshes. The extruded arch shape is filled, not a ring with an opening. | Author a genuinely open portal and interior thickness; validate the swept camera volume through it. Retain readable wall edges and visible world beyond. |
| Tablet is monumental rather than handheld | `roundedTablet()` uses width 4.3, height 6.8 and depth 0.8 against figures roughly two scene units high. | Define a metre convention and use a documented small tablet reference; compose a close encounter at the artifact's actual scale. The exact object remains interpretive unless tied to a source. |
| Tablet inscription geometry is detached | Wedges are added directly to the scene while the tablet is separately rotated. | Parent surface detail to the artifact or bake it into its material/geometry with explicit transcription status. |
| Information card interrupts the tour | `tour()` sets `tabletCard.style.display='block'` in shot index 6. | Remove automatic card presentation. Keep provenance available only through a deliberate request. |
| Evidence and reconstruction are conflated in object tags | Gate meshes, filled arch, simplified reliefs and the invented tablet use `kind='evidence'`. | Label constructed objects interpretive; link their supported attributes to separate cited claims. Tag spatial extensions imagined. |
| Evidence Lens misses grouped geometry | `evidence()` skips tagged objects without `.material`; human and relief groups have child materials. | Traverse/render descendants consistently, preserve original materials and dispose temporary resources. Do not equate color coding with proof. |
| Free exploration can penetrate geometry | `roam()` clamps world bounds but has no collision test. | Use explicit walkable regions and capsule/swept collision against authored simplified colliders. Test oblique walls, corners, passage and tablet furniture. |
| Free exploration changes view direction | `freeMode()` does not synchronize yaw/pitch with the cinematic camera. | Derive heading and pitch from the current camera; preserve continuity on interrupt and tour completion. |
| Movement depends on frame rate | `roam()` moves 0.24 units each frame although the loop computes `dt`. | Use elapsed seconds, normalized diagonal input and bounded integration. |
| Touch and keyboard release paths are incomplete | Touch buttons lack pointer capture; renderer lacks pointer-cancel handling; key state is not reset on blur or visibility loss. Arrow-key defaults are not prevented. | Handle cancellation, lost capture, blur and visibility; stop stuck movement and unintended scrolling. |
| Mobile viewport and text need revision | Mobile world has a 720px minimum height; primary control text is 12px; the touch pad is always displayed under the breakpoint. | Use the available dynamic viewport and safe-area insets, readable labels, separated touch zones and free-mode-only movement controls. Verify actual mobile behavior. |
| Celestial reveal loses the city | A shot points from `[0,14,-44]` to `[0,72,-44]`, directly overhead. | Storyboard the tilt and celestial layout together so the lower frame retains meaningful city context. |
| Tablet-to-sky transformation is only narration and reveal timing | Tablet remains unchanged while sky paths fade in and camera moves. | Implement continuous visual correspondence between tablet marks and celestial structures without claiming a literal ancient diagram. |
| Final shot is not a resolved city-and-sky panorama | It looks from `[0,54,-4]` toward `[0,10,-34]` while paths sit at heights 58–82. | Compose a new final camera with both architecture and celestial structures in view; verify framing across aspect ratios. |
| Venus is a literal sphere and bead trail | Separate sphere, point light and 22 bead meshes define the sequence. | Stage Venus as an apparent celestial guide with an explicit schematic interpretation, controlled visual size and a composed trajectory. |
| Performance has structural risk | 680 separate dust mesh/material pairs plus many point lights and thousands of separately constructed building/crowd elements; full scene traversal every frame. | Batch dust as particles, instance repeated assets, budget lights, bake distant detail and measure frame times. No actual GPU performance measurement was possible. |
| Repeated visual QA is nondeterministic | Texture and scene construction use unseeded `Math.random()`. | Use a recorded scene seed and addressable shot times for reproducible screenshot comparisons. |
| WebGL startup failure produces an empty scene | Import failure is caught, but `new THREE.WebGLRenderer` is outside error handling. | Catch renderer/context initialization and context loss; expose a useful accessible failure state and prevent inert navigation controls. This failure was observed live in this QA browser. |

Findings based on source are not claimed as newly rendered visual test results. The two historical user screenshots independently illustrate threshold and tablet defects.

## Visual production direction

Preserve the reference's glazed blue, warm stone, ornamental rhythm, layered procession and painterly tonal hierarchy. Night treatment must retain the blue material identity and legibility of faces, paving and reliefs. The opening composition should be developed against the reference before extending the city.

Recommended pipeline once graphics inspection is available: authored Blender environment and modular architecture, modeled reliefs and clothed figures, baked normal/roughness detail, glTF export, level-of-detail assets and browser Three.js presentation. Preserve working navigation concepts while separating scene assets, camera direction, input and provenance. Unreal Engine experimentation is optional and should only be introduced if it demonstrably improves this browser delivery. No Blender or Unreal production work was performed at this checkpoint.

Every asset needs a provenance record: source and license where applicable, supported attributes, interpretive changes, and imagined extent. A visually detailed asset does not become an evidence-based historical claim. Primary scholarship verification remains outstanding; no new historical claim is approved by this audit.

## Required storyboard and acceptance

| Shot | Direction | Acceptance requirement |
| --- | --- | --- |
| 1. Canonical tableau | Hold the reference-led monumental gate and layered human procession. | Reads as artwork; strong focal hierarchy; credible material and figure detail; full composition remains intentional on mobile. |
| 2. Image breathes | Small camera displacement, cloth/fire/atmospheric motion. | Depth appears without abrupt zoom, scene replacement or loss of the original composition. |
| 3. Processional approach | Descend smoothly toward human eye level along a clear route. | People read at consistent scale; camera does not pass through figures or street furniture. |
| 4. Threshold | Traverse a real portal with visible interior continuation. | Swept camera and near plane clear the opening; no solid door, black fill or wall dominates the full frame. |
| 5. Interior reveal | Reveal an authored courtyard and connected city beyond the reference. | Multiple depths, credible architecture from this angle and explicit imagined-extension provenance. |
| 6. Tablet | Move into a side-court encounter with a small clay object. | Artifact remains human-scale; inscription detail belongs to its surface; no automatic popup. |
| 7. Tablet becomes sky | Transform a selected visual motif into a celestial reading during a continuous tilt. | Visible spatial correspondence; no cut to a blank sky; interpretation status retained. |
| 8. Three Paths | Reveal distinct, legible celestial structures over the city. | Enlil, Anu and Ea remain readable and visually separated; architecture is still present below. Mapping must be source-checked and schematic status disclosed. |
| 9. Venus | Let the apparent celestial light guide a controlled change in composition. | Venus connects the sequence and the horizon; it does not read as a nearby glowing ball. |
| 10. Final panorama | Resolve city, gate and celestial structure into one wide frame. | Satisfying hierarchy and skyline; no missing architecture or sky system; smooth handoff to free exploration. |

## Acceptance and deployment procedure

1. Keep the recorded production deployment and aliases frozen during development.
2. Add reproducible named shot checkpoints and scene seed on the isolated branch.
3. Implement and inspect one coherent scene slice, then the full continuous sequence. Inspect both checkpoint frames and transitions; isolated screenshots do not prove collision-free motion.
4. Test desktop and real touch/mobile behavior: cinematic start, interruption, reset, free exploration, evidence open/close, pointer cancellation, resize, orientation and focus loss. Validate the opening and all ten shots in portrait and landscape layouts.
5. Measure loading cost, memory and frame-time distributions on defined test devices. Proposed targets are sustained 30fps on a representative mobile device and 60fps on a representative desktop at declared quality settings; these are targets, not measured results.
6. Deploy explicitly to an isolated preview environment. Record its immutable deployment ID, source commit, asset manifest and settings. Do not use a production alias as a preview.
7. Repeat the complete acceptance on that deployed preview. Fix failures and test the replacement preview; do not transfer acceptance between differing artifacts.
8. Only after every gate passes, promote the exact tested deployment without rebuilding. Preserve the original deployment for rollback and verify the resulting production alias.

## Current infrastructure blocker

The supported cloud browser can load the live page and Three.js module but cannot create a WebGL context. It reports:

```text
GL_VENDOR = Disabled, GL_RENDERER = Disabled
THREE.WebGLRenderer: Error creating WebGL context.
```

The visible result is a background gradient and controls, with no canvas. Reloading once reproduced the error. The supported browser API and troubleshooting documentation expose no graphics-enablement or alternate renderer configuration. No alternate browser-control mechanism was used.

This is an environment limitation, not a claim that production is universally broken. A WebGL-capable browser connected to the development/preview environment is required to continue the mandated render–inspect–correct loop. User-supplied screenshots are useful historical evidence but cannot substitute for autonomous QA of future changes.

## Gate status

- Repository and deployment discovery: performed.
- Baseline source, policy and available reference inspection: performed.
- Formal approval of recovered reference images: unverified.
- Isolated branch: established.
- Production asset construction: not performed.
- Application changes: none.
- Desktop rendered cinematic QA: blocked.
- Mobile rendered/touch QA: not performed.
- Collision/path acceptance: not passed.
- Historical source verification: not performed beyond existing project policy.
- GPU performance measurement: not performed.
- Preview deployment: not performed.
- Production promotion: prohibited until acceptance; not performed.
