/* ============================================================
   products-compare.js — Comparison table interactions
   ============================================================ */

(function () {
  'use strict';

  var table = document.querySelector('.compare-table');
  if (!table) return;

  // Highlight row on hover
  var rows = table.querySelectorAll('tbody tr');
  rows.forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      row.style.background = 'var(--color-surface-alt)';
    });
    row.addEventListener('mouseleave', function () {
      row.style.background = '';
    });
  });

  // Column toggle: checkboxes to show/hide product columns
  var toggles = document.querySelectorAll('[data-compare-toggle]');
  toggles.forEach(function (toggle) {
    toggle.addEventListener('change', function () {
      var columnIndex = parseInt(toggle.getAttribute('data-compare-toggle'));
      var isVisible = toggle.checked;

      // Toggle table header
      var headers = table.querySelectorAll('thead th');
      if (headers[columnIndex]) {
        headers[columnIndex].style.display = isVisible ? '' : 'none';
      }

      // Toggle table body cells
      var bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells[columnIndex - 1]) { // -1 because first column is feature name
          cells[columnIndex - 1].style.display = isVisible ? '' : 'none';
        }
      });
    });
  });
})();
