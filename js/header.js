/**
 * Header sticky : compaction au scroll, dropdowns accessibles au clavier,
 * drawer mobile en accordéon (Guía §8 et §10).
 */

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  /* ---------- Compaction au scroll ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Dropdowns desktop ---------- */
  const items = [...header.querySelectorAll('[data-dropdown]')];

  const closeAll = (except = null) => {
    items.forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
    });
  };

  items.forEach((item) => {
    const trigger = item.querySelector('[aria-expanded]');
    if (!trigger) return;

    const open = () => {
      closeAll(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      item.classList.contains('is-open') ? close() : open();
    });

    item.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover)').matches) open();
    });
    item.addEventListener('pointerleave', () => {
      if (window.matchMedia('(hover: hover)').matches) close();
    });

    // Le focus clavier ouvre aussi le panneau ; on ne le referme que lorsque
    // le focus quitte réellement l'ensemble trigger + dropdown.
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openItem = items.find((i) => i.classList.contains('is-open'));
    if (openItem) {
      openItem.querySelector('[aria-expanded]')?.focus();
      closeAll();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeAll();
  });

  /* ---------- Drawer mobile ---------- */
  const burger = header.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');

  if (burger && drawer) {
    const setDrawer = (open) => {
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', () => {
      setDrawer(!drawer.classList.contains('is-open'));
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setDrawer(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        setDrawer(false);
        burger.focus();
      }
    });

    // Repasser en desktop referme le drawer et rétablit le scroll.
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => {
      if (e.matches) setDrawer(false);
    });

    /* Accordéons du drawer */
    drawer.querySelectorAll('[data-accordion-toggle]').forEach((toggle) => {
      const section = toggle.closest('[data-accordion]');
      toggle.addEventListener('click', () => {
        const open = !section.classList.contains('is-open');
        section.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
    });
  }
}
