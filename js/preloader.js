/**
 * Préchargeur — écran d'attente volontairement bref (Guía §7 : le mouvement
 * accompagne, il ne retarde jamais).
 *
 * Aucune attente artificielle : on retire le voile dès que la page est
 * réellement utilisable. Une durée plancher de 320 ms évite seulement le
 * clignotement d'un voile affiché puis retiré en deux images, et un plafond de
 * 1600 ms garantit qu'une police ou une image lente ne retient jamais l'écran.
 */

const MIN_VISIBLE = 320;
const MAX_VISIBLE = 1600;

export function initPreloader() {
  const el = document.querySelector('[data-preloader]');
  if (!el) return;

  const start = performance.now();
  let done = false;

  const dismiss = () => {
    if (done) return;
    done = true;

    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - start));
    setTimeout(() => {
      el.classList.add('is-done');
      document.documentElement.classList.add('is-loaded');
      // Retrait du DOM une fois le fondu terminé : le voile ne doit pas rester
      // en couche fixe au-dessus de la page, même invisible.
      setTimeout(() => el.remove(), 600);
    }, wait);
  };

  // Les polices sont l'attente la plus visible du site (deux familles
  // self-hostées) ; on attend leur disponibilité, sans jamais en dépendre.
  const ready = document.fonts?.ready ?? Promise.resolve();
  Promise.race([ready, new Promise((r) => setTimeout(r, MAX_VISIBLE))]).then(dismiss);

  setTimeout(dismiss, MAX_VISIBLE);
  window.addEventListener('load', dismiss, { once: true });
}
