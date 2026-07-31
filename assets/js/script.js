'use strict';

const config = window.JF_SITE_CONFIG || {};

// Shared editable business details.
document.querySelectorAll('[data-config-text]').forEach((element) => {
  const key = element.dataset.configText;
  const value = key.split('.').reduce((current, part) => current?.[part], config);
  if (value !== undefined && value !== null) element.textContent = value;
});

document.querySelectorAll('[data-phone-link]').forEach((link) => {
  if (config.phoneHref) link.href = `tel:${config.phoneHref}`;
});

document.querySelectorAll('[data-email-link]').forEach((link) => {
  if (config.email) link.href = `mailto:${config.email}`;
});

document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
  if (config.whatsappUrl) link.href = config.whatsappUrl;
});

document.querySelectorAll('[data-social-link]').forEach((link) => {
  const network = link.dataset.socialLink;
  const url = config.social?.[network];
  if (url) link.href = url;
});

const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const closeMenu = () => {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navLinks.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 80px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const range = document.querySelector('.ba-range');
const afterLayer = document.querySelector('.after-layer');
if (range && afterLayer) {
  range.addEventListener('input', (event) => {
    afterLayer.style.width = `${event.target.value}%`;
  });
}

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    answer?.classList.toggle('open', !open);
  });
});

const bookingDate = document.querySelector('#booking-date');
if (bookingDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  bookingDate.min = localToday;
}

const bookingForm = document.querySelector('[data-booking-form]');
if (bookingForm) {
  const steps = [...bookingForm.querySelectorAll('.booking-step')];
  const dots = [...bookingForm.querySelectorAll('.step-dot')];
  const nextButtons = [...bookingForm.querySelectorAll('[data-next]')];
  const backButtons = [...bookingForm.querySelectorAll('[data-back]')];
  const success = bookingForm.querySelector('.success-message');
  let currentStep = 0;

  const showStep = (index) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => step.classList.toggle('active', i === currentStep));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStep);
      dot.setAttribute('aria-current', i === currentStep ? 'step' : 'false');
    });
    bookingForm.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const validateStep = () => {
    const fields = [...steps[currentStep].querySelectorAll('input, select, textarea')];
    return fields.every((field) => field.checkValidity() ? true : (field.reportValidity(), false));
  };

  nextButtons.forEach((button) => button.addEventListener('click', () => {
    if (validateStep()) showStep(currentStep + 1);
  }));

  backButtons.forEach((button) => button.addEventListener('click', () => showStep(currentStep - 1)));

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    success?.classList.add('show');
    success?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    bookingForm.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true');
  });
}

// Demo contact forms are intentionally not sent until a backend is connected.
document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const message = form.querySelector('[data-form-message]');
    message?.classList.add('show');
  });
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
