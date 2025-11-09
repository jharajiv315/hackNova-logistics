// /scripts/components.js
// Reusable UI components

// Toast notification component
export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Modal component
export function showModal(title, content, options = {}) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="modal-title">${title}</h3>
        <button class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">${content}</div>
      ${options.showFooter !== false ? `
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-confirm">Confirm</button>
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  const closeModal = () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  };

  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.querySelector('.modal-cancel')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Confirm handler
  if (options.onConfirm) {
    modal.querySelector('.modal-confirm')?.addEventListener('click', () => {
      options.onConfirm();
      closeModal();
    });
  }

  // Trap focus in modal
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  firstFocusable?.focus();

  return modal;
}

// Accordion component (already in HTML, but helper here)
export function initAccordions() {
  const accordions = document.querySelectorAll('.faq-item');
  
  accordions.forEach(accordion => {
    const summary = accordion.querySelector('.faq-question');
    if (summary) {
      summary.addEventListener('click', () => {
        // Close other accordions (optional)
        accordions.forEach(other => {
          if (other !== accordion && other.hasAttribute('open')) {
            other.removeAttribute('open');
          }
        });
      });
    }
  });
}

// Initialize accordions if present
if (document.querySelector('.faq-accordion')) {
  initAccordions();
}

// Table pagination component
export function paginateTable(tableId, rowsPerPage = 10) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  let currentPage = 1;
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  function renderPage(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
      row.style.display = (index >= start && index < end) ? '' : 'none';
    });

    renderPaginationControls();
  }

  function renderPaginationControls() {
    let controls = table.parentElement.querySelector('.pagination-controls');
    
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'pagination-controls';
      table.parentElement.appendChild(controls);
    }

    controls.innerHTML = `
      <button class="btn btn-small" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button class="btn btn-small" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;

    controls.querySelector('button:first-child').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });

    controls.querySelector('button:last-child').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });
  }

  renderPage(currentPage);
}
