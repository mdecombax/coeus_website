/**
 * Indicateur « scroll » du hero : pulsation discrète, visible tant que l'on est
 * dans le hero (Guía §7 et §9).
 *
 * Réversible et non plus définitif : l'indicateur se masque dès que la page
 * défile et réapparaît à chaque retour en haut. Un seuil unique produirait un
 * clignotement autour de la valeur limite ; on utilise donc une hystérésis —
 * masquage au-delà de 40 px, réapparition seulement en dessous de 12 px.
 */

const HIDE_AT = 40;
const SHOW_AT = 12;

export function initScrollHint() {
  const hint = document.querySelector('[data-scroll-hint]');
  if (!hint) return;

  let hidden = false;
  let ticking = false;

  const apply = () => {
    ticking = false;
    const y = window.scrollY;

    if (!hidden && y > HIDE_AT) {
      hidden = true;
      hint.classList.add('is-hidden');
    } else if (hidden && y < SHOW_AT) {
      hidden = false;
      hint.classList.remove('is-hidden');
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  apply();
}
