
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const updateStatusBtn = document.getElementById('update-status');
    const contactSupportBtn = document.getElementById('contact-support');
    
    // Datos de ejemplo (en un caso real, estos vendrían de una API)
    const serviceData = {
        ticketNumber: '#DSG-2023-001',
        requestDate: new Date('2023-08-21'),
        serviceType: 'Mantenimiento Preventivo',
        assignedTech: 'Juan Pérez',
        status: 'En Proceso',
        updates: [
            {
                status: 'En Proceso',
                description: 'El técnico está trabajando en su equipo',
                date: new Date()
            },
            {
                status: 'En Revisión',
                description: 'El equipo está siendo diagnosticado',
                date: new Date(Date.now() - 86400000) // Ayer
            },
            {
                status: 'Recibido',
                description: 'Hemos recibido su equipo',
                date: new Date(Date.now() - 2 * 86400000) // Anteayer
            }
        ]
    };

    // Función para formatear fechas
    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    // Función para actualizar la interfaz con los datos
    function updateUI() {
        // Actualizar detalles del servicio
        document.getElementById('ticket-number').textContent = serviceData.ticketNumber;
        document.getElementById('request-date').textContent = formatDate(serviceData.requestDate);
        document.getElementById('service-type').textContent = serviceData.serviceType;
        document.getElementById('assigned-tech').textContent = serviceData.assignedTech;
        
        // Actualizar estado actual
        const statusBadge = document.querySelector('.status-badge');
        statusBadge.textContent = serviceData.status;
        
        // Actualizar línea de tiempo
        const timeline = document.querySelector('.timeline');
        timeline.innerHTML = ''; // Limpiar timeline existente
        
        serviceData.updates.forEach((update, index) => {
            const isActive = index === 0; // El primer elemento está activo
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${isActive ? 'active' : ''}`;
            
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${update.status}</h4>
                    <p>${update.description}</p>
                    <span class="timeline-date">${formatDate(update.date)}</span>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
    }

    // Manejador para el botón de actualizar estado
    updateStatusBtn.addEventListener('click', function() {
        // Simular una actualización de estado
        const newUpdate = {
            status: 'Actualización',
            description: 'Se ha actualizado el estado de su servicio',
            date: new Date()
        };
        
        // Agregar la nueva actualización al principio del array
        serviceData.updates.unshift(newUpdate);
        
        // Actualizar la interfaz
        updateUI();
        
        // Mostrar notificación
        showNotification('¡Estado actualizado correctamente!');
    });

    // Manejador para el botón de contacto con soporte
    contactSupportBtn.addEventListener('click', function() {
        // Redirigir a la página de contacto o mostrar un formulario modal
        showNotification('Redirigiendo al soporte...');
        // En un caso real, redirigiría a la página de contacto
        window.location.href = '/pages/public/help/support.html';
    });

    // Función para mostrar notificaciones
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 24px';
        notification.style.backgroundColor = '#000000';
        notification.style.color = '#ffffff';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s ease';
        
        // Agregar al documento
        document.body.appendChild(notification);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Inicializar la interfaz
    updateUI();
});
