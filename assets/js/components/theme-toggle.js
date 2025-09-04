// Theme Toggle Component - DSG Dashboard

class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.updateIcon();
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Escuchar cambios de tema del sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                    this.updateIcon();
                }
            });
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateIcon();
        localStorage.setItem('theme', this.currentTheme);
        
        // Disparar evento personalizado para otros componentes
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }
    
    updateIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            // Remover clases existentes
            icon.className = '';
            
            // Agregar nueva clase basada en el tema
            if (this.currentTheme === 'dark') {
                icon.setAttribute('data-lucide', 'sun');
            } else {
                icon.setAttribute('data-lucide', 'moon');
            }
            
            // Reinicializar Lucide icons si está disponible
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    // Método para obtener el tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Método para establecer un tema específico
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.updateIcon();
            localStorage.setItem('theme', theme);
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeToggleInstance = new ThemeToggle();
    });
} else {
    window.themeToggleInstance = new ThemeToggle();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}