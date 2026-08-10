/**
 * Coeus — point d'entrée.
 * L'ordre compte : les liaisons de contenu s'exécutent avant les compteurs,
 * qui lisent les valeurs injectées dans le DOM.
 */

import { initBindings } from './bindings.js';
import { initHeader } from './header.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initMarquee } from './marquee.js';
import { initParticles } from './particles.js';
import { initScrollHint } from './scroll-hint.js';
import { initForm } from './form.js';

function boot() {
  initBindings();
  initHeader();
  initReveal();
  initCounters();
  initMarquee();
  initParticles();
  initScrollHint();
  initForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
