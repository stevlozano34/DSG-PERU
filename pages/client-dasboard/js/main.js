// Función para cambiar el tema
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Alternar entre temas
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeText.textContent = 'Modo Oscuro';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeText.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'light');
    }
}

// Cargar el tema guardado al cargar la página
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.add('fa-sun');
        themeText.textContent = 'Modo Claro';
    } else {
        body.classList.add('dark-theme');
        themeIcon.classList.add('fa-moon');
        themeText.textContent = 'Modo Oscuro';
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileHeader = document.querySelector('.profile-header');
    const profileArrow = document.querySelector('.profile-arrow');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Estado del menú
    let isMenuOpen = false;
    
    // Función para abrir/cerrar el menú lateral
    function toggleSidebar() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            sidebar.classList.add('show');
            if (menuOverlay) {
                menuOverlay.style.display = 'block';
                setTimeout(() => {
                    menuOverlay.style.opacity = '1';
                }, 10);
            }
            document.body.style.overflow = 'hidden';
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        } else {
            sidebar.classList.remove('show');
            if (menuOverlay) {
                menuOverlay.style.opacity = '0';
                setTimeout(() => {
                    menuOverlay.style.display = 'none';
                }, 300);
            }
            document.body.style.overflow = '';
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
        
        // Añadir clase al body para estilos específicos
        document.body.classList.toggle('menu-open', isMenuOpen);
    }
    
    // Función para cerrar el menú
    function closeSidebar() {
        if (isMenuOpen) {
            toggleSidebar();
        }
    }
    
    // Función para abrir/cerrar el menú desplegable del perfil
    function toggleProfileMenu(e) {
        if (e) e.stopPropagation();
        if (!profileDropdown) return;
        
        const isShowing = profileDropdown.classList.contains('show');
        
        // Cerrar otros menús desplegables abiertos
        document.querySelectorAll('.profile-dropdown.show').forEach(menu => {
            if (menu !== profileDropdown) menu.classList.remove('show');
        });
        
        // Alternar el menú actual
        profileDropdown.classList.toggle('show');
        document.body.classList.toggle('profile-menu-open', !isShowing);
        
        // Rotar la flecha con animación suave
        if (profileArrow) {
            profileArrow.style.transition = 'transform 0.3s ease';
            profileArrow.style.transform = isShowing ? 'rotate(0deg)' : 'rotate(180deg)';
        }
        
        e && e.stopPropagation();
    }
    
    // Función para manejar la navegación
    function handleNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const menuItems = document.querySelectorAll('.menu-links a');
        
        // Remover clase 'active' de todos los elementos del menú
        menuItems.forEach(item => {
            item.parentElement.classList.remove('active');
        });
        
        // Encontrar y marcar como activo el elemento del menú correspondiente a la página actual
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
                item.parentElement.classList.add('active');
            }
        });
    }
    
    // Cargar tema guardado
    loadTheme();
    
    // Manejar navegación al cargar la página
    handleNavigation();
    
    // Event Listener para el botón de cambio de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    // Event Listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }
    
    if (profileHeader) {
        profileHeader.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleProfileMenu(e);
        });
    }

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (profileDropdown && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('show');
            document.body.classList.remove('profile-menu-open');
            if (profileArrow) {
                profileArrow.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function() {
        if (profileDropdown && profileDropdown.classList.contains('show')) {
            toggleProfileMenu();
        }
    });
    
    // Cerrar menú al hacer clic en un enlace (para móviles)
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    closeSidebar();
                }
            });
        });
    }
    
    // Cerrar menú al cambiar el tamaño de la ventana (si es necesario)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024 && isMenuOpen) {
                closeSidebar();
            }
        }, 250);
    });
    
    // Prevenir que el clic en el menú desplegable lo cierre
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Inicialización de tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    if (tooltipElements.length > 0) {
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (this.offsetWidth / 2) - (tooltip.offsetWidth / 2)}px`;
                
                this._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }
});
