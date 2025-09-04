// Modal component
class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.init();
  }

  init() {
    // Create modal backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(this.backdrop);

    // Close modal on backdrop click
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  // Create modal
  create(id, options = {}) {
    const defaultOptions = {
      title: '',
      content: '',
      size: 'medium', // small, medium, large, full
      closable: true,
      backdrop: true,
      keyboard: true,
      animation: 'fade' // fade, slide, zoom
    };

    const config = { ...defaultOptions, ...options };

    const modal = document.createElement('div');
    modal.className = `modal modal-${config.size}`;
    modal.id = id;
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      display: none;
      max-height: 90vh;
      overflow-y: auto;
    `;

    // Set modal size
    const sizes = {
      small: '400px',
      medium: '600px',
      large: '800px',
      full: '95vw'
    };
    modal.style.width = sizes[config.size] || sizes.medium;
    modal.style.maxWidth = '95vw';

    // Create modal content
    const modalContent = `
      <div class="modal-header" style="padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="modal-title" style="margin: 0; font-size: 1.25rem; font-weight: 600;">${config.title}</h3>
        ${config.closable ? '<button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0; color: #64748b;">&times;</button>' : ''}
      </div>
      <div class="modal-body" style="padding: 1rem;">
        ${config.content}
      </div>
    `;

    modal.innerHTML = modalContent;

    // Add close button event
    if (config.closable) {
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn.addEventListener('click', () => this.close(id));
    }

    document.body.appendChild(modal);
    this.modals.set(id, { element: modal, config });

    return modal;
  }

  // Show modal
  show(id) {
    const modal = this.modals.get(id);
    if (!modal) return;

    // Close any active modal first
    if (this.activeModal && this.activeModal !== id) {
      this.close(this.activeModal);
    }

    this.activeModal = id;
    
    // Show backdrop
    this.backdrop.style.display = 'block';
    setTimeout(() => {
      this.backdrop.style.opacity = '1';
    }, 10);

    // Show modal
    modal.element.style.display = 'block';
    
    // Add animation class
    modal.element.classList.add('modal-show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Trigger show event
    modal.element.dispatchEvent(new CustomEvent('modal:show'));
  }

  // Close modal
  close(id = null) {
    const modalId = id || this.activeModal;
    if (!modalId) return;

    const modal = this.modals.get(modalId);
    if (!modal) return;

    // Hide modal
    modal.element.classList.remove('modal-show');
    
    setTimeout(() => {
      modal.element.style.display = 'none';
      
      // Hide backdrop
      this.backdrop.style.opacity = '0';
      setTimeout(() => {
        this.backdrop.style.display = 'none';
      }, 300);
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      this.activeModal = null;
      
      // Trigger close event
      modal.element.dispatchEvent(new CustomEvent('modal:close'));
    }, 300);
  }

  // Update modal content
  updateContent(id, content) {
    const modal = this.modals.get(id);
    if (!modal) return;

    const body = modal.element.querySelector('.modal-body');
    if (body) {
      body.innerHTML = content;
    }
  }

  // Update modal title
  updateTitle(id, title) {
    const modal = this.modals.get(id);
    if (!modal) return;

    const titleElement = modal.element.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  // Destroy modal
  destroy(id) {
    const modal = this.modals.get(id);
    if (!modal) return;

    if (this.activeModal === id) {
      this.close(id);
    }

    modal.element.remove();
    this.modals.delete(id);
  }

  // Quick alert modal
  alert(message, title = 'Alerta') {
    const id = 'alert-modal';
    
    if (this.modals.has(id)) {
      this.destroy(id);
    }

    this.create(id, {
      title,
      content: `
        <p style="margin-bottom: 1rem;">${message}</p>
        <div style="text-align: right;">
          <button class="btn btn-primary" onclick="window.modal.close('${id}')">Aceptar</button>
        </div>
      `,
      size: 'small'
    });

    this.show(id);
  }

  // Quick confirm modal
  confirm(message, title = 'Confirmar') {
    return new Promise((resolve) => {
      const id = 'confirm-modal';
      
      if (this.modals.has(id)) {
        this.destroy(id);
      }

      this.create(id, {
        title,
        content: `
          <p style="margin-bottom: 1rem;">${message}</p>
          <div style="text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="window.modal.close('${id}'); window.modal._resolveConfirm(false)">Cancelar</button>
            <button class="btn btn-primary" onclick="window.modal.close('${id}'); window.modal._resolveConfirm(true)">Confirmar</button>
          </div>
        `,
        size: 'small'
      });

      this._resolveConfirm = resolve;
      this.show(id);
    });
  }
}

// Global modal manager instance
window.modal = new ModalManager();

// Auto-initialize modal triggers
document.addEventListener('DOMContentLoaded', () => {
  // Handle data-modal attributes
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      window.modal.show(modalId);
    }
  });
});