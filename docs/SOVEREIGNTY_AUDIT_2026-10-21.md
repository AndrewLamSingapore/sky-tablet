# Sky Tablet engineering and sovereignty audit — 21 October 2026

**Completion classification: PARTIALLY COMPLETE.** The existing public learning, game and 3D tablet workflows have executable local evidence. The repository also specifies an unfinished five-shot film, and several operational and commercial acceptance gates remain open. This candidate is not a deployment receipt.

## Source and scope

- Canonical product: **The Sky Tablet**; repository `AndrewLamSingapore/sky-tablet`.
- Baseline: clean local `main`, commit `49c52cf01b21ddf350d5067775e14077d5ab3d30`.
- Candidate: branch `codex/sovereign-five-20261021-091215`, isolated from the original checkout.
- The portfolio coordinator confirmed ORQEVIA main `9703c9b5df92ba266acf56bfb19d85f3e10bc739` as a governance/observation reference. Product behavior is assessed from this repository and its tests.
- Windows ABEX validation used Node `24.20.0`, npm `11.19.0`, locked Playwright `1.58.2`, Chromium `145.0.7632.6` / build `1208`, and WebKit `26.0` / build `2248`. Matching browsers were installed only into this task's cache.
- No push, merge, deployment, provider subscription, live data write, paid generation, credential change, global runtime replacement, service or scheduled task was performed.

External execution evidence is in ABEX's `operations/sovereign-five-20261021-091215/` bundle, under `sky-*` filenames. The candidate commit is recorded in its final evidence ledger.

## Architecture established from implementation

| Boundary | Owning implementation and behavior |
| --- | --- |
| Entry and sound | [`index.html`](../index.html) embeds the local scene and controls the original Web Audio score in [`cinematic-score.js`](../cinematic-score.js). |
| 3D and interaction | [`experience.html`](../experience.html) owns Three.js geometry, camera state, tablet encounter, interpretation overlay, touch/keyboard controls and fallback UI. Three.js `0.180.0` and textures are copied locally by the build. |
| Learning | Notes, base-60 mathematics, source library and Interpretation Lens are local HTML pages. Notes render authored text through HTML escaping. |
| Game | [`royal-game-of-ur.html`](../royal-game-of-ur.html) owns legal moves, captures, rosettes, computer turns, hints, winning and restart. Game state is in memory. |
| Persistence | The four-stage learning checklist uses browser `localStorage`; tests verify reload and reset. No account, shared database, cross-device synchronization or installed offline-app capability is implemented or promised by the current public scope. |
| Optional integration | [`api/evidence-updates.js`](../api/evidence-updates.js), also exported by `/api/subscribe`, validates email/origin/method, applies bounded per-instance throttling and an eight-second Buttondown timeout. Production delivery requires a server-only credential. |
| Build/deployment | [`scripts/build.mjs`](../scripts/build.mjs) builds `public/` from this repository and the lockfile. [`vercel.json`](../vercel.json) declares the build/output/security headers. The core static bundle can be hosted at a site's root without any sovereign peer. |
| CI | Existing Sky Tablet CI runs `npm run check`; separate browser, production-assessment and pinned status-reference workflows exist. No new remote CI run was claimed. |

Public links to Authority Engine, ORQEVIA, The Portal, Game Platform and the parked product are optional navigation. No imports or mandatory runtime calls to their repositories were found. Tests explicitly block all external origins and optional API calls while using learning, checklist, game and local 3D-note flows.

## Confirmed defects and focused repairs

1. **Windows local startup:** `npm run serve` built successfully and then failed because it hard-coded `python3`; ABEX's `python3` is a Windows Store alias. `npm run check` used the same unavailable command. Both local commands now use Node 24. The existing Python CI compatibility guard is retained.
2. **Malformed note URL:** the shipped `syncHash()` threw `URIError: URI malformed` for `/notes.html#%`. A guarded decode now returns to the notes list, and browser tests verify subsequent article/back navigation.
3. **Windows test instrumentation:** two rule tests injected hooks using an LF-only string. CRLF checkouts failed to create the hook. Only the test fixture's line endings are normalized; production game code is unchanged.
4. **Full-game automation budget:** the 105-move WebKit scenario exceeded 60 seconds at five/six finished pieces, with valid moves visible. Its dedicated test budget is now 120 seconds. A no-retry rerun completed in 68.848 seconds on WebKit and 16.494 seconds on Chromium. These are automation durations, not player input-latency or rendering benchmarks.
5. **Obsolete media allowance:** both preview MP4s are already tracked locally, and their sizes/SHA-256 hashes match `assets/films/provenance.json`. After confirming zero active CloudFront asset references, the obsolete external `media-src` exception was removed.
6. **Retired active instruction:** the stale PRIME ownership reference in `AGENTS.md` now names ORQEVIA. Historical hashes, negative regression guards and the confirmed Authority `/jarvis` compatibility link remain.

The new standard-library preview binds only to `127.0.0.1`, serves real paths confined to generated `public/`, rejects traversal and escaping symlinks/junctions, disables directory listing/writes, emits the configured security headers, and supports byte-range video seeking. Both newsletter aliases explicitly report delivery disabled locally; the preview cannot submit subscriber data to Buttondown.

## Executable evidence and limits

| Check | Result | Evidence |
| --- | --- | --- |
| Initial installed dependency state | FAIL, environment gap | Original checkout's unit run could not import `three`; four API cases passed. |
| Fresh locked install | PASS | Isolated `npm ci --ignore-scripts`: four packages installed, zero reported advisories; original dependency directory preserved. |
| Baseline after locked install | PASS / FAIL | All 22 unit/API cases passed and build succeeded; `npm run serve` then failed on `python3`. |
| Candidate unit/API/preview security/build | PASS | `npm run check`: 28 tests passed, Node documentation guard passed, static build passed. `sky-local-check.json`. |
| Dependency advisory check | PASS | `npm audit --json`: zero known advisories at audit time. `sky-dependency-audit.json`; this is not a penetration test. |
| First browser run | FAIL, preserved | 30 passed, four CRLF-hook failures, two intentional WebKit 3D skips. `sky-browser-first-run.json` and `sky-first-browser-failures/`. |
| Second full browser run | FAIL, preserved | 35 passed, one WebKit full-game timeout, two intentional WebKit 3D skips. `sky-browser-second-run.json` and `sky-second-browser-timeout/`. |
| Corrected full-game scenario | PASS | Focused Chromium + WebKit rerun, retries disabled: two passed. `sky-browser-completion-rerun.json`. |
| Final full candidate browser run, retries disabled | PASS | At implementation commit `c2b61bddf32cd19d209f5f38080c5c78c4d6f2b3`: 36 passed, two intentional WebKit 3D skips, zero failures/flaky cases, one worker, 155.623 seconds. `sky-browser-final-run.json`. Earlier failure and combined-run evidence is retained. |
| Actual local media | PASS | The archived Ishtar preview decoded, played and sought in both browsers. Range validation also has dedicated HTTP tests. |
| Standalone failure behavior | PASS | Browser routes abort optional APIs/all external origins; core local flows remain usable and signup fails gracefully. |
| Visible 3D evidence | PASS, bounded | Chromium tablet screenshot was captured and inspected. It proves local rendering, not physical iPhone performance or final visual acceptance. |
| Independent rebuild recovery | PASS, bounded | Final committed-source recovery reproduced all 26 generated files byte-for-byte and left all 57 tracked candidate files unchanged. `sky-recovery-check.mjs`, `sky-recovery-final-result.json`. The earlier 52-file baseline receipt is retained. |
| Production source/deployment identity | NOT TESTED | No candidate push or deployment was authorized/performed. Existing production-assessment code is not a receipt for this candidate. |
| Real newsletter delivery and distributed abuse controls | NOT TESTED | Tests mock Buttondown; credentials were neither read out nor changed. Existing throttling is per instance; platform WAF acceptance remains separate. |
| Physical mobile/WebGL frame time, energy, accessibility acceptance | NOT TESTED | Browser emulation and camera math do not establish these measurements. |

## Sovereignty, recovery and operating procedure

The build, local server and tested visitor flows use only this repository's source, local assets and locked packages. There is no mandatory ORQEVIA/Authority gateway. External-origin/API-blocking tests establish core graceful degradation. Local serving with peers unavailable is not a service-worker/PWA offline-install claim.

For a fresh checkout: install Node 24, run `npm ci --ignore-scripts`, `npm run check`, install matching test browsers when needed, then `npm run test:browser` and `npm run serve`. The preview opens at `http://127.0.0.1:8765`; stop it with Ctrl+C. No Python setup is needed for local use.

For independent hosting, use `npm ci --ignore-scripts`, build with `npm run build`, and host `public/` at the domain root with the declared security headers. The Vercel deployment additionally serves the existing Node API functions. Missing optional signup leaves public notes available. Configure a newsletter key through server-side platform secret management only if authorized; never embed it in frontend files.

Recovery: restore the approved source revision plus lockfile and tracked assets, install locked dependencies, then rebuild and rerun checks. The static rebuild comparison is executable from the evidence bundle with `node sky-recovery-check.mjs <checkout-path>`. It verifies generated-output recovery only. Hosting rollback and subscriber-provider export/restore remain separate operational gates. Candidate rollback should use a reviewed revert/previous approved deployment, preserving Git history and user data; no reset or live rollback was performed.

## Remaining product, security and commercial gates

| Priority | Required outcome | Current evidence / next gate |
| --- | --- | --- |
| P1 | Complete the repository-specified Babylon film | Only two preview clips exist. Foliage/water detail, labeled Babel interlude, clay-to-cosmos finale, final edit, subtitle tracks and score integration remain pending in the owning specification/runtime page. No assets, purchases or readiness were fabricated. |
| P2 | Verify the deployed candidate | Requires authorized release, exact source/deployment identity, security-header check and production workflows. |
| P2 | Validate real newsletter operation | Requires authorized provider acceptance using an approved address, delivery/consent evidence and distributed abuse-control review. Core operation does not depend on this. |
| P2 | Complete device and visual acceptance | Physical mobile/desktop GPU observations, frame-time/resource measurements, assistive-technology acceptance and final film review remain open. |
| P2 | Complete commercial asset review | Three.js license is bundled. Font redistribution notices, generated-media terms and the final asset rights/provenance acceptance need evidence before commercial certification; this audit makes no legal-violation finding. |
| P2 | Record ongoing production operations | Deployment/recovery runbook exists here; hosting rollback drill, uptime/error ownership, provider recovery and actual hosting/provider costs are unverified. No speculative infrastructure or paid monitoring was added. |

## CORETEX applicability and value

Current game rules and camera/state transitions are bounded computation, while the cultural scene uses authored interpretation and previously generated assets. They do not demonstrate general-purpose AI inference. No measured policy/inference bottleneck or task-equivalent benefit justifies adding a 64 KiB decision runtime here. No CORETEX performance, energy, compression or intelligence claim is adopted. Existing instancing and software-rendering guards still require device measurements before performance claims.

The validated engineering value is operational: local Node-only onboarding, reproducible static recovery, graceful optional-service failure and stronger regression evidence. Infrastructure savings, customer conversion, novelty, patentability and commercial readiness are not quantified without workloads, actual cost data and customer/rights evidence.

## Retired and residual material

- **Changed:** stale active PRIME instruction; obsolete external media allowlist.
- **Kept:** dated historical PRIME commit reference, retired-name negative guards, `/jarvis` compatibility link, the scored-shell redirect and dated film-generation receipt. No blind renames or historical deletion occurred.
- **Generated artifacts:** isolated `node_modules`, `public`, browser cache and test traces are development/evidence artifacts. No deletion of source, credentials, workspace data or parked repositories was performed. Cleanup can be considered after preserving the evidence and approving the candidate.
