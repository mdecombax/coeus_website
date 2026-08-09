/**
 * Indicateur « scroll » du hero : pulsation discrète, disparition définitive
 * au premier défilement (Guía §7 et §9).
 */

export function initScrollHint() {
  const hint = document.querySelector('[data-scroll-hint]');
  if (!hint) return;

  const hide = () => {
    hint.classList.add('is-hidden');
    window.removeEventListener('scroll', onScroll);
  };

  const onScroll = () => {
    if (window.scrollY > 40) hide();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
