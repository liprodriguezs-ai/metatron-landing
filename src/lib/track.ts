// Sends GA4 events through the Google tag queue. Event names match the herraga and novarek sites so
// the three properties report the same conversions. In dev the tag is not loaded, so events only
// accumulate in window.dataLayer and are never sent.
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Params = {}) {
  window.dataLayer = window.dataLayer || [];
  // gtag() pushes the `arguments` object, not an array; GA ignores array pushes.
  (function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  })('event', event, params);
}

/** Tracks clicks on WhatsApp, phone and email links anywhere on the page. */
export function trackContactLinks() {
  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const where = link.closest('[id]')?.id || link.closest('header,footer,section')?.tagName.toLowerCase() || 'page';
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
      track('whatsapp_click', { link_location: where, link_text: link.textContent?.trim() });
    } else if (href.startsWith('tel:')) {
      track('phone_click', { link_location: where });
    } else if (href.startsWith('mailto:')) {
      track('email_click', { link_location: where });
    }
  });
}
