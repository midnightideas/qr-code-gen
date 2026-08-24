# QR Code Generator

A simple, static QR code generator that runs entirely in the browser — no backend required. Built for GitHub Pages.

**Live site:** https://midnightideas.github.io/qr-code-gen/

## Features

- **Generate QR codes** from any URL or text
- **Copy to clipboard** as PNG
- **Download as PNG** image
- **Responsive design** — works on desktop and mobile
- **No tracking** — runs entirely client-side

## Usage

1. Open the live site or serve the `docs/` folder locally.
2. Enter a URL or text in the input field.
3. Use **Copy** or **Download PNG** to save the QR code.

## Development

This is a static site. To serve locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve docs

# Using PHP
php -S localhost:8000 -t docs
```

Then open `http://localhost:8000` in your browser.

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) via CDN (pinned with SRI)
- Deployed via GitHub Pages from the `docs/` directory

## License

UNLICENSED — proprietary and private.
