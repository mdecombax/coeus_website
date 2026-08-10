/**
 * Boucle d'animation unique et partagée.
 *
 * Toutes les scènes de particules et les effets de scroll s'y abonnent plutôt
 * que d'ouvrir chacun leur `requestAnimationFrame` : une seule frame par tick,
 * et la boucle s'arrête d'elle-même quand plus personne n'écoute ou que
 * l'onglet passe en arrière-plan.
 */

const subscribers = new Set();
let rafId = null;

function loop(time) {
  rafId = requestAnimationFrame(loop);
  for (const fn of subscribers) fn(time);
}

function start() {
  if (rafId === null && subscribers.size > 0 && !document.hidden) {
    rafId = requestAnimationFrame(loop);
  }
}

function stop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
  else start();
});

/**
 * Abonne une fonction à la boucle.
 * @param {(time: number) => void} fn
 * @returns {() => void} désabonnement
 */
export function onFrame(fn) {
  subscribers.add(fn);
  start();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stop();
  };
}
