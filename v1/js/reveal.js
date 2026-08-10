/**
 * Apparition des blocs à l'entrée dans le viewport.
 * Fade + légère élévation, une seule fois (Guía §7).
 *
 * Volontairement basé sur une mesure au scroll plutôt que sur un
 * IntersectionObserver : celui-ci ne notifie que les franchissements de seuil,
 * si bien qu'un défilement par sauts (ancre, scrollbar tirée, restauration de
 * position) peut faire traverser un bloc sans jamais déclencher son entrée —
 * qui reste alors invisible. La vérification ci-dessous est déterministe et
 * s'arrête d'elle-même une fois tous les blocs révélés.
 */

export function initReveal() {
  const targets = [...document.querySelectorAll('[data-reveal]')];
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  targets.forEach((el) => {
    // Le décalage est indexé par groupe pour éviter des retards cumulés.
    const group = el.closest('[data-reveal-group]');
    if (group) {
      const index = [...group.querySelectorAll('[data-reveal]')].indexOf(el);
      el.style.setProperty('--reveal-delay', `${index * 80}ms`);
    } else if (el.dataset.reveal) {
      el.style.setProperty('--reveal-delay', `${Number(el.dataset.reveal) || 0}ms`);
    }
  });

  const pending = new Set(targets);
  let scheduled = false;

  const check = () => {
    scheduled = false;
    const trigger = window.innerHeight * 0.92;

    for (const el of pending) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('is-revealed');
        pending.delete(el);
      }
    }

    if (pending.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  };

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(check);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  check();
}
