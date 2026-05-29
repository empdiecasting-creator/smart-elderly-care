/* ============================================================
   Smart Elderly Care — B2B Export Website
   Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================
    // 1. MOBILE NAV TOGGLE
    // ==========================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close nav on link click (mobile)
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // ==========================================================
    // 2. STICKY NAV — ADD 'SCROLLED' CLASS
    // ==========================================================
    const nav = document.querySelector('.nav');
    let lastScrollY = 0;

    if (nav) {
      window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
      }, { passive: true });
    }

    // ==========================================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navHeight = nav ? nav.offsetHeight : 72;
          const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });

    // ==========================================================
    // 4. CONTACT FORM HANDLER
    // ==========================================================
    const contactForm = document.querySelector('.contact-form form');
    const formSuccess = document.querySelector('.form-success');

    if (contactForm) {
      // Pre-select product from URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const productParam = urlParams.get('product');
      const productSelect = contactForm.querySelector('#product');
      if (productSelect && productParam) {
        const optionExists = Array.from(productSelect.options).some(function (opt) {
          return opt.value === productParam;
        });
        if (optionExists) {
          productSelect.value = productParam;
        }
      }

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simple client-side validation
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const company = contactForm.querySelector('#company');
        let isValid = true;

        // Reset errors
        contactForm.querySelectorAll('.form-error').forEach(function (el) {
          el.remove();
        });
        contactForm.querySelectorAll('.error').forEach(function (el) {
          el.classList.remove('error');
        });

        if (name && !name.value.trim()) {
          showError(name, 'Please enter your name');
          isValid = false;
        }

        if (email && !email.value.trim()) {
          showError(email, 'Please enter your email');
          isValid = false;
        } else if (email && !isValidEmail(email.value.trim())) {
          showError(email, 'Please enter a valid email address');
          isValid = false;
        }

        if (company && !company.value.trim()) {
          showError(company, 'Please enter your company name');
          isValid = false;
        }

        if (!isValid) return;

        // Collect form data
        var formData = new FormData(contactForm);
        var data = {};
        formData.forEach(function (value, key) {
          data[key] = value;
        });

        // Show loading state
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Submit to Cloudflare Pages Function
        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(function (response) {
          return response.json().then(function (responseData) {
            if (!response.ok) {
              throw new Error(responseData.error || 'Submission failed');
            }
            return responseData;
          });
        })
        .then(function (responseData) {
          // Success
          contactForm.style.display = 'none';
          var successEl = document.querySelector('.form-success');
          if (successEl) {
            successEl.classList.add('show');
          }
        })
        .catch(function (err) {
          // Show error
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          var errorMsg = document.createElement('p');
          errorMsg.className = 'form-error';
          errorMsg.style.cssText = 'color: var(--color-error); font-size: 0.9rem; margin-top: 1rem; text-align: center;';
          errorMsg.textContent = err.message + '. Please email us directly at export@smartelderlycare.com';
          contactForm.appendChild(errorMsg);
        });

        // Reset form data (hidden)
        contactForm.reset();
      });
    }

    // ==========================================================
    // 5. SCROLL REVEAL ANIMATION
    // ==========================================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: just reveal everything
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }

    // ==========================================================
    // 6. COUNTER ANIMATION (hero stats, about stats)
    // ==========================================================
    const counters = document.querySelectorAll('.animate-counter');

    if (counters.length > 0 && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              el.textContent = current.toLocaleString();

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target.toLocaleString();
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    }

  }); // end DOMContentLoaded

  // ============================================================
  // HELPERS
  // ============================================================

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputEl, message) {
    inputEl.classList.add('error');
    var error = document.createElement('p');
    error.className = 'form-error';
    error.style.cssText = 'color: var(--color-error, #f56565); font-size: 0.8rem; margin-top: 4px;';
    error.textContent = message;
    inputEl.parentNode.appendChild(error);
  }

})();
