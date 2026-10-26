# Browser dependency installation incident — 26 October 2026

## Observed failure boundary

[Production assessment attempt 1](https://github.com/AndrewLamSingapore/sky-tablet/actions/runs/40301595614/attempts/1)
completed checkout and `npm ci`. Its Playwright system-dependency installer
requested 119 MB of Ubuntu packages and spent over eleven minutes downloading
from the Azure Ubuntu mirror. The operator cancelled that stalled attempt at
09:53:45 UTC to preserve its logs and repair the download path.

Application-contract checks and production browser tests had **not started**.
This was not an observed application-test failure. The log showed successful,
extremely slow package downloads rather than an authentication, firewall or
sandbox denial. It does not establish the absence of every upstream network policy.

For comparison, the identical browser installation command completed in 52 seconds
on the preceding successful [pull-request browser job](https://github.com/AndrewLamSingapore/sky-tablet/actions/runs/40301101137/job/121498907306).
The package lock selects Playwright 1.58.2 in both revisions.

## Repair

Both browser workflows reuse `.github/actions/setup-browsers`:

- Prefer Ubuntu's official HTTPS archive and security mirrors instead of the
  runner's slow Azure mirror preference. TLS verification and APT package-signature
  checks remain enabled.
- Retry failed package transfers twice, with a 30-second HTTPS inactivity timeout.
- Show system-package installation and browser-binary download as distinct steps.
- Download Chromium's headless shell and WebKit. The configured projects use
  headless Chromium without a branded channel and iPhone WebKit, so the additional
  headed Chromium download is unnecessary for CI.
- Pin the affected jobs to the observed Ubuntu 24.04 distribution. The existing
  test commands, browser coverage and overall job timeout remain unchanged.

This changes ephemeral CI runner setup. Application source, credentials,
production access controls and deployment configuration are unaffected.

## Acceptance evidence

The repaired browser regression must pass in a pull request. After merge, the
production assessment must independently verify exact public page bytes,
security headers, API rejection of invalid email input, and the complete browser
suite against the public HTTPS site. Provider email delivery and physical-device
performance require their separate existing acceptance evidence.

Read the [browser regression](https://github.com/AndrewLamSingapore/sky-tablet/actions/workflows/royal-game-regression.yml)
and [production assessment](https://github.com/AndrewLamSingapore/sky-tablet/actions/workflows/production-assessment.yml)
receipts for the repair commit. A source change alone is not a passing result.

The mirror-list format follows the [GitHub runner image setup](https://github.com/actions/runner-images/blob/main/images/ubuntu/scripts/build/configure-apt-sources.sh).
The separate installer commands and headless-shell option follow
[Playwright's browser documentation](https://playwright.dev/docs/browsers).
