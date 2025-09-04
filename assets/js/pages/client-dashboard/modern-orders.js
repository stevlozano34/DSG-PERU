// Modern Orders Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Get DOM elements
    const searchInput = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const tableBody = document.getElementById('ordersTableBody');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                row.style.display = shouldShow ? '' : 'none';
                
                if (shouldShow) {
                    row.style.animation = 'fadeIn 0.3s ease-in-out';
                }
            });
        });
    }
    
    // Status filter functionality
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (!filterValue) {
                    row.style.display = '';
                    return;
                }
                
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge) {
                    const statusClass = statusBadge.className;
                    const shouldShow = statusClass.includes(filterValue);
                    row.style.display = shouldShow ? '' : 'none';
                }
            });
        });
    }
    
    // Date filter functionality
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = tableBody.querySelectorAll('tr');
            const today = new Date();
            
            rows.forEach(row => {
                if (!filterValue) {
                    row.style.display = '';
                    return;
                }
                
                const dateCell = row.querySelector('.date-info strong');
                if (dateCell) {
                    const orderDate = new Date(dateCell.textContent);
                    let shouldShow = false;
                    
                    switch (filterValue) {
                        case 'today':
                            shouldShow = orderDate.toDateString() === today.toDateString();
                            break;
                        case 'week':
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                            shouldShow = orderDate >= weekAgo;
                            break;
                        case 'month':
                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                            shouldShow = orderDate >= monthAgo;
                            break;
                    }
                    
                    row.style.display = shouldShow ? '' : 'none';
                }
            });
        });
    }
    
    // View toggle functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            const tableContainer = document.querySelector('.orders-table-container');
            
            if (view === 'grid') {
                // TODO: Implement grid view
                console.log('Grid view not implemented yet');
            } else {
                // Table view is default
                tableContainer.style.display = 'block';
            }
        });
    });
    
    // Action buttons functionality
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const action = this.title;
            const row = this.closest('tr');
            const orderId = row.querySelector('.id-number').textContent;
            
            switch (action) {
                case 'Ver detalles':
                    showOrderDetails(orderId);
                    break;
                case 'Descargar':
                    downloadInvoice(orderId);
                    break;
                case 'Editar':
                    editOrder(orderId);
                    break;
                case 'Más opciones':
                    showMoreOptions(orderId, this);
                    break;
            }
        });
    });
    
    // Add new order button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            showNewOrderModal();
        });
    }
    
    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const direction = this.textContent.includes('Anterior') ? 'prev' : 'next';
                changePage(direction);
            }
        });
    });
    
    // Table row hover effects
    const tableRows = document.querySelectorAll('.orders-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.zIndex = '10';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Auto-refresh data every 30 seconds
    setInterval(refreshOrdersData, 30000);
    
    // Initialize tooltips
    initializeTooltips();
});

// Helper functions
function showOrderDetails(orderId) {
    console.log(`Showing details for order ${orderId}`);
    // TODO: Implement order details modal
    alert(`Detalles del pedido ${orderId}`);
}

function downloadInvoice(orderId) {
    console.log(`Downloading invoice for order ${orderId}`);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `factura-${orderId}.pdf`;
    link.click();
    
    // Show success message
    showNotification('Factura descargada exitosamente', 'success');
}

function editOrder(orderId) {
    console.log(`Editing order ${orderId}`);
    // TODO: Implement edit order modal
    alert(`Editar pedido ${orderId}`);
}

function showMoreOptions(orderId, button) {
    console.log(`Showing more options for order ${orderId}`);
    // TODO: Implement context menu
    alert(`Más opciones para ${orderId}`);
}

function showNewOrderModal() {
    console.log('Showing new order modal');
    // TODO: Implement new order modal
    alert('Crear nuevo pedido');
}

function changePage(direction) {
    console.log(`Changing page: ${direction}`);
    // TODO: Implement pagination logic
    showNotification(`Navegando ${direction === 'next' ? 'siguiente' : 'anterior'} página`, 'info');
}

function refreshOrdersData() {
    console.log('Refreshing orders data...');
    // TODO: Implement data refresh
    // This would typically fetch new data from an API
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            
            Object.assign(tooltip.style, {
                position: 'absolute',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                zIndex: '9999',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
            });
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.tooltipElement = tooltip;
            this.removeAttribute('title');
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.title = this.tooltipElement.textContent;
                this.tooltipElement = null;
            }
        });
    });
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .notification {
        animation: slideIn 0.3s ease-in-out;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);