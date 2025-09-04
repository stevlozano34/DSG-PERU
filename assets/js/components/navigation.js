// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Theme management
    initializeTheme();
    
    // Navbar functionality
    initializeNavbar();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Form handling
    initializeContactForm();
    
    // Animations
    initializeAnimations();
    
    // Mobile menu
    initializeMobileMenu();
    
    // Login dropdown - AGREGAR ESTA LÍNEA
    initializeLoginDropdown();
    
    // Services dropdown (text-link trigger)
    initializeServicesDropdown();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply the theme
    setTheme(currentTheme);
    
    // Theme toggle event listener for desktop
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Theme toggle event listener for mobile
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent menu toggle when clicking theme button
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    function setTheme(theme) {
        const themeIcons = document.querySelectorAll('.theme-icon');
        
        if (theme === 'dark') {
            // Aplica atributo global y clase por compatibilidad
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            themeIcons.forEach(icon => {
                icon.setAttribute('data-lucide', 'sun');
            });
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark');
            themeIcons.forEach(icon => {
                icon.setAttribute('data-lucide', 'moon');
            });
        }
        lucide.createIcons();
    }
}

// Navbar Functionality
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Update active nav link based on scroll position
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    // Initialize menu state
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Toggle menu on button click
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            if (mobileMenu) {
                if (isExpanded) {
                    mobileMenu.classList.remove('active');
                    if (mobileOverlay) mobileOverlay.classList.remove('active');
                } else {
                    mobileMenu.classList.add('active');
                    if (mobileOverlay) mobileOverlay.classList.add('active');
                }
            }
            
            // Update button state
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle body scroll
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
            
            // Update icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', !isExpanded ? 'x' : 'menu');
                lucide.createIcons();
            }
        });
        
        // Close menu when clicking on overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Close menu when clicking on a link
        if (mobileMenu) {
            mobileMenu.addEventListener('click', function(e) {
                if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
                    closeMenu();
                }
            });
        }
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    function closeMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Update icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
        
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        
        document.body.style.overflow = '';
    }
}
// Smooth Scrolling
function initializeSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                nombre: formData.get('name'),
                email: formData.get('email'),
                empresa: formData.get('company'),
                telefono: formData.get('phone'),
                asunto: formData.get('subject'),
                mensaje: formData.get('message')
            };
            
            // Validate form
            if (validateContactForm(data)) {
                await submitContactForm(data, contactForm);
            }
        });
    }
}

// Submit contact form
async function submitContactForm(data, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span>Enviando...</span>';
        submitButton.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/api/contact/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset();
        } else {
            showNotification(result.message || 'Error al enviar el mensaje', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión. Por favor, intenta nuevamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons();
    }
}

// Enhanced Demo Request Function
async function requestDemo() {
    // Create and show demo modal
    const modalHTML = `
        <div class="modal-overlay" id="demo-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Solicitar Demo Gratuita</h3>
                    <button class="modal-close" onclick="closeDemoModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <form id="demo-form" class="demo-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="demo-name">Nombre completo *</label>
                            <input type="text" id="demo-name" name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="demo-email">Email *</label>
                            <input type="email" id="demo-email" name="email" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="demo-empresa">Empresa</label>
                            <input type="text" id="demo-empresa" name="empresa">
                        </div>
                        <div class="form-group">
                            <label for="demo-telefono">Teléfono</label>
                            <input type="tel" id="demo-telefono" name="telefono">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="demo-tipo">Tipo de Negocio</label>
                        <select id="demo-tipo" name="tipoNegocio">
                            <option value="restaurante">Restaurante</option>
                            <option value="botica">Botica/Farmacia</option>
                            <option value="minimarket">Minimarket</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="demo-fecha">Fecha Preferida</label>
                            <input type="date" id="demo-fecha" name="fechaPreferida" min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label for="demo-hora">Hora Preferida</label>
                            <input type="time" id="demo-hora" name="horaPreferida">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="demo-mensaje">Mensaje adicional</label>
                        <textarea id="demo-mensaje" name="mensaje" rows="3" placeholder="Cuéntanos más sobre tu negocio y qué te gustaría ver en la demo..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeDemoModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i data-lucide="send"></i>
                            <span>Solicitar Demo</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
    
    // Handle form submission
    const demoForm = document.getElementById('demo-form');
    demoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitDemoRequest(new FormData(demoForm), demoForm);
    });
}

// Submit demo request
async function submitDemoRequest(formData, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span>Enviando...</span>';
        submitButton.disabled = true;
        
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            empresa: formData.get('empresa'),
            telefono: formData.get('telefono'),
            tipoNegocio: formData.get('tipoNegocio'),
            fechaPreferida: formData.get('fechaPreferida'),
            horaPreferida: formData.get('horaPreferida'),
            mensaje: formData.get('mensaje')
        };
        
        const response = await fetch(`${API_BASE_URL}/api/contact/demo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('¡Demo solicitado exitosamente! Te contactaremos pronto.', 'success');
            closeDemoModal();
            // Scroll to contact section after a delay
            setTimeout(() => {
                scrollToSection('contacto');
            }, 1000);
        } else {
            showNotification(result.message || 'Error al solicitar el demo', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión. Por favor, intenta nuevamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons();
    }
}

// Close demo modal
function closeDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced contact form validation
function validateContactForm(data) {
    if (!data.nombre || data.nombre.trim().length < 2) {
        showNotification('Por favor, ingresa un nombre válido', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return false;
    }
    
    if (!data.mensaje || data.mensaje.trim().length < 10) {
        showNotification('Por favor, ingresa un mensaje de al menos 10 caracteres', 'error');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'alert-circle';
        case 'warning': return 'alert-triangle';
        default: return 'info';
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card, .reason-card, .industry-card, .mv-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const suffix = counter.textContent.replace(/[\d]/g, '');
                
                animateCounter(counter, 0, target, 2000, suffix);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, suffix = '') {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

//Función requestDemo
function requestDemo() {
    showNotification('¡Excelente! Te contactaremos pronto para programar tu demo gratuita.', 'success');
    
    // Scroll to contact section
    setTimeout(() => {
        scrollToSection('contacto');
    }, 1000);
}

// Función mejorada para el dropdown de login
function initializeLoginDropdown() {
    // Desktop login dropdown
    const loginDropdownBtn = document.getElementById('login-dropdown-btn');
    const loginDropdownMenu = document.getElementById('login-dropdown-menu');
    
    // Mobile login dropdown
    const mobileLoginBtn = document.getElementById('mobile-login-dropdown-btn');
    const mobileLoginMenu = document.getElementById('mobile-login-dropdown-menu');

    // Function to handle dropdown toggle
    function toggleDropdown(button, menu) {
        if (button && menu) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('show');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(item => {
                    if (item !== menu) {
                        item.classList.remove('show');
                    }
                });
            });
        }
    }

    // Initialize desktop dropdown
    toggleDropdown(loginDropdownBtn, loginDropdownMenu);
    
    // Initialize mobile dropdown
    toggleDropdown(mobileLoginBtn, mobileLoginMenu);

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (loginDropdownBtn && !loginDropdownBtn.contains(e.target) && 
            loginDropdownMenu && !loginDropdownMenu.contains(e.target)) {
            loginDropdownMenu.classList.remove('show');
        }
        
        if (mobileLoginBtn && !mobileLoginBtn.contains(e.target) && 
            mobileLoginMenu && !mobileLoginMenu.contains(e.target)) {
            mobileLoginMenu.classList.remove('show');
        }
    });

    // Cerrar menú al hacer clic en un ítem (para ambos menús)
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            if (loginDropdownMenu) loginDropdownMenu.classList.remove('show');
            if (mobileLoginMenu) mobileLoginMenu.classList.remove('show');
        });
    });
}

// Dropdown de Servicios (texto como trigger)
function initializeServicesDropdown() {
    const triggers = document.querySelectorAll('.nav-dropdown .nav-link-dropdown');
    
    triggers.forEach(trigger => {
        const wrapper = trigger.closest('.nav-dropdown');
        const menu = wrapper ? wrapper.querySelector('.dropdown-menu') : null;
        
        if (!trigger || !menu || !wrapper) return;
        
        // Toggle on click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Cerrar otros dropdowns abiertos
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                if (dropdown !== wrapper) {
                    dropdown.classList.remove('open', 'active');
                }
            });
            
            // Alternar el estado del dropdown actual
            const isOpen = wrapper.classList.toggle('open');
            wrapper.classList.toggle('active', isOpen);
            
            if (isOpen) {
                lucide.createIcons();
            }
        });
        
        // Manejar clics en los ítems del menú
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                wrapper.classList.remove('open', 'active');
                // Si es un enlace, permite la navegación
                if (item.href) {
                    window.location.href = item.href;
                }
            }
        });
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('open', 'active');
            });
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('open', 'active');
            });
        }
    });
}

// Función mejorada para redirección
function redirectToClientLogin() {
    window.location.href = '/DSG/frontend/pages/pages/auth/login_prueba.html';
}

function redirectToAdminLogin() {
    window.location.href = '/DSG/frontend/pages/pages/auth/admin_login.html';
}

function redirectToContact() {
    if (window.location.pathname.includes('about.html')) {
        window.location.href = 'index.html#contacto';
    } else {
        scrollToSection('contacto');
    }
}

// Service card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.service-btn')) {
        const serviceCard = e.target.closest('.service-card');
        const serviceTitle = serviceCard.querySelector('.service-title').textContent;
        
        // Show service details or redirect
        showNotification(`Más información sobre: ${serviceTitle}`, 'info');
        
        // You can add more specific actions here
        setTimeout(() => {
            scrollToSection('contacto');
        }, 1500);
    }
});

// Industry card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.industry-card')) {
        const industryCard = e.target.closest('.industry-card');
        const industryTitle = industryCard.querySelector('h3').textContent;
        
        // Show industry-specific information
        showNotification(`Soluciones especializadas para: ${industryTitle}`, 'info');
        
        // Redirect to contact with industry context
        setTimeout(() => {
            scrollToSection('contacto');
        }, 1500);
    }
});

// Floating animation for hero elements
function startFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Start floating animation when page loads
window.addEventListener('load', startFloatingAnimation);

// Enhanced hover effects for cards
document.querySelectorAll('.service-card, .feature-item, .pricing-card, .reason-card, .industry-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
});

// Enhanced hover effects for interactive elements
document.addEventListener('mouseenter', function(e) {
    if (e.target.matches('.btn, .nav-link, .social-link')) {
        e.target.style.transform = 'scale(1.05)';
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target.matches('.btn, .nav-link, .social-link')) {
        e.target.style.transform = 'scale(1)';
    }
}, true);

// Enhanced scroll-to-top functionality
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        if (scrollTop > 300) {
            scrollToTopBtn.style.display = 'flex';
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (scrollTop <= 300) {
                    scrollToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }
});

// Scroll to top button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('#scroll-to-top')) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Add CSS animations and styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--background);
            border-top: 1px solid var(--border);
            flex-direction: column;
            gap: 0;
            padding: var(--spacing-lg);
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
            opacity: 0;
            visibility: hidden;
        }
        
        .nav-menu.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: var(--spacing-md) 0;
            border-bottom: 1px solid var(--border);
            display: block;
            width: 100%;
        }
        
        .nav-link:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Timeline animations for about page
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Initialize timeline animations if on about page
if (window.location.pathname.includes('about.html')) {
    initializeTimelineAnimations();
}

console.log('DSG PERU TECHNOLOGY Landing Page - Loaded Successfully! 🚀');