// Modern Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Generate work activity calendar
    generateActivityCalendar();
    
    // Initialize progress rings
    initializeProgressRings();
    
    // Add click handlers
    initializeClickHandlers();
});

function generateActivityCalendar() {
    const activityGrid = document.querySelector('.activity-grid');
    if (!activityGrid) return;
    
    // Generate 7x8 grid (56 days)
    for (let i = 0; i < 56; i++) {
        const day = document.createElement('div');
        day.className = 'activity-day';
        
        // Random activity level (0-4)
        const level = Math.floor(Math.random() * 5);
        day.setAttribute('data-level', level);
        
        activityGrid.appendChild(day);
    }
    
    // Add CSS for activity days
    const style = document.createElement('style');
    style.textContent = `
        .activity-day {
            width: 100%;
            height: 20px;
            border-radius: 3px;
            background: #1a1a1a;
            transition: all 0.2s ease;
        }
        
        .activity-day[data-level="1"] { background: #0d4f3c; }
        .activity-day[data-level="2"] { background: #196c4e; }
        .activity-day[data-level="3"] { background: #239a5b; }
        .activity-day[data-level="4"] { background: #2dd4bf; }
        
        .activity-day:hover {
            transform: scale(1.1);
            z-index: 10;
        }
    `;
    document.head.appendChild(style);
}

function initializeProgressRings() {
    const rings = document.querySelectorAll('.progress-ring-fill');
    
    rings.forEach(ring => {
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;
        
        // Animate to 60% (representing 41B hours)
        setTimeout(() => {
            const offset = circumference - (0.6 * circumference);
            ring.style.strokeDashoffset = offset;
        }, 500);
    });
}

function initializeClickHandlers() {
    // Play button functionality
    const playBtn = document.querySelector('.play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                this.style.background = '#ef4444';
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                this.style.background = '#10b981';
            }
        });
    }
    
    // View controls
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Add some interactive features
function addInteractiveFeatures() {
    // Hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize interactive features
addInteractiveFeatures();