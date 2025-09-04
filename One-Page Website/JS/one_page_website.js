/* One-Page Website — Lightbox / Modal Image Gallery */


(function () {
  // Create modal elements once and reuse
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = `
    position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.85); z-index: 9999; padding: 2rem;
  `;

  const img = document.createElement('img');
  img.id = 'lightbox-image';
  img.alt = '';
  img.style.cssText = `
    max-width: 90vw; max-height: 85vh; box-shadow: 0 10px 40px rgba(0,0,0,.6);
    border-radius: 6px; background:#111;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close image');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute; top: 12px; right: 20px; font-size: 2.2rem; line-height:1;
    color: #fff; background: transparent; border: none; cursor: pointer;
    text-shadow: 0 2px 8px rgba(0,0,0,.7);
  `;

  modal.appendChild(img);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);

  let currentIndex = -1;
  let currentGroup = null;
  let currentList = [];

  // Helper: open modal with src
  function openLightbox(src, index = -1, group = null, list = []) {
    img.src = src;
    currentIndex = index;
    currentGroup = group;
    currentList = list;
    modal.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden'; // prevent background scroll
    closeBtn.focus();
  }

  // Helper: close modal
  function closeLightbox() {
    modal.style.display = 'none';
    img.src = '';
    document.documentElement.style.overflow = '';
    currentIndex = -1;
    currentGroup = null;
    currentList = [];
  }

  // Click to close (backdrop/×)
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && currentList.length > 0) {
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      currentIndex = (currentIndex + step + currentList.length) % currentList.length;
      const next = currentList[currentIndex];
      if (next) {
        img.src = next.dataset.large || next.src;
      }
    }
  });

  // Bind thumbnails
  const gallery = document.querySelector('#gallery, .gallery'); // your gallery wrapper
  if (!gallery) return;

  const thumbs = Array.from(gallery.querySelectorAll('img'));
  thumbs.forEach((thumb, idx) => {
    // Expect a large image path in data-large; if absent, fallback to src
    const largeSrc = thumb.dataset.large || thumb.src;
    thumb.style.cursor = 'zoom-in';
    thumb.addEventListener('click', () => {
      // Optional grouping: use data-group if you ever split multiple galleries
      const group = thumb.dataset.group || null;
      const list = group
        ? thumbs.filter(t => (t.dataset.group || null) === group)
        : thumbs;
      const startIndex = list.indexOf(thumb);
      openLightbox(largeSrc, startIndex, group, list);
    });
  });
})();