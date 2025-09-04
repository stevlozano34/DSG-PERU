// Documentation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.docs-nav-link');
    const sections = document.querySelectorAll('.docs-section');
    const currentSection = document.getElementById('current-section');
    const searchInput = document.getElementById('docs-search');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active states
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                this.classList.add('active');
                targetSection.classList.add('active');
                
                // Update breadcrumb
                currentSection.textContent = this.textContent;
                
                // Scroll to top of content
                document.querySelector('.docs-content').scrollTop = 0;
            }
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        navLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const listItem = link.closest('.docs-nav-item');
            
            if (text.includes(searchTerm) || searchTerm === '') {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        });
    });
    
    // Smooth scrolling for anchor links within sections
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Copy code blocks on click
    document.querySelectorAll('pre code').forEach(block => {
        block.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent).then(() => {
                // Show temporary feedback
                const originalBg = this.style.backgroundColor;
                this.style.backgroundColor = 'var(--success-color)';
                this.style.transition = 'background-color 0.3s ease';
                
                setTimeout(() => {
                    this.style.backgroundColor = originalBg;
                }, 1000);
            });
        });
    });
});