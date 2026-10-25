# Pang Boren · Personal Portfolio

A bilingual Chinese/English portfolio for Pang Boren, an Information Technology master's student at UNSW Sydney. The site presents his education, Python experience, selected projects, and contact links in a responsive, dark blue-violet interface.

**Live site:** https://pbr2002.github.io

## Features

- Full-page Chinese and English language toggle.
- Animated star-field, grid, light beams, and an interactive Three.js point-cloud globe with broad study-location markers for Yangling and Sydney.
- Three project cards: diffusion-based person re-identification research, the Video Review Assistant, and this interactive portfolio. Each groups factual descriptions into goals, implementation, and verification where applicable.
- Responsive layout, keyboard-accessible controls, reduced-motion support, and a copy-email interaction.
- Playwright checks for language switching, navigation, safe external links, reduced motion, a labeled static SVG WebGL fallback, email copy success/failure, JavaScript errors, and Chinese/English 360/375px layouts.
- axe accessibility scans in Chinese and English, plus deterministic size budgets for the production JavaScript, CSS, and HTML.
- Static build with no runtime server or API keys.

## Resume summary

- Built and deployed a bilingual, responsive portfolio with an interactive Three.js globe and GSAP motion using a static esbuild pipeline.
- Added eight Playwright end-to-end checks and WCAG 2.1 A/AA axe scans for both languages; GitHub Actions blocks deployment on test failures and enforces production asset budgets.

## Tech stack

- HTML, CSS, and JavaScript
- Three.js for the interactive globe
- GSAP for motion
- esbuild for the production bundle
- Playwright and axe-core for browser and accessibility checks
- GitHub Actions and GitHub Pages for deployment

## Run locally

Requirements: Node.js 20 or later and Python 3 (for the preview server).

```sh
npm ci
npm run build
npm run dev
```

Open http://localhost:5173 in a browser. The production site is written to `dist/`. You can also open `dist/index.html` directly after building.

To run the browser checks, first install Chromium once, then run the project checks:

```sh
npx playwright install chromium
npm test
```

`npm test` rebuilds the site, checks that `main.js` stays below 150 KiB, the deferred `globe.js` below 550 KiB, `style.css` below 50 KiB, and `index.html` below 20 KiB, then runs the Playwright and axe tests. Failure details are saved in `test-results/`.

## Deploy

This repository is configured as the GitHub user site `pbr2002.github.io`. Pushes and pull requests targeting `main` run `.github/workflows/deploy.yml` to build the site, enforce the asset budgets, and run browser and accessibility checks. A push to `main` deploys the same `dist/` artifact that passed verification.

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** if it is not already selected. Follow deployment progress in the **Actions** tab; the site is live when **Deploy to GitHub Pages** completes successfully.

## Source layout

```text
src/                 Page markup, styles, interactions, translations, favicon
e2e/                 Playwright browser and accessibility tests
scripts/             Production asset-size budget check
build.mjs            Builds the static dist/ output
playwright.config.cjs Browser-test configuration
.github/workflows/   Verification and GitHub Pages deployment
```

## Rendering and accessibility decisions

- The main entry keeps navigation, translation, and contact actions independent of Three.js. The globe bundle loads only when its canvas intersects the viewport, with no remote textures or API keys.
- The 3D render loop stops outside the viewport, in hidden tabs, and under reduced motion. System motion changes apply live; dragging, arrow keys, and resizing can still request a static redraw.
- If the 3D bundle fails or WebGL is unavailable/lost, a static SVG shows Yangling and Sydney with accurate bilingual labels rather than claiming drag interaction.
- Eight Playwright scenarios include real WebGL draw-call checks for motion changes, lazy loading, static fallback content, both mobile languages, and email-copy success/failure. Automated axe scans complement these checks; they do not establish complete accessibility conformance.
