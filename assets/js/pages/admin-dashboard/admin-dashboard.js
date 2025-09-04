// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupSidebar();
        this.setupCharts();
        this.setupFilters();
        this.setupAnimations();
        this.loadTheme();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            // Add transition effect
            body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        body.setAttribute('data-theme', savedTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Sidebar Management
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            
            // Add overlay for mobile
            if (window.innerWidth <= 1024) {
                this.toggleOverlay();
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                this.removeOverlay();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('open');
                this.removeOverlay();
            }
        });
    }

    toggleOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(overlay);
            
            // Trigger animation
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
        }
    }

    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    // Charts Setup
    setupCharts() {
        this.createFocusChart();
    }

    createFocusChart() {
        const canvas = document.getElementById('focusChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 120;

        // Sample data for focus chart (bar chart)
        const data = [65, 45, 80, 70, 90, 75, 85];
        const maxValue = Math.max(...data);
        const barWidth = 20;
        const barSpacing = 8;
        const chartHeight = 80;
        const chartTop = 20;

        // Get current theme colors
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const barColor = isDark ? '#ff6b35' : '#007bff';
        const backgroundColor = isDark ? '#404040' : '#e9ecef';

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = index * (barWidth + barSpacing) + 10;
            const y = chartTop + chartHeight - barHeight;

            // Background bar
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, chartTop, barWidth, chartHeight);

            // Data bar
            ctx.fillStyle = barColor;
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    // Filter Management
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const activityItems = document.querySelectorAll('.activity-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.textContent.toLowerCase();
                
                // Filter activities
                activityItems.forEach(item => {
                    const status = item.querySelector('.activity-status');
                    const statusText = status.textContent.toLowerCase();
                    
                    if (filter === 'all' || statusText.includes(filter)) {
                        item.style.display = 'block';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Animations
    setupAnimations() {
        // Animate cards on load
        const cards = document.querySelectorAll('.stat-card, .team-section, .activities-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            observer.observe(card);
        });

        // Animate numbers
        this.animateNumbers();
    }

    animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number, .stat-value');
        
        numbers.forEach(number => {
            const target = parseInt(number.textContent);
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.textContent = Math.floor(current) + (number.textContent.includes('%') ? '%' : '');
            }, 30);
        });
    }

    // Utility Methods
    updateChart() {
        // Re-create chart when theme changes
        setTimeout(() => {
            this.createFocusChart();
        }, 100);
    }

    // Real-time updates simulation
    startRealTimeUpdates() {
        setInterval(() => {
            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const count = Math.floor(Math.random() * 10);
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }

            // Update some stats randomly
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (Math.random() > 0.95) { // 5% chance to update
                    const currentValue = parseInt(stat.textContent);
                    const change = Math.floor(Math.random() * 10) - 5;
                    const newValue = Math.max(0, currentValue + change);
                    stat.textContent = newValue;
                }
            });
        }, 5000); // Update every 5 seconds
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AdminDashboard();
    
    // Start real-time updates
    dashboard.startRealTimeUpdates();
    
    // Update chart when theme changes
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                dashboard.updateChart();
            }, 100);
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}