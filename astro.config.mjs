// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/data/site-url.mjs';

export default defineConfig({
  site: SITE_URL,
  // Versioned so Workers Builds reuses optimized images instead of re-encoding ~220 AVIF/WebP
  // variants on every deploy (the first CI build otherwise approaches the 20-minute limit).
  cacheDir: './.astro-cache',
  trailingSlash: 'ignore',
  // Dev/preview only: allow Cloudflare quick tunnels (random *.trycloudflare.com names) for remote review.
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-MX' } },
      changefreq: 'monthly',
      priority: 1,
      lastmod: new Date(),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-sans',
      weights: [300, 400, 500, 600],
      styles: ['normal'],
      // Spanish accents and ñ live in "latin"; latin-ext only adds weight.
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'always',
  },
  prefetch: false,
});
