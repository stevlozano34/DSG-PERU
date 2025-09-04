// Enhanced Logs Page JavaScript - Complete Implementation
class LogsManager {
    constructor() {
        this.logs = [];
        this.filteredLogs = [];
        this.currentPage = 1;
        this.logsPerPage = 20;
        this.autoRefreshInterval = null;
        this.isLoading = false;
        this.maxLogs = 1000; // Prevent memory issues
        this.searchDebounceTimer = null;
        this.lastUpdateTime = new Date();
        this.connectionStatus = 'connected';
        this.retryAttempts = 0;
        this.maxRetryAttempts = 3;
        
        // Performance monitoring
        this.performanceMetrics = {
            renderTime: 0,
            filterTime: 0,
            searchTime: 0
        };
        
        this.init();
    }

    init() {
        try {
            this.showLoadingState(true);
            this.generateSampleLogs();
            this.bindEvents();
            this.renderLogs();
            this.updateStats();
            this.startAutoRefresh();
            this.initializeTooltips();
            this.setupKeyboardShortcuts();
            this.monitorPerformance();
            this.showLoadingState(false);
            this.showNotification('Sistema de logs inicializado correctamente', 'success');
        } catch (error) {
            console.error('Error initializing logs manager:', error);
            this.showNotification('Error al inicializar el sistema de logs', 'error');
            this.showLoadingState(false);
        }
    }

    generateSampleLogs() {
        const levels = ['info', 'warning', 'error', 'debug', 'critical'];
        const categories = ['auth', 'orders', 'payments', 'system', 'security', 'api', 'database'];
        const severityWeights = {
            'info': 0.4,
            'warning': 0.25,
            'error': 0.2,
            'debug': 0.1,
            'critical': 0.05
        };
        
        const messages = {
            auth: [
                'Usuario {user} inició sesión exitosamente desde {ip}',
                'Intento de login fallido para {user} desde {ip}',
                'Sesión expirada para usuario {user}',
                'Cambio de contraseña realizado por {user}',
                'Token de acceso renovado para {user}',
                'Bloqueo de cuenta por múltiples intentos fallidos',
                'Activación de autenticación de dos factores',
                'Restablecimiento de contraseña solicitado'
            ],
            orders: [
                'Nuevo pedido #{orderId} creado por {user}',
                'Pedido #{orderId} actualizado - Estado: {status}',
                'Pedido #{orderId} cancelado por {user}',
                'Error al procesar pedido #{orderId}: {error}',
                'Pedido #{orderId} enviado exitosamente',
                'Inventario insuficiente para pedido #{orderId}',
                'Pago confirmado para pedido #{orderId}',
                'Devolución procesada para pedido #{orderId}'
            ],
            payments: [
                'Pago de ${amount} procesado exitosamente - ID: {paymentId}',
                'Error en procesamiento de pago: {error}',
                'Reembolso de ${amount} realizado - ID: {refundId}',
                'Tarjeta de crédito expirada para usuario {user}',
                'Pago pendiente de confirmación - ID: {paymentId}',
                'Transacción fraudulenta detectada y bloqueada',
                'Webhook de pago recibido desde {provider}',
                'Reconciliación de pagos completada'
            ],
            system: [
                'Respaldo automático completado - {size}MB',
                'Cache limpiado - {entries} entradas removidas',
                'Actualización del sistema v{version} aplicada',
                'Error de conexión a base de datos: {error}',
                'Mantenimiento programado iniciado',
                'Monitoreo de salud del sistema: {status}',
                'Limpieza de logs antiguos completada',
                'Certificado SSL renovado exitosamente'
            ],
            security: [
                'Intento de acceso no autorizado desde {ip}',
                'Firewall bloqueó {attempts} intentos maliciosos',
                'Escaneo de vulnerabilidades completado',
                'Actualización de seguridad aplicada',
                'Detección de malware en archivo subido',
                'Política de seguridad actualizada',
                'Auditoría de seguridad programada',
                'Certificado de seguridad validado'
            ],
            api: [
                'API endpoint {endpoint} respondió en {time}ms',
                'Rate limit excedido para IP {ip}',
                'Error 500 en endpoint {endpoint}',
                'Nueva versión de API v{version} desplegada',
                'Webhook entregado exitosamente a {url}',
                'Timeout en llamada a servicio externo',
                'Autenticación API fallida para key {keyId}',
                'Documentación de API actualizada'
            ],
            database: [
                'Consulta lenta detectada: {query} ({time}ms)',
                'Backup de base de datos completado',
                'Índice recreado en tabla {table}',
                'Conexión a base de datos restablecida',
                'Migración de esquema v{version} aplicada',
                'Optimización de consultas ejecutada',
                'Replicación de datos sincronizada',
                'Limpieza de datos obsoletos completada'
            ]
        };

        // Generate realistic logs with weighted distribution
        for (let i = 0; i < 150; i++) {
            const level = this.getWeightedRandomLevel(severityWeights);
            const category = categories[Math.floor(Math.random() * categories.length)];
            const messageTemplate = messages[category][Math.floor(Math.random() * messages[category].length)];
            
            // Generate realistic data for message interpolation
            const data = this.generateLogData(category);
            const message = this.interpolateMessage(messageTemplate, data);
            
            const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
            
            this.logs.push({
                id: i + 1,
                timestamp: date,
                level: level,
                category: category,
                message: message,
                details: this.generateDetailedInfo(category, level, data),
                ip: this.generateRandomIP(),
                user: this.generateRandomUser(),
                sessionId: this.generateSessionId(),
                userAgent: this.generateUserAgent(),
                duration: Math.random() * 5000, // ms
                size: Math.floor(Math.random() * 1024), // bytes
                statusCode: this.generateStatusCode(level),
                source: this.generateSource(category)
            });
        }

        // Sort by timestamp (newest first)
        this.logs.sort((a, b) => b.timestamp - a.timestamp);
        this.filteredLogs = [...this.logs];
    }

    getWeightedRandomLevel(weights) {
        const random = Math.random();
        let cumulative = 0;
        
        for (const [level, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (random <= cumulative) {
                return level;
            }
        }
        return 'info'; // fallback
    }

    generateLogData(category) {
        const users = ['admin@fixture.com', 'user@fixture.com', 'manager@fixture.com', 'support@fixture.com'];
        const statuses = ['pending', 'processing', 'completed', 'cancelled', 'shipped'];
        const errors = ['Connection timeout', 'Invalid credentials', 'Insufficient funds', 'Server error'];
        
        return {
            user: users[Math.floor(Math.random() * users.length)],
            ip: this.generateRandomIP(),
            orderId: Math.floor(Math.random() * 10000),
            paymentId: 'PAY_' + Math.random().toString(36).substr(2, 9),
            refundId: 'REF_' + Math.random().toString(36).substr(2, 9),
            amount: (Math.random() * 1000).toFixed(2),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            error: errors[Math.floor(Math.random() * errors.length)],
            size: Math.floor(Math.random() * 500),
            entries: Math.floor(Math.random() * 1000),
            version: '2.' + Math.floor(Math.random() * 10) + '.' + Math.floor(Math.random() * 10),
            endpoint: '/api/v1/' + ['users', 'orders', 'payments', 'products'][Math.floor(Math.random() * 4)],
            time: Math.floor(Math.random() * 2000),
            attempts: Math.floor(Math.random() * 50),
            keyId: 'KEY_' + Math.random().toString(36).substr(2, 6),
            url: 'https://webhook.example.com/callback',
            query: 'SELECT * FROM ' + ['users', 'orders', 'products'][Math.floor(Math.random() * 3)],
            table: ['users', 'orders', 'products', 'payments'][Math.floor(Math.random() * 4)],
            provider: ['stripe', 'paypal', 'square'][Math.floor(Math.random() * 3)]
        };
    }

    interpolateMessage(template, data) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return data[key] || match;
        });
    }

    generateDetailedInfo(category, level, data) {
        const details = {
            auth: `Detalles de autenticación: Usuario ${data.user}, IP ${data.ip}, Sesión ${this.generateSessionId()}`,
            orders: `Detalles del pedido: ID ${data.orderId}, Usuario ${data.user}, Estado ${data.status}`,
            payments: `Detalles del pago: Monto $${data.amount}, Método ${data.provider}, ID ${data.paymentId}`,
            system: `Detalles del sistema: Versión ${data.version}, Tamaño ${data.size}MB, Tiempo ${data.time}ms`,
            security: `Detalles de seguridad: IP ${data.ip}, Intentos ${data.attempts}, Nivel de amenaza: ${level}`,
            api: `Detalles de API: Endpoint ${data.endpoint}, Tiempo de respuesta ${data.time}ms, Usuario ${data.user}`,
            database: `Detalles de BD: Tabla ${data.table}, Consulta optimizada, Tiempo ${data.time}ms`
        };
        
        return details[category] || `Información detallada para categoría ${category}`;
    }

    generateRandomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    generateRandomUser() {
        const users = [
            'admin@fixture.com', 'user@fixture.com', 'manager@fixture.com', 
            'support@fixture.com', 'developer@fixture.com', 'analyst@fixture.com',
            'system@fixture.com', 'api@fixture.com'
        ];
        return users[Math.floor(Math.random() * users.length)];
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 16);
    }

    generateUserAgent() {
        const agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'PostmanRuntime/7.29.0',
            'curl/7.68.0'
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    }

    generateStatusCode(level) {
        const codes = {
            'info': [200, 201, 202],
            'warning': [400, 401, 403],
            'error': [500, 502, 503],
            'debug': [200, 201],
            'critical': [500, 503, 504]
        };
        const levelCodes = codes[level] || [200];
        return levelCodes[Math.floor(Math.random() * levelCodes.length)];
    }

    generateSource(category) {
        const sources = {
            'auth': ['auth-service', 'login-api', 'session-manager'],
            'orders': ['order-service', 'inventory-api', 'shipping-service'],
            'payments': ['payment-gateway', 'billing-service', 'fraud-detection'],
            'system': ['system-monitor', 'backup-service', 'health-check'],
            'security': ['firewall', 'intrusion-detection', 'security-scanner'],
            'api': ['api-gateway', 'rate-limiter', 'load-balancer'],
            'database': ['db-monitor', 'query-optimizer', 'replication-service']
        };
        const categorySources = sources[category] || ['unknown-service'];
        return categorySources[Math.floor(Math.random() * categorySources.length)];
    }

    bindEvents() {
        try {
            // Search functionality with debouncing
            const searchInput = document.getElementById('logSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(this.searchDebounceTimer);
                    this.searchDebounceTimer = setTimeout(() => {
                        this.filterLogs();
                    }, 300); // 300ms debounce
                });
                
                // Clear search on Escape
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        searchInput.value = '';
                        this.filterLogs();
                    }
                });
            }

            // Filter dropdowns with change detection
            const filters = ['logLevel', 'logCategory', 'logDate'];
            filters.forEach(filterId => {
                const filter = document.getElementById(filterId);
                if (filter) {
                    filter.addEventListener('change', () => {
                        this.filterLogs();
                        this.saveFilterState();
                    });
                }
            });

            // Auto refresh toggle with state persistence
            const autoRefreshToggle = document.getElementById('autoRefresh');
            if (autoRefreshToggle) {
                // Load saved state
                const savedState = localStorage.getItem('logsAutoRefresh');
                if (savedState !== null) {
                    autoRefreshToggle.checked = JSON.parse(savedState);
                }
                
                autoRefreshToggle.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        this.startAutoRefresh();
                        this.showNotification('Auto-actualización activada', 'info');
                    } else {
                        this.stopAutoRefresh();
                        this.showNotification('Auto-actualización desactivada', 'info');
                    }
                    localStorage.setItem('logsAutoRefresh', JSON.stringify(e.target.checked));
                });
                
                // Initialize based on saved state
                if (!autoRefreshToggle.checked) {
                    this.stopAutoRefresh();
                }
            }

            // Action buttons with error handling
            this.bindActionButtons();
            
            // Log entry interactions
            this.bindLogEntryEvents();
            
            // Window events
            this.bindWindowEvents();
            
        } catch (error) {
            console.error('Error binding events:', error);
            this.showNotification('Error al configurar eventos', 'error');
        }
    }

    bindActionButtons() {
        const buttons = [
            { id: 'clearLogs', handler: () => this.clearLogs(), confirm: true },
            { id: 'exportLogs', handler: () => this.exportLogs(), confirm: false },
            { id: 'loadMore', handler: () => this.loadMoreLogs(), confirm: false },
            { id: 'refreshLogs', handler: () => this.refreshLogs(), confirm: false }
        ];

        buttons.forEach(({ id, handler, confirm }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    if (confirm && !window.confirm('¿Estás seguro de realizar esta acción?')) {
                        return;
                    }
                    
                    try {
                        button.disabled = true;
                        button.classList.add('loading');
                        await handler();
                    } catch (error) {
                        console.error(`Error in ${id}:`, error);
                        this.showNotification(`Error al ejecutar ${id}`, 'error');
                    } finally {
                        button.disabled = false;
                        button.classList.remove('loading');
                    }
                });
            }
        });
    }

    bindLogEntryEvents() {
        // Use event delegation for better performance
        document.addEventListener('click', (e) => {
            // View log details
            if (e.target.closest('.btn-icon')) {
                const logEntry = e.target.closest('.log-entry');
                if (logEntry) {
                    const logId = parseInt(logEntry.dataset.logId);
                    this.showLogDetails(logId);
                }
            }
            
            // Copy log message
            if (e.target.closest('.log-message')) {
                const message = e.target.textContent;
                this.copyToClipboard(message);
                this.showNotification('Mensaje copiado al portapapeles', 'success');
            }
        });
        
        // Double click to view details
        document.addEventListener('dblclick', (e) => {
            const logEntry = e.target.closest('.log-entry');
            if (logEntry) {
                const logId = parseInt(logEntry.dataset.logId);
                this.showLogDetails(logId);
            }
        });
    }

    bindWindowEvents() {
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoRefresh();
            } else {
                const autoRefreshToggle = document.getElementById('autoRefresh');
                if (autoRefreshToggle && autoRefreshToggle.checked) {
                    this.startAutoRefresh();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.adjustLayoutForScreenSize();
        }, 250));
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.connectionStatus = 'connected';
            this.showNotification('Conexión restablecida', 'success');
            this.retryAttempts = 0;
        });
        
        window.addEventListener('offline', () => {
            this.connectionStatus = 'disconnected';
            this.showNotification('Conexión perdida', 'warning');
            this.stopAutoRefresh();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('logSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Ctrl/Cmd + R: Refresh logs
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshLogs();
            }
            
            // Ctrl/Cmd + E: Export logs
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.exportLogs();
            }
            
            // Escape: Clear filters
            if (e.key === 'Escape') {
                this.clearAllFilters();
            }
        });
    }

    filterLogs() {
        const startTime = performance.now();
        
        try {
            const searchTerm = document.getElementById('logSearch')?.value.toLowerCase().trim() || '';
            const levelFilter = document.getElementById('logLevel')?.value || 'all';
            const categoryFilter = document.getElementById('logCategory')?.value || 'all';
            const dateFilter = document.getElementById('logDate')?.value || '';

            this.filteredLogs = this.logs.filter(log => {
                // Search in multiple fields
                const searchFields = [
                    log.message,
                    log.category,
                    log.level,
                    log.user,
                    log.ip,
                    log.source
                ].join(' ').toLowerCase();
                
                const matchesSearch = !searchTerm || searchFields.includes(searchTerm);
                const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
                const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
                
                let matchesDate = true;
                if (dateFilter) {
                    const filterDate = new Date(dateFilter);
                    const logDate = new Date(log.timestamp.toDateString());
                    matchesDate = logDate.getTime() === filterDate.getTime();
                }

                return matchesSearch && matchesLevel && matchesCategory && matchesDate;
            });

            this.currentPage = 1;
            this.renderLogs();
            this.updateStats();
            this.updateFilterInfo();
            
            const endTime = performance.now();
            this.performanceMetrics.filterTime = endTime - startTime;
            
        } catch (error) {
            console.error('Error filtering logs:', error);
            this.showNotification('Error al filtrar logs', 'error');
        }
    }

    renderLogs() {
        const startTime = performance.now();
        
        try {
            const container = document.querySelector('.logs-container');
            if (!container) {
                throw new Error('Logs container not found');
            }

            const startIndex = 0;
            const endIndex = this.currentPage * this.logsPerPage;
            const logsToShow = this.filteredLogs.slice(startIndex, endIndex);

            if (logsToShow.length === 0) {
                container.innerHTML = this.renderEmptyState();
            } else {
                container.innerHTML = logsToShow.map(log => this.renderLogEntry(log)).join('');
            }

            // Update load more button
            this.updateLoadMoreButton(endIndex);
            
            // Update pagination info
            this.updatePaginationInfo(logsToShow.length);
            
            const endTime = performance.now();
            this.performanceMetrics.renderTime = endTime - startTime;
            
        } catch (error) {
            console.error('Error rendering logs:', error);
            this.showNotification('Error al renderizar logs', 'error');
        }
    }

    renderLogEntry(log) {
        const timeAgo = this.getTimeAgo(log.timestamp);
        const severity = this.getSeverityClass(log.level);
        
        return `
            <div class="log-entry ${severity}" data-level="${log.level}" data-category="${log.category}" data-log-id="${log.id}" title="Doble click para ver detalles">
                <div class="log-time" title="${this.formatTimestamp(log.timestamp)}">
                    <span class="timestamp">${this.formatTimestamp(log.timestamp)}</span>
                    <span class="time-ago">${timeAgo}</span>
                </div>
                <div class="log-level ${log.level}" title="Nivel: ${log.level.toUpperCase()}">
                    ${this.getLevelIcon(log.level)}
                    <span>${log.level.toUpperCase()}</span>
                </div>
                <div class="log-category" title="Categoría: ${log.category}">
                    ${this.getCategoryIcon(log.category)}
                    <span>${log.category.toUpperCase()}</span>
                </div>
                <div class="log-message" title="Click para copiar">
                    <span class="message-text">${this.highlightSearchTerm(log.message)}</span>
                    <div class="log-meta">
                        <span class="log-source">${log.source}</span>
                        <span class="log-user">${log.user}</span>
                        ${log.statusCode ? `<span class="status-code status-${Math.floor(log.statusCode / 100)}xx">${log.statusCode}</span>` : ''}
                    </div>
                </div>
                <div class="log-actions">
                    <button class="btn-icon" title="Ver detalles (Enter)" data-action="details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Copiar mensaje" data-action="copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <div class="log-indicators">
                        ${log.duration > 1000 ? '<span class="indicator slow" title="Operación lenta">🐌</span>' : ''}
                        ${log.level === 'critical' ? '<span class="indicator critical" title="Crítico">🚨</span>' : ''}
                        ${log.ip.startsWith('192.168') ? '' : '<span class="indicator external" title="IP externa">🌐</span>'}
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No se encontraron logs</h3>
                <p>No hay logs que coincidan con los filtros aplicados.</p>
                <button class="btn btn-primary" onclick="window.logsManager.clearAllFilters()">
                    <i class="fas fa-filter"></i>
                    Limpiar Filtros
                </button>
            </div>
        `;
    }

    getLevelIcon(level) {
        const icons = {
            'info': '<i class="fas fa-info-circle"></i>',
            'warning': '<i class="fas fa-exclamation-triangle"></i>',
            'error': '<i class="fas fa-times-circle"></i>',
            'debug': '<i class="fas fa-bug"></i>',
            'critical': '<i class="fas fa-skull-crossbones"></i>'
        };
        return icons[level] || '<i class="fas fa-circle"></i>';
    }

    getCategoryIcon(category) {
        const icons = {
            'auth': '<i class="fas fa-user-shield"></i>',
            'orders': '<i class="fas fa-shopping-cart"></i>',
            'payments': '<i class="fas fa-credit-card"></i>',
            'system': '<i class="fas fa-server"></i>',
            'security': '<i class="fas fa-shield-alt"></i>',
            'api': '<i class="fas fa-code"></i>',
            'database': '<i class="fas fa-database"></i>'
        };
        return icons[category] || '<i class="fas fa-tag"></i>';
    }

    getSeverityClass(level) {
        const severityMap = {
            'critical': 'severity-critical',
            'error': 'severity-high',
            'warning': 'severity-medium',
            'info': 'severity-low',
            'debug': 'severity-minimal'
        };
        return severityMap[level] || 'severity-low';
    }

    highlightSearchTerm(text) {
        const searchTerm = document.getElementById('logSearch')?.value.trim();
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `hace ${days}d`;
        if (hours > 0) return `hace ${hours}h`;
        if (minutes > 0) return `hace ${minutes}m`;
        return `hace ${seconds}s`;
    }

    updateStats() {
        try {
            const stats = {
                info: this.filteredLogs.filter(log => log.level === 'info').length,
                warning: this.filteredLogs.filter(log => log.level === 'warning').length,
                error: this.filteredLogs.filter(log => log.level === 'error').length,
                debug: this.filteredLogs.filter(log => log.level === 'debug').length,
                critical: this.filteredLogs.filter(log => log.level === 'critical').length
            };

            Object.keys(stats).forEach(level => {
                const statElement = document.querySelector(`.stat-item .stat-icon.${level}`);
                if (statElement) {
                    const numberElement = statElement.parentElement.querySelector('.stat-number');
                    if (numberElement) {
                        const currentValue = parseInt(numberElement.textContent.replace(/,/g, '')) || 0;
                        this.animateNumber(numberElement, currentValue, stats[level]);
                    }
                }
            });
            
            // Update total logs count
            this.updateTotalCount();
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateTotalCount() {
        const totalElement = document.querySelector('.total-logs-count');
        if (totalElement) {
            totalElement.textContent = `${this.filteredLogs.length} de ${this.logs.length} logs`;
        }
    }

    updateFilterInfo() {
        const filterInfo = document.querySelector('.filter-info');
        if (filterInfo) {
            const activeFilters = this.getActiveFilters();
            if (activeFilters.length > 0) {
                filterInfo.innerHTML = `
                    <span>Filtros activos: ${activeFilters.join(', ')}</span>
                    <button class="clear-filters-btn" onclick="window.logsManager.clearAllFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                filterInfo.style.display = 'flex';
            } else {
                filterInfo.style.display = 'none';
            }
        }
    }

    getActiveFilters() {
        const filters = [];
        
        const searchTerm = document.getElementById('logSearch')?.value.trim();
        if (searchTerm) filters.push(`Búsqueda: "${searchTerm}"`);
        
        const levelFilter = document.getElementById('logLevel')?.value;
        if (levelFilter && levelFilter !== 'all') filters.push(`Nivel: ${levelFilter}`);
        
        const categoryFilter = document.getElementById('logCategory')?.value;
        if (categoryFilter && categoryFilter !== 'all') filters.push(`Categoría: ${categoryFilter}`);
        
        const dateFilter = document.getElementById('logDate')?.value;
        if (dateFilter) filters.push(`Fecha: ${dateFilter}`);
        
        return filters;
    }

    clearAllFilters() {
        try {
            document.getElementById('logSearch').value = '';
            document.getElementById('logLevel').value = 'all';
            document.getElementById('logCategory').value = 'all';
            document.getElementById('logDate').value = '';
            
            this.filterLogs();
            this.showNotification('Filtros limpiados', 'info');
        } catch (error) {
            console.error('Error clearing filters:', error);
        }
    }

    animateNumber(element, from, to) {
        const duration = 800;
        const startTime = performance.now();
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            const current = Math.round(from + (to - from) * easedProgress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    formatTimestamp(timestamp) {
        return timestamp.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    updateLoadMoreButton(endIndex) {
        const loadMoreBtn = document.getElementById('loadMore');
        if (loadMoreBtn) {
            const hasMore = endIndex < this.filteredLogs.length;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            
            if (hasMore) {
                const remaining = this.filteredLogs.length - endIndex;
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-plus"></i>
                    Cargar Más (${remaining} restantes)
                `;
            }
        }
    }

    updatePaginationInfo(currentCount) {
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${currentCount} de ${this.filteredLogs.length} logs`;
        }
    }

    loadMoreLogs() {
        try {
            this.currentPage++;
            this.renderLogs();
            this.showNotification(`Cargados ${this.logsPerPage} logs adicionales`, 'info');
        } catch (error) {
            console.error('Error loading more logs:', error);
            this.showNotification('Error al cargar más logs', 'error');
        }
    }

    async refreshLogs() {
        try {
            this.showLoadingState(true);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add some new logs
            this.addNewLog();
            this.addNewLog();
            this.addNewLog();
            
            this.filterLogs();
            this.showNotification('Logs actualizados', 'success');
            
        } catch (error) {
            console.error('Error refreshing logs:', error);
            this.showNotification('Error al actualizar logs', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    startAutoRefresh() {
        if (this.connectionStatus !== 'connected') {
            this.showNotification('No se puede activar auto-actualización sin conexión', 'warning');
            return;
        }
        
        this.stopAutoRefresh();
        this.autoRefreshInterval = setInterval(() => {
            if (document.hidden) return; // Don't refresh when tab is not visible
            
            try {
                this.addNewLog();
                this.updateLastRefreshTime();
            } catch (error) {
                console.error('Error in auto refresh:', error);
                this.retryAttempts++;
                
                if (this.retryAttempts >= this.maxRetryAttempts) {
                    this.stopAutoRefresh();
                    this.showNotification('Auto-actualización desactivada por errores repetidos', 'error');
                }
            }
        }, 15000); // Every 15 seconds
        
        this.updateRefreshIndicator(true);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
        this.updateRefreshIndicator(false);
    }

    updateRefreshIndicator(isActive) {
        const indicator = document.querySelector('.refresh-indicator');
        if (indicator) {
            indicator.style.display = isActive ? 'block' : 'none';
        }
    }

    updateLastRefreshTime() {
        this.lastUpdateTime = new Date();
        const timeElement = document.querySelector('.last-update-time');
        if (timeElement) {
            timeElement.textContent = `Última actualización: ${this.formatTimestamp(this.lastUpdateTime)}`;
        }
    }

    addNewLog() {
        if (this.logs.length >= this.maxLogs) {
            // Remove oldest logs to prevent memory issues
            this.logs = this.logs.slice(0, this.maxLogs - 100);
        }
        
        const levels = ['info', 'warning', 'error', 'debug'];
        const categories = ['auth', 'orders', 'payments', 'system', 'security', 'api'];
        
        const realtimeMessages = {
            auth: ['Nuevo inicio de sesión detectado', 'Token renovado automáticamente', 'Sesión verificada'],
            orders: ['Pedido actualizado en tiempo real', 'Nueva orden recibida', 'Estado de envío actualizado'],
            payments: ['Pago procesado exitosamente', 'Verificación de pago completada', 'Webhook recibido'],
            system: ['Monitoreo del sistema activo', 'Cache actualizado', 'Salud del sistema verificada'],
            security: ['Escaneo de seguridad completado', 'Política actualizada', 'Amenaza bloqueada'],
            api: ['Endpoint respondió correctamente', 'Rate limit actualizado', 'Nueva versión desplegada']
        };

        const level = levels[Math.floor(Math.random() * levels.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const messages = realtimeMessages[category] || ['Evento del sistema'];
        const message = messages[Math.floor(Math.random() * messages.length)];

        const newLog = {
            id: this.logs.length + 1,
            timestamp: new Date(),
            level: level,
            category: category,
            message: message,
            details: `Detalles para log en tiempo real ${this.logs.length + 1}`,
            ip: this.generateRandomIP(),
            user: this.generateRandomUser(),
            sessionId: this.generateSessionId(),
            userAgent: this.generateUserAgent(),
            duration: Math.random() * 2000,
            size: Math.floor(Math.random() * 512),
            statusCode: this.generateStatusCode(level),
            source: this.generateSource(category)
        };

        this.logs.unshift(newLog);
        
        // Only update if no filters are active or log matches current filters
        if (this.logMatchesCurrentFilters(newLog)) {
            this.filteredLogs.unshift(newLog);
            this.renderLogs();
            this.updateStats();
            
            // Show notification for critical/error logs
            if (['critical', 'error'].includes(level)) {
                this.showNotification(`Nuevo log ${level}: ${message}`, level === 'critical' ? 'error' : 'warning');
            }
        }
    }

    logMatchesCurrentFilters(log) {
        const searchTerm = document.getElementById('logSearch')?.value.toLowerCase().trim() || '';
        const levelFilter = document.getElementById('logLevel')?.value || 'all';
        const categoryFilter = document.getElementById('logCategory')?.value || 'all';
        const dateFilter = document.getElementById('logDate')?.value || '';
        
        const searchFields = [
            log.message,
            log.category,
            log.level,
            log.user,
            log.ip,
            log.source
        ].join(' ').toLowerCase();
        
        const matchesSearch = !searchTerm || searchFields.includes(searchTerm);
        const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            const logDate = new Date(log.timestamp.toDateString());
            matchesDate = logDate.getTime() === filterDate.getTime();
        }
        
        return matchesSearch && matchesLevel && matchesCategory && matchesDate;
    }

    clearLogs() {
        const confirmMessage = `¿Estás seguro de que quieres limpiar todos los logs?\n\nEsta acción eliminará ${this.logs.length} logs y no se puede deshacer.`;
        
        if (confirm(confirmMessage)) {
            try {
                this.logs = [];
                this.filteredLogs = [];
                this.currentPage = 1;
                this.renderLogs();
                this.updateStats();
                this.showNotification('Logs limpiados exitosamente', 'success');
                
                // Log this action
                this.addSystemLog('Logs limpiados por usuario', 'warning');
                
            } catch (error) {
                console.error('Error clearing logs:', error);
                this.showNotification('Error al limpiar logs', 'error');
            }
        }
    }

    addSystemLog(message, level = 'info') {
        const systemLog = {
            id: this.logs.length + 1,
            timestamp: new Date(),
            level: level,
            category: 'system',
            message: message,
            details: 'Acción realizada desde el panel de administración',
            ip: '127.0.0.1',
            user: 'admin@fixture.com',
            sessionId: this.generateSessionId(),
            userAgent: navigator.userAgent,
            duration: 0,
            size: 0,
            statusCode: 200,
            source: 'admin-panel'
        };
        
        this.logs.unshift(systemLog);
    }

    async exportLogs() {
        try {
            this.showLoadingState(true, 'Preparando exportación...');
            
            const exportData = this.filteredLogs.map(log => ({
                timestamp: this.formatTimestamp(log.timestamp),
                level: log.level,
                category: log.category,
                message: log.message,
                user: log.user,
                ip: log.ip,
                source: log.source,
                statusCode: log.statusCode,
                duration: log.duration,
                sessionId: log.sessionId,
                details: log.details
            }));

            // Choose export format
            const format = await this.chooseExportFormat();
            
            let content, mimeType, extension;
            
            switch (format) {
                case 'csv':
                    content = this.convertToCSV(exportData);
                    mimeType = 'text/csv;charset=utf-8;';
                    extension = 'csv';
                    break;
                case 'json':
                    content = JSON.stringify(exportData, null, 2);
                    mimeType = 'application/json;charset=utf-8;';
                    extension = 'json';
                    break;
                case 'txt':
                    content = this.convertToText(exportData);
                    mimeType = 'text/plain;charset=utf-8;';
                    extension = 'txt';
                    break;
                default:
                    throw new Error('Formato de exportación no válido');
            }

            const blob = new Blob([content], { type: mimeType });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                const timestamp = new Date().toISOString().split('T')[0];
                const filename = `logs_${timestamp}_${this.filteredLogs.length}entries.${extension}`;
                
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
            }

            this.showNotification(`${this.filteredLogs.length} logs exportados como ${format.toUpperCase()}`, 'success');
            this.addSystemLog(`Logs exportados (${this.filteredLogs.length} entradas, formato ${format})`, 'info');
            
        } catch (error) {
            console.error('Error exporting logs:', error);
            this.showNotification('Error al exportar logs', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    chooseExportFormat() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content export-format-modal">
                    <div class="modal-header">
                        <h3>Seleccionar Formato de Exportación</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="format-options">
                            <div class="format-option" data-format="csv">
                                <div class="format-icon">📊</div>
                                <div class="format-info">
                                    <h4>CSV</h4>
                                    <p>Formato de valores separados por comas, ideal para Excel</p>
                                </div>
                            </div>
                            <div class="format-option" data-format="json">
                                <div class="format-icon">📋</div>
                                <div class="format-info">
                                    <h4>JSON</h4>
                                    <p>Formato estructurado, ideal para análisis programático</p>
                                </div>
                            </div>
                            <div class="format-option" data-format="txt">
                                <div class="format-icon">📄</div>
                                <div class="format-info">
                                    <h4>TXT</h4>
                                    <p>Texto plano, fácil de leer y compartir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Handle format selection
            modal.querySelectorAll('.format-option').forEach(option => {
                option.addEventListener('click', () => {
                    const format = option.dataset.format;
                    modal.remove();
                    resolve(format);
                });
            });
            
            // Handle close
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
                resolve('csv'); // Default format
            });
            
            // Show modal
            setTimeout(() => modal.classList.add('show'), 10);
        });
    }

    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma or quote
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    convertToText(data) {
        return data.map(log => {
            return `[${log.timestamp}] ${log.level.toUpperCase()} [${log.category.toUpperCase()}] ${log.message}\n` +
                   `  Usuario: ${log.user} | IP: ${log.ip} | Fuente: ${log.source}\n` +
                   `  Detalles: ${log.details}\n` +
                   `  ---\n`;
        }).join('\n');
    }

    showLogDetails(logId) {
        try {
            const log = this.logs.find(l => l.id === logId);
            if (!log) {
                this.showNotification('Log no encontrado', 'error');
                return;
            }

            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content log-details-modal">
                    <div class="modal-header">
                        <h3>Detalles del Log #${log.id}</h3>
                        <div class="modal-actions">
                            <button class="btn-icon" title="Copiar detalles" data-action="copy-details">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn-icon" title="Exportar este log" data-action="export-single">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="modal-close">&times;</button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="log-detail-grid">
                            <div class="detail-section">
                                <h4>Información Básica</h4>
                                <div class="detail-item">
                                    <label>Timestamp:</label>
                                    <span class="timestamp-detail">
                                        ${this.formatTimestamp(log.timestamp)}
                                        <small>(${this.getTimeAgo(log.timestamp)})</small>
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Nivel:</label>
                                    <span class="log-level ${log.level}">
                                        ${this.getLevelIcon(log.level)}
                                        ${log.level.toUpperCase()}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Categoría:</label>
                                    <span class="category-detail">
                                        ${this.getCategoryIcon(log.category)}
                                        ${log.category.toUpperCase()}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Fuente:</label>
                                    <span>${log.source}</span>
                                </div>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Información del Usuario</h4>
                                <div class="detail-item">
                                    <label>Usuario:</label>
                                    <span>${log.user}</span>
                                </div>
                                <div class="detail-item">
                                    <label>IP:</label>
                                    <span class="ip-detail">${log.ip}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Sesión:</label>
                                    <span class="session-detail">${log.sessionId}</span>
                                </div>
                                <div class="detail-item">
                                    <label>User Agent:</label>
                                    <span class="user-agent-detail">${log.userAgent}</span>
                                </div>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Información Técnica</h4>
                                ${log.statusCode ? `
                                    <div class="detail-item">
                                        <label>Código de Estado:</label>
                                        <span class="status-code status-${Math.floor(log.statusCode / 100)}xx">${log.statusCode}</span>
                                    </div>
                                ` : ''}
                                <div class="detail-item">
                                    <label>Duración:</label>
                                    <span>${log.duration ? log.duration.toFixed(2) + 'ms' : 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Tamaño:</label>
                                    <span>${log.size ? log.size + ' bytes' : 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div class="detail-section full-width">
                                <h4>Mensaje</h4>
                                <div class="message-detail">
                                    ${log.message}
                                </div>
                            </div>
                            
                            <div class="detail-section full-width">
                                <h4>Detalles Adicionales</h4>
                                <div class="details-content">
                                    ${log.details}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-close">Cerrar</button>
                        <button class="btn btn-primary" data-action="copy-all">Copiar Todo</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle modal actions
            modal.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action;
                
                switch (action) {
                    case 'copy-details':
                        this.copyLogDetails(log);
                        break;
                    case 'export-single':
                        this.exportSingleLog(log);
                        break;
                    case 'copy-all':
                        this.copyLogDetails(log, true);
                        break;
                }
            });

            // Close modal events
            modal.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', () => modal.remove());
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            // Keyboard navigation
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') modal.remove();
            });

            // Show modal with animation
            setTimeout(() => modal.classList.add('show'), 10);
            
        } catch (error) {
            console.error('Error showing log details:', error);
            this.showNotification('Error al mostrar detalles del log', 'error');
        }
    }

    // ... existing code ...
    copyLogDetails(log, includeAll = false) {
        const basicInfo = `Log #${log.id}\n` +
                         `Timestamp: ${this.formatTimestamp(log.timestamp)}\n` +
                         `Nivel: ${log.level.toUpperCase()}\n` +
                         `Categoría: ${log.category.toUpperCase()}\n` +
                         `Mensaje: ${log.message}`;
        
        if (includeAll) {
            const fullInfo = basicInfo + `\n` +
                           `Usuario: ${log.user}\n` +
                           `IP: ${log.ip}\n` +
                           `Fuente: ${log.source}\n` +
                           `Sesión: ${log.sessionId}\n` +
                           `Código: ${log.statusCode}\n` +
                           `Duración: ${log.duration}ms\n` +
                           `Detalles: ${log.details}`;
            
            this.copyToClipboard(fullInfo);
            this.showNotification('Detalles completos copiados', 'success');
        } else {
            this.copyToClipboard(basicInfo);
            this.showNotification('Información básica copiada', 'success');
        }
    }

    // Utility method for copying text to clipboard
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('Error al copiar al portapapeles', 'error');
        }
    }

    // Export single log functionality
    exportSingleLog(log) {
        try {
            const logData = [log];
            const csv = this.convertToCSV(logData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `log_${log.id}_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('Log exportado exitosamente', 'success');
            }
        } catch (error) {
            console.error('Error exporting single log:', error);
            this.showNotification('Error al exportar el log', 'error');
        }
    }

    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        try {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${this.getNotificationIcon(type)}"></i>
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `;

            // Add to DOM
            document.body.appendChild(notification);

            // Show with animation
            setTimeout(() => notification.classList.add('show'), 10);

            // Auto remove
            const autoRemove = setTimeout(() => {
                this.removeNotification(notification);
            }, duration);

            // Manual close
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemove);
                this.removeNotification(notification);
            });

        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Loading state management
    showLoadingState(show = true) {
        const loadingOverlay = document.getElementById('loadingOverlay') || this.createLoadingOverlay();
        
        if (show) {
            loadingOverlay.style.display = 'flex';
            setTimeout(() => loadingOverlay.classList.add('show'), 10);
        } else {
            loadingOverlay.classList.remove('show');
            setTimeout(() => loadingOverlay.style.display = 'none', 300);
        }
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Cargando logs...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // Tooltip initialization
    initializeTooltips() {
        try {
            const tooltipElements = document.querySelectorAll('[title]');
            tooltipElements.forEach(element => {
                element.addEventListener('mouseenter', this.showTooltip.bind(this));
                element.addEventListener('mouseleave', this.hideTooltip.bind(this));
            });
        } catch (error) {
            console.error('Error initializing tooltips:', error);
        }
    }

    showTooltip(event) {
        const element = event.target;
        const title = element.getAttribute('title');
        
        if (!title) return;
        
        // Hide title to prevent default tooltip
        element.setAttribute('data-original-title', title);
        element.removeAttribute('title');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = title;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    hideTooltip(event) {
        const element = event.target;
        const originalTitle = element.getAttribute('data-original-title');
        
        if (originalTitle) {
            element.setAttribute('title', originalTitle);
            element.removeAttribute('data-original-title');
        }
        
        const tooltips = document.querySelectorAll('.custom-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    // Performance monitoring
    monitorPerformance() {
        try {
            // Monitor memory usage
            if (performance.memory) {
                const memoryInfo = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                };
                
                console.log('Memory usage:', memoryInfo);
                
                // Warn if memory usage is high
                if (memoryInfo.used > memoryInfo.limit * 0.8) {
                    this.showNotification('Alto uso de memoria detectado', 'warning');
                }
            }
            
            // Monitor performance metrics
            setInterval(() => {
                this.logPerformanceMetrics();
            }, 30000); // Every 30 seconds
            
        } catch (error) {
            console.error('Error monitoring performance:', error);
        }
    }

    logPerformanceMetrics() {
        console.log('Performance Metrics:', {
            renderTime: this.performanceMetrics.renderTime + 'ms',
            filterTime: this.performanceMetrics.filterTime + 'ms',
            searchTime: this.performanceMetrics.searchTime + 'ms',
            totalLogs: this.logs.length,
            filteredLogs: this.filteredLogs.length
        });
    }

    // Screen size adjustment
    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Adjust logs per page based on screen size
        if (isMobile) {
            this.logsPerPage = 10;
        } else if (isTablet) {
            this.logsPerPage = 15;
        } else {
            this.logsPerPage = 20;
        }
        
        // Re-render if needed
        this.renderLogs();
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Save filter state to localStorage
    saveFilterState() {
        try {
            const filterState = {
                level: document.getElementById('logLevel')?.value || 'all',
                category: document.getElementById('logCategory')?.value || 'all',
                date: document.getElementById('logDate')?.value || 'all',
                search: document.getElementById('logSearch')?.value || ''
            };
            localStorage.setItem('logsFilterState', JSON.stringify(filterState));
        } catch (error) {
            console.error('Error saving filter state:', error);
        }
    }

    // Load filter state from localStorage
    loadFilterState() {
        try {
            const savedState = localStorage.getItem('logsFilterState');
            if (savedState) {
                const filterState = JSON.parse(savedState);
                
                const levelFilter = document.getElementById('logLevel');
                const categoryFilter = document.getElementById('logCategory');
                const dateFilter = document.getElementById('logDate');
                const searchInput = document.getElementById('logSearch');
                
                if (levelFilter) levelFilter.value = filterState.level || 'all';
                if (categoryFilter) categoryFilter.value = filterState.category || 'all';
                if (dateFilter) dateFilter.value = filterState.date || 'all';
                if (searchInput) searchInput.value = filterState.search || '';
            }
        } catch (error) {
            console.error('Error loading filter state:', error);
        }
    }

    // Cleanup method
    destroy() {
        try {
            // Stop auto refresh
            this.stopAutoRefresh();
            
            // Clear timers
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer);
            }
            
            // Remove event listeners
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('online', this.handleOnline);
            window.removeEventListener('offline', this.handleOffline);
            
            // Clear data
            this.logs = [];
            this.filteredLogs = [];
            
            console.log('LogsManager destroyed successfully');
        } catch (error) {
            console.error('Error destroying LogsManager:', error);
        }
    }
}

// Initialize the logs manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.logsManager = new LogsManager();
        console.log('LogsManager initialized successfully');
    } catch (error) {
        console.error('Error initializing LogsManager:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.logsManager) {
        window.logsManager.destroy();
    }
});
                           