# The Sky Tablet

**Walk through an imagined ancient city. Look up. Find a question worth exploring.**

[**Enter the experience**](https://sky-tablet.vercel.app/) · [**Discuss a project with Andrew**](https://authority-engine-app.vercel.app/contact?source=sky-tablet&intent=collaboration) · [**Explore JARVIS PRIME**](https://authority-engine-app.vercel.app/jarvis)

The current app is a Three.js cinematic environment inspired by Mesopotamian architecture, sky observation and cuneiform. It includes a guided camera journey, free exploration, a tablet encounter and a creator invitation linked to Andrew’s other projects.

## Current implementation

- A bounded visible-time camera clock, continuous transitions and orientation-preserving free exploration
- Portrait framing and touch controls, with movement paused while reading the creator invitation
- Generated photographic-style material textures, naturalistic dusk lighting, human-scale figures, palms and architecture
- Distant point stars, a small moon and Venus, with an educational sky interpretation
- Instanced repeated geometry and bounded lighting to limit rendering overhead
- Clear routes to Andrew, JARVIS PRIME, VELYQUA, The Portal and Living Worlds

This replaces the former README’s sky wheel, synodic-cycle explorer and searchable sign-sampler description. Those are not the current interface.

## Evidence and limits

The scene is an interpretive software prototype, not a surveyed historical reconstruction or a date-accurate astronomical simulation. Generated textures and procedural people are not archaeological scans or photogrammetric humans. The visual target is maximum practical realism; full photorealism is not claimed.

Nine regression tests exercise the shipped camera and scene logic with real Three.js geometry/math and a stubbed renderer. They do not verify GPU appearance or physical iPhone performance. See [repair and asset provenance](docs/2026-09-16-cinematic-repair.md).

## Run and verify

Serve this directory over HTTP, then open `index.html` in a WebGL-capable browser. `experience.html` owns the scene; `index.html` hosts the experience and sound controls.

```bash
npm ci
npm test
python -m http.server 8000
```

Operational deployment identity is recorded in the portfolio’s canonical PRIME manifest, referenced by `SSOT.json`. Source changes and passing tests do not by themselves prove deployment.
