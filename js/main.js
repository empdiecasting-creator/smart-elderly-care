/* ============================================================
   main.js — Global interactions
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     Mobile Menu
     ========================================================== */

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('mobile-menu--open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        closeMobileMenu();
      }
    });

    // Mobile dropdown toggle
    const dropdownToggle = mobileMenu.querySelector('.mobile-menu__dropdown-toggle');
    const submenu = mobileMenu.querySelector('.mobile-menu__submenu');
    if (dropdownToggle && submenu) {
      dropdownToggle.addEventListener('click', function () {
        const isSubOpen = submenu.classList.contains('mobile-menu__submenu--open');
        submenu.classList.toggle('mobile-menu__submenu--open', !isSubOpen);
        dropdownToggle.classList.toggle('mobile-menu__dropdown-toggle--open', !isSubOpen);
      });
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    hamburger.classList.add('hamburger--open');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    hamburger.classList.remove('hamburger--open');
    body.style.overflow = '';
  }

  /* ==========================================================
     Sticky Header Shadow
     ========================================================== */

  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const observer = new IntersectionObserver(
      function ([entry]) {
        siteHeader.classList.toggle('site-header--scrolled', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    // Observe a sentinel element at the very top of the page
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }

  /* ==========================================================
     Back to Top Button
     ========================================================== */

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const btObserver = new IntersectionObserver(
      function ([entry]) {
        backToTop.classList.toggle('back-to-top--visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const topSentinel = document.createElement('div');
    topSentinel.style.position = 'absolute';
    topSentinel.style.top = '400px';
    topSentinel.style.height = '1px';
    topSentinel.style.width = '100%';
    topSentinel.style.pointerEvents = 'none';
    document.body.prepend(topSentinel);
    btObserver.observe(topSentinel);

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     Active Nav Highlighting
     ========================================================== */

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('nav__link--active');
    }
    // Also highlight the dropdown toggle if a child is active
    if (href && currentPath.includes('/solutions/') && href.includes('solutions')) {
      link.classList.add('nav__link--active');
    }
  });

  /* ==========================================================
     Scroll Reveal Animations
     ========================================================== */

  const revealElements = document.querySelectorAll('.reveal');
  const revealStaggerContainers = document.querySelectorAll('.reveal-stagger');

  if (revealElements.length > 0 || revealStaggerContainers.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('reveal-stagger')) {
              entry.target.classList.add('reveal-stagger--visible');
            } else {
              entry.target.classList.add('reveal--visible');
            }
            // Optionally unobserve after reveal for performance
            // revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    revealStaggerContainers.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================
     Reading Time Estimator (for blog pages)
     ========================================================== */

  const articleBody = document.querySelector('.article-body');
  const readingTimeEl = document.querySelector('[data-reading-time]');
  if (articleBody && readingTimeEl) {
    const text = articleBody.textContent;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 wpm
    readingTimeEl.textContent = readingTime + ' min read';
  }

  /* ==========================================================
     Current Year (for copyright)
     ========================================================== */

  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
