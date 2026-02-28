/* ================================================
   CHIRAG RAWAL — Personal Website
   main.js
   ================================================ */

(function () {
  'use strict';

  /* ——————————————————————————————————————————————
     HELPERS
  —————————————————————————————————————————————— */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  /* ——————————————————————————————————————————————
     NAVBAR — scroll behaviour + active link
  —————————————————————————————————————————————— */
  const navbar   = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  function updateActiveLink() {
    const scrollPos = window.scrollY + parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
    ) + 20;

    let current = '';
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateNavbar,    { passive: true });
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateNavbar();
  updateActiveLink();

  /* ——————————————————————————————————————————————
     MOBILE MENU
  —————————————————————————————————————————————— */
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ——————————————————————————————————————————————
     SMOOTH SCROLL for anchor links
  —————————————————————————————————————————————— */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ——————————————————————————————————————————————
     BACK TO TOP
  —————————————————————————————————————————————— */
  const backToTop = $('#backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ——————————————————————————————————————————————
     ANIMATED COUNTERS
  —————————————————————————————————————————————— */
  const counters = $$('.stat-number[data-target]');
  let countersTriggered = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(target * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function checkCounters() {
    if (countersTriggered) return;
    const hero = $('.hero');
    if (hero && hero.getBoundingClientRect().top < window.innerHeight * 0.9) {
      countersTriggered = true;
      counters.forEach(animateCounter);
    }
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();

  /* ——————————————————————————————————————————————
     SCROLL-TRIGGERED FADE-IN ANIMATIONS
  —————————————————————————————————————————————— */
  const animatedSelectors = [
    '.expertise-card',
    '.service-card',
    '.insight-card',
    '.testimonial-card',
    '.project-card',
    '.timeline-item',
    '.highlight-item',
    '.contact-method',
  ].join(', ');

  const animatedEls = $$(animatedSelectors);

  animatedEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.07}s, transform 0.5s ease ${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => observer.observe(el));

  /* ——————————————————————————————————————————————
     CONTACT FORM (simulated — swap for real endpoint)
  —————————————————————————————————————————————— */
  const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn         = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sending&hellip;</span><i class="fas fa-spinner fa-spin"></i>';
      btn.disabled  = true;

      // Simulate a brief network request; replace with fetch() to a real endpoint.
      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        btn.style.background = 'var(--green)';

        setTimeout(() => {
          btn.innerHTML        = originalHTML;
          btn.disabled         = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1600);
    });
  }

  /* ——————————————————————————————————————————————
     NAVBAR — hide on fast downscroll, reveal on upscroll
     (optional UX polish)
  —————————————————————————————————————————————— */
  let lastScrollY   = window.scrollY;
  let ticking       = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        // Only hide after user scrolls past the hero and scrolls DOWN quickly
        if (current > 500 && current > lastScrollY + 80) {
          navbar.style.transform = 'translateY(-100%)';
        } else if (current < lastScrollY - 10 || current < 100) {
          navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = current;
        ticking     = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();
