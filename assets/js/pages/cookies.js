document.addEventListener('DOMContentLoaded', () => {
    // Manejo de la lógica de aceptación de cookies
    const acceptAllCookiesBtn = document.getElementById('accept-all-cookies');
    const customizeCookiesBtn = document.getElementById('customize-cookies');

    if (acceptAllCookiesBtn) {
        acceptAllCookiesBtn.addEventListener('click', () => {
            alert('Todas las cookies han sido aceptadas.');
            // Aquí se añadiría la lógica real para establecer las cookies
        });
    }

    if (customizeCookiesBtn) {
        customizeCookiesBtn.addEventListener('click', () => {
            alert('Redirigiendo a la configuración de cookies (funcionalidad no implementada).');
            // Aquí se añadiría la lógica para redirigir a una página de personalización de cookies o abrir un modal
        });
    }

    // Manejo de la navegación lateral para resaltar la sección actual
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.cookies-nav .nav-link');

    // Función para mostrar una sección y ocultar las demás
    const showSection = (targetId) => {
        sections.forEach(section => {
            console.log(`Processing section: ${section.id}`);
            if (section.id === targetId) {
                // Mostrar la sección
                section.style.display = 'block';
                section.style.visibility = 'visible';

                // Forzar un reflow para asegurar que scrollHeight es calculado correctamente
                section.style.maxHeight = 'none'; // Temporalmente a none para obtener altura real
                const currentHeight = section.scrollHeight;
                console.log(`Section ${section.id} scrollHeight (visible): ${currentHeight}px`);

                section.style.maxHeight = '0'; // Volver a 0 para animar desde el inicio
                section.offsetHeight; // Forzar reflow de nuevo
                section.style.maxHeight = currentHeight + 'px';
                section.style.opacity = '1';

                section.addEventListener('transitionend', function handler() {
                    if (section.style.opacity === '1') { // Asegurarse de que es la transición de apertura
                        section.style.maxHeight = 'none';
                        console.log(`Section ${section.id} opened.`);
                    }
                    section.removeEventListener('transitionend', handler);
                }, { once: true });

            } else {
                // Ocultar la sección
                console.log(`Hiding section: ${section.id}`);
                section.style.maxHeight = section.scrollHeight + 'px';
                section.offsetHeight; // Forzar reflow
                section.style.maxHeight = '0';
                section.style.opacity = '0';

                section.addEventListener('transitionend', function handler() {
                    if (section.style.opacity === '0') { // Asegurarse de que es la transición de cierre
                        section.style.display = 'none';
                        section.style.visibility = 'hidden';
                        console.log(`Section ${section.id} hidden.`);
                    }
                    section.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav-link--active');
            if (link.getAttribute('href').substring(1) === targetId) {
                link.classList.add('nav-link--active');
            }
        });
    };

    // Mostrar la primera sección por defecto al cargar
    if (sections.length > 0 && navLinks.length > 0) {
        console.log('Showing first section on load:', sections[0].id);
        showSection(sections[0].id);
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Resaltar cuando el 50% de la sección es visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Desactivar temporalmente la lógica del IntersectionObserver
                // si la navegación se realiza por clic para evitar conflictos
                if (!document.body.classList.contains('scrolling-by-click')) {
                    navLinks.forEach(link => {
                        link.classList.remove('nav-link--active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('nav-link--active');
                        }
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Manejar clics en los enlaces de navegación lateral
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.add('scrolling-by-click'); // Indicar que se está desplazando por clic

            const targetId = this.getAttribute('href').substring(1);
            console.log(`Click on: ${targetId}`);
            showSection(targetId);

            // Remover la clase después de un breve tiempo para permitir que el IntersectionObserver vuelva a operar
            setTimeout(() => {
                document.body.classList.remove('scrolling-by-click');
            }, 500); // Ajustar este tiempo si es necesario
        });
    });
});
