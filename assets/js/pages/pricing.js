// Pricing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initPricingPage();
});

function initPricingPage() {
    initBillingToggle();
    initFAQ();
    initPlanComparison();
}

// Billing Toggle (Monthly/Yearly)
function initBillingToggle() {
    const billingToggle = document.getElementById('billingToggle');
    const body = document.body;
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('yearly-active');
            } else {
                body.classList.remove('yearly-active');
            }
        });
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los FAQs
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Abrir el FAQ clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Plan Comparison
function initPlanComparison() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Smooth scroll to pricing section
function scrollToPricing() {
    const pricingSection = document.querySelector('.pricing-plans');
    if (pricingSection) {
        pricingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Plan selection tracking
function selectPlan(planName) {
    console.log(`Plan seleccionado: ${planName}`);
    
    // Aquí puedes agregar lógica para tracking o analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'plan_selected', {
            'plan_name': planName,
            'event_category': 'pricing',
            'event_label': planName
        });
    }
}

// Export functions for global use
window.scrollToPricing = scrollToPricing;
window.selectPlan = selectPlan;