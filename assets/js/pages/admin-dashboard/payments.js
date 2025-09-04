// Payments Page JavaScript
class PaymentsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPaymentFilters();
        this.setupTransactionActions();
        this.setupPaymentMethodCards();
        this.animateStats();
        this.setupRealTimeUpdates();
    }

    // Payment Filters
    setupPaymentFilters() {
        const searchInput = document.querySelector('.transactions-filters .search-box input');
        const statusFilter = document.querySelector('.transactions-filters .filter-select:nth-child(2)');
        const methodFilter = document.querySelector('.transactions-filters .filter-select:nth-child(3)');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTransactions(e.target.value, statusFilter?.value, methodFilter?.value);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterTransactions(searchInput?.value, e.target.value, methodFilter?.value);
            });
        }

        if (methodFilter) {
            methodFilter.addEventListener('change', (e) => {
                this.filterTransactions(searchInput?.value, statusFilter?.value, e.target.value);
            });
        }
    }

    filterTransactions(search = '', status = '', method = '') {
        const rows = document.querySelectorAll('.transactions-table tbody tr');
        
        rows.forEach(row => {
            const customerName = row.querySelector('.customer-info span')?.textContent.toLowerCase() || '';
            const transactionId = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
            const transactionStatus = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';
            const paymentMethod = row.querySelector('.payment-method span')?.textContent.toLowerCase() || '';
            
            const matchesSearch = !search || 
                customerName.includes(search.toLowerCase()) || 
                transactionId.includes(search.toLowerCase());
            
            const matchesStatus = !status || status === 'Todos los estados' || 
                transactionStatus.includes(status.toLowerCase());
            
            const matchesMethod = !method || method === 'Todos los métodos' || 
                paymentMethod.includes(method.toLowerCase());
            
            if (matchesSearch && matchesStatus && matchesMethod) {
                row.style.display = '';
                row.classList.add('fade-in');
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Transaction Actions
    setupTransactionActions() {
        const actionButtons = document.querySelectorAll('.transactions-table .btn-icon');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('title');
                const row = button.closest('tr');
                const transactionId = row.querySelector('td:first-child strong')?.textContent;
                
                this.handleTransactionAction(action, transactionId, row);
            });
        });
    }

    handleTransactionAction(action, transactionId, row) {
        switch(action) {
            case 'Ver':
                this.viewTransaction(transactionId);
                break;
            case 'Reembolsar':
                this.refundTransaction(transactionId, row);
                break;
            case 'Procesar':
                this.processTransaction(transactionId, row);
                break;
            case 'Cancelar':
                this.cancelTransaction(transactionId, row);
                break;
            case 'Imprimir':
                this.printTransaction(transactionId);
                break;
        }
    }

    viewTransaction(transactionId) {
        // Simulate viewing transaction details
        this.showNotification(`Viendo detalles de ${transactionId}`, 'info');
    }

    refundTransaction(transactionId, row) {
        if (confirm(`¿Estás seguro de que quieres reembolsar ${transactionId}?`)) {
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Reembolsado';
            statusBadge.className = 'status-badge refunded';
            
            this.showNotification(`${transactionId} ha sido reembolsado`, 'success');
            this.updateStats('refund');
        }
    }

    processTransaction(transactionId, row) {
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = 'Completado';
        statusBadge.className = 'status-badge completed';
        
        this.showNotification(`${transactionId} ha sido procesado`, 'success');
        this.updateStats('process');
    }

    cancelTransaction(transactionId, row) {
        if (confirm(`¿Estás seguro de que quieres cancelar ${transactionId}?`)) {
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Cancelado';
            statusBadge.className = 'status-badge failed';
            
            this.showNotification(`${transactionId} ha sido cancelado`, 'warning');
            this.updateStats('cancel');
        }
    }

    printTransaction(transactionId) {
        this.showNotification(`Imprimiendo ${transactionId}`, 'info');
        // Simulate printing
        window.print();
    }

    // Payment Method Cards
    setupPaymentMethodCards() {
        const methodCards = document.querySelectorAll('.payment-method-card');
        
        methodCards.forEach(card => {
            card.addEventListener('click', () => {
                const methodName = card.querySelector('h4').textContent;
                this.showPaymentMethodDetails(methodName);
            });
        });
    }

    showPaymentMethodDetails(methodName) {
        this.showNotification(`Mostrando detalles de ${methodName}`, 'info');
    }

    // Animate Stats
    animateStats() {
        const statNumbers = document.querySelectorAll('.payment-stats .stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const isMonetary = text.includes('$');
            const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            if (!isNaN(numericValue)) {
                this.animateNumber(stat, 0, numericValue, isMonetary);
            }
        });
    }

    animateNumber(element, start, end, isMonetary = false) {
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutCubic(progress);
            
            if (isMonetary) {
                element.textContent = `$${current.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Update Stats
    updateStats(action) {
        const pendingElement = document.querySelector('.pending .stat-number');
        const transactionsElement = document.querySelector('.transactions .stat-number');
        const revenueElement = document.querySelector('.revenue .stat-number');
        const refundsElement = document.querySelector('.refunds .stat-number');
        
        if (action === 'process' && pendingElement) {
            const current = parseInt(pendingElement.textContent);
            pendingElement.textContent = Math.max(0, current - 1);
        }
        
        if (action === 'refund' && refundsElement) {
            const current = parseFloat(refundsElement.textContent.replace(/[^0-9.]/g, ''));
            const newAmount = current + Math.random() * 500 + 100;
            refundsElement.textContent = `$${newAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        }
    }

    // Real-time Updates
    setupRealTimeUpdates() {
        setInterval(() => {
            this.simulateNewTransaction();
        }, 30000); // Every 30 seconds
    }

    simulateNewTransaction() {
        const transactionsElement = document.querySelector('.transactions .stat-number');
        const revenueElement = document.querySelector('.revenue .stat-number');
        
        if (transactionsElement) {
            const current = parseInt(transactionsElement.textContent.replace(/,/g, ''));
            transactionsElement.textContent = (current + 1).toLocaleString();
        }
        
        if (revenueElement) {
            const current = parseFloat(revenueElement.textContent.replace(/[^0-9.]/g, ''));
            const newRevenue = current + Math.random() * 1000 + 50;
            revenueElement.textContent = `$${newRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        }
        
        this.showNotification('Nueva transacción recibida', 'success');
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#000';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            default:
                notification.style.backgroundColor = '#007bff';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize Payments Manager
document.addEventListener('DOMContentLoaded', () => {
    new PaymentsManager();
});