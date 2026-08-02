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

qsa("[data-phone-link]").forEach((link) => {
  link.href = `tel:${config.phoneHref}`;
});

qsa("[data-social]").forEach((link) => {
  const url = config.social?.[link.dataset.social];
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

qsa("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const mobileDevicePattern = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i;
const mobileUserAgent = Boolean(navigator.userAgentData?.mobile) || mobileDevicePattern.test(navigator.userAgent);
const touchSizedDevice = navigator.maxTouchPoints > 0 && Math.min(window.screen.width, window.screen.height) <= 900;
const iPadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
const usesSms = () => mobileUserAgent || touchSizedDevice || iPadDesktopMode;
const emailAddress = typeof config.email === "string" ? config.email.trim() : "";
const genericMessage = "Hi JF Auto Detailing, I'd like to ask about a service.";

const buildSmsUrl = (message = "") => {
  const smsUrl = config.smsUrl || `sms:${config.phoneHref || ""}`;
  if (!message) return smsUrl;
  const separator = smsUrl.includes("?") ? "&" : "?";
  return `${smsUrl}${separator}body=${encodeURIComponent(message)}`;
};

const buildEmailUrl = (message = genericMessage, subject = "JF Auto Detailing enquiry") => {
  const recipient = emailAddress;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
};

const updateContactMethod = () => {
  const smsMode = usesSms();

  qsa("[data-sms-link]").forEach((link) => {
    if (!link.dataset.mobileLabel) link.dataset.mobileLabel = link.textContent.trim() || "Text JF";
    if (!link.dataset.desktopLabel) link.dataset.desktopLabel = "Email JF";

    link.href = smsMode ? buildSmsUrl() : buildEmailUrl();
    link.textContent = smsMode ? link.dataset.mobileLabel : link.dataset.desktopLabel;
    link.setAttribute("aria-label", smsMode ? "Text JF Auto Detailing" : "Email JF Auto Detailing");
  });

  qsa("[data-message-method-label]").forEach((element) => {
    element.textContent = smsMode ? "Text message" : "Email enquiry";
  });

  qsa("[data-message-submit]").forEach((button) => {
    button.textContent = smsMode ? "Prepare Text Message" : "Prepare Email";
  });

  qsa("[data-message-help]").forEach((element) => {
    element.textContent = smsMode
      ? "The button prepares a text message for you to send."
      : emailAddress
        ? "The button opens an email with your enquiry already filled in."
        : "The button opens an email draft. The recipient will be added once the business email is confirmed.";
  });
};

updateContactMethod();

const menuToggle = qs(".menu-toggle");
const navLinks = qs(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  qsa("a", navLinks).forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
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
  }, { threshold: 0.06, rootMargin: "0px 0px 80px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

qsa("[data-compare]").forEach((range) => {
  const compare = range.closest(".compare");
  const update = () => compare?.style.setProperty("--position", `${range.value}%`);
  range.addEventListener("input", update);
  update();
});

qsa(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.nextElementSibling?.classList.toggle("open", !isOpen);
  });
});

const dateField = qs('input[type="date"]');
if (dateField) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateField.min = today.toISOString().split("T")[0];
}

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

const openPreparedMessage = (message, subject) => {
  window.location.href = usesSms()
    ? buildSmsUrl(message)
    : buildEmailUrl(message, subject);
};

const bookingForm = qs("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const data = new FormData(bookingForm);
    const extras = data.getAll("extras");
    const message = [
      "Hi JF Auto Detailing, I'd like to arrange a booking.",
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

    openPreparedMessage(message, "JF Auto Detailing booking enquiry");
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

    openPreparedMessage(message, "JF Auto Detailing enquiry");
  });
}
