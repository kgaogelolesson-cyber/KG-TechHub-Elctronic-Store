//FOr all forms submmission//
const STORE_EMAIL = "flowwebgraphicdesign@gmail.com";

//Email Validation//
function isValidEmail(email) {
  return email.includes("@") && email.indexOf("@") > 0 && email.indexOf(".") > email.indexOf("@");
}

//Success Message//
function showSuccessMessage(form, message) {
  const existing = form.parentElement.querySelector(".success-message");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.className = "success-message";
  msg.innerHTML = `<span class="success-icon">✔</span><span>${message}</span>`;
  form.parentElement.insertBefore(msg, form.nextSibling);
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
  form.style.display = "none";
}

//Inline Field Error//
function showError(input, message) {
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
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

//Collect form data for mailto body//
function collectFormData(form) {
  const lines = [];
  form.querySelectorAll("input, select, textarea").forEach(el => {
    const label = el.placeholder || el.name || el.id;
    if (label && el.value.trim()) lines.push(`${label}: ${el.value.trim()}`);
  });
  return lines.join("\n");
}

//ENQUIRY FORM//
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const emailInput = document.getElementById("enquiry-email");
  emailInput.addEventListener("input", () => clearError(emailInput));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address containing "@".');
      return;
    }
    const subject = "New Enquiry - KG's TechHub";
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(collectFormData(form))}`;
    showSuccessMessage(form, "Thank you! Your enquiry has been sent. We'll get back to you shortly.");
  });
}
//QUOTE FORM//
function initQuoteForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const emailInput = document.getElementById("quote-email");
  emailInput.addEventListener("input", () => clearError(emailInput));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address containing "@".');
      return;
    }
    const subject = "Quote Request - KG's TechHub";
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(collectFormData(form))}`;
    showSuccessMessage(form, "Thank you! Your quote request has been received. We'll send your quote to the details provided.");
  });
}
//NEWSLETTER FORM//
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  const emailInput = document.getElementById("newsletter-email");
  emailInput.addEventListener("input", () => clearError(emailInput));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address containing "@".');
      return;
    }
    const body = `New Newsletter Subscriber\nEmail: ${emailInput.value.trim()}`;
    const subject = "Newsletter Subscription - KG's TechHub";
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showSuccessMessage(form, "You're subscribed! Thank you for joining our newsletter.");
  });
}
//LIGHTBOX//
function initLightbox() {
  const overlay   = document.getElementById("lightbox-overlay");
  if (!overlay) return;

  const lbImg     = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCounter = document.getElementById("lb-counter");
  const lbThumbs  = document.getElementById("lb-thumbs");
  const closeBtn  = document.getElementById("lb-close");
  const prevBtn   = document.getElementById("lb-prev");
  const nextBtn   = document.getElementById("lb-next");

  //Gather all product links into an array//
  const links = Array.from(document.querySelectorAll("a.View-Product[data-popup]"));
  let currentIndex = 0;

  // Build thumbnail strip//
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

    // Fade the image out, swap src, fade back in//
    lbImg.style.opacity = "0";
    lbImg.style.transition = "opacity 0.2s";
    setTimeout(() => {
      lbImg.src = link.dataset.popup;
      lbCaption.textContent = link.dataset.caption;
      lbCounter.textContent = `${currentIndex + 1} / ${links.length}`;
      lbImg.style.opacity = "1";
    }, 180);

    // Update active thumbnail//
    lbThumbs.querySelectorAll("img").forEach((t, i) => {
      t.classList.toggle("active", i === currentIndex);
    });
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

  // Attach click to each product link//
  links.forEach((link, i) => {
    link.addEventListener("click", e => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  // Also clicking the product image opens lightbox//
  document.querySelectorAll("img.product").forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(i));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  // Click outside image to close//
  overlay.addEventListener("click", e => { if (e.target === overlay) closeLightbox(); });

  // Keyboard navigation//
  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   goTo(currentIndex - 1);
    if (e.key === "ArrowRight")  goTo(currentIndex + 1);
  });
}
//For all forms//
document.addEventListener("DOMContentLoaded", function () {
  initEnquiryForm();
  initQuoteForm();
  initNewsletterForm();
  initLightbox();
});
