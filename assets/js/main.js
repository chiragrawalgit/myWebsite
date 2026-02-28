/* ================================================
   CHIRAG RAWAL — Personal Website
   main.js  (multi-page)
   ================================================ */

(function () {
  'use strict';

  /* ——————————————————————————————————————————————
     HELPERS
  —————————————————————————————————————————————— */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ——————————————————————————————————————————————
     NAVBAR — scroll behaviour + active page link
  —————————————————————————————————————————————— */
  const navbar   = $('#navbar');
  const navLinks = $$('.nav-link');

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  /* Set active nav link based on current page URL */
  function setActiveNavLink() {
    const path = window.location.pathname;
    const current = path.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop() || 'index.html';
      const isHome = (current === '' || current === 'index.html') && (linkPage === '' || linkPage === 'index.html');
      const isMatch = linkPage !== '' && linkPage !== 'index.html' && current === linkPage;
      link.classList.toggle('active', isHome || isMatch);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  if (navbar) updateNavbar();
  setActiveNavLink();

  /* ——————————————————————————————————————————————
     MOBILE MENU
  —————————————————————————————————————————————— */
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close on link click */
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ——————————————————————————————————————————————
     SMOOTH SCROLL for same-page anchor links
  —————————————————————————————————————————————— */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ——————————————————————————————————————————————
     BACK TO TOP
  —————————————————————————————————————————————— */
  const backToTop = $('#backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ——————————————————————————————————————————————
     ANIMATED COUNTERS (home page hero)
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

  if (counters.length) {
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
  }

  /* ——————————————————————————————————————————————
     SCROLL-TRIGGERED FADE-IN ANIMATIONS
  —————————————————————————————————————————————— */
  const animatedSelectors = [
    '.expertise-card',
    '.service-card',
    '.insight-card',
    '.insight-list-card',
    '.testimonial-card',
    '.project-card',
    '.timeline-item',
    '.highlight-item',
    '.contact-method',
    '.work-preview-card',
    '.case-study',
    '.approach-card',
    '.outcome-metric',
  ].join(', ');

  const animatedEls = $$(animatedSelectors);

  animatedEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = `opacity 0.5s ease ${(i % 5) * 0.07}s, transform 0.5s ease ${(i % 5) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  animatedEls.forEach(el => observer.observe(el));

  /* ——————————————————————————————————————————————
     CONTACT FORM
     Swap setTimeout for a real fetch() to your endpoint.
     Recommended: https://formspree.io (free for static sites)
  —————————————————————————————————————————————— */
  const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn          = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sending&hellip;</span><i class="fas fa-spinner fa-spin"></i>';
      btn.disabled  = true;

      setTimeout(() => {
        btn.innerHTML        = '<span>Message Sent!</span><i class="fas fa-check"></i>';
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
     WORK PAGE — FILTER TABS
  —————————————————————————————————————————————— */
  const filterBtns    = $$('.filter-btn');
  const caseStudies   = $$('.case-study[data-category]');

  if (filterBtns.length && caseStudies.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        caseStudies.forEach(cs => {
          const show = cat === 'all' || cs.dataset.category === cat;
          cs.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ——————————————————————————————————————————————
     NAVBAR — hide on fast downscroll, reveal on upscroll
  —————————————————————————————————————————————— */
  if (navbar) {
    let lastScrollY = window.scrollY;
    let ticking     = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const current = window.scrollY;
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
  }

})();
