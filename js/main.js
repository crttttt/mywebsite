/* =========================================
   MAIN.JS — Navigation & animations
   Quatuor Qu4tre à 4
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navigation — effet au scroll ── */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 2. Lien actif selon la section visible ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    const highlightNav = () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
  }

  /* ── 3. Reveal on scroll (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
  }

});


/* ── Carousel Galerie ── */
(function () {
  const track   = document.querySelector('.carousel-track');
  const btnPrev = document.querySelector('.carousel-prev');
  const btnNext = document.querySelector('.carousel-next');
  if (!track) return;

  const items      = track.querySelectorAll('.galerie-item');
  const total      = items.length;
  let   current    = 0;

  // Créer les dots
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Image ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  track.closest('#galerie').appendChild(dotsWrap);

  function getItemWidth() {
    return items[0].offsetWidth + 4; // 4px = gap
  }

  function getVisible() {
    return Math.floor(track.parentElement.offsetWidth / getItemWidth()) || 1;
  }

  function goTo(index) {
    const visible = getVisible();
    const max     = Math.max(0, total - visible);
    current = Math.min(Math.max(index, 0), max);
    track.style.transform = `translateX(-${current * getItemWidth()}px)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Swipe tactile
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => goTo(current));
})();
