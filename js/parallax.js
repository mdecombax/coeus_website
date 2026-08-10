/**
 * Micro-parallaxe au défilement (Guía §7 : mouvement lent et contrôlé).
 *
 * Chaque `[data-parallax]` reçoit un décalage vertical proportionnel à sa
 * position dans le viewport. L'amplitude par défaut reste volontairement
 * faible : le décor respire, il ne glisse pas.
 *
 * Le décalage est écrit dans la variable `--parallax-y` plutôt que directement
 * dans `style.transform`, pour que la feuille de style garde la main sur la
 * composition du transform (cf. components.css).
 */

const DEFAULT_STRENGTH = 26; // amplitude crête à crête, en px

export function initParallax() {
  const targets = [...document.querySelectorAll('[data-parallax]')];
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const mid = window.innerHeight / 2;

    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      // Hors champ : inutile de recalculer, et surtout de laisser une valeur
      // extrême figée sur un élément qui reviendra à l'écran.
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;

      const strength = Number(el.dataset.parallax) || DEFAULT_STRENGTH;
      // −1 quand l'élément est en bas du viewport, +1 quand il est en haut.
      const progress = (mid - (rect.top + rect.height / 2)) / (window.innerHeight / 2 + rect.height / 2);
      el.style.setProperty('--parallax-y', `${(progress * strength).toFixed(2)}px`);
    }
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}
