# Babylon cinematic production — Higgsfield
Date: 19 October 2026. Owning source reviewed: Sky Tablet main 9448992e95a82b6504d3d1edfb1a8cf04d85864b.
Shared references reviewed at ORQEVIA f982e2a39ff569869e493b7743feebcd7bd48901. This is a production specification, not a generated-video or deployment receipt.

## Deliverable
An optional, approximately 40-second Babylon film alongside the existing interactive Three.js journey. Preserve free exploration, the tablet encounter, Interpretation Lens and original score. Pre-rendered video cannot provide navigable 3D geometry.

## Reference register
User upload: Abex_Ancient_Babylon_References (1).zip. Four screenshots inspected.
- IMG_9304.jpeg: Ishtar Gate replica, David Stanley; screenshot displays CC BY-SA 3.0. Use blue glazed brick, relief animals and monumental scale as visual cues. Verify original source and applicable attribution/share-alike terms before distributing a derivative or the source photograph.
- IMG_9305.jpeg: Bruegel the Elder, Tower of Babel (1563), a later artistic treatment of Genesis 11. Use only in an explicitly labeled biblical/artistic interlude, never as archaeological reconstruction.
- IMG_9306.jpeg: later Hanging Gardens engraving and a Seven Wonders timeline. Composition inspiration only; do not reproduce the timeline or treat it as evidence for the gardens.
- IMG_9307.jpeg: speculative garden plants: olive, quince, pear, fig, almond, grape, date palm, tamarisk and Pistacia atlantica. Screenshot itself flags an unreliable source. Treat planting as art direction, not a verified species inventory.
Do not publish screenshot browser chrome, encyclopedia text or unverified third-party illustrations as finished assets.

## Shared visual direction
Original cinematic interpretation of ancient Mesopotamia. Naturalistic materials, weathered mud brick, deep lapis-blue glazed brick, restrained gold relief, warm torchlight, dusty dusk and a deep indigo sky. Physically plausible scale and stable architecture. Slow deliberate camera movement. No fantasy palace, European medieval city, modern buildings, tourists, modern clothing, neon, interfaces, captions, watermarks or invented legible cuneiform. Add all labels as accessible HTML or subtitle tracks after generation. Keep 16:9 framing with the subject in the central 60 percent for mobile.

## Shot prompts
Paste the shared direction plus one shot into Higgsfield. Durations are editorial targets; use the nearest supported duration and trim exports.

1. **Gate approach — 7 seconds — IMG_9304**
   At human eye level, slowly dolly along a dusty processional approach toward a monumental lapis-blue glazed-brick gate. Weathered cream and gold animal reliefs, deep shadow within the arch, a few distant adult figures in simple linen garments, date palms beyond the walls. Preserve rectilinear masonry and relief patterns throughout the move. End beneath the arch, looking into warm city light.
   Label: Ishtar Gate — cinematic interpretation.

2. **Gardens revealed — 8 seconds — IMG_9306**
   Begin in the shadow of a brick passage and crane gently upward to reveal an imagined terraced riverside garden. Heavy mud-brick retaining walls, planted terraces, shaded walkways and modest gravity-fed water channels. Date palms rise above layered foliage. No white marble fantasy palace. Keep garden layout stable and the water physically believable.
   Label: Hanging Gardens — imagined interpretation; existence and location debated.

3. **Living garden — 6 seconds — IMG_9307**
   Slow lateral tracking at terrace level through date-palm fronds, fig leaves, grape vines and olive foliage. Warm reflected dusk light on a narrow water channel; subtle wind, a few natural droplets, textured earth and brick. Selective focus without morphing leaf shapes or moving the architecture.
   Label: Planting is an artistic interpretation.

4. **Babel interlude — 7 seconds — IMG_9305**
   A separate painterly vision inspired by the monumental spiral composition of Bruegel's Tower of Babel: an immense unfinished tower, distant workers for scale, hazy river landscape and gathering clouds. Slow restrained orbit. This shot is deliberately an artistic biblical vision, visually distinct from the gate and garden interpretation. No collapse, spectacle or assertion of archaeological accuracy.
   Label: Tower of Babel — Genesis 11; artistic vision inspired by Bruegel (1563).

5. **Clay to cosmos — 10 seconds — existing Sky Tablet world**
   Close view of a weathered clay tablet under warm side light, abstract wedge impressions without fabricated readable writing. Slowly pull back and rise above the city into a vast indigo night sky. Maintain stable buildings and continuous scale. Date palms and warm courtyard lights below. Restrained stars; do not generate planet names or portray a date-accurate sky.
   Label: From clay to cosmos — an illustrative sky.

## Production workflow
1. Generate original clean keyframes using these visual cues. Source screenshots remain research references; check rights before using image-to-video transformations of third-party artwork/photos.
2. Match the gate and final city keyframes to the existing Sky Tablet dusk palette and camera direction.
3. Animate one shot at a time. Record the actual selected model, settings, prompt, job ID, export date and rights review. Do not invent API endpoints or assume one model supports every control.
4. Reject warped gates, shifting reliefs, melting people, impossible irrigation, plant morphing and abrupt motion.
5. Export silent H.264 MP4, 1080p landscape, web-optimized fast-start. Produce a poster and WebVTT descriptions/captions. Keep the existing score separate to avoid duplicate audio.
6. Store reviewed exports under assets/cinematics/babylon/. Keep large masters outside Git; use the existing hosting/storage conventions once measured.
7. Only mark a shot ready when its actual file, rights review and visual review exist. No placeholder video URLs.

## Integration acceptance
Provide a user-triggered Watch Babylon film option alongside Begin cinematic journey. Never auto-replace the opening journey. Use native video controls, playsinline, preload=none, a poster, captions and visible historical-context labels. Pause the interactive render clock while film is open, stop competing audio, restore the prior view/focus on return, and pause on backgrounding. Provide a working return link if video fails. Respect reduced motion and Save-Data by keeping playback opt-in.
Verify desktop and mobile portrait: no clipping, working pause/seek/close, captions, keyboard navigation, no doubled score, no hidden background rendering, and direct routes still work. Run npm test, npm run test:browser and npm run build before release.
Current state: reference mapping and production prompts prepared; Higgsfield exports, player implementation, visual acceptance and deployment remain pending.
