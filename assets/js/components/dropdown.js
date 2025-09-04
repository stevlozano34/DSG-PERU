// Dropdown component
class DropdownManager {
  constructor() {
    this.dropdowns = new Map();
    this.activeDropdown = null;
    this.init();
  }

  init() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.activeDropdown && !e.target.closest('.dropdown')) {
        this.close(this.activeDropdown);
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeDropdown) {
        this.close(this.activeDropdown);
      }
    });
  }

  // Create dropdown
  create(id, options = {}) {
    const defaultOptions = {
      trigger: 'click', // click, hover
      position: 'bottom-left', // bottom-left, bottom-right, top-left, top-right
      offset: 5,
      animation: true,
      closeOnSelect: true
    };

    const config = { ...defaultOptions, ...options };
    this.dropdowns.set(id, config);

    const dropdown = document.getElementById(id);
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!trigger || !menu) return;

    // Set initial styles
    dropdown.style.position = 'relative';
    menu.style.cssText = `
      position: absolute;
      z-index: 1000;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 160px;
      padding: 0.5rem 0;
      display: none;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    `;

    // Position dropdown
    this.setPosition(menu, config.position, config.offset);

    // Add event listeners
    if (config.trigger === 'click') {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(id);
      });
    } else if (config.trigger === 'hover') {
      dropdown.addEventListener('mouseenter', () => this.show(id));
      dropdown.addEventListener('mouseleave', () => this.close(id));
    }

    // Close on menu item click
    if (config.closeOnSelect) {
      menu.addEventListener('click', (e) => {
        if (e.target.closest('.dropdown-item')) {
          this.close(id);
        }
      });
    }

    return dropdown;
  }

  // Set dropdown position
  setPosition(menu, position, offset) {
    const positions = {
      'bottom-left': { top: `calc(100% + ${offset}px)`, left: '0' },
      'bottom-right': { top: `calc(100% + ${offset}px)`, right: '0' },
      'top-left': { bottom: `calc(100% + ${offset}px)`, left: '0' },
      'top-right': { bottom: `calc(100% + ${offset}px)`, right: '0' }
    };

    const pos = positions[position] || positions['bottom-left'];
    Object.assign(menu.style, pos);
  }

  // Show dropdown
  show(id) {
    const config = this.dropdowns.get(id);
    if (!config) return;

    // Close any active dropdown
    if (this.activeDropdown && this.activeDropdown !== id) {
      this.close(this.activeDropdown);
    }

    const dropdown = document.getElementById(id);
    const menu = dropdown?.querySelector('.dropdown-menu');
    if (!menu) return;

    this.activeDropdown = id;
    
    menu.style.display = 'block';
    
    if (config.animation) {
      setTimeout(() => {
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
      }, 10);
    } else {
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0)';
    }

    // Add active class
    dropdown.classList.add('dropdown-active');

    // Trigger show event
    dropdown.dispatchEvent(new CustomEvent('dropdown:show'));
  }

  // Close dropdown
  close(id) {
    const config = this.dropdowns.get(id);
    if (!config) return;

    const dropdown = document.getElementById(id);
    const menu = dropdown?.querySelector('.dropdown-menu');
    if (!menu) return;

    if (config.animation) {
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        menu.style.display = 'none';
      }, 200);
    } else {
      menu.style.display = 'none';
    }

    // Remove active class
    dropdown.classList.remove('dropdown-active');
    
    if (this.activeDropdown === id) {
      this.activeDropdown = null;
    }

    // Trigger close event
    dropdown.dispatchEvent(new CustomEvent('dropdown:close'));
  }

  // Toggle dropdown
  toggle(id) {
    if (this.activeDropdown === id) {
      this.close(id);
    } else {
      this.show(id);
    }
  }

  // Update dropdown content
  updateContent(id, content) {
    const dropdown = document.getElementById(id);
    const menu = dropdown?.querySelector('.dropdown-menu');
    if (menu) {
      menu.innerHTML = content;
    }
  }

  // Destroy dropdown
  destroy(id) {
    if (this.activeDropdown === id) {
      this.close(id);
    }
    this.dropdowns.delete(id);
  }
}

// Global dropdown manager instance
window.dropdown = new DropdownManager();

// Auto-initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all dropdowns with data-dropdown attribute
  document.querySelectorAll('[data-dropdown]').forEach(element => {
    const id = element.id;
    const options = {
      trigger: element.dataset.trigger || 'click',
      position: element.dataset.position || 'bottom-left',
      closeOnSelect: element.dataset.closeOnSelect !== 'false'
    };
    
    window.dropdown.create(id, options);
  });
});