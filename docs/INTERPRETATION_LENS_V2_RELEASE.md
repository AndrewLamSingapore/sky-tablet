# Interpretation Lens 2.0 — release record
Date: 2026-10-18
Scope: public historical learning hub, Royal Game of Ur, base-60 article, source registry, guided learning checklist and game hints.
Excluded: immersive 3D, analytics collection, user accounts, speculative historical reconstructions.

## Delivered
- `/interpretation-lens.html`: unified independent entry point, evidence/interpretation/imagination framework, four-stage learning journey, browser-local optional checklist and reset.
- `/sources.html`: source-to-claim registry with scope and limits for the Royal Game of Ur board, Finkel's rules research, VR prototype, and base-60 mathematics.
- Cross-navigation from the stone tablet, mathematics article and Royal Game of Ur.
- Non-automated move suggestion in the Royal Game of Ur; player retains control.
- Browser regression coverage for the new hub, checklist persistence, source page, and hint behavior in Chromium and iPhone WebKit emulation.

## Historical and privacy caveats
The popular seven-piece game is a modern Finkel-style reconstruction. A later cuneiform rules text does not fully recover third-millennium play. Game probabilities and base-60 mathematics are linked pedagogically, not presented as evidence of ancient use of base-60 in this game. Checklist state is stored in browser localStorage only; no activity analytics have been added.

## Release acceptance
GitHub Actions workflow: `.github/workflows/royal-game-regression.yml`.
A Vercel READY deployment proves build and publication, not successful gameplay tests. The GitHub Actions conclusion and physical Safari device results must be verified independently. This record does not claim those results until confirmed.

## Known limitations
- No real-device iPhone Safari certification by the assistant.
- Browser WebKit emulation is not physical-device validation.
- No multiplayer or save-game feature.
- No immersive 3D implementation.
