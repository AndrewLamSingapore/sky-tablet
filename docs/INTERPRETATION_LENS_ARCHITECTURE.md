# Interpretation Lens: purpose and ownership

Sky Tablet is a public educational 3D experience about Mesopotamian astronomical culture. Its Interpretation Lens, formerly Evidence Lens, explains which parts of that experience are based on historical context, which are artistic interpretation and which extend beyond observed material.

## Visitor journey

`index.html` hosts `experience.html` and the sound controls. A visitor can begin the guided journey, explore freely or open the tablet encounter using `/?scene=tablet`.

The **Interpretation Lens** control applies a color overlay to tagged scene objects, shows a three-category legend and opens the modern tablet build note. Turning it off restores the original materials. City view resets the overlay. The scene and camera remain the same experience; the overlay adds context rather than a new operational workspace.

The tablet encounter pauses the guided journey. A visitor can open the note through the accessible control or the tablet surface, close it and explicitly choose **Continue journey**. The full note opens at `/notes.html?from=tablet#001`; its return link preserves the tablet encounter. Notes are public, with an optional email subscription when the server-side newsletter service is configured.

## What the categories mean

| Category | Purpose in this scene |
| --- | --- |
| Evidence-based | Identify historical cultural context represented by the author, such as cuneiform culture and celestial observation. |
| Interpretive | Mark specific architecture, placement, lighting, clothing, staging and modern tablet presentation as authored interpretation. |
| Imagined extension | Mark spatial continuity and other extensions needed for exploration beyond observed material. |

These tags are authored classifications, not independently verified archaeological findings or automated credibility scores. The exact city, generated assets and planetary placement remain interpretive. Planet positions are illustrative; the modern tablet is not a transcription of an excavated object. Scholarly verification and date-specific astronomy need separate evidence.

## Source boundaries

Sky owns the scene tags, overlay behavior, camera journey, notes, newsletter routes and this domain explanation. The Portal owns its separate Evidence Lab and its evidence export/verification journey. A cross-product link does not share a lens implementation, evidence model or authority.

The Sky scene imports Three.js `0.180.0` and local assets. Its implementation is inline in `experience.html`; there is no Portal or ORQEVIA lens package import. `authority-family.css` supplies local visual styling. Links to other products provide navigation. They do not transfer source ownership or perform private runtime operations.

**Mission Lens** would imply operational observations or decision support that this scene does not implement. Interpretation Lens describes the shipped historical scene and its source boundaries.

## Compatibility and traceability

The public display name is **Interpretation Lens**. The internal `evidence` alias remains compatible: `#evidence`, `evidenceOn`, `setEvidence`, `evidenceMaterials`, scene classification values and evidence-related CSS/DOM names are unchanged. `/notes.html`, note ID `001`, `?from=tablet`, `?scene=tablet`, `/api/evidence-updates` and `/api/subscribe` retain their existing meanings.

Published notes retain their original title, date and body. A current notice explains the new feature name as “Interpretation Lens (formerly Evidence Lens).” Git history also retains the earlier name. The current control, tablet display and implementation documentation use the new name.

The overlay was implemented in `a0743119d3d4df2498c0829b7c38e63ee80bdbe2`; public notes and newsletter integration arrived in `d7777bf7d64841411f789f84374349dae4931249` (PR 11). Later changes made the tablet interactive and paused the journey for reading. The name update changes display copy and explanation, preserving those handlers and evidence boundaries.

## Verification scope

Run `npm run check` and `npm run test:browser`. Local checks and preview use Node 24; `python scripts/check_status_authority.py` remains an optional CI compatibility guard. The Node tests execute the shipped scene with real Three.js geometry/math and substituted DOM/GPU presentation. They cover navigation, camera state, tablet interaction and newsletter behavior with mocked requests. Focused local checks can also confirm overlay material restoration and the unchanged note routes.

These checks establish source behavior. A deployment identity and served-byte comparison establish what a host serves. Rendered WebGL appearance, performance, physical iPhone use and real newsletter delivery require their own observations.
