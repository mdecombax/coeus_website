/**
 * Coeus Cybersecurity — contenu centralisé
 *
 * Les copies proviennent de « COEUS WEBSITE CONTENT SPECIFICATION_.docx ».
 * Ne pas inventer de chiffres, certifications, clients ni couverture
 * géographique (Guía Maestra §11).
 *
 * ⚠️  TOUT CE QUI EST DANS `TODO` EST À COMPLÉTER AVANT MISE EN LIGNE.
 *     Les valeurs `null` / '' ne sont PAS rendues : le bloc concerné est
 *     simplement masqué plutôt que d'afficher un placeholder en production.
 */

/* ==========================================================================
   1. À FOURNIR PAR COEUS
   ========================================================================== */

export const TODO = {
  /* Section 05 — Alcance y experiencia. Chiffres réels uniquement. */
  empresasApoyadas: null, //  ex. 120  → affiché « 120+ Empresas apoyadas »
  paisesAtendidos: null, //  ex. 8    → affiché « 8+ Países atendidos »

  /* CTA principal du Hero + bouton circulaire du header */
  whatsappUrl: '', //  ex. 'https://wa.me/525549717709?text=Hola%20Coeus'

  /* Réseaux sociaux (header + footer). Vides → liens rendus inertes. */
  linkedinUrl: '',
  xUrl: '',

  /* Formulaire de contact — endpoint à brancher (Formspree, Web3Forms, API…) */
  formEndpoint: '',

  /* Logos des fabricants partenaires. Absents de img/ à ce jour.
     Format attendu : { name: 'Fortinet', logo: 'img/socios/fortinet.webp' } */
  sociosAliados: [],

  /* Articles Blog / Noticias / Eventos réels.
     Format : { category, title, teaser, href, image, date } */
  recursosArticulos: [],
};

/* ==========================================================================
   2. IDENTITÉ & CONTACT (validés)
   ========================================================================== */

export const brand = {
  name: 'Coeus Cybersecurity',
  slogan: ['Navegamos la incertidumbre.', 'Protegemos lo que importa.'],
  email: 'linda@coeus.com.mx',
  phone: '+52 55 4971 7709',
  phoneHref: 'tel:+525549717709',
  year: 2026,
};

/* ==========================================================================
   3. NAVIGATION
   ========================================================================== */

export const soluciones = [
  {
    slug: 'pruebas-de-penetracion',
    title: 'Pruebas de Penetración',
    short: 'Identificamos vulnerabilidades antes de que puedan convertirse en un riesgo.',
    menuHint: 'Ataques controlados sobre infraestructura, apps y servicios.',
    icon: 'target',
  },
  {
    slug: 'coordinacion-de-ciberseguridad',
    title: 'Coordinación de Ciberseguridad',
    short: 'Gestionamos la ciberseguridad como una función estratégica para su organización.',
    menuHint: 'Gestión de vulnerabilidades, gobierno e indicadores ejecutivos.',
    icon: 'compass',
  },
  {
    slug: 'soluciones-de-ciberseguridad',
    title: 'Diseño, Implementación y Operación de Soluciones de Ciberseguridad',
    titleShort: 'Soluciones de Ciberseguridad',
    short: 'Diseñamos, implementamos y operamos soluciones alineadas con sus objetivos de negocio.',
    menuHint: 'Zero Trust, SASE, SIEM, Cloud Security, Identity Security.',
    icon: 'layers',
  },
  {
    slug: 'application-security-testing',
    title: 'Application Security Testing',
    short: 'Protegemos sus aplicaciones durante todo el ciclo de desarrollo.',
    menuHint: 'SAST, DAST, IAST, SCA y análisis de dependencias.',
    icon: 'code',
  },
  {
    slug: 'devsecops',
    title: 'DevSecOps',
    short: 'Integramos seguridad en cada etapa del desarrollo de software.',
    menuHint: 'Security pipelines, controles CI/CD e Infrastructure as Code.',
    icon: 'pipeline',
  },
];

export const coeusMenu = [
  {
    href: 'nosotros.html',
    title: 'Nosotros',
    hint: 'Misión, visión, nuestra promesa y certificaciones.',
  },
  {
    href: 'socios-aliados.html',
    title: 'Socios Aliados',
    hint: 'Socios principales y demás aliados tecnológicos.',
  },
  {
    href: 'recursos.html',
    title: 'Recursos',
    hint: 'Noticias, eventos y blog.',
  },
];

/* ==========================================================================
   4. HOME
   ========================================================================== */

export const home = {
  hero: {
    headline: ['Seguridad ofensiva', 'y ciberseguridad', 'para empresas.'],
    subheadline:
      'Ayudamos a las empresas a anticipar amenazas, reducir riesgos y proteger la continuidad de su operación.',
    cta: 'Contáctanos ahora',
    scrollLabel: 'Scroll',
  },

  clientes: {
    eyebrow: 'Nuestros clientes',
    backdrop: 'NUESTROS CLIENTES',
    logos: [
      { name: 'Genomma Lab', file: 'genomma' },
      { name: 'ADNS', file: 'adns' },
      { name: 'ANA Seguros', file: 'ana-seguros' },
      { name: 'Enerser', file: 'enerser' },
      { name: 'Traject', file: 'traject' },
      { name: 'Andamios', file: 'andamios' },
    ],
  },

  capacidades: {
    eyebrow: 'Nuestras capacidades',
    title: 'Cinco frentes para proteger su operación.',
    lead: 'Cada capacidad responde a una etapa distinta del ciclo de seguridad, desde la detección ofensiva hasta la operación continua.',
    // Les cartes reprennent `soluciones` ci-dessus.
  },

  avanzada: {
    eyebrow: 'Ciberseguridad avanzada',
    title: ['Ciberseguridad avanzada para empresas', 'que no pueden detener su operación.'],
    body: 'Visibilidad, estrategia y protección para fortalecer la continuidad del negocio.',
    cta: 'Solicitar un análisis',
    href: 'contacto.html',
  },

  experiencia: {
    eyebrow: 'Alcance y experiencia',
    title: 'Experiencia que respalda cada decisión.',
    // `value: null` → l'indicateur n'est pas rendu (voir TODO).
    stats: [
      { value: 15, suffix: '+', label: 'Años de experiencia' },
      { value: 100, suffix: '%', label: 'Especializados en ciberseguridad' },
      { value: TODO.empresasApoyadas, suffix: '+', label: 'Empresas apoyadas' },
      { value: TODO.paisesAtendidos, suffix: '+', label: 'Países atendidos' },
    ],
  },

  recursos: {
    eyebrow: 'Recursos',
    title: 'Conocimiento para anticipar las amenazas del mañana.',
    lead: 'Compartimos análisis, tendencias y experiencias para ayudar a las organizaciones a tomar mejores decisiones en ciberseguridad.',
    cards: [
      {
        key: 'blog',
        label: 'Blog',
        title: 'Artículos y análisis especializados.',
        teaser: 'Contenido técnico, mejores prácticas y análisis especializados.',
        cta: 'Ver artículos',
        href: 'recursos.html#blog',
      },
      {
        key: 'noticias',
        label: 'Noticias',
        title: 'Las tendencias que impactan la ciberseguridad.',
        teaser: 'Actualidad sobre amenazas, tecnologías y ciberseguridad empresarial.',
        cta: 'Ver noticias',
        href: 'recursos.html#noticias',
      },
      {
        key: 'eventos',
        label: 'Eventos',
        title: 'Experiencias, webinars y sesiones exclusivas.',
        teaser: 'Webinars, experiencias y eventos exclusivos junto a nuestros socios tecnológicos.',
        cta: 'Ver eventos',
        href: 'recursos.html#eventos',
      },
    ],
  },

  ctaFinal: {
    title: 'La seguridad comienza con una conversación.',
    cta: 'Contáctanos ahora',
  },
};

/* ==========================================================================
   5. FOOTER
   ========================================================================== */

export const footer = {
  columns: [
    {
      title: 'Soluciones',
      links: soluciones.map((s) => ({
        label: s.titleShort || s.title,
        href: `soluciones/${s.slug}.html`,
      })),
    },
    {
      title: 'Coeus',
      links: coeusMenu.map((m) => ({ label: m.title, href: m.href })),
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Blog', href: 'recursos.html#blog' },
        { label: 'Noticias', href: 'recursos.html#noticias' },
        { label: 'Eventos', href: 'recursos.html#eventos' },
      ],
    },
    {
      title: 'Contacto',
      links: [
        { label: 'Contacto', href: 'contacto.html' },
        { label: 'LinkedIn', href: TODO.linkedinUrl, external: true },
        { label: 'X', href: TODO.xUrl, external: true },
      ],
    },
  ],
  legal: [
    { label: 'Aviso de Privacidad', href: 'aviso-de-privacidad.html' },
    { label: 'Términos y Condiciones', href: 'terminos-y-condiciones.html' },
  ],
};
