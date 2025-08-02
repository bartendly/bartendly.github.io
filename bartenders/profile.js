(function() {
    // Get slug from folder path (e.g., /bartenders/giuseppequartararo/)
    function getSlugFromPath() {
      const parts = window.location.pathname.split('/').filter(Boolean);
      return parts.length > 1 ? parts[1] : '';
    }
    const slug = getSlugFromPath();
    const data = window.bartenders || [];
    const bartender = data.find(b => b.slug === slug);
  
    if (bartender && bartender.name) {
    document.title = `${bartender.name} profile | Bartendly`;
    }
  
  
    // Defensive: show error if not found
    const root = document.getElementById('profile-root');
    if (!bartender) {
      root.innerHTML = '<div style="padding:4em 1em;text-align:center;font-size:1.4em;">Bartender not found.</div>';
      return;
    }
  
    // Helper: section rendering only if present
    function renderSection(title, items) {
      if (!items || !items.length) return '';
      return `
        <section class="profile-section">
          <div class="profile-section-title">${title}</div>
          <ul>
            ${items.map(i => `<li><span class="icon">${i.icon||""}</span>${i.text||""}</li>`).join('')}
          </ul>
        </section>
      `;
    }
  
    // Helper: field rendering only if present
    function maybeDiv(cls, val) {
      return val ? `<div class="${cls}">${val}</div>` : '';
    }
  
    function locationDiv(val) {
    if (!val) return '';
    return `<div class="profile-location">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#ffae3a" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20c-4.418 0-8-4.03-8-9a8 8 0 0116 0c0 4.97-3.582 9-8 9zm0 0v0"/><circle cx="12" cy="11" r="3" /></svg>
      ${val}
    </div>`;
  }
  
  
    // Hero image sources (relative path)
    function heroSource(type) {
      return `hero-600.${type} 600w, hero-900.${type} 900w, hero-1200.${type} 1200w`;
    }
    function heroImg(type, fallback = false) {
      return fallback ? `hero-900.jpg` : `hero-900.webp`;
    }
  
    // Main profile rendering
    root.innerHTML = `
      <section class="hero" id="hero">
        <picture class="hero-bg">
          <source srcset="${heroSource('webp')}" type="image/webp" sizes="100vw">
          <source srcset="${heroSource('jpg')}" type="image/jpeg" sizes="100vw">
          <img src="${heroImg('jpg', true)}" alt="${bartender.name}" width="1200" height="1800" loading="eager" fetchpriority="high" />
        </picture>
        <div class="hero-content">
          <div class="hero-content-bg">
              ${locationDiv(bartender.locationDisplay || bartender.city || "")}
              ${maybeDiv("profile-name", bartender.name)}
              ${maybeDiv("profile-title", bartender.title)}
              ${maybeDiv("profile-tagline", bartender.tagline)}
          </div>
           ${
            bartender.directBooking
              ? `<button class="profile-request-btn" id="open-request-modal"><span style="margin-right:0.5em;">🍸</span>Request ${bartender.name.split(' ')[0]}</button>`
              : ''
            }
        </div>
      </section>
      <main>
        ${renderSection('About ' + (bartender.name.split(' ')[0]||''), bartender.experience)}
        ${renderSection('Signature Cocktails', bartender.signatureCocktails)}
        ${renderSection('Services Offered', bartender.services)}
        ${renderSection('More About ' + (bartender.name.split(' ')[0]||''), bartender.more)}
        ${(bartender.showGallery && bartender.gallery && bartender.gallery.length)
          ? `<section class="profile-section">
              <div class="profile-section-title">Gallery</div>
              <div class="profile-gallery">
                ${bartender.gallery.map(img =>
                  `<img src="${img}" alt="${bartender.name} at work" loading="lazy" />`
                ).join('')}
              </div>
            </section>`
          : ''}
      </main>
      <div id="modal-container"></div>
    `;
  
    // Modal and form logic: only if directBooking is true
    if (bartender.directBooking) {
      document.getElementById('modal-container').innerHTML = `
      <div id="request-modal" class="modal-overlay" style="display:none;">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">&times;</button>
          <form id="ai-request-form" action="https://formspree.io/f/mdkevral" method="POST" class="ai-form-mockup" target="_self">
            <input type="hidden" name="city" value="${bartender.city||""}">
            <input type="hidden" name="bartender" value="${bartender.name||""}">
            <label for="ai-prompt" class="sr-only">Your Request</label>
            <textarea name="ai-prompt" id="ai-prompt" class="main-event-input" rows="2" required
            placeholder='Describe your event — e.g. “Anniversary, 12 Sep, 30 guests, Soho, 8pm–late”'></textarea>
            <label for="ai-contact" class="sr-only">Your contact information</label>
            <input type="text" name="ai-contact" id="ai-contact" class="ai-input" placeholder="WhatsApp (preferred) or Email + contact name" required autocomplete="off" />
            <label class="ai-label">Will you need Bartendly to provide glassware?</label>
            <div class="ai-toggle-group" data-name="glassware">
              <button type="button" class="ai-toggle" data-value="Yes">Yes</button>
              <button type="button" class="ai-toggle" data-value="No">No</button>
              <button type="button" class="ai-toggle" data-value="Not sure">Not sure</button>
            </div>
            <input type="hidden" name="glassware" required>
            <button type="submit" class="ai-submit">Get a Quote</button>
            <div class="booking-legal-disclaimer">
              By submitting, you agree to our <a href="/terms" target="_blank">Terms & Disclaimer</a>.
            </div>
          </form>
          <div id="ai-success-message" class="success-message" aria-live="polite">Thank you! ${bartender.name} will reply to your request as soon as possible.</div>
        </div>
      </div>
      `;
    }
  
    // Interactions
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.innerHTML = "&#8592;";
      backBtn.onclick = () => window.history.length > 1
        ? window.history.back()
        : window.location.href = '/bartenders/';
    }
    // Modal interactions (only if directBooking)
    if (bartender.directBooking) {
      let o = document.getElementById('direct-booking-btn'),
          c = document.getElementById('close-modal'),
          m = document.getElementById('request-modal');
      o && m && (o.onclick = () => m.style.display = 'flex');
      c && m && (c.onclick = () => m.style.display = 'none');
      m && (window.onclick = e => e.target === m && (m.style.display = 'none'));
      // Form validation/submit
      let f = document.getElementById('ai-request-form'), s = document.getElementById('ai-success-message');
      f && s && (f.onsubmit = async e => {
        e.preventDefault();
        let u = f.querySelector('[name="ai-prompt"]').value.trim(), q = f.querySelector('input[name="ai-contact"]').value.trim(), b = f.querySelector('button[type="submit"]');
        if (u.length < 30) return alert("Please provide a bit more detail about your request.");
        if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(q) && !/(\+?\(?\d{1,4}\)?[\s\d\-]{5,})/.test(q)) return alert('Please enter a valid email or phone number.');
        b.disabled = 1; b.textContent = 'Sending...';
        try {
          let r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { 'Accept': 'application/json' } });
          r.ok ? (f.reset(), f.style.display = 'none', s.style.display = 'block') : alert('Oops! Something went wrong while sending your message.');
        } catch { alert('Network error. Please try again later.'); }
        b.disabled = 0; b.textContent = 'Get My Bartender';
      });
      // Toggle groups
      document.querySelectorAll('.ai-toggle-group').forEach(g => {
        let n = g.getAttribute('data-name'), h = document.querySelector(`input[name="${n}"]`);
        if (h) g.querySelectorAll('.ai-toggle').forEach(b => b.onclick = () => {
          g.querySelectorAll('.ai-toggle').forEach(x => x.classList.remove('selected'));
          b.classList.add('selected'); h.value = b.getAttribute('data-value');
        });
      });
    }
  })();