/* Bartendly Carousel — baseline render + offsetLeft snapping (first click works, full-card jumps) */
(function () {
    const mount = document.querySelector('.btly-mount');
    if (!mount) return;
  
    const norm = s => (s || '').toString().trim().toLowerCase();
    const cityFilter = norm(mount.dataset.city || 'all');
  
    // Data (expects window.bartenders = [...])
    const source = Array.isArray(window.bartenders) ? window.bartenders.slice() : [];
    if (!source.length) { console.warn('[Bartendly] window.bartenders is empty or missing.'); return; }
  
    // Shuffle
    for (let i = source.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [source[i], source[j]] = [source[j], source[i]]; }
    const items = source.filter(b => cityFilter === 'all' ? true : norm(b.city) === cityFilter);
  
    // Works locally and on server
    const base = (location.protocol === 'file:' ? 'bartenders' : '/bartenders');
  
    // Build DOM
    const wrap = document.createElement('div'); wrap.className = 'btly-wrap';
    const track = document.createElement('div'); track.className = 'btly-track'; track.setAttribute('role','list');
  
    function card(b) {
      const name = b.name || 'Unnamed';
      const city = b.locationDisplay || b.city || '';
      const slug = (b.slug || name).toString().toLowerCase().replace(/\s+/g,'-');
      const folder = `${base}/${slug}`;
      const baseHero = `${folder}/hero`;
      const fallback = b.photo ? `${folder}/${b.photo}` : `${baseHero}-900.jpg`;
  
      const picture = document.createElement('picture');
  
      const sWebp = document.createElement('source');
      sWebp.type='image/webp';
      sWebp.srcset = `${baseHero}-600.webp 600w, ${baseHero}-900.webp 900w, ${baseHero}-1200.webp 1200w`;
      sWebp.sizes  = '(max-width: 899px) 80vw, (min-width: 900px) 33vw';
  
      const sJpg  = document.createElement('source');
      sJpg.type='image/jpeg';
      sJpg.srcset = `${baseHero}-600.jpg 600w, ${baseHero}-900.jpg 900w, ${baseHero}-1200.jpg 1200w`;
      sJpg.sizes  = '(max-width: 899px) 80vw, (min-width: 900px) 33vw';
  
      const img   = document.createElement('img');
      img.loading='lazy'; img.decoding='async';
      img.src=fallback; img.alt=`${name} — ${city}`;
  
      picture.appendChild(sWebp); picture.appendChild(sJpg); picture.appendChild(img);
  
      const el = document.createElement('article'); el.className='btly-card'; el.setAttribute('role','listitem');
      el.appendChild(picture);
  
      const overlay = document.createElement('div'); overlay.className='btly-overlay';
      overlay.innerHTML = `<h3 class="btly-name">${name}</h3><div class="btly-meta">${city}</div>`;
      el.appendChild(overlay);
  
      el.tabIndex = 0; el.setAttribute('aria-label', `${name} — ${city}`);
      el.addEventListener('click', () => location.href = `${base}/${slug}/`);
      el.addEventListener('keypress', e => { if (e.key === 'Enter') location.href = `${base}/${slug}/`; });
  
      return el;
    }
  
    items.forEach(b => track.appendChild(card(b)));
    wrap.appendChild(track);
  
    // Arrows
    const mkArrow = (dir, label, svg) => {
      const btn = document.createElement('button');
      btn.className = `btly-arrow btly-arrow--${dir}`;
      btn.setAttribute('aria-label', label);
      btn.innerHTML = svg;
      return btn;
    };
    const prev = mkArrow('prev','Previous','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>');
    const next = mkArrow('next','Next','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>');
  
    wrap.appendChild(prev); wrap.appendChild(next);
    mount.appendChild(wrap);
  
    // --- Exact offset snapping ---
    let cards = []; let offsets = [];
  
    function measure() {
      cards = Array.from(track.querySelectorAll('.btly-card'));
      offsets = cards.map(el => el.offsetLeft);
      // If layout not ready yet (rare), try one more frame
      if (offsets.length && offsets.every(v => v === 0) && cards.length > 1) {
        requestAnimationFrame(() => { cards = Array.from(track.querySelectorAll('.btly-card')); offsets = cards.map(el => el.offsetLeft); });
      }
    }
  
   // Helpers (place near your existing measure()/offsets/cards)
const EPS = 1;
function atStart(){ return track.scrollLeft <= EPS; }
function atEnd(){ return Math.abs(track.scrollWidth - track.clientWidth - track.scrollLeft) <= EPS; }
function currentIndex(){
  if (!offsets.length) return 0;
  const x = track.scrollLeft + 1; // guard exact boundary
  let idx = 0;
  for (let i = 0; i < offsets.length; i++) if (offsets[i] <= x) idx = i;
  return idx;
}
function scrollToIndex(i){
  if (!offsets.length) return;
  const idx = Math.max(0, Math.min(i, offsets.length - 1));
  track.scrollTo({ left: offsets[idx], behavior: 'smooth' });
}

function goPrev() {
    if (!offsets.length) measure();
    if (atStart()) {
      const last = track.lastElementChild;
      if (last) track.insertBefore(last, track.firstChild); // [6,1,2,3,4,5]
      requestAnimationFrame(() => { measure(); track.scrollLeft = 0; });
      return;
    }
    scrollToIndex(currentIndex() - 1);
  }
  
  function goNext() {
    if (!offsets.length) measure();
    if (atEnd()) {
      const first = track.firstElementChild;
      const keep = track.scrollLeft;
      if (first) track.appendChild(first); // [2,3,4,5,6,1]
      requestAnimationFrame(() => { measure(); track.scrollLeft = keep; });
      return;
    }
    scrollToIndex(currentIndex() + 1);
  }
  

  
    prev.addEventListener('click', goPrev);
    next.addEventListener('click', goNext);
  
    // Show arrows only when content overflows
    function updateArrows() {
      const show = track.scrollWidth > track.clientWidth + 4;
      prev.style.display = next.style.display = show ? '' : 'none';
    }
  
    // Initial measure/vis after layout
    requestAnimationFrame(() => { measure(); updateArrows(); });
    window.addEventListener('resize', () => { measure(); updateArrows(); });
  })();  