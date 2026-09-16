# Cinematic repair and visual treatment — 16 September 2026

Canonical portfolio contract read at PRIME `1bd2be98adf91df3bc4df22d7a2348848181b8b8`.

## Changes

- Preserve the current camera direction when entering free exploration; clear held input on blur and mode changes.
- Advance the journey by bounded visible frame time, preserving the shot when a mobile browser backgrounds the page.
- Open the gate geometry, remove Euler-roll overrides and avoid a straight-up camera singularity.
- Adapt the lens to portrait screens and keep controls inside the viewport.
- Photographic-style generated glazed-brick, mud-brick, stone paving and clay textures, with physically based materials, bump detail and dusk lighting.
- Human-scale anatomy, shaped linen clothing, relaxed poses, palms with individual fronds and instanced repeated meshes.
- Angularly distant stars with varying brightness and color, restrained twinkle, a subtle Milky Way and point-like Venus without a comet tail.
- Creator invitation after the journey, project-specific enquiries and links to the other public apps.

## Evidence and limits

Nine automated regression checks execute the shipped camera/scene code with real Three.js math and geometry. DOM and GPU presentation are stubbed; these are not visual or WebGL performance tests. The available cloud browser cannot create a WebGL context, so mobile visual quality and frame rate still need an actual GPU-enabled client check.

The scene, people, material textures, sky placement and choreography are artistic interpretations. The stars are not a dated astronomical reconstruction. The material images are AI-generated, not archaeological scans. The result is a more naturalistic procedural 3D environment, not a photogrammetric reconstruction or scan-quality digital humans.

## Generated asset provenance

Built-in image generation produced a four-quadrant material atlas. Its quadrants were extracted and encoded as WebP into `assets/`. Prompt: “Production PBR albedo texture atlas, four equal quadrants, flat orthographic photographic material scans, even ambient light: cobalt glazed staggered ancient brick with wear; ochre mud brick with straw and eroded edges; weathered sandstone paving; fine clay plaster. No text, perspective, vignette or directional shadows; individually tileable; natural subdued colors, not cartoon or illustration.”
