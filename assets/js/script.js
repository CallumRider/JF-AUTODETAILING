'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

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
    answer.classList.toggle('open', !open);
  });
});

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
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentStep));
    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep = () => {
    const fields = [...steps[currentStep].querySelectorAll('input, select, textarea')];
    return fields.every((field) => field.checkValidity() ? true : (field.reportValidity(), false));
  };

  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (validateStep()) showStep(currentStep + 1);
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener('click', () => showStep(currentStep - 1));
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    success?.classList.add('show');
    bookingForm.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true');
  });
}

const yearElements = document.querySelectorAll('[data-year]');
yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});
