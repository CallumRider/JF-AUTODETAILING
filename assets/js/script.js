"use strict";

const config = window.JF_SITE_CONFIG || {};
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

qsa("[data-config-text]").forEach((element) => {
  const path = element.dataset.configText.split(".");
  let value = config;
  path.forEach((key) => { value = value?.[key]; });
  if (typeof value === "string" && value) element.textContent = value;
});
qsa("[data-phone-link]").forEach((link) => { link.href = `tel:${config.phoneHref}`; });
qsa("[data-whatsapp-link]").forEach((link) => { link.href = config.whatsappUrl; });
qsa("[data-social]").forEach((link) => {
  const url = config.social?.[link.dataset.social];
  if (url) link.href = url;
});
qsa("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

const menuToggle = qs(".menu-toggle");
const navLinks = qs(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  qsa("a", navLinks).forEach((link) => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  }));
}

const revealItems = qsa(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add("visible"));

qsa("[data-compare]").forEach((range) => {
  const compare = range.closest(".compare");
  const update = () => compare?.style.setProperty("--position", `${range.value}%`);
  range.addEventListener("input", update);
  update();
});

qsa(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.nextElementSibling?.classList.toggle("open", !open);
  });
});

const dateField = qs('input[type="date"]');
if (dateField) dateField.min = new Date().toISOString().split("T")[0];

const serviceSelect = qs("#service");
const depositAlert = qs(".deposit-alert");
if (serviceSelect && depositAlert) {
  const updateDeposit = () => {
    const needsDeposit = ["Machine Polishing", "Ceramic Coating (2 year)"].includes(serviceSelect.value);
    depositAlert.classList.toggle("show", needsDeposit);
  };
  serviceSelect.addEventListener("change", updateDeposit);
  updateDeposit();
}

const bookingForm = qs("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const extras = data.getAll("extras");
    const message = [
      "Hi JF Auto Detailing, I'd like to request a booking.",
      "",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Vehicle: ${data.get("vehicle")}`,
      `Service: ${data.get("service")}`,
      extras.length ? `Extras: ${extras.join(", ")}` : "Extras: None",
      `Preferred date: ${data.get("date")}`,
      `Preferred time: ${data.get("time")}`,
      data.get("notes") ? `Notes: ${data.get("notes")}` : ""
    ].filter(Boolean).join("\n");
    window.open(`${config.whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

const contactForm = qs("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const message = [
      "Hi JF Auto Detailing, I have an enquiry.",
      "",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Message: ${data.get("message")}`
    ].join("\n");
    window.open(`${config.whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}
