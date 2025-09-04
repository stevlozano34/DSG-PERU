// LocalStorage and SessionStorage utility functions
class StorageManager {
  constructor() {
    this.prefix = 'dsg_';
  }

  // Generate prefixed key
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // LocalStorage methods
  local = {
    // Set item in localStorage
    set: (key, value) => {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(this.getKey(key), serializedValue);
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    },

    // Get item from localStorage
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(this.getKey(key));
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },

    // Remove item from localStorage
    remove: (key) => {
      try {
        localStorage.removeItem(this.getKey(key));
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    },

    // Clear all prefixed items
    clear: () => {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    },

    // Check if key exists
    exists: (key) => {
      return localStorage.getItem(this.getKey(key)) !== null;
    }
  };

  // SessionStorage methods
  session = {
    // Set item in sessionStorage
    set: (key, value) => {
      try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(this.getKey(key), serializedValue);
        return true;
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
      }
    },

    // Get item from sessionStorage
    get: (key, defaultValue = null) => {
      try {
        const item = sessionStorage.getItem(this.getKey(key));
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
      }
    },

    // Remove item from sessionStorage
    remove: (key) => {
      try {
        sessionStorage.removeItem(this.getKey(key));
        return true;
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
        return false;
      }
    },

    // Clear all prefixed items
    clear: () => {
      try {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
        return false;
      }
    },

    // Check if key exists
    exists: (key) => {
      return sessionStorage.getItem(this.getKey(key)) !== null;
    }
  };

  // Cookie methods
  cookie = {
    // Set cookie
    set: (name, value, days = 7) => {
      try {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${this.getKey(name)}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
        return true;
      } catch (error) {
        console.error('Error setting cookie:', error);
        return false;
      }
    },

    // Get cookie
    get: (name, defaultValue = null) => {
      try {
        const nameEQ = this.getKey(name) + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) {
            return JSON.parse(c.substring(nameEQ.length, c.length));
          }
        }
        return defaultValue;
      } catch (error) {
        console.error('Error reading cookie:', error);
        return defaultValue;
      }
    },

    // Remove cookie
    remove: (name) => {
      try {
        document.cookie = `${this.getKey(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        return true;
      } catch (error) {
        console.error('Error removing cookie:', error);
        return false;
      }
    }
  };

  // Check storage availability
  isStorageAvailable(type) {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Global storage manager instance
window.storage = new StorageManager();