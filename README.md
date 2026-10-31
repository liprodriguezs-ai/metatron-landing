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
pnpm run deploy # publish dist/ to the metatron-landing Worker (run build first)
```

## Deploy

Production runs on Cloudflare Workers (static assets) as the Worker `metatron-landing` (account li.prodriguezs),
auto-deployed by Workers Builds on every push to the production branch. Dashboard settings for the Worker's
Builds section:

| Setting | Value |
| --- | --- |
| Repository | `liprodriguezs-ai/metatron-landing` (the "Cloudflare Workers and Pages" GitHub App must have access to it) |
| Build command | `pnpm run build` (builds only) |
| Deploy command | `pnpm run deploy` (`wrangler deploy`, publishes only) |
| Root directory | `/` |
| Builds for non-production branches | off |

`wrangler.jsonc` deliberately has no `routes` or custom domains; add domains in the dashboard (Worker →
Domains). Node version for builds comes from `.node-version` (Astro 7 needs Node ≥ 22.22).

## Analytics

Google Analytics 4: account "Metatron Service", property `metatronservice.com`, web stream for
`https://www.metatronservice.com`, measurement ID `G-VE79EB0VG4` (owner li.prodriguezs@gmail.com). The ID lives in
`src/data/site.ts` (`gaMeasurementId`) and the tag is rendered in `src/layouts/Base.astro` only in production builds,
so `pnpm dev` sends nothing. Default GA4 page tracking only: no custom events and no consent banner.

## Domains

`SITE_URL` (`src/data/site-url.mjs`) is `https://www.metatronservice.com`: it drives canonical URLs, sitemap,
Open Graph, JSON-LD, `robots.txt` and `llms.txt`. The domain is registered at Hostinger and its nameservers
stay there, so the site is attached through Cloudflare for SaaS on the `novarek.mx` zone (same setup as herraga).

| Host | Served by |
| --- | --- |
| `www.metatronservice.com` | Cloudflare for SaaS custom hostname on the `novarek.mx` zone (fallback origin `saas.novarek.mx`), Worker route `www.metatronservice.com/*` → `metatron-landing`. Hostinger DNS: `CNAME www → saas.novarek.mx` plus the TXT validation records Cloudflare asks for. |
| `metatronservice.com` | Cloudflare for SaaS custom hostname on `novarek.mx` plus the Single Redirect Rule "metatronservice.com raiz a www" (301 → `https://www.metatronservice.com`, path and query kept). Hostinger DNS: `ALIAS/CNAME @ → saas.novarek.mx` plus the `_cf-custom-hostname` TXT and `_acme-challenge` CNAME. Hostinger's own redirect cannot be used (it refuses to redirect a domain to itself). |

## Before going live

1. Confirm the business data in `src/data/site.ts` (phone, email). The office location is intentionally not
   published anywhere (page, JSON-LD, meta tags, llms.txt); only the country is exposed.
2. Register the site in Google Search Console and Bing Webmaster Tools and submit `/sitemap-index.xml`.
3. Create or claim the Google Business Profile as a service-area business (address hidden), with the same name and phone as the site.

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
- Local SEO: country-level `geo.region` / `geo.placename`, consistent name and phone in footer and schema (no office address).
- JSON-LD: `Organization`, `LocalBusiness`/`GeneralContractor`, `Person`, six `Service`, `WebSite`,
  `WebPage` (with `speakable`) and `FAQPage`.
- `sitemap-index.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, web manifest, favicons and maskable icon.
- Lighthouse (local build): desktop 100/100/100/100; mobile 92 performance, 100 accessibility,
  best practices and SEO.

## Hero video

A 16 s journey generated with Higgsfield in two legs that share a keyframe, so they join without a cut:

1. Platform → supply vessel heading to Ciudad del Carmen (Kling 3.0, 4K, start/end frames).
2. Supply vessel → coastal facility (MiniMax H3, 2K, start/end frames).

The legs are joined with a 0.25 s crossfade and upscaled to a 3840×2160 master (Topaz). Web tiers live in
`public/media/` and the hero picks one at runtime (`pickSource` in `Hero.astro`): the smallest tier that covers
the device pixels the cover-fitted video needs, best codec first (AV1 10-bit → HEVC 10-bit → H.264), skipping
codecs `mediaCapabilities` reports as not smooth. Portrait screens get a 9:16 crop (1080×1920).

| File | Codec | Size |
| --- | --- | --- |
| `hero-2560-{av1,hevc}.mp4` | AV1 / HEVC 10-bit | 2560×1440 |
| `hero-1920-{av1,hevc}.mp4`, `hero-1920.mp4` | AV1 / HEVC 10-bit / H.264 | 1920×1080 |
| `hero-movil-{av1,hevc}.mp4`, `hero-movil.mp4` | AV1 / HEVC 10-bit / H.264 | 1080×1920 |

All tiers use a 12-frame GOP without scene-cut keyframes so seeking on scroll stays smooth. The file is fetched
as a blob after `window.load`; with `prefers-reduced-motion` or Save-Data only the poster frame is shown.

Encoding settings (from the 4K master): AV1 `libsvtav1 -preset 5 -crf 38 -g 12 -pix_fmt yuv420p10le`,
HEVC `libx265 -preset slow -crf 28 -pix_fmt yuv420p10le -tag:v hvc1 -x265-params keyint=12:min-keyint=12:scenecut=0:bframes=0`,
H.264 `libx264 -preset slower -tune film -crf 23 -g 12 -bf 0`. Mobile crop:
`crop=ih*9/16:ih:min(iw-ih*9/16\,max(0\,iw*0.70-ih*9/32)):0,scale=1080:1920`.

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
