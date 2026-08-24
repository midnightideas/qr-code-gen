# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static QR code generator for GitHub Pages. Single-page app in `docs/index.html`.

## Key Files

- `docs/index.html` — The entire app (HTML + CSS + JS)
- `package.json` — Project metadata (private, unlicensed)

## Commands

```bash
# Serve locally (from repo root)
python -m http.server 8000
```

## Tech Stack

- Vanilla HTML/CSS/JS (no build step)
- QRCode.js via CDN with SRI pinning
- GitHub Pages deploys from `docs/`

## Security Notes

- External scripts use Subresource Integrity (SRI) hashes
- CSP meta tag restricts script sources to pinned CDN
- No server-side code; all processing is client-side

## Deployment

Push to `main` branch. GitHub Pages serves `docs/` automatically at:
`https://midnightideas.github.io/qr-code-gen/`
