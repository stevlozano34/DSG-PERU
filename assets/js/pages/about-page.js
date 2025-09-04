/**
 * JS específico para la página About
 * - Carrusel de 3 imágenes
 * - Acciones de CTA: requestDemo y redirectToContact
 * - Inicialización de iconos Lucide
 * Nota: No gestiona tema para evitar conflictos con scripts globales
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos Lucide si está disponible
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    // Inicializar carrusel multi
    initMultiCarousel('#carousel-3img');

    // Exponer funciones CTA en window para uso desde atributos onclick
    window.requestDemo = requestDemo;
    window.redirectToContact = redirectToContact;
  });

  /**
   * Carrusel simple para un contenedor con estructura:
   * .carousel-multi > .carousel-btn.prev + .carousel-track > .carousel-slide + .carousel-btn.next
   */
  function initMultiCarousel(selector) {
    const root = document.querySelector(selector);
    if (!root) return;

    const track = root.querySelector('.carousel-track');
    let slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const btnPrev = root.querySelector('.carousel-btn.prev');
    const btnNext = root.querySelector('.carousel-btn.next');

    if (!track || slides.length === 0) return;

    // Si solo hay una slide, clonar para habilitar desplazamiento suave
    if (slides.length === 1) {
      const clone1 = slides[0].cloneNode(true);
      const clone2 = slides[0].cloneNode(true);
      track.appendChild(clone1);
      track.appendChild(clone2);
      slides = Array.from(root.querySelectorAll('.carousel-slide'));
    }

    let index = 0;

    const update = () => {
      const offset = -index * 100; // cada slide ocupa 100%
      track.style.transform = `translateX(${offset}%)`;
      // Marcar activa para efectos sutiles
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    };

    const goPrev = () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    };

    const goNext = () => {
      index = (index + 1) % slides.length;
      update();
    };

    // Botones
    if (btnPrev) btnPrev.addEventListener('click', goPrev);
    if (btnNext) btnNext.addEventListener('click', goNext);

    // Swipe en móvil
    let startX = 0;
    let isDown = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDown = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        isDown = false;
        dx > 0 ? goPrev() : goNext();
      }
    }, { passive: true });

    track.addEventListener('touchend', () => { isDown = false; }, { passive: true });

    // Accesibilidad: foco y teclado
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    });

    // Respeto a preferencias de movimiento reducido
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let auto = null;
    const startAuto = () => { if (!prefersReduced) auto = setInterval(goNext, 6000); };
    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };

    // Auto-play suave con pausa en hover
    startAuto();
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);

    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto(); else startAuto();
    });

    // Ajuste inicial
    update();
  }

  // CTA: solicitar demo
  function requestDemo() {
    try {
      if (window.gtag) {
        gtag('event', 'request_demo', { page: 'about' });
      }
    } catch (_) {}
    alert('¡Gracias! Hemos recibido tu solicitud de demo. Te contactaremos pronto.');
  }

  // CTA: ir a contacto suave o redirigir
  function redirectToContact() {
    const contactHash = '#contacto';
    const section = document.querySelector(contactHash);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Fallback: redirigir al home con hash de contacto
    const base = '/index.html';
    window.location.href = `${base}${contactHash}`;
  }
})();
