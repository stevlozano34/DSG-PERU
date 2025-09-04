// Main JavaScript file for DSG PERU TECHNOLOGY

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Global utilities
const DSG = {
    // Theme management
    theme: {
        init() {
            const savedTheme = localStorage.getItem('dsg-theme') || 'light';
            this.setTheme(savedTheme);
        },
        
        setTheme(theme) {
            document.documentElement.className = theme;
            localStorage.setItem('dsg-theme', theme);
            
            // Update theme toggle icons
            const themeToggles = document.querySelectorAll('.theme-toggle');
            themeToggles.forEach(toggle => {
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
                }
            });
            
            // Recreate icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        },
        
        toggle() {
            const currentTheme = document.documentElement.className;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }
    },
    
    // Navigation management
    nav: {
        init() {
            this.setupMobileMenu();
            this.setupDropdowns();
            this.setupScrollEffect();
        },
        
        setupMobileMenu() {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');
            
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('open');
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        const isOpen = navMenu.classList.contains('open');
                        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                        lucide.createIcons();
                    }
                });
            }
        },
        
        setupDropdowns() {
            const dropdownBtns = document.querySelectorAll('[id$="-dropdown-btn"]');
            
            dropdownBtns.forEach(btn => {
                const menuId = btn.id.replace('-btn', '-menu');
                const menu = document.getElementById(menuId);
                
                if (menu) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        menu.classList.toggle('show');
                    });
                }
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            });
        },
        
        setupScrollEffect() {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }
    },
    
    // Form utilities
    forms: {
        validate(form) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    this.showError(input, 'Este campo es requerido');
                    isValid = false;
                } else {
                    this.clearError(input);
                }
            });
            
            return isValid;
        },
        
        showError(input, message) {
            input.classList.add('error');
            let errorElement = input.parentNode.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                input.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        },
        
        clearError(input) {
            input.classList.remove('error');
            const errorElement = input.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    },
    
    // Utility functions
    utils: {
        scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i data-lucide="x"></i>
                </button>
            `;
            
            // Add to page
            document.body.appendChild(notification);
            
            // Initialize icons
            lucide.createIcons();
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
            
            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
        }
    }
};

// Global functions for backward compatibility
function scrollToSection(sectionId) {
    DSG.utils.scrollToSection(sectionId);
}

function requestDemo() {
    DSG.utils.showNotification('Demo solicitada. Nos contactaremos contigo pronto.', 'success');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    DSG.theme.init();
    DSG.nav.init();
    
    // Setup theme toggles
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => DSG.theme.toggle());
    });
    
    // Setup password toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentNode.querySelector('input');
            const icon = toggle.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            
            lucide.createIcons();
        });
    });
    
    // Setup form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (DSG.forms.validate(form)) {
                // Handle form submission
                console.log('Form submitted:', new FormData(form));
                DSG.utils.showNotification('Formulario enviado correctamente', 'success');
            }
        });
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSG;
}