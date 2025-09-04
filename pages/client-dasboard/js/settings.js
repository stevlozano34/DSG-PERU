document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const html = document.documentElement;
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const themeText = themeToggle ? themeToggle.querySelector('span') : null;
    const themeOptions = document.querySelectorAll('.theme-option');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Verificar preferencia del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Cargar tema guardado o usar la preferencia del sistema
    let currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Aplicar tema
    function applyTheme(theme) {
        // Si el tema es 'system', usar la preferencia del sistema
        if (theme === 'system') {
            theme = prefersDarkScheme.matches ? 'dark' : 'light';
            localStorage.setItem('theme', 'system');
        } else {
            localStorage.setItem('theme', theme);
        }
        
        // Aplicar tema al HTML
        html.setAttribute('data-theme', theme);
        body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
        
        // Actualizar botón de tema
        if (themeToggle && themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Cambiar a modo claro';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeText.textContent = 'Cambiar a modo oscuro';
            }
        }
        
        // Actualizar opciones de tema seleccionadas
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // Inicializar tema
    applyTheme(currentTheme);
    
    // Cambiar entre temas
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
    
    // Selección de tema desde las opciones
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
        });
    });
    
    // Navegación entre secciones
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los elementos
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Añadir clase active al elemento clickeado
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Guardar la sección activa en localStorage
            localStorage.setItem('activeSection', sectionId);
        });
    });
    
    // Restaurar sección activa
    const activeSection = localStorage.getItem('activeSection') || 'account';
    const sectionToActivate = document.getElementById(activeSection);
    const navItemToActivate = document.querySelector(`[data-section="${activeSection}"]`);
    
    if (sectionToActivate && navItemToActivate) {
        sectionToActivate.classList.add('active');
        navItemToActivate.classList.add('active');
    } else {
        // Si no hay sección guardada, activar la primera
        sections[0]?.classList.add('active');
        navItems[0]?.classList.add('active');
    }
    
    // Mostrar/ocultar contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Manejar cambios en la preferencia del sistema
    prefersDarkScheme.addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Inicializar tooltips
    const tooltipElements = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.map(function (tooltipEl) {
        return new bootstrap.Tooltip(tooltipEl);
    });
    
    // Manejar envío de formularios
    const formElements = document.querySelectorAll('form');
    formElements.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Deshabilitar botón y mostrar indicador de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
            
            // Simular envío asíncrono
            setTimeout(() => {
                // Aquí iría la lógica real de envío del formulario
                console.log('Formulario enviado:', this.id || 'formulario sin ID');
                
                // Mostrar mensaje de éxito
                showMessage('success', '¡Tus cambios se han guardado correctamente!');
                
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1000);
        });
    });
    
    // Manejar botones de eliminar cuenta
    const deleteAccountBtn = document.querySelector('.btn-outline-danger');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function(e) {
            if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                // Lógica para eliminar la cuenta
                console.log('Cuenta marcada para eliminación');
                // Aquí iría la llamada a la API para eliminar la cuenta
            }
        });
    }
    
    // Inicializar popovers de Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Manejar el menú en dispositivos móviles
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.settings-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
    
    // Manejar cambios en el selector de densidad
    const densitySelect = document.getElementById('density');
    if (densitySelect) {
        const savedDensity = localStorage.getItem('density') || 'comfortable';
        densitySelect.value = savedDensity;
        document.body.setAttribute('data-density', savedDensity);
        
        densitySelect.addEventListener('change', function() {
            const density = this.value;
            document.body.setAttribute('data-density', density);
            localStorage.setItem('density', density);
        });
    }
    
    // Mostrar mensajes de éxito/error
    function showMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show`;
        messageDiv.role = 'alert';
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        `;
        
        const container = document.querySelector('.settings-main') || document.body;
        container.insertBefore(messageDiv, container.firstChild);
        
        // Eliminar automáticamente después de 5 segundos
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 150);
        }, 5000);
    }
    
    // Ejemplo de cómo usar showMessage:
    // showMessage('success', '¡Tus cambios se han guardado correctamente!');
    // showMessage('danger', 'Ha ocurrido un error al guardar los cambios.');
    
});