async function loadGallery() {
  const res = await fetch(API_URL);
  const images = await res.json();
  const container = document.getElementById("gallery");

  images.forEach((img, i) => {
    const el = document.createElement("img");
    el.src = img.thumb || img.url;
    el.dataset.full = img.url;
    el.dataset.index = i;
    el.loading = "lazy";
    container.appendChild(el);
  });

  setupLightbox(images);
}

function setupLightbox(images) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const close = document.getElementById("close");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  let current = 0;

  document.querySelectorAll(".gallery img").forEach(img => {
    img.onclick = () => {
      current = Number(img.dataset.index);
      open();
    };
  });

  function open() {
    lightbox.style.display = "flex";
    lightboxImg.src = images[current].url;
  }

  close.onclick = () => lightbox.style.display = "none";

  next.onclick = () => {
    current = (current + 1) % images.length;
    open();
  };

  prev.onclick = () => {
    current = (current - 1 + images.length) % images.length;
    open();
  };

  document.onkeydown = e => {
    if (e.key === "Escape") lightbox.style.display = "none";
    if (e.key === "ArrowRight") next.onclick();
    if (e.key === "ArrowLeft") prev.onclick();
  };
}

loadGallery();
