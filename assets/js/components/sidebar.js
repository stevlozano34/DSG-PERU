// Sidebar Component Mejorado - DSG Dashboard

class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.overlay = null;
        this.isCollapsed = false;
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.bindEvents();
        this.handleResize();
        this.setActiveLink(this.currentPage);
        this.initializeAnimations();
        
        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', () => this.handleResize());
        
        // Inicializar tooltips para elementos del sidebar
        this.initializeTooltips();
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(this.overlay);
        
        this.overlay.addEventListener('click', () => this.closeMobile());
    }
    
    bindEvents() {
        // Toggle para móvil
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobile());
        }
        
        // Toggle para cerrar en móvil
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.closeMobile());
        }
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileOpen()) {
                this.closeMobile();
            }
        });
        
        // Manejar clics en enlaces de navegación
        const navLinks = this.sidebar?.querySelectorAll('.nav-link');
        navLinks?.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e, link);
            });
            
            // Efecto hover mejorado
            link.addEventListener('mouseenter', () => this.handleLinkHover(link, true));
            link.addEventListener('mouseleave', () => this.handleLinkHover(link, false));
        });
        
        // Manejar clics en botones de acción rápida
        const quickActionBtns = this.sidebar?.querySelectorAll('.quick-action-btn');
        quickActionBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e, btn));
        });
        
        // Manejar clic en botón de upgrade
        const upgradeBtn = this.sidebar?.querySelector('.upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', (e) => this.handleUpgrade(e));
        }
        
        // Efectos de hover para widgets
        const widgets = this.sidebar?.querySelectorAll('.widget');
        widgets?.forEach(widget => {
            widget.addEventListener('mouseenter', () => this.handleWidgetHover(widget, true));
            widget.addEventListener('mouseleave', () => this.handleWidgetHover(widget, false));
        });
    }
    
    handleNavLinkClick(e, link) {
        // Remover clase active de todos los enlaces
        const navLinks = this.sidebar?.querySelectorAll('.nav-link');
        navLinks?.forEach(l => l.classList.remove('active'));
        
        // Agregar clase active al enlace clickeado
        link.classList.add('active');
        
        // Efecto de click
        this.addClickEffect(link);
        
        // Cerrar sidebar en móvil después de hacer clic
        if (window.innerWidth <= 768) {
            setTimeout(() => this.closeMobile(), 300);
        }
    }
    
    handleLinkHover(link, isHovering) {
        if (isHovering) {
            link.style.transform = 'translateX(8px)';
        } else {
            link.style.transform = link.classList.contains('active') ? 'translateX(4px)' : 'translateX(0)';
        }
    }
    
    handleQuickAction(e, btn) {
        e.preventDefault();
        
        // Efecto de click
        this.addClickEffect(btn);
        
        // Simular acción
        const action = btn.querySelector('span').textContent;
        console.log(`Acción rápida: ${action}`);
        
        // Mostrar notificación
        this.showNotification(`Acción ejecutada: ${action}`, 'success');
    }
    
    handleUpgrade(e) {
        e.preventDefault();
        
        // Efecto de click
        this.addClickEffect(e.currentTarget);
        
        // Simular proceso de upgrade
        this.showNotification('Redirigiendo a página de upgrade...', 'info');
        
        setTimeout(() => {
            // Aquí iría la lógica real de upgrade
            console.log('Proceso de upgrade iniciado');
        }, 1000);
    }
    
    handleWidgetHover(widget, isHovering) {
        if (isHovering) {
            widget.style.transform = 'translateY(-4px)';
            widget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
        } else {
            widget.style.transform = 'translateY(0)';
            widget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        }
    }
    
    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 100);
    }
    
    initializeAnimations() {
        // Animar elementos del sidebar al cargar
        const navItems = this.sidebar?.querySelectorAll('.nav-item');
        const widgets = this.sidebar?.querySelectorAll('.widget');
        
        // Animar elementos de navegación
        navItems?.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
        
        // Animar widgets
        widgets?.forEach((widget, index) => {
            widget.style.opacity = '0';
            widget.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                widget.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                widget.style.opacity = '1';
                widget.style.transform = 'translateY(0)';
            }, (navItems?.length || 0) * 100 + index * 150);
        });
    }
    
    initializeTooltips() {
        // Crear tooltips para elementos del sidebar
        const elementsWithTooltips = this.sidebar?.querySelectorAll('[data-tooltip]');
        elementsWithTooltips?.forEach(element => {
            this.createTooltip(element);
        });
    }
    
    createTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            this.positionTooltip(tooltip, element);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
    
    positionTooltip(tooltip, element) {
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.right + 10 + 'px';
        tooltip.style.top = rect.top + (rect.height / 2) + 'px';
        tooltip.style.transform = 'translateY(-50%)';
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `sidebar-notification ${type}`;
        notification.textContent = message;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Colores según tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    toggleMobile() {
        if (this.isMobileOpen()) {
            this.closeMobile();
        } else {
            this.openMobile();
        }
    }
    
    openMobile() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('open');
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        
        // Animar entrada
        this.sidebar.style.transform = 'translateX(0)';
    }
    
    closeMobile() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('open');
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
        
        // Animar salida
        this.sidebar.style.transform = 'translateX(-100%)';
    }
    
    isMobileOpen() {
        return this.sidebar?.classList.contains('open') || false;
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobile();
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'dashboard';
    }
    
    // Método para establecer el enlace activo programáticamente
    setActiveLink(href) {
        const navLinks = this.sidebar?.querySelectorAll('.nav-link');
        navLinks?.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === href || 
                link.getAttribute('href')?.includes(href)) {
                link.classList.add('active');
            }
        });
    }
    
    // Método para obtener el enlace activo actual
    getActiveLink() {
        return this.sidebar?.querySelector('.nav-link.active');
    }
    
    // Método para colapsar/expandir sidebar
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar?.classList.add('collapsed');
        } else {
            this.sidebar?.classList.remove('collapsed');
        }
    }
    
    // Método para actualizar contadores
    updateCounter(page, count) {
        const counter = this.sidebar?.querySelector(`[data-page="${page}"] .nav-counter`);
        if (counter) {
            counter.textContent = count;
            counter.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                counter.style.animation = '';
            }, 600);
        }
    }
    
    // Método para mostrar/ocultar badges
    toggleBadge(page, show, type = 'default') {
        const link = this.sidebar?.querySelector(`[data-page="${page}"]`);
        if (link) {
            let badge = link.querySelector('.nav-badge');
            
            if (show && !badge) {
                badge = document.createElement('div');
                badge.className = `nav-badge ${type}`;
                badge.textContent = type === 'urgent' ? 'Urgente' : 'Nuevo';
                link.appendChild(badge);
            } else if (!show && badge) {
                badge.remove();
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sidebarInstance = new Sidebar();
    });
} else {
    window.sidebarInstance = new Sidebar();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sidebar;
}