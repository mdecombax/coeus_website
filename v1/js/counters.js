/**
 * Compteurs animés — une seule fois à l'entrée dans le viewport (Guía §7).
 * Uniquement sur des chiffres réels : un `data-value` vide n'est pas animé,
 * l'indicateur entier est masqué en amont par bindings.js.
 */

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function animate(el, value, duration = 1200) {
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.round(easeOutExpo(progress) * value));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const value = Number(el.dataset.counter);
        observer.unobserve(el);

        if (!Number.isFinite(value)) return;
        if (reduced) el.textContent = String(value);
        else animate(el, value);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
