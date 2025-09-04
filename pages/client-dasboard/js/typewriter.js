document.addEventListener('DOMContentLoaded', function() {
    // Opciones de formato de fecha en español
    const options = { 
        weekday: 'long', // Nombre completo del día (ej: lunes)
        day: 'numeric',  // Día del mes (1-31)
        month: 'long',   // Nombre completo del mes (ej: septiembre)
        year: 'numeric'  // Año (ej: 2023)
    };
    
    // Función para formatear la fecha con la primera letra en mayúscula
    function formatDate() {
        const today = new Date();
        let dateString = today.toLocaleDateString('es-ES', options);
        
        // Poner en mayúscula la primera letra de cada palabra
        dateString = dateString.replace(/\b\w/g, l => l.toUpperCase());
        
        // Corregir la capitalización de 'De' en la fecha
        dateString = dateString.replace(/\bDe\b/g, 'de');
        
        return dateString;
    }
    
    // Función para actualizar la fecha
    function updateDate() {
        const dateElement = document.getElementById('currentDate');
        dateElement.textContent = formatDate();
    }
    
    // Función para el efecto de máquina de escribir
    function typeWriterEffect() {
        const textElement = document.querySelector('.typewriter-text');
        const text = 'BIENVENIDO Rafael A TUS CONFIGURACIONES';
        let i = 0;
        let isDeleting = false;
        let currentText = '';
        let typeSpeed = 100; // Velocidad de escritura
        let deleteSpeed = 50; // Velocidad de borrado
        let waitTime = 2000; // Tiempo de espera entre ciclos
        
        function type() {
            // Si está escribiendo
            if (!isDeleting && i <= text.length) {
                currentText = text.substring(0, i);
                textElement.textContent = currentText;
                i++;
                
                // Si terminó de escribir, esperar y comenzar a borrar
                if (i > text.length) {
                    isDeleting = true;
                    setTimeout(type, waitTime);
                    return;
                }
                
                setTimeout(type, typeSpeed);
            } 
            // Si está borrando
            else if (isDeleting && i >= 0) {
                currentText = text.substring(0, i);
                textElement.textContent = currentText;
                i--;
                
                // Si terminó de borrar, esperar y comenzar de nuevo
                if (i < 0) {
                    isDeleting = false;
                    i = 0;
                    setTimeout(type, typeSpeed);
                    return;
                }
                
                setTimeout(type, deleteSpeed);
            }
        }
        
        // Iniciar la animación
        type();
    }
    
    // Iniciar efectos
    updateDate();
    typeWriterEffect();
    
    // Actualizar la fecha cada minuto (por si cambia el día)
    setInterval(updateDate, 60000);
});
