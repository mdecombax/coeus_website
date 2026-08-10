/**
 * Pont entre `data/content.js` et le DOM statique.
 *
 * Le HTML est écrit en dur (SEO, pas de FOUC), mais tout ce qui dépend d'une
 * information encore manquante côté Coeus est résolu ici :
 *  - `[data-todo="whatsappUrl"]`   → href, ou repli vers la page contacto ;
 *  - `[data-todo="linkedinUrl"]`   → href, ou lien rendu inerte ;
 *  - `[data-stat]`                 → l'indicateur est retiré si la valeur est nulle.
 *
 * Aucune valeur n'est inventée : en l'absence de donnée, on masque (Guía §11).
 */

import { TODO, home } from '../data/content.js';

function bindLinks() {
  document.querySelectorAll('[data-todo]').forEach((el) => {
    const key = el.dataset.todo;
    const value = TODO[key];

    if (value) {
      el.setAttribute('href', value);
      el.removeAttribute('aria-disabled');
      return;
    }

    const fallback = el.dataset.todoFallback;
    if (fallback) {
      el.setAttribute('href', fallback);
      return;
    }

    // Ni valeur ni repli : le lien reste visible mais neutralisé.
    el.removeAttribute('href');
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('tabindex', '-1');
  });
}

function bindStats() {
  const stats = document.querySelectorAll('[data-stat]');
  if (!stats.length) return;

  const values = new Map(home.experiencia.stats.map((s) => [s.label, s]));

  stats.forEach((el) => {
    const stat = values.get(el.dataset.stat);
    if (!stat || stat.value === null || stat.value === undefined) {
      el.remove();
      return;
    }
    const number = el.querySelector('[data-counter]');
    if (number) number.dataset.counter = String(stat.value);
  });
}

export function initBindings() {
  bindLinks();
  bindStats();
}
