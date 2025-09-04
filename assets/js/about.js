/**
 * Script para la página About
 * Maneja animaciones, interacciones y efectos visuales
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones de la línea de tiempo
    initTimeline();
    
    // Inicializar animaciones de scroll
    initScrollAnimations();
    
    // Inicializar tooltips si es necesario
    initTooltips();
    
    // Inicializar partículas para la sección CTA
    initParticles();
});

/**
 * Inicializa las animaciones de la línea de tiempo
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Función para verificar si un elemento es visible en el viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.8) &&
            rect.bottom >= (window.innerHeight * 0.2)
        );
    };
    
    // Función para manejar la visibilidad de los elementos de la línea de tiempo
    const handleTimelineVisibility = () => {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('visible');
            }
        });
    };
    
    // Verificar visibilidad al cargar la página y al hacer scroll
    window.addEventListener('load', handleTimelineVisibility);
    window.addEventListener('scroll', handleTimelineVisibility);
    
    // Inicializar el carrusel de imágenes si existe
    const timelineCarousel = document.querySelector('.timeline-carousel');
    if (timelineCarousel) {
        initTimelineCarousel();
    }
}

/**
 * Inicializa el carrusel de imágenes para la línea de tiempo
 */
function initTimelineCarousel() {
    // Usar una biblioteca como Swiper.js o implementación personalizada
    // Aquí un ejemplo básico con Swiper.js (asegúrate de incluir la biblioteca)
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.timeline-carousel', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }
}

/**
 * Inicializa las animaciones al hacer scroll
 */
function initScrollAnimations() {
    // Configurar el Intersection Observer para animaciones al hacer scroll
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Dejar de observar una vez que se ha animado
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    
    // Observar elementos con la clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Inicializa los tooltips
 */
function initTooltips() {
    // Usar una biblioteca como Tippy.js o implementación personalizada
    // Aquí un ejemplo básico con Tippy.js (asegúrate de incluir la biblioteca)
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]', {
            animation: 'scale-extreme',
            theme: 'dsg',
            arrow: true,
            delay: [100, 0],
            duration: [200, 150],
            interactive: true,
            appendTo: document.body
        });
    }
}

/**
 * Inicializa las partículas para la sección CTA
 */
function initParticles() {
    const ctaSection = document.querySelector('.cta-section');
    if (!ctaSection) return;
    
    // Crear partículas dinámicamente
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'cta-particles';
    
    // Agregar partículas al contenedor
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const size = Math.random() * 8 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Aplicar estilos
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
    
    ctaSection.appendChild(particlesContainer);
}

/**
 * Maneja el scroll suave para los enlaces internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Ajuste para el header fijo
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Maneja el cambio de tema
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Actualizar atributo de tema
    html.setAttribute('data-theme', newTheme);
    
    // Guardar preferencia en localStorage
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) {
        console.error('Error al guardar la preferencia de tema:', e);
    }
    
    // Actualizar el ícono del botón de tema
    updateThemeButton(newTheme);
}

/**
 * Actualiza el ícono del botón de tema
 */
function updateThemeButton(theme) {
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    if (!themeIcons.length) return;
    
    themeIcons.forEach(icon => {
        icon.classList.toggle('hidden', !icon.classList.contains(theme));
    });
}

// Inicializar tema al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar preferencia guardada o usar preferencia del sistema
    let theme = 'light';
    try {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = savedTheme || (prefersDark ? 'dark' : 'light');
    } catch (e) {
        console.error('Error al cargar la preferencia de tema:', e);
    }
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton(theme);
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeButton(newTheme);
    });
});
