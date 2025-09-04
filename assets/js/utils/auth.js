// Authentication utility functions
class AuthManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
    this.refreshTokenKey = 'refresh_token';
  }

  // Set authentication token
  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
      // Update API client with new token
      if (window.api) {
        window.api.setAuthToken(token);
      }
    }
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove authentication token
  removeToken() {
    localStorage.removeItem(this.tokenKey);
    if (window.api) {
      window.api.setAuthToken(null);
    }
  }

  // Set user data
  setUser(userData) {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  // Get user data
  getUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Login
  async login(credentials) {
    try {
      const response = await window.api.post('/auth/login', credentials);
      
      if (response.token) {
        this.setToken(response.token);
        if (response.user) {
          this.setUser(response.user);
        }
        if (response.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        }
        return response;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint if available
      if (this.isAuthenticated()) {
        await window.api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local storage regardless of API call result
      this.removeToken();
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.refreshTokenKey);
      
      // Redirect to login page
      window.location.href = '/pages/auth/login.html';
    }
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await window.api.post('/auth/refresh', {
        refreshToken
      });
      
      if (response.token) {
        this.setToken(response.token);
        return response.token;
      }
      
      throw new Error('Invalid refresh response');
    } catch (error) {
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }
}

// Global auth manager instance
window.auth = new AuthManager();

// Initialize auth on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const token = window.auth.getToken();
    if (token && window.api) {
      window.api.setAuthToken(token);
    }
  });
} else {
  const token = window.auth.getToken();
  if (token && window.api) {
    window.api.setAuthToken(token);
  }
}