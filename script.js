/**
 * FayaJets — script.js
 * Vanilla ES6 JavaScript
 * WhatsApp integration, form handling, animations
 */

'use strict';

const WA_NUMBER = '233240299171';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

/* ═══════════════════════
   NAV — scroll + hamburger
═══════════════════════ */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu on nav link click
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ═══════════════════════
   SMOOTH SCROLL
═══════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════
   REVEAL ON SCROLL
═══════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════
   DELIVERY FEE TOGGLE
═══════════════════════ */
const deliveryRadios   = document.querySelectorAll('input[name="delivery"]');
const deliveryFeeGroup = document.getElementById('deliveryFeeGroup');

function toggleDeliveryFee() {
  const val = document.querySelector('input[name="delivery"]:checked')?.value;
  deliveryFeeGroup.style.opacity = val === 'Yes' ? '1' : '0.4';
  deliveryFeeGroup.querySelector('input').disabled = val !== 'Yes';
}

deliveryRadios.forEach(r => r.addEventListener('change', toggleDeliveryFee));
toggleDeliveryFee(); // initialise

/* ═══════════════════════
   IMAGE PREVIEW
═══════════════════════ */
const productImagesInput = document.getElementById('productImages');
const imagePreview       = document.getElementById('imagePreview');

productImagesInput.addEventListener('change', () => {
  imagePreview.innerHTML = '';
  const files = Array.from(productImagesInput.files).slice(0, 5);
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = file.name;
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

/* ═══════════════════════
   FORM UTILITIES
═══════════════════════ */
function getVal(id)  { return (document.getElementById(id)?.value || '').trim(); }
function getRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function validateRequired(id, errId) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el) return true;
  const empty = !el.value.trim();
  el.classList.toggle('error', empty);
  if (err) err.classList.toggle('visible', empty);
  return !empty;
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
}

function redirectToWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`${WA_BASE}?text=${encoded}`, '_blank');
}

/* ═══════════════════════
   SETUP FORM SUBMISSION
═══════════════════════ */
const setupForm   = document.getElementById('setupForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

setupForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors(setupForm);

  // Validate required fields
  const nameOk = validateRequired('bizName',    'err-bizName');
  const waOk   = validateRequired('whatsappNum','err-whatsappNum');
  if (!nameOk || !waOk) {
    const firstErr = setupForm.querySelector('.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Collect values
  const bizName      = getVal('bizName');
  const bizSlogan    = getVal('bizSlogan');
  const bizCategory  = getVal('bizCategory');
  const bizDesc      = getVal('bizDesc');
  const whatsappNum  = getVal('whatsappNum');
  const emailAddr    = getVal('emailAddr');
  const bizLocation  = getVal('bizLocation');
  const delivery     = getRadio('delivery');
  const deliveryFee  = getVal('deliveryFee');
  const products     = getVal('products');
  const socialLinks  = getVal('socialLinks');
  const momoNum      = getVal('momoNum');
  const contactMethod = getVal('contactMethod');

  // Build WhatsApp message
  const lines = [
    '🚀 *New FayaJets Client Request*',
    '─────────────────────────',
    `*Business Name:* ${bizName}`,
  ];
  if (bizSlogan)    lines.push(`*Slogan:* ${bizSlogan}`);
  if (bizCategory)  lines.push(`*Category:* ${bizCategory}`);
  if (bizLocation)  lines.push(`*Location:* ${bizLocation}`);
  if (bizDesc)      lines.push(`*Description:* ${bizDesc}`);
  lines.push('─────────────────────────');
  lines.push(`*WhatsApp:* ${whatsappNum}`);
  if (emailAddr)    lines.push(`*Email:* ${emailAddr}`);
  if (momoNum)      lines.push(`*MoMo Number:* ${momoNum}`);
  if (socialLinks)  lines.push(`*Social Media:* ${socialLinks}`);
  lines.push(`*Preferred Contact:* ${contactMethod}`);
  lines.push('─────────────────────────');
  if (products) {
    lines.push('*Products / Services:*');
    lines.push(products);
  }
  lines.push('─────────────────────────');
  lines.push(`*Delivery Available:* ${delivery}`);
  if (delivery === 'Yes' && deliveryFee) {
    lines.push(`*Delivery Fee:* GH₵${deliveryFee}`);
  }
  lines.push('─────────────────────────');
  lines.push('Please contact ASAP. 🙏');

  const message = lines.join('\n');

  // Show success message
  formSuccess.style.display = 'flex';
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Animate button
  submitBtn.textContent = '✅ Sent! Opening WhatsApp…';
  submitBtn.disabled = true;

  // Small delay then redirect
  setTimeout(() => {
    redirectToWhatsApp(message);
    // Reset button after
    setTimeout(() => {
      submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.864L.057 23.57a.75.75 0 00.914.914l5.702-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.352l-.37-.214-3.384.876.891-3.384-.233-.38A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg> Send to WhatsApp & Submit`;
      submitBtn.disabled = false;
    }, 4000);
  }, 600);
});

/* ═══════════════════════
   CONTACT FORM SUBMISSION
═══════════════════════ */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = getVal('cName');
  const phone   = getVal('cPhone');
  const message = getVal('cMsg');

  if (!name && !phone && !message) {
    contactForm.querySelectorAll('input, textarea').forEach(el => {
      if (!el.value.trim()) el.classList.add('error');
    });
    return;
  }

  const lines = [
    '👋 *FayaJets Contact Inquiry*',
    '─────────────────────────',
  ];
  if (name)    lines.push(`*Name:* ${name}`);
  if (phone)   lines.push(`*Phone:* ${phone}`);
  if (message) lines.push(`*Message:* ${message}`);
  lines.push('─────────────────────────');
  lines.push('Please reply at your earliest convenience.');

  redirectToWhatsApp(lines.join('\n'));

  // Feedback
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '✅ Opening WhatsApp…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send via WhatsApp';
    btn.disabled = false;
    contactForm.reset();
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }, 3500);
});

/* ═══════════════════════
   ACTIVE NAV HIGHLIGHT
═══════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════
   HERO BADGE TYPEWRITER
═══════════════════════ */
(function heroEntrance() {
  // Staggered entrance via CSS classes already handled by .reveal
  // Add a gentle count-up for hero stats
  const stats = [
    { el: document.querySelector('.hero__stat:nth-child(1) strong'), target: 100, suffix: '%', prefix: '' },
  ];
  // Simple number count-up
  function countUp(el, target, duration = 1200) {
    if (!el) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + '%';
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp(document.querySelector('.hero__stat:nth-child(1) strong'), 100);
      heroObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const heroEl = document.querySelector('.hero__stats');
  if (heroEl) heroObserver.observe(heroEl);
})();
