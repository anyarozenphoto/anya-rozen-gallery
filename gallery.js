// gallery.js — принимает JSONP от Apps Script: galleryCallback(data)
// data = [{url: "https://lh3.googleusercontent.com/...", name: "photo-1"}, ...]

/* Globals */
let images = [];
let currentIndex = 0;

/* JSONP callback (встраивает полученные данные) */
function galleryCallback(data) {
  const container = document.getElementById('gallery');
  const loader = document.getElementById('loader');
  if (!Array.isArray(data)) {
    container.innerHTML = '<div class="loader">Ошибка: неверный ответ от сервиса галереи.</div>';
    console.error('galleryCallback: unexpected data', data);
    return;
  }
  images = data;
  if (images.length === 0) {
    container.innerHTML = '<div class="loader">В альбоме нет доступных изображений.</div>';
    return;
  }
  // clear loader and build gallery items
  container.innerHTML = '';
  images.forEach((it, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'item';

    const img = document.createElement('img');
    img.src = it.url;               // full resolution link from Apps Script
    img.alt = it.name || ('Photo ' + (i+1));
    img.loading = 'lazy';
    img.dataset.index = i;
    // graceful fallback: if image fails, show placeholder
    img.onerror = function(){ this.src = placeholderDataURI(); };

    // open lightbox on click
    img.addEventListener('click', () => openLightbox(i));

    wrap.appendChild(img);
    container.appendChild(wrap);
  });

  // initialize lightbox & keyboard
  initLightbox();
}

/* Lightbox & navigation */
function initLightbox() {
  const LB = document.getElementById('lightbox');
  const LBIMG = document.getElementById('lightbox-img');
  const CLOSE = document.getElementById('close');
  const NEXT = document.getElementById('next');
  const PREV = document.getElementById('prev');
  const CAP = document.getElementById('cap');

  function open(i) {
    currentIndex = i;
    LBIMG.src = images[currentIndex].url;
    LBIMG.alt = images[currentIndex].name || '';
    CAP.textContent = images[currentIndex].name || '';
    LB.style.display = 'flex';
    LB.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // focus for keyboard
    CLOSE.focus();
  }

  function close() {
    LB.style.display = 'none';
    LB.setAttribute('aria-hidden','true');
    LBIMG.src = '';
    document.body.style.overflow = '';
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    LBIMG.src = images[currentIndex].url;
    CAP.textContent = images[currentIndex].name || '';
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    LBIMG.src = images[currentIndex].url;
    CAP.textContent = images[currentIndex].name || '';
  }

  // Expose openLightbox used earlier
  window.openLightbox = function(i) { open(i); };

  // events
  CLOSE.addEventListener('click', close);
  NEXT.addEventListener('click', (e)=>{ e.stopPropagation(); next(); });
  PREV.addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });

  // click outside image closes
  LB.addEventListener('click', (e) => {
    if (e.target === LB) close();
  });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (LB.style.display !== 'flex') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
}

/* Small helper: placeholder (SVG data URI) */
function placeholderDataURI(){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-family='sans-serif' font-size='24'>Image failed to load</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
