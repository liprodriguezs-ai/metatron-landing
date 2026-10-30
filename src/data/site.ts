// Single source of truth for business data. Feeds the page, JSON-LD, llms.txt and the manifest.
import { SITE_URL } from './site-url.mjs';

export const site = {
  url: SITE_URL,
  name: 'Metatron Service',
  legalName: 'Metatron Service',
  tagline: 'Mantenimiento y obras offshore / terrestres',
  slogan: 'Tu proyecto, nuestra misión.',
  claim: 'Fuerza, compromiso y experiencia que construye confianza.',
  title: 'Metatron Service | Mantenimiento industrial y obras offshore y terrestres en México',
  description:
    'Mantenimiento industrial y obras offshore y terrestres en México: obra eléctrica, sistemas fotovoltaicos, aire acondicionado, aislamiento térmico, obra civil y estructural. Cotiza tu proyecto.',
  locale: 'es_MX',
  lang: 'es-MX',
  phone: '+529381838455',
  phoneDisplay: '938 183 8455',
  whatsapp: '529381838455',
  email: 'jimenez.metatron@gmail.com',
  // The office location is intentionally not published; only the country is exposed.
  country: 'MX',
  manager: {
    name: 'José Antonio Jiménez Santos',
    displayName: 'Ing. José Antonio Jiménez',
    role: 'Gerente de Proyectos',
  },
  areaServed: ['México', 'Golfo de México'],
  pillars: ['Calidad', 'Seguridad', 'Compromiso'],
  mission:
    'Somos un equipo íntegro, orientado al servicio del Cliente, mejorando continuamente nuestros procesos, con el objetivo de consolidar nuestra empresa con un reconocido prestigio Nacional por su eficiencia, calidad y competitividad.',
  vision:
    'Ser una empresa con capacidad de prestar servicios de mantenimiento, reparación y puesta en operación de Obra Civil, Estructural, Eléctrica, Mecánica, Aire Acondicionado, Instrumentación, Aislamiento Térmico, Tubería de cobre y Tubería de CPVC industrial, como la mejor alternativa que satisface las necesidades de nuestros Clientes, a través de una buena planeación, selección del material adecuado, menor tiempo de ejecución y un costo competitivo.',
  objectives: [
    'Entregar un servicio de excelencia que satisfaga los requerimientos constructivos de los proyectos.',
    'Formar equipos de profesionales y trabajadores con un claro compromiso con la calidad y la prevención de riesgos.',
    'Prestar un oportuno servicio de supervisión durante la etapa de ejecución del proyecto.',
    'Planificar y controlar la eficiencia y eficacia de los insumos de construcción.',
  ],
} as const;

export const whatsappUrl = (text = 'Hola Metatron Service, me gustaría cotizar un proyecto.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type Service = {
  id: string;
  index: string;
  name: string;
  short: string;
  summary: string;
  scope: string[];
  keywords: string[];
  image: 'electrica' | 'solar' | 'hvac' | 'aislamiento' | 'civil' | 'estructural';
  alt: string;
};

export const services: Service[] = [
  {
    id: 'obra-electrica',
    index: '01',
    name: 'Obra eléctrica',
    short: 'Eléctrica',
    summary:
      'Instalación, pruebas, mantenimiento y puesta en operación de sistemas eléctricos de potencia, respaldo y alumbrado.',
    scope: [
      'Motogeneradores eléctricos y motores de CA y CD',
      'Plantas de emergencia y subestaciones eléctricas',
      'Transformadores y bancos de baterías de CA y CD',
      'Alumbrado normal y de emergencia',
      'Sistemas de tierras y pararrayos',
    ],
    keywords: ['subestaciones eléctricas', 'plantas de emergencia', 'transformadores', 'tierras y pararrayos'],
    image: 'electrica',
    alt: 'Técnico con overol naranja inspeccionando tableros en una subestación eléctrica al anochecer',
  },
  {
    id: 'sistemas-fotovoltaicos',
    index: '02',
    name: 'Sistemas fotovoltaicos',
    short: 'Fotovoltaica',
    summary:
      'Energía solar para instalaciones comerciales e industriales, desde el montaje hasta el diagnóstico de inversores.',
    scope: [
      'Instalación de sistemas fotovoltaicos e inversores',
      'Pruebas y puesta en servicio',
      'Mantenimiento preventivo y correctivo',
      'Reparación de inversores y cableado',
    ],
    keywords: ['paneles solares', 'inversores', 'energía solar industrial'],
    image: 'solar',
    alt: 'Técnico caminando entre filas de paneles solares sobre la azotea de una nave industrial',
  },
  {
    id: 'aire-acondicionado',
    index: '03',
    name: 'Aire acondicionado',
    short: 'A/A',
    summary:
      'Mantenimiento e instalación de sistemas de climatización de confort e industriales, con tubería de cobre.',
    scope: [
      'Unidades enfriadoras de agua (chillers)',
      'Manejadoras de aire y extractores',
      'Torres de enfriamiento',
      'Equipos piso-techo, fan coil, mini split y ventana',
      'Tubería de cobre para refrigeración',
    ],
    keywords: ['mantenimiento de chillers', 'torres de enfriamiento', 'HVAC industrial'],
    image: 'hvac',
    alt: 'Planta de aire acondicionado industrial con chillers, manejadoras y torre de enfriamiento en azotea',
  },
  {
    id: 'aislamiento-termico',
    index: '04',
    name: 'Aislamiento térmico',
    short: 'Aislamiento',
    summary:
      'Aislamiento con fibra de vidrio y protección mecánica metálica para tuberías, accesorios y válvulas.',
    scope: [
      'Aislamiento térmico de fibra de vidrio en tuberías, accesorios y válvulas',
      'Protección mecánica con lámina',
      'Sustitución y corrección de protección mecánica',
      'Fabricación e instalación de puertos de inspección',
    ],
    keywords: ['aislamiento de tuberías', 'protección mecánica', 'puertos de inspección'],
    image: 'aislamiento',
    alt: 'Tuberías industriales con aislamiento térmico y chaqueta de aluminio, codos y válvulas',
  },
  {
    id: 'obra-civil',
    index: '05',
    name: 'Obra civil',
    short: 'Civil',
    summary:
      'Construcción, habilitación y acabados para espacios comerciales, institucionales e industriales.',
    scope: [
      'Bardas perimetrales, pisos y banquetas',
      'Ingeniería y construcción de unidades deportivas',
      'Habilitación de locales comerciales e islas para cajero',
      'Fabricación de locales de gobierno',
      'Plafón, tablaroca, aplanados y nivelación de juntas',
    ],
    keywords: ['obra civil comercial', 'tablaroca', 'bardas perimetrales'],
    image: 'civil',
    alt: 'Obra civil comercial al anochecer con barda de block, banquetas nuevas y local iluminado',
  },
  {
    id: 'obra-estructural',
    index: '06',
    name: 'Obra estructural',
    short: 'Estructural',
    summary:
      'Mantenimiento de estructuras metálicas, techumbres y naves para prolongar su vida útil con seguridad.',
    scope: [
      'Mantenimiento estructural',
      'Estructuras metálicas y techumbres',
      'Trabajos en altura con andamiaje',
      'Supervisión durante la ejecución',
    ],
    keywords: ['estructuras metálicas', 'techumbres', 'mantenimiento estructural'],
    image: 'estructural',
    alt: 'Estructura metálica de nave industrial en construcción con trabajador en altura al atardecer',
  },
];

export const otherSpecialties = [
  'Obra mecánica',
  'Instrumentación',
  'Tubería de cobre',
  'Tubería de CPVC industrial',
];

export type Work = { file: string; category: Service['short']; alt: string };

// Real project photos from the company portfolio.
export const works: Work[] = [
  { file: 'fotovoltaica-01', category: 'Fotovoltaica', alt: 'Técnico supervisando un arreglo de paneles solares en azotea' },
  { file: 'electrica-01', category: 'Eléctrica', alt: 'Técnico revisando tableros e inversores en cuarto eléctrico' },
  { file: 'aislamiento-01', category: 'Aislamiento', alt: 'Técnicos instalando protección mecánica de lámina en tubería aislada' },
  { file: 'estructural-01', category: 'Estructural', alt: 'Trabajos en altura sobre estructura metálica de techumbre' },
  { file: 'aire-01', category: 'A/A', alt: 'Técnico realizando mantenimiento en torre de enfriamiento' },
  { file: 'civil-02', category: 'Civil', alt: 'Local de atención terminado con plafón e iluminación empotrada' },
  { file: 'electrica-02', category: 'Eléctrica', alt: 'Técnico con overol naranja trabajando en tablero eléctrico' },
  { file: 'aire-02', category: 'A/A', alt: 'Diagnóstico del tablero de control de una unidad enfriadora' },
  { file: 'fotovoltaica-02', category: 'Fotovoltaica', alt: 'Paneles fotovoltaicos instalados sobre techumbre metálica' },
  { file: 'civil-03', category: 'Civil', alt: 'Plafón decorativo de tablaroca con iluminación indirecta' },
  { file: 'aislamiento-02', category: 'Aislamiento', alt: 'Tubería con aislamiento térmico y protección metálica' },
  { file: 'estructural-02', category: 'Estructural', alt: 'Techumbre metálica terminada en área exterior' },
  { file: 'electrica-05', category: 'Eléctrica', alt: 'Motor eléctrico industrial en mantenimiento' },
  { file: 'civil-01', category: 'Civil', alt: 'Barda perimetral de block terminada' },
  { file: 'aire-03', category: 'A/A', alt: 'Carga de refrigerante a equipo de aire acondicionado con manómetros' },
  { file: 'civil-05', category: 'Civil', alt: 'Fachada de local comercial terminado con cancelería' },
  { file: 'electrica-03', category: 'Eléctrica', alt: 'Técnico realizando conexiones en tablero de distribución' },
  { file: 'aislamiento-03', category: 'Aislamiento', alt: 'Red de tuberías aisladas en cuarto de máquinas' },
  { file: 'estructural-03', category: 'Estructural', alt: 'Montaje de estructura metálica con andamio' },
  { file: 'civil-07', category: 'Civil', alt: 'Muros de tablaroca en proceso con andamio' },
  { file: 'aire-04', category: 'A/A', alt: 'Diagnóstico de chiller con equipo de cómputo' },
  { file: 'electrica-04', category: 'Eléctrica', alt: 'Tablero eléctrico con cableado ordenado e interruptores' },
  { file: 'fotovoltaica-03', category: 'Fotovoltaica', alt: 'Paneles solares montados sobre estructura en azotea' },
  { file: 'civil-06', category: 'Civil', alt: 'Construcción de banqueta de concreto' },
  { file: 'civil-04', category: 'Civil', alt: 'Interior habilitado con plafón y acabados' },
  { file: 'civil-08', category: 'Civil', alt: 'Cocineta habilitada con alacena y cubierta' },
];

export const process = [
  {
    step: '01',
    title: 'Planeación',
    text: 'Levantamiento en sitio, alcance técnico y programa de obra con tiempos realistas.',
  },
  {
    step: '02',
    title: 'Material adecuado',
    text: 'Selección de materiales y equipos según la especificación y el entorno, terrestre u offshore.',
  },
  {
    step: '03',
    title: 'Ejecución supervisada',
    text: 'Personal calificado, prevención de riesgos y supervisión continua durante cada etapa.',
  },
  {
    step: '04',
    title: 'Puesta en operación',
    text: 'Pruebas, puesta en servicio y entrega del sistema funcionando, con menor tiempo de ejecución.',
  },
];

export const faqs = [
  {
    q: '¿Qué servicios ofrece Metatron Service?',
    a: 'Metatron Service ofrece mantenimiento, reparación y puesta en operación de obra eléctrica (subestaciones, plantas de emergencia, transformadores, motogeneradores, tierras y pararrayos), sistemas fotovoltaicos e inversores, aire acondicionado (chillers, manejadoras, torres de enfriamiento, mini split), aislamiento térmico de tuberías, obra civil y obra estructural. También atiende obra mecánica, instrumentación y tubería de cobre y CPVC industrial.',
  },
  {
    q: '¿Dónde opera Metatron Service?',
    a: 'Metatron Service atiende proyectos de mantenimiento y obra en México, tanto terrestres como offshore (costa afuera) en el Golfo de México.',
  },
  {
    q: '¿Realizan trabajos offshore o costa afuera?',
    a: 'Sí. Metatron Service se especializa en mantenimiento y obras offshore y terrestres, con personal calificado y equipo especializado para entornos exigentes.',
  },
  {
    q: '¿Dan mantenimiento a sistemas fotovoltaicos e inversores?',
    a: 'Sí. Se realizan la instalación, las pruebas, el mantenimiento preventivo y correctivo y la reparación de sistemas fotovoltaicos e inversores para instalaciones comerciales e industriales.',
  },
  {
    q: '¿Qué equipos de aire acondicionado atienden?',
    a: 'Unidades enfriadoras de agua (chillers), manejadoras de aire, extractores, torres de enfriamiento y equipos tipo piso-techo, fan coil, mini split y ventana, incluyendo la tubería de cobre.',
  },
  {
    q: '¿Qué incluye el servicio de aislamiento térmico?',
    a: 'Instalación de aislamiento de fibra de vidrio con protección mecánica de lámina en tuberías, accesorios y válvulas; sustitución y corrección de protección mecánica, y fabricación e instalación de puertos de inspección.',
  },
  {
    q: '¿Cómo solicito una cotización?',
    a: 'Puedes escribir por WhatsApp o llamar al 938 183 8455, o enviar un correo a jimenez.metatron@gmail.com. Comparte el tipo de obra, la ubicación (terrestre u offshore), el alcance y, si es posible, fotografías del sitio.',
  },
  {
    q: '¿Quién dirige los proyectos?',
    a: 'Los proyectos están a cargo del Ing. José Antonio Jiménez, Gerente de Proyectos de Metatron Service, con supervisión durante toda la ejecución.',
  },
];
