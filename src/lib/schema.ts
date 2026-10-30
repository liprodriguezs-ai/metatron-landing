import { site, services, faqs, otherSpecialties } from '../data/site';

const abs = (path: string) => new URL(path, site.url).href;

/** Builds the JSON-LD @graph describing the business for search and answer engines. */
export function buildSchema() {
  const orgId = abs('/#organization');
  const businessId = abs('/#business');
  const websiteId = abs('/#website');
  const pageId = abs('/#webpage');
  const personId = abs('/#gerente');

  // Country only: the office location is intentionally not published.
  const address = {
    '@type': 'PostalAddress',
    addressCountry: site.country,
  };

  const serviceNodes = services.map((s) => ({
    '@type': 'Service',
    '@id': abs(`/#${s.id}`),
    name: s.name,
    serviceType: s.name,
    description: `${s.summary} Incluye: ${s.scope.join('; ')}.`,
    provider: { '@id': businessId },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    url: abs(`/#${s.id}`),
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        slogan: site.slogan,
        description: site.description,
        email: site.email,
        telephone: site.phone,
        logo: {
          '@type': 'ImageObject',
          '@id': abs('/#logo'),
          url: abs('/brand/logo-stacked-light.png'),
          contentUrl: abs('/brand/logo-stacked-light.png'),
          width: 2000,
          caption: site.name,
        },
        image: abs('/og/og-image.jpg'),
        founder: { '@id': personId },
        address,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: site.phone,
            email: site.email,
            contactType: 'sales',
            areaServed: 'MX',
            availableLanguage: ['es'],
          },
        ],
        sameAs: [`https://wa.me/${site.whatsapp}`],
      },
      {
        '@type': ['LocalBusiness', 'GeneralContractor'],
        '@id': businessId,
        name: site.name,
        alternateName: 'Metatron Service — Mantenimiento & Obras Offshore/Terrestres',
        description: site.description,
        slogan: site.claim,
        url: site.url,
        image: [abs('/og/og-image.jpg'), abs('/og/og-square.jpg')],
        logo: { '@id': abs('/#logo') },
        telephone: site.phone,
        email: site.email,
        address,
        areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
        parentOrganization: { '@id': orgId },
        employee: { '@id': personId },
        knowsAbout: [
          ...services.flatMap((s) => [s.name, ...s.keywords]),
          ...otherSpecialties,
          'Mantenimiento offshore',
          'Obras terrestres',
          'Mantenimiento industrial',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios de mantenimiento y obra',
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@id': abs(`/#${s.id}`) },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.manager.name,
        honorificPrefix: 'Ing.',
        jobTitle: site.manager.role,
        worksFor: { '@id': orgId },
        email: site.email,
        telephone: site.phone,
      },
      ...serviceNodes,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: site.lang,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: site.url,
        name: site.title,
        description: site.description,
        inLanguage: site.lang,
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        primaryImageOfPage: { '@type': 'ImageObject', url: abs('/og/og-image.jpg'), width: 1200, height: 630 },
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#resumen', '#faq'] },
        mainEntity: { '@id': abs('/#faq') },
      },
      {
        '@type': 'FAQPage',
        '@id': abs('/#faq'),
        inLanguage: site.lang,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}
