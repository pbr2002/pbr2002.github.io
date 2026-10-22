# Pang Boren · Personal Portfolio

A bilingual Chinese/English portfolio for Pang Boren, an Information Technology master's student at UNSW Sydney. The site presents his education, Python experience, selected projects, and contact links in a responsive, dark blue-violet interface.

**Live site:** https://pbr2002.github.io

## Features

- Full-page Chinese and English language toggle.
- Animated star-field, grid, light beams, and an interactive Three.js point-cloud globe with broad study-location markers for Yangling and Sydney.
- Project cards for diffusion-based person re-identification research and the Video Review Assistant.
- Responsive layout, keyboard-accessible controls, reduced-motion support, and a copy-email interaction.
- Static build with no runtime server or API keys.

## Tech stack

- HTML, CSS, and JavaScript
- Three.js for the interactive globe
- GSAP for motion
- esbuild for the production bundle
- GitHub Actions and GitHub Pages for deployment

## Run locally

Requirements: Node.js 20 or later.

```sh
npm ci
npm run build
npm run dev
```

Open http://localhost:5173 in a browser. The production site is written to `dist/`. You can also open `dist/index.html` directly after building.

## Deploy

This repository is configured as the GitHub user site `pbr2002.github.io`. Every push to `main` runs `.github/workflows/deploy.yml`, builds the static site, and publishes the `dist/` output to GitHub Pages.

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** if it is not already selected. Follow deployment progress in the **Actions** tab; the site is live when **Deploy to GitHub Pages** completes successfully.

## Source layout

```text
src/                 Page markup, styles, interactions, translations, favicon
build.mjs            Builds the static dist/ output
.github/workflows/   GitHub Pages build and deployment workflow
```
