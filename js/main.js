/**
 * Coeus — point d'entrée.
 * L'ordre compte : le préchargeur part en premier pour ne dépendre d'aucun
 * autre module, et les liaisons de contenu s'exécutent avant les compteurs,
 * qui lisent les valeurs injectées dans le DOM.
 */

import { initPreloader } from './preloader.js';
import { initBindings } from './bindings.js';
import { initHeader } from './header.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initMarquee } from './marquee.js';
import { initParticles } from './particles.js';
import { initParallax } from './parallax.js';
import { initScrollHint } from './scroll-hint.js';
import { initForm } from './form.js';

function boot() {
  initPreloader();
  initBindings();
  initHeader();
  initReveal();
  initCounters();
  initMarquee();
  initParticles();
  initParallax();
  initScrollHint();
  initForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
