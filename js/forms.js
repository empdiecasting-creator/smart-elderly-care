/* ============================================================
   forms.js — Contact form validation & submission
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  /* ==========================================================
     URL Parameter Pre-fill
     ========================================================== */

  const params = new URLSearchParams(window.location.search);
  const productParam = params.get('product');
  if (productParam) {
    const productSelect = form.querySelector('[name="product_interest"]');
    if (productSelect) {
      const option = productSelect.querySelector('option[value="' + productParam + '"]');
      if (option) {
        option.selected = true;
      }
    }
  }

  /* ==========================================================
     Real-time Validation
     ========================================================== */

  const fields = form.querySelectorAll('[data-validate]');

  const validators = {
    required: function (value) {
      return value.trim().length > 0 ? null : 'This field is required.';
    },
    email: function (value) {
      if (value.trim().length === 0) return null; // skip if empty (handled by required)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address.';
    },
    minlength: function (value, min) {
      if (value.trim().length === 0) return null;
      return value.trim().length >= parseInt(min) ? null : 'Must be at least ' + min + ' characters.';
    },
    phone: function (value) {
      if (value.trim().length === 0) return null;
      return /^[+]?[\d\s\-().]{7,20}$/.test(value) ? null : 'Please enter a valid phone number.';
    }
  };

  fields.forEach(function (field) {
    var rules = field.getAttribute('data-validate').split(',');
    var errorEl = field.parentNode.querySelector('.form-error');

    field.addEventListener('blur', function () {
      validateField(field, rules, errorEl);
    });

    field.addEventListener('input', function () {
      // Clear error on input if previously errored
      if (field.classList.contains('form-input--error') || field.classList.contains('form-textarea--error')) {
        validateField(field, rules, errorEl);
      }
    });
  });

  function validateField(field, rules, errorEl) {
    var error = null;

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i].trim();
      var parts = rule.split(':');
      var ruleName = parts[0];
      var ruleParam = parts[1] || null;

      if (validators[ruleName]) {
        error = validators[ruleName](field.value, ruleParam);
        if (error) break;
      }
    }

    if (error) {
      field.classList.add(field.tagName === 'TEXTAREA' ? 'form-textarea--error' : 'form-input--error');
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.classList.add('form-error--visible');
      }
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('form-input--error', 'form-textarea--error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('form-error--visible');
      }
      field.removeAttribute('aria-invalid');
    }

    return !error;
  }

  /* ==========================================================
     Form Submission — Cloudflare Function
     ========================================================== */


  // Show success message if redirected back from Cloudflare Function
  if (window.location.search.includes('success=1')) {
    var successEl = document.querySelector('.form-success');
    if (successEl) {
      successEl.classList.add('form-success--visible');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.history.replaceState({}, '', window.location.pathname);
  }
})();
