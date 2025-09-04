// AOS (Animate On Scroll) configuration and helpers
// This assumes AOS is loaded via CDN

class AOSManager {
  constructor() {
    this.initialized = false;
    this.defaultSettings = {
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    };
  }

  // Initialize AOS
  init(customSettings = {}) {
    if (typeof AOS === 'undefined') {
      console.warn('AOS library not loaded');
      return;
    }

    const settings = { ...this.defaultSettings, ...customSettings };
    AOS.init(settings);
    this.initialized = true;
  }

  // Refresh AOS (useful for dynamic content)
  refresh() {
    if (this.initialized && typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Add animation to element
  addAnimation(element, animation, options = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (element) {
      element.setAttribute('data-aos', animation);
      
      Object.keys(options).forEach(key => {
        element.setAttribute(`data-aos-${key}`, options[key]);
      });

      this.refresh();
    }
  }

  // Common animation presets
  fadeIn(selector, delay = 0) {
    this.addAnimation(selector, 'fade-up', { delay });
  }

  slideIn(selector, direction = 'left', delay = 0) {
    this.addAnimation(selector, `slide-${direction}`, { delay });
  }

  zoomIn(selector, delay = 0) {
    this.addAnimation(selector, 'zoom-in', { delay });
  }
}

// Global AOS manager instance
window.aosManager = new AOSManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aosManager.init();
  });
} else {
  window.aosManager.init();
}