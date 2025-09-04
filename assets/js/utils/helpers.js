// General helper utility functions
class HelperUtils {
  // DOM manipulation helpers
  dom = {
    // Get element(s)
    get: (selector) => {
      if (selector.startsWith('#')) {
        return document.getElementById(selector.slice(1));
      }
      return document.querySelectorAll(selector);
    },

    // Create element with attributes
    create: (tag, attributes = {}, content = '') => {
      const element = document.createElement(tag);
      
      Object.keys(attributes).forEach(key => {
        if (key === 'className') {
          element.className = attributes[key];
        } else if (key === 'innerHTML') {
          element.innerHTML = attributes[key];
        } else {
          element.setAttribute(key, attributes[key]);
        }
      });
      
      if (content) {
        element.textContent = content;
      }
      
      return element;
    },

    // Show/hide elements
    show: (selector) => {
      const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
      elements.forEach(el => {
        if (el) el.style.display = '';
      });
    },

    hide: (selector) => {
      const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
      elements.forEach(el => {
        if (el) el.style.display = 'none';
      });
    },

    // Toggle class
    toggleClass: (selector, className) => {
      const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
      elements.forEach(el => {
        if (el) el.classList.toggle(className);
      });
    }
  };

  // String utilities
  string = {
    // Capitalize first letter
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

    // Convert to title case
    titleCase: (str) => {
      return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },

    // Generate slug
    slug: (str) => {
      return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    // Truncate string
    truncate: (str, length, suffix = '...') => {
      if (str.length <= length) return str;
      return str.substring(0, length) + suffix;
    },

    // Generate random string
    random: (length = 10) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  };

  // Number utilities
  number = {
    // Format currency
    currency: (amount, currency = 'USD', locale = 'en-US') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    },

    // Format number with commas
    format: (num, decimals = 0) => {
      return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    },

    // Generate random number
    random: (min = 0, max = 100) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Clamp number between min and max
    clamp: (num, min, max) => {
      return Math.min(Math.max(num, min), max);
    }
  };

  // Date utilities
  date = {
    // Format date
    format: (date, format = 'YYYY-MM-DD') => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');

      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    },

    // Get relative time
    relative: (date) => {
      const now = new Date();
      const diff = now - new Date(date);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} día${days > 1 ? 's' : ''} atrás`;
      if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
      if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
      return 'Hace un momento';
    },

    // Add days to date
    addDays: (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  };

  // Array utilities
  array = {
    // Remove duplicates
    unique: (arr) => [...new Set(arr)],

    // Shuffle array
    shuffle: (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    // Group by property
    groupBy: (arr, key) => {
      return arr.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
      }, {});
    },

    // Sort by property
    sortBy: (arr, key, direction = 'asc') => {
      return [...arr].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
  };

  // URL utilities
  url = {
    // Get query parameters
    getParams: () => {
      const params = new URLSearchParams(window.location.search);
      const result = {};
      for (const [key, value] of params) {
        result[key] = value;
      }
      return result;
    },

    // Set query parameter
    setParam: (key, value) => {
      const url = new URL(window.location);
      url.searchParams.set(key, value);
      window.history.pushState({}, '', url);
    },

    // Remove query parameter
    removeParam: (key) => {
      const url = new URL(window.location);
      url.searchParams.delete(key);
      window.history.pushState({}, '', url);
    }
  };

  // Debounce function
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Deep clone object
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  // Check if object is empty
  isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
  }
}

// Global helper utilities instance
window.utils = new HelperUtils();