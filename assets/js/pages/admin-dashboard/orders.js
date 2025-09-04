// Orders Page JavaScript

class OrdersManager {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentDate = '';
        this.init();
    }

    init() {
        this.loadOrders();
        this.initFilters();
        this.initSearch();
        this.initActions();
        this.initNotifications();
        this.animateStats();
        this.startRealTimeUpdates();
    }

    loadOrders() {
        // Simulated orders data
        this.orders = [
            {
                id: 'ORD-001',
                customer: { name: 'Juan Pérez', avatar: '../../assets/images/hero/user1.jpg' },
                products: 3,
                total: 245.99,
                status: 'processing',
                date: '2024-01-15',
                items: ['Producto Premium', 'Servicio Básico', 'Consultoría']
            },
            {
                id: 'ORD-002',
                customer: { name: 'María García', avatar: '../../assets/images/hero/user2.jpg' },
                products: 1,
                total: 89.50,
                status: 'delivered',
                date: '2024-01-14',
                items: ['Producto Estándar']
            },
            {
                id: 'ORD-003',
                customer: { name: 'Carlos López', avatar: '../../assets/images/hero/user3.jpg' },
                products: 2,
                total: 156.75,
                status: 'pending',
                date: '2024-01-13',
                items: ['Servicio Premium', 'Addon Extra']
            },
            {
                id: 'ORD-004',
                customer: { name: 'Ana Martínez', avatar: '../../assets/images/hero/user4.jpg' },
                products: 4,
                total: 320.00,
                status: 'shipped',
                date: '2024-01-12',
                items: ['Producto A', 'Producto B', 'Producto C', 'Producto D']
            },
            {
                id: 'ORD-005',
                customer: { name: 'Roberto Silva', avatar: '../../assets/images/hero/user5.jpg' },
                products: 1,
                total: 75.25,
                status: 'cancelled',
                date: '2024-01-11',
                items: ['Servicio Básico']
            }
        ];
        
        this.filteredOrders = [...this.orders];
        this.renderOrders();
    }

    initFilters() {
        const statusFilter = document.querySelector('.filter-select');
        const dateFilter = document.querySelector('.filter-date');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value.toLowerCase().replace(' ', '');
                this.applyFilters();
            });
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.currentDate = e.target.value;
                this.applyFilters();
            });
        }
    }

    initSearch() {
        const searchInput = document.querySelector('.search-box input');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredOrders = this.orders.filter(order => {
            const matchesStatus = this.currentFilter === 'all' || 
                                this.currentFilter === 'todoslosestados' || 
                                order.status === this.currentFilter;
            
            const matchesSearch = this.currentSearch === '' || 
                                order.id.toLowerCase().includes(this.currentSearch) ||
                                order.customer.name.toLowerCase().includes(this.currentSearch);
            
            const matchesDate = this.currentDate === '' || order.date === this.currentDate;
            
            return matchesStatus && matchesSearch && matchesDate;
        });
        
        this.renderOrders();
        this.updateStats();
    }

    renderOrders() {
        const tbody = document.querySelector('.orders-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.filteredOrders.forEach(order => {
            const row = this.createOrderRow(order);
            tbody.appendChild(row);
        });
        
        // Add animation to new rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    createOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>
                <div class="customer-info">
                    <img src="${order.customer.avatar}" alt="Cliente" onerror="this.src='../../assets/images/hero/user-avatar.jpg'">
                    <span>${order.customer.name}</span>
                </div>
            </td>
            <td>${order.products} producto${order.products > 1 ? 's' : ''}</td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
            <td><span class="status-badge ${order.status}">${this.getStatusText(order.status)}</span></td>
            <td>${this.formatDate(order.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Ver" onclick="ordersManager.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Editar" onclick="ordersManager.editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Imprimir" onclick="ordersManager.printOrder('${order.id}')">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn-icon" title="Más acciones" onclick="ordersManager.showMoreActions('${order.id}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'processing': 'Procesando',
            'shipped': 'Enviado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    initActions() {
        // New Order button
        const newOrderBtn = document.querySelector('.btn-primary');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                this.createNewOrder();
            });
        }
        
        // Export button
        const exportBtn = document.querySelector('.btn-secondary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportOrders();
            });
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        this.showModal('Ver Pedido', `
            <div class="order-details">
                <h4>Pedido #${order.id}</h4>
                <div class="order-info">
                    <p><strong>Cliente:</strong> ${order.customer.name}</p>
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                    <p><strong>Estado:</strong> ${this.getStatusText(order.status)}</p>
                    <p><strong>Fecha:</strong> ${this.formatDate(order.date)}</p>
                </div>
                <div class="order-items">
                    <h5>Productos:</h5>
                    <ul>
                        ${order.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `);
    }

    editOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        this.showModal('Editar Pedido', `
            <div class="edit-order-form">
                <h4>Editar Pedido #${order.id}</h4>
                <form id="editOrderForm">
                    <div class="form-group">
                        <label>Estado:</label>
                        <select name="status" value="${order.status}">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Procesando</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="ordersManager.closeModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `);
        
        document.getElementById('editOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.updateOrderStatus(orderId, formData.get('status'));
        });
    }

    updateOrderStatus(orderId, newStatus) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = newStatus;
            this.applyFilters();
            this.closeModal();
            this.showNotification(`Estado del pedido #${orderId} actualizado a ${this.getStatusText(newStatus)}`, 'success');
        }
    }

    printOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        // Create printable content
        const printContent = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h2>Pedido #${order.id}</h2>
                <p><strong>Cliente:</strong> ${order.customer.name}</p>
                <p><strong>Fecha:</strong> ${this.formatDate(order.date)}</p>
                <p><strong>Estado:</strong> ${this.getStatusText(order.status)}</p>
                <h3>Productos:</h3>
                <ul>
                    ${order.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
            </div>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        
        this.showNotification(`Pedido #${orderId} enviado a imprimir`, 'info');
    }

    showMoreActions(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        this.showModal('Acciones Adicionales', `
            <div class="more-actions">
                <h4>Pedido #${order.id}</h4>
                <div class="action-list">
                    <button class="action-item" onclick="ordersManager.duplicateOrder('${orderId}')">
                        <i class="fas fa-copy"></i>
                        Duplicar Pedido
                    </button>
                    <button class="action-item" onclick="ordersManager.sendEmail('${orderId}')">
                        <i class="fas fa-envelope"></i>
                        Enviar Email
                    </button>
                    <button class="action-item" onclick="ordersManager.addNote('${orderId}')">
                        <i class="fas fa-sticky-note"></i>
                        Agregar Nota
                    </button>
                    <button class="action-item danger" onclick="ordersManager.deleteOrder('${orderId}')">
                        <i class="fas fa-trash"></i>
                        Eliminar Pedido
                    </button>
                </div>
            </div>
        `);
    }

    duplicateOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const newOrder = {
            ...order,
            id: `ORD-${String(this.orders.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        this.orders.unshift(newOrder);
        this.applyFilters();
        this.closeModal();
        this.showNotification(`Pedido duplicado como #${newOrder.id}`, 'success');
    }

    deleteOrder(orderId) {
        if (confirm(`¿Estás seguro de que quieres eliminar el pedido #${orderId}?`)) {
            this.orders = this.orders.filter(o => o.id !== orderId);
            this.applyFilters();
            this.closeModal();
            this.showNotification(`Pedido #${orderId} eliminado`, 'success');
        }
    }

    createNewOrder() {
        this.showModal('Nuevo Pedido', `
            <div class="new-order-form">
                <h4>Crear Nuevo Pedido</h4>
                <form id="newOrderForm">
                    <div class="form-group">
                        <label>Cliente:</label>
                        <input type="text" name="customer" placeholder="Nombre del cliente" required>
                    </div>
                    <div class="form-group">
                        <label>Productos:</label>
                        <textarea name="products" placeholder="Lista de productos" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Total:</label>
                        <input type="number" name="total" placeholder="0.00" step="0.01" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="ordersManager.closeModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Crear Pedido</button>
                    </div>
                </form>
            </div>
        `);
        
        document.getElementById('newOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.addNewOrder(formData);
        });
    }

    addNewOrder(formData) {
        const newOrder = {
            id: `ORD-${String(this.orders.length + 1).padStart(3, '0')}`,
            customer: { 
                name: formData.get('customer'), 
                avatar: '../../assets/images/hero/user-avatar.jpg' 
            },
            products: formData.get('products').split(',').length,
            total: parseFloat(formData.get('total')),
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            items: formData.get('products').split(',').map(p => p.trim())
        };
        
        this.orders.unshift(newOrder);
        this.applyFilters();
        this.closeModal();
        this.showNotification(`Nuevo pedido #${newOrder.id} creado exitosamente`, 'success');
    }

    exportOrders() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Pedidos exportados exitosamente', 'success');
    }

    generateCSV() {
        const headers = ['ID', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha'];
        const rows = this.filteredOrders.map(order => [
            order.id,
            order.customer.name,
            order.products,
            order.total,
            this.getStatusText(order.status),
            order.date
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    updateStats() {
        const stats = this.calculateStats();
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length >= 4) {
            this.animateNumber(statNumbers[0], stats.total);
            this.animateNumber(statNumbers[1], stats.pending);
            this.animateNumber(statNumbers[2], stats.completed);
            this.animateNumber(statNumbers[3], `$${stats.revenue.toLocaleString()}`);
        }
    }

    calculateStats() {
        const total = this.orders.length;
        const pending = this.orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const completed = this.orders.filter(o => o.status === 'delivered').length;
        const revenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        
        return { total, pending, completed, revenue };
    }

    animateNumber(element, targetValue) {
        const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const endValue = typeof targetValue === 'string' ? 
            parseInt(targetValue.replace(/[^\d]/g, '')) : targetValue;
        
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            
            if (typeof targetValue === 'string' && targetValue.includes('$')) {
                element.textContent = `$${currentValue.toLocaleString()}`;
            } else {
                element.textContent = currentValue.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });
    }

    startRealTimeUpdates() {
        setInterval(() => {
            // Simulate real-time order updates
            if (Math.random() < 0.3) {
                this.simulateOrderUpdate();
            }
        }, 10000);
    }

    simulateOrderUpdate() {
        const pendingOrders = this.orders.filter(o => o.status === 'pending' || o.status === 'processing');
        if (pendingOrders.length > 0) {
            const randomOrder = pendingOrders[Math.floor(Math.random() * pendingOrders.length)];
            const nextStatus = randomOrder.status === 'pending' ? 'processing' : 'shipped';
            
            this.updateOrderStatus(randomOrder.id, nextStatus);
            this.showNotification(`Pedido #${randomOrder.id} actualizado automáticamente`, 'info');
        }
    }

    initNotifications() {
        // Initialize notification system
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="ordersManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    }
}

// Initialize orders manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ordersManager = new OrdersManager();
});

// Handle theme changes
document.addEventListener('themeChanged', (e) => {
    // Update any theme-specific elements if needed
    console.log('Theme changed to:', e.detail.theme);
});