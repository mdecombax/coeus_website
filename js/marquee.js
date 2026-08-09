/**
 * Carrousel horizontal infini des logos clients (Guía §9 — section 02).
 *
 * Le défilement est piloté en JS sur un `transform: translate3d` afin de
 * pouvoir le ralentir progressivement au survol plutôt que de le stopper net,
 * et de le suspendre hors viewport.
 */

import { onFrame } from './raf.js';

export function initMarquee(selector = '[data-marquee]') {
  const root = document.querySelector(selector);
  if (!root) return;

  const track = root.querySelector('[data-marquee-track]');
  if (!track) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplication du contenu pour que la boucle soit invisible.
  const original = track.innerHTML;
  track.innerHTML = original + original;
  track.setAttribute('aria-hidden', 'false');
  // La seconde copie est purement décorative pour les lecteurs d'écran.
  [...track.children].slice(track.children.length / 2).forEach((el) => {
    el.setAttribute('aria-hidden', 'true');
  });

  if (reduced) return;

  const speed = Number(root.dataset.marqueeSpeed) || 42; // px / seconde
  let offset = 0;
  let lastTime = null;
  let currentSpeed = speed;
  let targetSpeed = speed;
  let visible = true;
  let half = 0;

  const measure = () => {
    half = track.scrollWidth / 2;
  };

  measure();
  new ResizeObserver(measure).observe(track);

  root.addEventListener('pointerenter', () => {
    targetSpeed = speed * 0.15;
  });
  root.addEventListener('pointerleave', () => {
    targetSpeed = speed;
  });
  root.addEventListener('focusin', () => {
    targetSpeed = 0;
  });
  root.addEventListener('focusout', () => {
    targetSpeed = speed;
  });

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) lastTime = null;
    },
    { rootMargin: '10% 0px' }
  ).observe(root);

  onFrame((time) => {
    if (!visible || !half) return;
    if (lastTime === null) {
      lastTime = time;
      return;
    }

    const delta = Math.min((time - lastTime) / 1000, 0.05); // anti-saut d'onglet
    lastTime = time;

    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    offset = (offset + currentSpeed * delta) % half;

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  });
}
