// Funcionalidad para el acordeón de preguntas frecuentes
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Alternar el item actual
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            } else {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Inicializar Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }
});
