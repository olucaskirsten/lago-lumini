(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header state
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile menu
  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.classList.toggle('is-open', opening);
    mobileMenu.setAttribute('aria-hidden', String(!opening));
    document.body.classList.toggle('menu-open', opening);
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMenu();
  });

  // Reveal animations
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('button');
    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Lightbox for lots and overview map
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.querySelector('.lightbox-close');
  let lastFocused = null;

  const openLightbox = (src, title, trigger) => {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;
    lastFocused = trigger || document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = title || 'Imagem ampliada do Lago Lumini';
    lightboxTitle.textContent = title || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => lightboxClose?.focus(), 50);
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImage) lightboxImage.src = '';
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  document.querySelectorAll('.lot-card[data-lightbox]').forEach(card => {
    const trigger = card.querySelector('.lot-image');
    trigger?.addEventListener('click', () => {
      openLightbox(card.dataset.lightbox, card.dataset.title, trigger);
    });
  });

  document.querySelectorAll('[data-open-map]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      openLightbox(trigger.dataset.openMap, trigger.dataset.title, trigger);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (lightbox?.classList.contains('is-open')) closeLightbox();
      else if (mobileMenu?.classList.contains('is-open')) closeMenu();
    }
  });
})();
