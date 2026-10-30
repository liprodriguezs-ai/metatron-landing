import { faqs, otherSpecialties, process, services, site } from '../data/site';

const abs = (p: string) => new URL(p, site.url).href;

/** llms.txt — concise, link-first summary (https://llmstxt.org). */
export function llmsTxt() {
  return `# ${site.name}

> ${site.name} es una empresa mexicana de mantenimiento y obras offshore (costa afuera) y terrestres que atiende proyectos en México. Ofrece obra eléctrica, sistemas fotovoltaicos, aire acondicionado, aislamiento térmico, obra civil y obra estructural para la industria.

- Teléfono / WhatsApp: ${site.phoneDisplay} (${site.phone})
- Correo: ${site.email}
- Responsable: ${site.manager.displayName}, ${site.manager.role}
- Cobertura: ${site.areaServed.join(', ')}
- Lema: ${site.slogan}

## Servicios

${services.map((s) => `- [${s.name}](${abs(`/#${s.id}`)}): ${s.summary}`).join('\n')}

## Más información

- [Información completa para LLMs](${abs('/llms-full.txt')}): servicios detallados, proceso, misión, visión y preguntas frecuentes.
- [Preguntas frecuentes](${abs('/#faq')})
- [Contacto y cotizaciones](${abs('/#contacto')})
`;
}

/** llms-full.txt — full plain-language knowledge base for answer engines. */
export function llmsFullTxt() {
  return `# ${site.name} — Mantenimiento y obras offshore / terrestres

${site.description}

## Datos de la empresa

- Nombre: ${site.name}
- Giro: mantenimiento industrial, reparación, construcción y puesta en operación (offshore y terrestre)
- Teléfono y WhatsApp: ${site.phoneDisplay} (${site.phone})
- Correo electrónico: ${site.email}
- Gerente de Proyectos: ${site.manager.displayName}
- Zonas de servicio: ${site.areaServed.join(', ')}
- Valores: ${site.pillars.join(', ')}
- Frase: "${site.claim}"
- Sitio web: ${site.url}

## Servicios

${services
  .map(
    (s) => `### ${s.index}. ${s.name}

${s.summary}

${s.scope.map((i) => `- ${i}`).join('\n')}
`,
  )
  .join('\n')}
### Otras especialidades

${otherSpecialties.map((o) => `- ${o}`).join('\n')}

## Proceso de trabajo

${process.map((p) => `${p.step}. **${p.title}**: ${p.text}`).join('\n')}

## Misión

${site.mission}

## Visión

${site.vision}

## Objetivos

${site.objectives.map((o) => `- ${o}`).join('\n')}

## Preguntas frecuentes

${faqs.map((f) => `### ${f.q}\n\n${f.a}\n`).join('\n')}
## Cómo cotizar

Envía por WhatsApp (${site.phoneDisplay}) o correo (${site.email}) el tipo de instalación (offshore o terrestre), la especialidad, la ubicación, el alcance y fotografías del sitio si es posible.
`;
}
