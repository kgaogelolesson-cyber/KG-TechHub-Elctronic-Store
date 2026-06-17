const STORE_EMAIL = "flowwebgraphicdesign@gmail.com";

//Email Validation//
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//Show Success Message//
function showSuccessMessage(form, message) {
  const existing = form.parentElement.querySelector(".success-message");
  if (existing) existing.remove();
  const msg = document.createElement("div");
  msg.className = "success-message";
  msg.innerHTML = `<span class="success-icon">&#10004;</span><span>${message}</span>`;
  form.parentElement.insertBefore(msg, form.nextSibling);
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
  form.style.display = "none";
}

//Show Error Message//
function showFormError(form, message) {
  const existing = form.parentElement.querySelector(".form-error-msg");
  if (existing) existing.remove();
  const err = document.createElement("div");
  err.className = "form-error-msg";
  err.innerHTML = `<span>&#9888; ${message}</span>`;
  form.parentElement.insertBefore(err, form);
  err.scrollIntoView({ behavior: "smooth", block: "center" });
}

//Inline Field Error//
function showError(input, message) {
  clearError(input);
  input.classList.add("input-error");
  const err = document.createElement("span");
  err.className = "field-error";
  err.textContent = message;
  input.insertAdjacentElement("afterend", err);
  input.focus();
}

function clearError(input) {
  input.classList.remove("input-error");
  const err = input.parentElement.querySelector(".field-error");
  if (err) err.remove();
}

//Loading Spinner//
function showLoading(button) {
  button.disabled = true;
  button.dataset.originalText = button.textContent;
  button.textContent = "Sending...";
  button.style.opacity = "0.7";
}

function hideLoading(button) {
  button.disabled = false;
  button.textContent = button.dataset.originalText;
  button.style.opacity = "1";
}

//Collect form data//
function collectFormData(form) {
  const lines = [];
  form.querySelectorAll("input, select, textarea").forEach(el => {
    const label = el.placeholder || el.name || el.id;
    if (label && el.value.trim()) lines.push(`${label}: ${el.value.trim()}`);
  });
  return lines.join("\n");
}

//AJAX Form Submission via mailto fallback//
function submitFormAJAX(options) {
  const { form, emailInputId, subject, successMessage, button } = options;
  const emailInput = document.getElementById(emailInputId);

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default page reload (AJAX behaviour)

    // Clear previous form-level errors
    const prevErr = form.parentElement.querySelector(".form-error-msg");
    if (prevErr) prevErr.remove();

    //Validate email field
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      showError(emailInput, "Email address is required.");
      return;
    }
    if (!isValidEmail(emailVal)) {
      showError(emailInput, 'Please enter a valid email address (must include "@" and a domain e.g. name@example.com).');
      return;
    }

    clearError(emailInput);

    //Show loading state (async UX feedback)
    showLoading(button);

    //Simulate async processing (mimics AJAX request delay)
    setTimeout(function () {
      try {
        //Build mailto and open email client
        const body = collectFormData(form);
        const mailtoLink = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        //Show success feedback to user
        hideLoading(button);
        showSuccessMessage(form, successMessage);
      } catch (err) {
        //Error handling — display user-friendly message
        hideLoading(button);
        showFormError(form, "Something went wrong. Please try again or contact us directly at " + STORE_EMAIL);
      }
    }, 1200); // Simulated async delay
  });
}

//ENQUIRY FORM//
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const emailInput = document.getElementById("enquiry-email");
  const button = form.querySelector("button");
  emailInput.addEventListener("input", () => clearError(emailInput));

  submitFormAJAX({
    form,
    emailInputId: "enquiry-email",
    subject: "New Customer Enquiry - KG's TechHub Electronics",
    successMessage: "Thank you! Your enquiry has been sent successfully. We'll get back to you shortly.",
    button
  });
}
//Quote form//
function initQuoteForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;
  const emailInput = document.getElementById("quote-email");
  const button = form.querySelector("button");
  emailInput.addEventListener("input", () => clearError(emailInput));

  submitFormAJAX({
    form,
    emailInputId: "quote-email",
    subject: "Quote Request - KG's TechHub Electronics",
    successMessage: "Thank you! Your quote request has been received. We'll send your quote via the details you provided.",
    button
  });
}

//Newsletterform //
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  const emailInput = document.getElementById("newsletter-email");
  const button = form.querySelector("button");
  emailInput.addEventListener("input", () => clearError(emailInput));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailVal = emailInput.value.trim();
    if (!emailVal) { showError(emailInput, "Please enter your email address."); return; }
    if (!isValidEmail(emailVal)) {
      showError(emailInput, 'Please enter a valid email address (must include "@").');
      return;
    }
    clearError(emailInput);
    showLoading(button);
    setTimeout(function () {
      try {
        const body = `New Newsletter Subscriber\nEmail: ${emailVal}`;
        window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent("Newsletter Subscription - KG's TechHub")}&body=${encodeURIComponent(body)}`;
        hideLoading(button);
        showSuccessMessage(form, "You're subscribed! Thank you for joining the KG's TechHub newsletter.");
      } catch (err) {
        hideLoading(button);
        showFormError(form, "Something went wrong. Please try again.");
      }
    }, 1000);
  });
}

//The lightbox//
function initLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;

  const lbImg     = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCounter = document.getElementById("lb-counter");
  const lbThumbs  = document.getElementById("lb-thumbs");
  const closeBtn  = document.getElementById("lb-close");
  const prevBtn   = document.getElementById("lb-prev");
  const nextBtn   = document.getElementById("lb-next");

  const links = Array.from(document.querySelectorAll("a.View-Product[data-popup]"));
  let currentIndex = 0;

  //Build thumbnail strip//
  links.forEach((link, i) => {
    const thumb = document.createElement("img");
    thumb.src = link.dataset.popup;
    thumb.alt = link.dataset.caption;
    thumb.title = link.dataset.caption;
    thumb.addEventListener("click", () => goTo(i));
    lbThumbs.appendChild(thumb);
  });

  function goTo(index) {
    currentIndex = (index + links.length) % links.length;
    const link = links[currentIndex];
    lbImg.style.opacity = "0";
    lbImg.style.transition = "opacity 0.2s";
    setTimeout(() => {
      lbImg.src = link.dataset.popup;
      lbImg.alt = link.dataset.caption;
      lbCaption.textContent = link.dataset.caption;
      lbCounter.textContent = `${currentIndex + 1} / ${links.length}`;
      lbImg.style.opacity = "1";
    }, 180);
    lbThumbs.querySelectorAll("img").forEach((t, i) => t.classList.toggle("active", i === currentIndex));
  }

  function openLightbox(index) {
    goTo(index);
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => { lbImg.src = ""; }, 300);
  }

  links.forEach((link, i) => {
    link.addEventListener("click", e => { e.preventDefault(); openLightbox(i); });
  });

  document.querySelectorAll("img.product").forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(i));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
  overlay.addEventListener("click", e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
  });
}
//For allforms//
document.addEventListener("DOMContentLoaded", function () {
  initEnquiryForm();
  initQuoteForm();
  initNewsletterForm();
  initLightbox();
});
