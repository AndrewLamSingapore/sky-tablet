# Royal Game of Ur — release verification record

Date: 2026-10-18
Scope: Standalone Royal Game of Ur article/game and Interpretation Lens stone-tablet link.
Immersive 3D: expressly excluded.

## Implemented
- Twenty-square board, seven counters per player, four binary dice (0–4).
- Legal entry and movement, same-player occupancy exclusion, shared-square capture, protected central rosette, extra turns on rosettes, exact bearing-off and seven-piece victory.
- Asynchronous AI continuation to avoid recursive turns.
- Mobile-responsive grid, keyboard-operable buttons, touch-target interactions, screen-reader status text, and restart.
- Evidence/interpretation/imagined distinction, museum object attribution, rule reconstruction caveat, board path guide, probability explanation, and base-60 link.

## Automated test coverage
The GitHub Actions workflow `.github/workflows/royal-game-regression.yml` runs `tests/royal-game.spec.cjs` using Chromium and WebKit iPhone emulation. Tests cover rendering and JavaScript exceptions, board geometry, dice, move, reset, zero roll, AI turn, capture, protected rosette, bonus turn, exact finish, victory, 375/390px layout, tap interactions, scrolling, and navigation.

**Execution evidence:** The existence of tests and workflow does not establish that a GitHub Actions run passed. The GitHub Actions run conclusion must be inspected and linked here before QA sign-off. No physical iPhone Safari device test has been performed by the assistant. WebKit emulation is not equivalent to physical-device certification.

## Historical basis and limitations
- British Museum, Royal Game of Ur board, registration 1928,1009.378: https://www.britishmuseum.org/collection/object/W_1928-1009-378
- British Museum gaming pieces, series 1928,1009.379.
- Irving L. Finkel, “On the Rules for the Royal Game of Ur” (2007).
- The later Babylonian cuneiform text and the playable modern Finkel-style rules are **not identical**; the original third-millennium rules are not fully recoverable.
- The probability comparison and base-60 cross-link are modern educational juxtapositions, not claims that the game historically employed sexagesimal probability.
- The VR prototype cited in the article is a design reference only; no third-party paper assets or implementation are reused.

## Outstanding acceptance gates
1. GitHub Actions: obtain green results for desktop Chromium and iPhone WebKit projects; fix failures if any.
2. Real device: open the live page in iPhone Safari, play a match, confirm touch, scroll, return navigation, and no visual clipping.
3. Check live URL and Vercel production alias against the final commit.
4. Record pass evidence, tester/device and date in this file.

Release classification: **feature implemented, production deployment subject to confirmation, QA sign-off pending**. Do not describe this as fully regression-certified until the acceptance gates are satisfied.
