/**
 * Footer Component - Responsive Functionality
 * Handles responsive behavior for the footer component
 */
class Footer {
    constructor() {
        this.footerSections = document.querySelectorAll('.footer-section');
        this.footerBottom = document.querySelector('.footer-bottom');
        this.breakpoint = 768; // Mobile breakpoint in pixels
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleResize();
    }

    setupEventListeners() {
        // Toggle sections on mobile
        this.footerSections.forEach(section => {
            const heading = section.querySelector('h4');
            if (heading) {
                heading.addEventListener('click', () => this.toggleSection(section));
                heading.setAttribute('tabindex', '0'); // Make headings focusable
                heading.setAttribute('role', 'button'); // Add ARIA role
                heading.setAttribute('aria-expanded', 'true'); // ARIA expanded state
                heading.style.cursor = 'pointer'; // Visual feedback
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.tagName === 'H4' && target.closest('.footer-section')) {
                    e.preventDefault();
                    this.toggleSection(target.closest('.footer-section'));
                }
            }
        });

        // Debounce resize events for better performance
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 100);
        });
    }

    toggleSection(section) {
        // Only toggle on mobile
        if (window.innerWidth <= this.breakpoint) {
            const content = Array.from(section.children).filter(
                child => !child.matches('h4')
            );
            const isExpanded = section.getAttribute('aria-expanded') === 'true';
            
            section.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle content visibility with animation
            content.forEach(element => {
                if (isExpanded) {
                    element.style.maxHeight = '0';
                    element.style.opacity = '0';
                    element.style.overflow = 'hidden';
                    element.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                } else {
                    element.style.maxHeight = `${element.scrollHeight}px`;
                    element.style.opacity = '1';
                    element.style.overflow = 'visible';
                }
            });
        }
    }

    handleResize() {
        const isMobile = window.innerWidth <= this.breakpoint;
        
        this.footerSections.forEach(section => {
            const heading = section.querySelector('h4');
            const content = Array.from(section.children).filter(
                child => !child.matches('h4')
            );
            
            if (isMobile) {
                // Mobile styles
                section.style.marginBottom = '0.5rem';
                section.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                
                // Set initial state for mobile
                content.forEach(element => {
                    element.style.maxHeight = '0';
                    element.style.opacity = '0';
                    element.style.overflow = 'hidden';
                    element.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                });
                
                // Set ARIA attributes for mobile
                section.setAttribute('aria-expanded', 'false');
                
            } else {
                // Desktop styles - ensure everything is visible
                section.style.marginBottom = '';
                section.style.borderBottom = '';
                
                content.forEach(element => {
                    element.style.maxHeight = '';
                    element.style.opacity = '';
                    element.style.overflow = '';
                    element.style.transition = '';
                });
                
                // Reset ARIA attributes for desktop
                section.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Adjust footer bottom padding based on viewport
        if (this.footerBottom) {
            this.footerBottom.style.paddingTop = isMobile ? '1.5rem' : '2rem';
        }
    }
}

// Initialize the footer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const footer = new Footer();
    
    // Expose to window for debugging if needed
    window.footerComponent = footer;
});
