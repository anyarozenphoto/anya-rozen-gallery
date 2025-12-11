let currentIndex = 0;

function initGallery() {
  const container = document.getElementById('gallery');
  const images = window.galleryImages;

  if (!images || !images.length) {
    container.innerHTML = '<p>Failed to load images</p>';
    return;
  }

  images.forEach((img, index) => {
    const el = document.createElement('img');
    el.src = img.url;
    el.dataset.index = index;
    el.loading = 'lazy';
    el.addEventListener('click', () => openLightbox(index));
    container.appendChild(el);
  });

  setupLightbox(images);
}

function setupLightbox(images) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].url;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].url;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].url;
  }

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
