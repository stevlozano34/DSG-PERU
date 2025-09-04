// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Mobile menu functionality
    initializeMobileMenu();
    
    // Theme management
    initializeTheme();
});

// Mobile Menu for About Page
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply the theme
    setTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
    }
}

// Demo and navigation functions
function requestDemo() {
    alert('Demo solicitada! Nos pondremos en contacto contigo pronto.');
}

function redirectToLogin() {
    window.location.href = '/DSG/frontend/src/pages/auth/login_prueba.html';
}

function redirectToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'index.html#contacto';
    }
}

// Mobile menu styles
const aboutStyles = document.createElement('style');
aboutStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--background, #ffffff);
            border-top: 1px solid var(--border, #e5e7eb);
            flex-direction: column;
            gap: 0;
            padding: 1rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border, #e5e7eb);
            display: block;
            width: 100%;
        }
        
        .nav-link:last-child {
            border-bottom: none;
        }
        
        .nav-actions {
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border, #e5e7eb);
        }
        
        .nav-toggle {
            display: block;
        }
    }
`;
document.head.appendChild(aboutStyles);

console.log('DSG PERU TECHNOLOGY About Page - Loaded Successfully! 🚀');