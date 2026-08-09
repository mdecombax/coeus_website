/**
 * Formulaire de contact.
 *
 * Validation côté client en espagnol, protection antispam par honeypot +
 * temps de remplissage minimal, états loading / succès / erreur.
 *
 * L'envoi passe par `TODO.formEndpoint` (data/content.js). Tant qu'il est vide,
 * le formulaire n'envoie rien et affiche l'erreur prévue par la spec avec les
 * coordonnées directes — plutôt que de simuler un succès.
 */

import { TODO } from '../data/content.js';

/* Délai sous lequel une soumission est considérée robotique. */
const MIN_FILL_MS = 3000;

const MESSAGES = {
  required: 'Este campo es obligatorio.',
  email: 'Ingrese un correo electrónico válido.',
  phone: 'Ingrese un teléfono válido.',
  consent: 'Debe aceptar el Aviso de Privacidad para continuar.',
  minLength: 'Proporcione un poco más de detalle.',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+\d][\d\s().-]{7,}$/;

function setError(field, message) {
  const input = field.querySelector('input, textarea');
  const slot = field.querySelector('.field__error');
  if (!input || !slot) return;

  if (message) {
    input.setAttribute('aria-invalid', 'true');
    slot.textContent = message;
  } else {
    input.removeAttribute('aria-invalid');
    slot.textContent = '';
  }
}

function validateField(field) {
  const input = field.querySelector('input, textarea');
  if (!input) return true;

  const value = input.value.trim();

  if (input.required && !value) {
    setError(field, MESSAGES.required);
    return false;
  }
  if (value && input.type === 'email' && !EMAIL_RE.test(value)) {
    setError(field, MESSAGES.email);
    return false;
  }
  if (value && input.type === 'tel' && !PHONE_RE.test(value)) {
    setError(field, MESSAGES.phone);
    return false;
  }
  if (input.tagName === 'TEXTAREA' && value && value.length < 20) {
    setError(field, MESSAGES.minLength);
    return false;
  }

  setError(field, '');
  return true;
}

function showStatus(form, kind) {
  form.querySelectorAll('.form__status').forEach((el) => {
    el.classList.toggle('is-visible', el.dataset.status === kind);
  });

  const active = form.querySelector(`.form__status[data-status="${kind}"]`);
  if (active) active.focus({ preventScroll: false });
}

export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const fields = [...form.querySelectorAll('.field')];
  const consent = form.querySelector('[name="consent"]');
  const consentError = form.querySelector('[data-consent-error]');
  const submit = form.querySelector('[type="submit"]');
  const honeypot = form.querySelector('[name="website"]');
  const openedAt = Date.now();

  // Validation à la sortie du champ seulement : ne pas harceler pendant la saisie.
  fields.forEach((field) => {
    const input = field.querySelector('input, textarea');
    if (!input) return;
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let valid = true;
    fields.forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (consent && !consent.checked) {
      consentError.textContent = MESSAGES.consent;
      valid = false;
    } else if (consentError) {
      consentError.textContent = '';
    }

    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // Antispam silencieux : un robot remplit le honeypot ou répond trop vite.
    if (honeypot?.value || Date.now() - openedAt < MIN_FILL_MS) {
      showStatus(form, 'error');
      return;
    }

    if (!TODO.formEndpoint) {
      // Aucun endpoint configuré : on le dit franchement plutôt que de
      // laisser croire à un envoi réussi.
      console.warn(
        '[Coeus] TODO.formEndpoint est vide dans data/content.js — le formulaire n’envoie rien.'
      );
      showStatus(form, 'error');
      return;
    }

    submit.classList.add('is-loading');
    submit.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(TODO.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      showStatus(form, 'success');
    } catch (error) {
      console.error('[Coeus] Envío del formulario fallido :', error);
      showStatus(form, 'error');
    } finally {
      submit.classList.remove('is-loading');
      submit.removeAttribute('aria-busy');
    }
  });
}
