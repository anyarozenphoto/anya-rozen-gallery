let currentImageIndex = 0;
let images = [];

async function loadGallery() {
  try {
    const res = await fetch('data.json');
    images = await res.json();
    const container = document.getElementById('gallery');
    
    images.forEach((img, i) => {
      const el = document.createElement('img');
      // Use full URL for display, store index for lightbox
      el.src = img.url;
      el.dataset.index = i;
      el.loading = 'lazy';
      el.addEventListener('click', () => openLightbox(i));
      container.appendChild(el);
    });
    
    setupLightbox();
  } catch (error) {
    console.error('Failed to load gallery:', error);
  }
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  
  // Open lightbox
  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = images[currentImageIndex].url;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  // Navigate to next image
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex].url;
  }
  
  // Navigate to previous image
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex].url;
  }
  
  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
    }
  });
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Initialize on page load
loadGallery();
