/**
 * Coeus — champ de particules réactif au curseur.
 *
 * Superpose un <canvas> à un symbole de marque (dragón, faro, ola) et y anime
 * un nuage de points reliés par de fines lignes de constellation. Les points
 * dérivent lentement autour d'une position d'ancrage et sont attirés vers le
 * pointeur par un ressort amorti, ce qui produit un retour élastique une fois
 * le curseur éloigné.
 *
 * Contraintes de la Guía Maestra §6/§7 :
 *  - mouvement lent, contrôlé, intentionnel ;
 *  - densité de lignes faible (interdiction de l'effet « toile d'araignée ») ;
 *  - accents orange ponctuels seulement ;
 *  - fallback statique si `prefers-reduced-motion` ou pointeur tactile.
 */

import { onFrame } from './raf.js';

const PALETTE = [
  { color: '15, 76, 129', weight: 0.34 }, // Coeus Deep Blue
  { color: '175, 203, 227', weight: 0.5 }, // Mist Blue
  { color: '11, 31, 51', weight: 0.08 }, // Midnight Navy
  { color: '242, 140, 40', weight: 0.08 }, // Signal Orange — accents ponctuels
];

const DEFAULTS = {
  density: 78, // nombre de particules sur desktop
  densityMobile: 26,
  linkDistance: 68, // portée des lignes de constellation, en px CSS
  pointerRadius: 190, // rayon d'influence du curseur
  pointerStrength: 26, // amplitude max du déplacement induit, en px
  stiffness: 0.035, // raideur du ressort de rappel
  damping: 0.86, // amortissement — évite l'oscillation
  driftSpeed: 0.00022, // vitesse de la dérive sinusoïdale
  driftAmplitude: 9,
  maxDpr: 2,
};

const pickColor = () => {
  let r = Math.random();
  for (const entry of PALETTE) {
    r -= entry.weight;
    if (r <= 0) return entry.color;
  }
  return PALETTE[1].color;
};

export class ParticleField {
  /**
   * @param {HTMLElement} root  conteneur `.symbol` (position: relative)
   * @param {object} options    surcharges de DEFAULTS
   */
  constructor(root, options = {}) {
    this.root = root;
    this.opts = { ...DEFAULTS, ...options };
    this.canvas = root.querySelector('.symbol__canvas');

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    if (!this.ctx) return;

    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.visible = false;
    this.hasPointer = false;

    // Position brute du pointeur, puis version lissée réellement utilisée.
    this.pointer = { x: 0, y: 0, active: false };
    this.smooth = { x: 0, y: 0 };

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.tick = this.tick.bind(this);

    this.init();
  }

  init() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // Fallback statique : on n'initialise même pas le canvas.
    if (reduced) {
      this.canvas.remove();
      return;
    }

    this.hasPointer = !coarse;
    this.resize();

    if (this.hasPointer) {
      window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
    }

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.root);

    // Le rendu ne tourne que lorsque la scène est réellement visible.
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
      },
      { rootMargin: '15% 0px' }
    );
    this.intersectionObserver.observe(this.root);

    this.stopFrame = onFrame(this.tick);
  }

  resize() {
    const rect = this.root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    this.width = rect.width;
    this.height = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.seed();
  }

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.resize(), 150);
  }

  /**
   * Répartit les particules en privilégiant la périphérie du cadre : le centre,
   * occupé par le symbole, reste lisible.
   */
  seed() {
    const coarse = window.matchMedia('(max-width: 720px)').matches;
    const count = coarse ? this.opts.densityMobile : this.opts.density;

    this.particles = Array.from({ length: count }, (_, i) => {
      // Distribution radiale : rayon biaisé vers l'extérieur.
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.32 + Math.sqrt(Math.random()) * 0.62;
      const ax = this.width * (0.5 + Math.cos(angle) * radius * 0.5);
      const ay = this.height * (0.5 + Math.sin(angle) * radius * 0.5);

      return {
        ax,
        ay,
        x: ax,
        y: ay,
        vx: 0,
        vy: 0,
        size: 0.6 + Math.random() * 1.4,
        color: pickColor(),
        baseAlpha: 0.24 + Math.random() * 0.36,
        // Déphasages pour que dérive et respiration ne soient pas synchronisées.
        phase: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        speed: 0.55 + Math.random() * 0.9,
        seedIndex: i,
      };
    });
  }

  handlePointerMove(event) {
    const rect = this.root.getBoundingClientRect();
    this.pointer.x = event.clientX - rect.left;
    this.pointer.y = event.clientY - rect.top;

    // On garde le pointeur actif un peu au-delà du cadre pour éviter les à-coups.
    const margin = this.opts.pointerRadius;
    this.pointer.active =
      this.pointer.x > -margin &&
      this.pointer.x < rect.width + margin &&
      this.pointer.y > -margin &&
      this.pointer.y < rect.height + margin;

    if (this.pointer.active && !this.smoothInitialised) {
      this.smooth.x = this.pointer.x;
      this.smooth.y = this.pointer.y;
      this.smoothInitialised = true;
    }
  }

  handlePointerLeave() {
    this.pointer.active = false;
  }

  tick(time) {
    if (!this.visible || !this.width) return;

    const { ctx, opts } = this;

    // Lissage du pointeur : le champ « suit » sans jamais coller au curseur.
    if (this.pointer.active) {
      this.smooth.x += (this.pointer.x - this.smooth.x) * 0.06;
      this.smooth.y += (this.pointer.y - this.smooth.y) * 0.06;
    }

    ctx.clearRect(0, 0, this.width, this.height);

    const pointerActive = this.hasPointer && this.pointer.active;
    const radiusSq = opts.pointerRadius * opts.pointerRadius;

    for (const p of this.particles) {
      // 1. Dérive lente autour de l'ancrage.
      const drift = time * opts.driftSpeed * p.speed;
      const targetX = p.ax + Math.cos(drift + p.phase) * opts.driftAmplitude;
      const targetY = p.ay + Math.sin(drift * 0.8 + p.phase2) * opts.driftAmplitude;

      // 2. Attraction douce vers le pointeur, plafonnée.
      let goalX = targetX;
      let goalY = targetY;

      if (pointerActive) {
        const dx = this.smooth.x - targetX;
        const dy = this.smooth.y - targetY;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq && distSq > 0.01) {
          const falloff = 1 - distSq / radiusSq; // 0 au bord, 1 au centre
          const dist = Math.sqrt(distSq);
          const pull = (opts.pointerStrength * falloff * falloff) / dist;
          goalX += dx * pull;
          goalY += dy * pull;
        }
      }

      // 3. Ressort amorti → retour élastique quand le curseur s'éloigne.
      p.vx = (p.vx + (goalX - p.x) * opts.stiffness) * opts.damping;
      p.vy = (p.vy + (goalY - p.y) * opts.stiffness) * opts.damping;
      p.x += p.vx;
      p.y += p.vy;

      // 4. Respiration d'opacité.
      p.alpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(time * 0.0008 * p.speed + p.phase));
    }

    this.drawLinks();
    this.drawParticles();
  }

  drawLinks() {
    const { ctx, particles, opts } = this;
    const max = opts.linkDistance;
    const maxSq = max * max;

    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      // Une particule sur deux seulement génère des liens : densité maîtrisée.
      if (a.seedIndex % 2 === 1) continue;

      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > maxSq) continue;

        const strength = (1 - distSq / maxSq) * 0.085;
        ctx.strokeStyle = `rgba(15, 76, 129, ${strength.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  drawParticles() {
    const { ctx } = this;

    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  destroy() {
    this.stopFrame?.();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerleave', this.handlePointerLeave);
  }
}

/** Instancie un champ de particules sur chaque `[data-particles]` du document. */
export function initParticles() {
  const fields = [];

  document.querySelectorAll('[data-particles]').forEach((el) => {
    const options = {};
    if (el.dataset.density) options.density = Number(el.dataset.density);
    if (el.dataset.pointerStrength) options.pointerStrength = Number(el.dataset.pointerStrength);
    fields.push(new ParticleField(el, options));
  });

  return fields;
}
