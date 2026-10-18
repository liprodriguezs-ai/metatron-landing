# Metatron Service — Landing

Landing page for **Metatron Service** (maintenance and offshore/onshore works, Ciudad del Carmen, Campeche, MX).
Built with **Astro 7.4**, zero UI framework, static output.

## Commands

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static site in dist/
pnpm preview
pnpm check      # astro check (needs TypeScript 6, pinned)
```

## Before going live

1. Set the final domain in `src/data/site-url.mjs` (`SITE_URL`). It feeds canonical URLs, sitemap,
   Open Graph, JSON-LD, `robots.txt` and `llms.txt`.
2. Confirm the business data in `src/data/site.ts` (phone, address, coordinates). The coordinates are
   city-level for Ciudad del Carmen; replace them with the exact office pin if available.
3. Register the site in Google Search Console and Bing Webmaster Tools and submit `/sitemap-index.xml`.
4. Create or claim the Google Business Profile with the same name, address and phone (NAP) as the site.

## Structure

| Path | Purpose |
| --- | --- |
| `src/data/site.ts` | Single source of truth: business data, services, real-project photos, process, FAQ |
| `src/components/Hero.astro` | Scroll-scrubbed offshore → onshore video transition with live coordinates HUD |
| `src/components/*.astro` | Sections: Intro, Services, Fronts, Projects (gallery + lightbox), Process, About, FAQ, Contact, Footer |
| `src/components/Seo.astro` + `src/lib/schema.ts` | Meta, Open Graph, Twitter, geo meta, JSON-LD `@graph` |
| `src/lib/llms.ts` | `llms.txt` and `llms-full.txt` content (generative-engine optimization) |
| `src/pages/robots.txt.ts` | robots with explicit allow for search and AI answer crawlers |
| `public/media/` | Hero transition video (desktop 16:9 and mobile 9:16 crops) |
| `public/og/` | Share images: `og-image.jpg` 1200×630, `og-square.jpg` 1200×1200, `og-story.jpg` 1080×1920 |
| `public/brand/` | Logo kit (SVG + PNG): stacked, horizontal, icon, light/dark |
| `tools/brand/` | Scripts that generate the logo SVGs and share images |

## SEO / GEO checklist (implemented)

- One `h1`, semantic sections, descriptive `alt` text on every content image.
- Canonical, `hreflang` es-MX + x-default, robots meta with large image previews.
- Local SEO: `geo.region`, `geo.placename`, `geo.position`, `ICBM`, consistent NAP in footer and schema.
- JSON-LD: `Organization`, `LocalBusiness`/`GeneralContractor`, `Person`, six `Service`, `WebSite`,
  `WebPage` (with `speakable`) and `FAQPage`.
- `sitemap-index.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, web manifest, favicons and maskable icon.
- Lighthouse (local build): desktop 100/100/100/100; mobile 92 performance, 100 accessibility,
  best practices and SEO.

## Hero video

The transition was generated with Higgsfield (FLUX 3 Video, start/end keyframes) from two generated stills.
It is encoded with a short GOP (`-g 8`, no B-frames) so seeking on scroll is smooth, fetched as a blob after
`window.load`, and skipped with `prefers-reduced-motion` or Save-Data (the poster frame stays).

Re-encode from a new source:

```sh
ffmpeg -i source.mp4 -an -vf "crop=1920:1080:0:4,scale=1440:810:flags=lanczos,hqdn3d=1.5:1.5:3:3" \
  -c:v libx264 -preset slower -crf 28 -g 8 -keyint_min 8 -sc_threshold 0 -bf 0 -pix_fmt yuv420p \
  -movflags +faststart public/media/transicion.mp4
```

## Brand assets

The logo is redrawn from the original artwork as flat geometric shapes (no shadows). The wordmark uses
Archivo SemiBold Expanded converted to outlines, with a crossbar-less "A" (Λ) built from the flipped "V".

```sh
python3 -m venv .venv && .venv/bin/pip install fonttools
mkdir -p tools/brand/fonts
curl -L -o tools/brand/fonts/Archivo.ttf "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf"
curl -L -o tools/brand/fonts/JetBrainsMono-Medium.ttf "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Medium.ttf"
.venv/bin/python tools/brand/build_logo.py   # -> tools/brand/out/*.svg
.venv/bin/python tools/brand/og.py           # -> public/og/*.jpg (needs rsvg-convert and ImageMagick)
```

Palette: navy `#0A1630` / `#060E20`, gold `#E3A21A`, paper `#F7F3EA`.
