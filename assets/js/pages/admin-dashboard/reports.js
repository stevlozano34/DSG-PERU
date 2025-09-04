// Enhanced Reports Page JavaScript - Professional Implementation
class ReportsManager {
    constructor() {
        this.reports = [];
        this.filteredReports = [];
        this.currentPage = 1;
        this.reportsPerPage = 10;
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.isGenerating = false;
        this.templates = [
            {
                id: 1,
                name: 'Reporte de Ventas Mensual',
                description: 'Análisis completo de ventas con desglose de ingresos y tendencias',
                icon: 'fas fa-chart-line',
                type: 'sales',
                category: 'financial',
                estimatedTime: '2-3 minutos',
                popularity: 95,
                isNew: false,
                fields: ['revenue', 'transactions', 'products', 'customers']
            },
            {
                id: 2,
                name: 'Análisis de Usuarios',
                description: 'Métricas de actividad y engagement de usuarios',
                icon: 'fas fa-users',
                type: 'users',
                category: 'analytics',
                estimatedTime: '1-2 minutos',
                popularity: 87,
                isNew: false,
                fields: ['active_users', 'sessions', 'retention', 'demographics']
            },
            {
                id: 3,
                name: 'Estado Financiero',
                description: 'Resumen financiero completo con análisis de rentabilidad',
                icon: 'fas fa-coins',
                type: 'financial',
                category: 'financial',
                estimatedTime: '3-5 minutos',
                popularity: 92,
                isNew: false,
                fields: ['revenue', 'expenses', 'profit', 'cash_flow']
            },
            {
                id: 4,
                name: 'Inventario y Stock',
                description: 'Niveles de inventario y gestión de stock',
                icon: 'fas fa-boxes',
                type: 'inventory',
                category: 'operations',
                estimatedTime: '1-2 minutos',
                popularity: 78,
                isNew: false,
                fields: ['stock_levels', 'low_stock', 'turnover', 'suppliers']
            },
            {
                id: 5,
                name: 'Métricas de Rendimiento',
                description: 'Análisis de rendimiento del sistema y optimización',
                icon: 'fas fa-tachometer-alt',
                type: 'performance',
                category: 'technical',
                estimatedTime: '2-3 minutos',
                popularity: 65,
                isNew: true,
                fields: ['response_time', 'uptime', 'errors', 'load']
            },
            {
                id: 6,
                name: 'Análisis de Clientes',
                description: 'Comportamiento y satisfacción del cliente',
                icon: 'fas fa-user-chart',
                type: 'customers',
                category: 'analytics',
                estimatedTime: '2-4 minutos',
                popularity: 83,
                isNew: true,
                fields: ['satisfaction', 'churn', 'lifetime_value', 'segments']
            }
        ];
        this.stats = {
            totalReports: 0,
            completedToday: 0,
            processing: 0,
            totalSize: 0
        };
        this.init();
    }

    async init() {
        this.showLoadingOverlay('Inicializando sistema de reportes...');
        
        try {
            await this.loadSampleData();
            this.setupEventListeners();
            this.renderStatsOverview();
            this.renderTemplates();
            this.renderRecentReports();
            this.setupRealTimeUpdates();
            this.initializeTooltips();
            this.setupKeyboardShortcuts();
            
            this.hideLoadingOverlay();
            this.showToast('Sistema de reportes cargado correctamente', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error al cargar el sistema de reportes', 'error');
            console.error('Error initializing reports:', error);
        }
    }

    async loadSampleData() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const statuses = ['completed', 'processing', 'failed', 'scheduled'];
        const types = ['sales', 'users', 'financial', 'inventory', 'performance', 'customers'];
        const formats = ['pdf', 'excel', 'csv'];
        
        for (let i = 1; i <= 25; i++) {
            const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const format = formats[Math.floor(Math.random() * formats.length)];
            
            this.reports.push({
                id: i,
                name: `${this.getTypeDisplayName(type)} - ${this.formatDate(createdAt, 'short')}`,
                type: type,
                status: status,
                format: format,
                createdAt: createdAt,
                completedAt: status === 'completed' ? new Date(createdAt.getTime() + Math.random() * 3600000) : null,
                size: status === 'completed' ? `${(Math.random() * 10 + 1).toFixed(1)} MB` : null,
                downloadUrl: status === 'completed' ? `#download-${i}` : null,
                progress: status === 'processing' ? Math.floor(Math.random() * 80 + 10) : null,
                error: status === 'failed' ? 'Error de conexión con la base de datos' : null,
                scheduledFor: status === 'scheduled' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
            });
        }
        
        this.filteredReports = [...this.reports];
        this.updateStats();
    }

    setupEventListeners() {
        // Generate report button
        const generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.showGenerateModal());
        }

        // Report period change
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', (e) => {
                this.toggleDateRange(e.target.value === 'custom');
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterReports();
            });
        }

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            }
            
            // Template selection
            if (e.target.closest('.template-card')) {
                const templateId = parseInt(e.target.closest('.template-card').dataset.templateId);
                this.selectTemplate(templateId);
            }
            
            // Report actions
            if (e.target.matches('.btn-icon')) {
                const action = e.target.dataset.action;
                const reportId = parseInt(e.target.dataset.reportId);
                this.handleReportAction(action, reportId);
            }
        });

        // Refresh button
        const refreshBtn = document.querySelector('.btn-secondary');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshReports());
        }

        // Export all button
        const exportBtn = document.querySelector('.export-all-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAllReports());
        }
    }

    renderStatsOverview() {
        const statsContainer = document.querySelector('.stats-overview');
        if (!statsContainer) {
            // Create stats container if it doesn't exist
            const dashboardContent = document.querySelector('.dashboard-content');
            if (dashboardContent) {
                const statsHTML = `
                    <div class="stats-overview">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-number" id="totalReports">${this.stats.totalReports}</div>
                                <div class="stat-label">Total de Reportes</div>
                                <div class="stat-change positive">+12% este mes</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-number" id="completedToday">${this.stats.completedToday}</div>
                                <div class="stat-label">Completados Hoy</div>
                                <div class="stat-change positive">+5 desde ayer</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-number" id="processing">${this.stats.processing}</div>
                                <div class="stat-label">En Proceso</div>
                                <div class="stat-change neutral">Sin cambios</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-hdd"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-number" id="totalSize">${this.stats.totalSize} GB</div>
                                <div class="stat-label">Almacenamiento</div>
                                <div class="stat-change negative">85% usado</div>
                            </div>
                        </div>
                    </div>
                `;
                dashboardContent.insertAdjacentHTML('afterbegin', statsHTML);
            }
        } else {
            // Update existing stats
            document.getElementById('totalReports').textContent = this.stats.totalReports;
            document.getElementById('completedToday').textContent = this.stats.completedToday;
            document.getElementById('processing').textContent = this.stats.processing;
            document.getElementById('totalSize').textContent = this.stats.totalSize + ' GB';
        }
    }

    renderTemplates() {
        const templatesGrid = document.querySelector('.templates-grid');
        if (!templatesGrid) return;

        templatesGrid.innerHTML = this.templates.map(template => `
            <div class="template-card" data-template-id="${template.id}">
                <div class="template-preview">
                    <div class="template-icon">
                        <i class="${template.icon}"></i>
                    </div>
                    ${template.isNew ? '<div class="template-badge new"><i class="fas fa-star"></i> Nuevo</div>' : ''}
                    ${template.popularity > 90 ? '<div class="template-badge popular"><i class="fas fa-fire"></i> Popular</div>' : ''}
                </div>
                <div class="template-info">
                    <div class="template-title">${template.name}</div>
                    <div class="template-description">${template.description}</div>
                    <div class="template-stats">
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            ${template.estimatedTime}
                        </div>
                        <div class="stat">
                            <i class="fas fa-thumbs-up"></i>
                            ${template.popularity}%
                        </div>
                    </div>
                    <button class="btn btn-outline template-btn" data-template-id="${template.id}">
                        <i class="fas fa-plus"></i>
                        Usar Plantilla
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRecentReports() {
        const reportsGrid = document.querySelector('.reports-grid');
        if (!reportsGrid) return;

        const startIndex = (this.currentPage - 1) * this.reportsPerPage;
        const endIndex = startIndex + this.reportsPerPage;
        const paginatedReports = this.filteredReports.slice(startIndex, endIndex);

        if (paginatedReports.length === 0) {
            reportsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="empty-title">No se encontraron reportes</div>
                    <div class="empty-description">
                        ${this.searchQuery ? 'Intenta con otros términos de búsqueda' : 'Genera tu primer reporte usando las plantillas disponibles'}
                    </div>
                    <button class="btn btn-primary" onclick="reportsManager.showGenerateModal()">
                        <i class="fas fa-plus"></i>
                        Generar Reporte
                    </button>
                </div>
            `;
            return;
        }

        reportsGrid.innerHTML = paginatedReports.map(report => `
            <div class="report-card" data-report-id="${report.id}">
                <div class="report-status">
                    <div class="status-indicator ${report.status}"></div>
                </div>
                <div class="report-icon">
                    <i class="${this.getTypeIcon(report.type)}"></i>
                </div>
                <div class="report-info">
                    <div class="report-title">${report.name}</div>
                    <div class="report-date">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(report.createdAt)}
                    </div>
                    <div class="report-meta">
                        ${report.size ? `<span class="report-size"><i class="fas fa-file"></i> ${report.size}</span>` : ''}
                        <span class="report-format ${report.format}">
                            <i class="fas fa-file-${this.getFormatIcon(report.format)}"></i>
                            ${report.format.toUpperCase()}
                        </span>
                        <span class="report-status-text ${report.status}">
                            <i class="fas fa-${this.getStatusIcon(report.status)}"></i>
                            ${this.getStatusText(report.status)}
                        </span>
                    </div>
                    ${report.status === 'processing' && report.progress ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${report.progress}%"></div>
                        </div>
                        <div class="progress-text">${report.progress}% completado</div>
                    ` : ''}
                    ${report.error ? `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${report.error}</div>` : ''}
                </div>
                <div class="report-actions">
                    ${this.getActionButtons(report)}
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredReports.length / this.reportsPerPage);
        if (totalPages <= 1) return;

        let paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            document.querySelector('.reports-section').appendChild(paginationContainer);
        }

        let paginationHTML = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="reportsManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="reportsManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="reportsManager.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="pagination-info">
                Mostrando ${(this.currentPage - 1) * this.reportsPerPage + 1}-${Math.min(this.currentPage * this.reportsPerPage, this.filteredReports.length)} de ${this.filteredReports.length}
            </div>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    getActionButtons(report) {
        let buttons = '';
        
        switch (report.status) {
            case 'completed':
                buttons = `
                    <button class="btn-icon download" title="Descargar" data-action="download" data-report-id="${report.id}">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon view" title="Ver" data-action="view" data-report-id="${report.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon share" title="Compartir" data-action="share" data-report-id="${report.id}">
                        <i class="fas fa-share"></i>
                    </button>
                `;
                break;
            case 'processing':
                buttons = `
                    <button class="btn-icon cancel" title="Cancelar" data-action="cancel" data-report-id="${report.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn-icon view" title="Ver Estado" data-action="status" data-report-id="${report.id}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                `;
                break;
            case 'failed':
                buttons = `
                    <button class="btn-icon view" title="Ver Error" data-action="error" data-report-id="${report.id}">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                    <button class="btn-icon download" title="Reintentar" data-action="retry" data-report-id="${report.id}">
                        <i class="fas fa-redo"></i>
                    </button>
                `;
                break;
            case 'scheduled':
                buttons = `
                    <button class="btn-icon view" title="Ver Programación" data-action="schedule" data-report-id="${report.id}">
                        <i class="fas fa-clock"></i>
                    </button>
                    <button class="btn-icon cancel" title="Cancelar" data-action="cancel" data-report-id="${report.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                break;
        }
        
        buttons += `
            <button class="btn-icon more" title="Más opciones" data-action="more" data-report-id="${report.id}">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        `;
        
        return buttons;
    }

    async handleReportAction(action, reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        switch (action) {
            case 'download':
                await this.downloadReport(report);
                break;
            case 'view':
                this.viewReport(report);
                break;
            case 'share':
                this.shareReport(report);
                break;
            case 'cancel':
                this.cancelReport(report);
                break;
            case 'retry':
                this.retryReport(report);
                break;
            case 'error':
                this.showErrorDetails(report);
                break;
            case 'status':
                this.showStatusDetails(report);
                break;
            case 'schedule':
                this.showScheduleDetails(report);
                break;
            case 'more':
                this.showMoreOptions(report);
                break;
        }
    }

    async downloadReport(report) {
        if (report.status !== 'completed') {
            this.showToast('El reporte no está disponible para descarga', 'warning');
            return;
        }

        this.showToast(`Iniciando descarga de ${report.name}...`, 'info');
        
        // Simulate download progress
        const progressToast = this.showProgressToast('Descargando reporte...', 0);
        
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.updateProgressToast(progressToast, i);
        }
        
        this.hideProgressToast(progressToast);
        this.showToast('Descarga completada exitosamente', 'success');
        
        // In a real app, trigger actual download
        // window.open(report.downloadUrl, '_blank');
    }

    viewReport(report) {
        // Create modal for report preview
        const modal = this.createModal('Vista Previa del Reporte', `
            <div class="report-preview">
                <div class="preview-header">
                    <h3>${report.name}</h3>
                    <p>Generado el ${this.formatDate(report.createdAt)}</p>
                </div>
                <div class="preview-content">
                    <div class="preview-placeholder">
                        <i class="fas fa-file-alt"></i>
                        <p>Vista previa del reporte</p>
                        <p class="text-muted">En una aplicación real, aquí se mostraría el contenido del reporte</p>
                    </div>
                </div>
                <div class="preview-actions">
                    <button class="btn btn-primary" onclick="reportsManager.downloadReport(${JSON.stringify(report).replace(/"/g, '&quot;')})">
                        <i class="fas fa-download"></i>
                        Descargar
                    </button>
                    <button class="btn btn-secondary" onclick="reportsManager.shareReport(${JSON.stringify(report).replace(/"/g, '&quot;')})">
                        <i class="fas fa-share"></i>
                        Compartir
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    shareReport(report) {
        const shareUrl = `${window.location.origin}/reports/share/${report.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: report.name,
                text: `Compartiendo reporte: ${report.name}`,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showToast('Enlace copiado al portapapeles', 'success');
            }).catch(() => {
                this.showToast('Error al copiar enlace', 'error');
            });
        }
    }

    cancelReport(report) {
        if (!confirm(`¿Estás seguro de que quieres cancelar "${report.name}"?`)) return;
        
        report.status = 'cancelled';
        this.updateStats();
        this.renderRecentReports();
        this.showToast('Reporte cancelado', 'info');
    }

    retryReport(report) {
        report.status = 'processing';
        report.progress = 0;
        report.error = null;
        
        this.updateStats();
        this.renderRecentReports();
        this.showToast('Reintentando generación del reporte...', 'info');
        
        // Simulate retry process
        this.simulateReportGeneration(report);
    }

    async simulateReportGeneration(report) {
        const duration = Math.random() * 10000 + 5000; // 5-15 seconds
        const steps = 20;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            await new Promise(resolve => setTimeout(resolve, stepDuration));
            report.progress = Math.floor((i / steps) * 100);
            
            if (i === steps) {
                // 90% chance of success
                if (Math.random() < 0.9) {
                    report.status = 'completed';
                    report.completedAt = new Date();
                    report.size = `${(Math.random() * 10 + 1).toFixed(1)} MB`;
                    report.downloadUrl = `#download-${report.id}`;
                    this.showToast(`Reporte "${report.name}" completado`, 'success');
                } else {
                    report.status = 'failed';
                    report.error = 'Error durante la generación del reporte';
                    this.showToast(`Error al generar "${report.name}"`, 'error');
                }
                report.progress = null;
            }
            
            this.updateStats();
            this.renderRecentReports();
        }
    }

    selectTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        // Update form with template data
        const reportTypeSelect = document.getElementById('reportType');
        if (reportTypeSelect) {
            reportTypeSelect.value = template.type;
        }

        // Highlight selected template
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-template-id="${templateId}"]`).classList.add('selected');

        this.showToast(`Plantilla "${template.name}" seleccionada`, 'success');
        
        // Auto-scroll to generator
        const generator = document.querySelector('.report-generator');
        if (generator) {
            generator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showGenerateModal() {
        const modal = this.createModal('Generar Nuevo Reporte', `
            <form id="generateReportForm" class="generate-form">
                <div class="form-section">
                    <h4 class="form-section-title">Configuración del Reporte</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-chart-bar"></i>
                                Tipo de Reporte
                            </label>
                            <div class="select-wrapper">
                                <select id="reportType" name="reportType" class="form-select" required>
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="sales">Reporte de Ventas</option>
                                    <option value="users">Reporte de Usuarios</option>
                                    <option value="financial">Reporte Financiero</option>
                                    <option value="inventory">Reporte de Inventario</option>
                                    <option value="performance">Reporte de Rendimiento</option>
                                    <option value="customers">Análisis de Clientes</option>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-calendar"></i>
                                Período
                            </label>
                            <div class="select-wrapper">
                                <select id="reportPeriod" name="reportPeriod" class="form-select" required>
                                    <option value="today">Hoy</option>
                                    <option value="week">Esta Semana</option>
                                    <option value="month" selected>Este Mes</option>
                                    <option value="quarter">Este Trimestre</option>
                                    <option value="year">Este Año</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="date-range-section" id="dateRangeSection" style="display: none;">
                        <h5>Rango de Fechas Personalizado</h5>
                        <div class="date-range">
                            <div class="form-group">
                                <label class="form-label">Fecha Inicio</label>
                                <input type="date" id="startDate" name="startDate" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fecha Fin</label>
                                <input type="date" id="endDate" name="endDate" class="form-input">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4 class="form-section-title">Formato de Salida</h4>
                    <div class="format-options">
                        <label class="format-option">
                            <input type="radio" name="format" value="pdf" checked>
                            <div class="format-card">
                                <i class="fas fa-file-pdf"></i>
                                <span>PDF</span>
                            </div>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="format" value="excel">
                            <div class="format-card">
                                <i class="fas fa-file-excel"></i>
                                <span>Excel</span>
                            </div>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="format" value="csv">
                            <div class="format-card">
                                <i class="fas fa-file-csv"></i>
                                <span>CSV</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4 class="form-section-title">Opciones Avanzadas</h4>
                    <div class="advanced-options">
                        <div class="options-grid">
                            <label class="checkbox-option">
                                <input type="checkbox" name="includeCharts" checked>
                                <div class="checkmark"></div>
                                <div class="option-text">
                                    <i class="fas fa-chart-pie"></i>
                                    Incluir Gráficos
                                </div>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="includeRawData">
                                <div class="checkmark"></div>
                                <div class="option-text">
                                    <i class="fas fa-table"></i>
                                    Datos en Bruto
                                </div>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="emailNotification" checked>
                                <div class="checkmark"></div>
                                <div class="option-text">
                                    <i class="fas fa-envelope"></i>
                                    Notificar por Email
                                </div>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="scheduleRecurring">
                                <div class="checkmark"></div>
                                <div class="option-text">
                                    <i class="fas fa-sync"></i>
                                    Programar Recurrente
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="reportsManager.hideModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-cog"></i>
                        Generar Reporte
                    </button>
                </div>
            </form>
        `);
        
        this.showModal(modal);
        
        // Setup form event listeners
        const form = document.getElementById('generateReportForm');
        const periodSelect = document.getElementById('reportPeriod');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateReport(new FormData(form));
        });
        
        periodSelect.addEventListener('change', (e) => {
            this.toggleDateRange(e.target.value === 'custom');
        });
    }

    async generateReport(formData) {
        if (this.isGenerating) {
            this.showToast('Ya hay un reporte generándose', 'warning');
            return;
        }
        
        this.isGenerating = true;
        
        const reportData = {
            type: formData.get('reportType'),
            period: formData.get('reportPeriod'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            format: formData.get('format'),
            includeCharts: formData.get('includeCharts') === 'on',
            includeRawData: formData.get('includeRawData') === 'on',
            emailNotification: formData.get('emailNotification') === 'on',
            scheduleRecurring: formData.get('scheduleRecurring') === 'on'
        };
        
        // Validate required fields
        if (!reportData.type) {
            this.showToast('Por favor selecciona un tipo de reporte', 'error');
            this.isGenerating = false;
            return;
        }
        
        if (reportData.period === 'custom' && (!reportData.startDate || !reportData.endDate)) {
            this.showToast('Por favor selecciona las fechas de inicio y fin', 'error');
            this.isGenerating = false;
            return;
        }
        
        this.hideModal();
        
        // Create new report
        const newReport = {
            id: this.reports.length + 1,
            name: `${this.getTypeDisplayName(reportData.type)} - ${this.formatDate(new Date(), 'short')}`,
            type: reportData.type,
            status: 'processing',
            format: reportData.format,
            createdAt: new Date(),
            completedAt: null,
            size: null,
            downloadUrl: null,
            progress: 0,
            error: null
        };
        
        this.reports.unshift(newReport);
        this.filteredReports = [...this.reports];
        this.updateStats();
        this.renderRecentReports();
        
        this.showToast('Iniciando generación del reporte...', 'info');
        
        // Simulate report generation
        await this.simulateReportGeneration(newReport);
        
        this.isGenerating = false;
    }

    filterReports() {
        this.filteredReports = this.reports.filter(report => {
            const matchesSearch = !this.searchQuery || 
                report.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                report.type.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            const matchesFilter = this.currentFilter === 'all' || report.status === this.currentFilter;
            
            return matchesSearch && matchesFilter;
        });
        
        this.currentPage = 1;
        this.renderRecentReports();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.filterReports();
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredReports.length / this.reportsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderRecentReports();
    }

    async refreshReports() {
        this.showToast('Actualizando reportes...', 'info');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.updateStats();
        this.renderRecentReports();
        this.showToast('Reportes actualizados', 'success');
    }

    async exportAllReports() {
        const completedReports = this.reports.filter(r => r.status === 'completed');
        
        if (completedReports.length === 0) {
            this.showToast('No hay reportes completados para exportar', 'warning');
            return;
        }
        
        this.showToast(`Exportando ${completedReports.length} reportes...`, 'info');
        
        // Simulate export process
        const progressToast = this.showProgressToast('Preparando exportación...', 0);
        
        for (let i = 0; i <= 100; i += 5) {
            await new Promise(resolve => setTimeout(resolve, 50));
            this.updateProgressToast(progressToast, i);
        }
        
        this.hideProgressToast(progressToast);
        this.showToast('Exportación completada', 'success');
    }

    setupRealTimeUpdates() {
        setInterval(() => {
            const processingReports = this.reports.filter(r => r.status === 'processing');
            
            processingReports.forEach(report => {
                if (report.progress !== null && report.progress < 100) {
                    report.progress = Math.min(report.progress + Math.random() * 10, 100);
                    
                    if (report.progress >= 100) {
                        // 95% chance of success
                        if (Math.random() < 0.95) {
                            report.status = 'completed';
                            report.completedAt = new Date();
                            report.size = `${(Math.random() * 10 + 1).toFixed(1)} MB`;
                            report.downloadUrl = `#download-${report.id}`;
                            this.showToast(`Reporte "${report.name}" completado`, 'success');
                        } else {
                            report.status = 'failed';
                            report.error = 'Error durante la generación';
                            this.showToast(`Error en "${report.name}"`, 'error');
                        }
                        report.progress = null;
                    }
                }
            });
            
            if (processingReports.length > 0) {
                this.updateStats();
                this.renderRecentReports();
            }
        }, 2000);
    }

    updateStats() {
        this.stats.totalReports = this.reports.length;
        this.stats.completedToday = this.reports.filter(r => 
            r.status === 'completed' && 
            this.isToday(r.completedAt)
        ).length;
        this.stats.processing = this.reports.filter(r => r.status === 'processing').length;
        
        const totalSizeBytes = this.reports
            .filter(r => r.size)
            .reduce((total, r) => total + parseFloat(r.size), 0);
        this.stats.totalSize = (totalSizeBytes / 1024).toFixed(1); // Convert MB to GB
        
        this.renderStatsOverview();
    }

    // Utility methods
    toggleDateRange(show) {
        const dateRangeSection = document.getElementById('dateRangeSection');
        if (dateRangeSection) {
            dateRangeSection.style.display = show ? 'block' : 'none';
        }
    }

    getTypeDisplayName(type) {
        const names = {
            sales: 'Reporte de Ventas',
            users: 'Reporte de Usuarios',
            financial: 'Reporte Financiero',
            inventory: 'Reporte de Inventario',
            performance: 'Reporte de Rendimiento',
            customers: 'Análisis de Clientes'
        };
        return names[type] || type;
    }

    getTypeIcon(type) {
        const icons = {
            sales: 'fas fa-chart-line',
            users: 'fas fa-users',
            financial: 'fas fa-coins',
            inventory: 'fas fa-boxes',
            performance: 'fas fa-tachometer-alt',
            customers: 'fas fa-user-chart'
        };
        return icons[type] || 'fas fa-file-alt';
    }

    getFormatIcon(format) {
        const icons = {
            pdf: 'pdf',
            excel: 'excel',
            csv: 'csv'
        };
        return icons[format] || 'alt';
    }

    getStatusIcon(status) {
        const icons = {
            completed: 'check-circle',
            processing: 'clock',
            failed: 'exclamation-triangle',
            scheduled: 'calendar',
            cancelled: 'times-circle'
        };
        return icons[status] || 'question-circle';
    }

    getStatusText(status) {
        const texts = {
            completed: 'Completado',
            processing: 'Procesando',
            failed: 'Fallido',
            scheduled: 'Programado',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    }

    formatDate(date, format = 'full') {
        if (!date) return '';
        
        const d = new Date(date);
        
        if (format === 'short') {
            return new Intl.DateTimeFormat('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(d);
        }
        
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    }

    isToday(date) {
        if (!date) return false;
        const today = new Date();
        const d = new Date(date);
        return d.toDateString() === today.toDateString();
    }

    // Toast notification system
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${this.getToastTitle(type)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, duration);
        }
        
        return toast;
    }

    showProgressToast(message, progress) {
        const toast = document.createElement('div');
        toast.className = 'toast progress';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-download"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">Descarga en Progreso</div>
                <div class="toast-message">${message}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">${progress}%</div>
            </div>
        `;
        
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        return toast;
    }

    updateProgressToast(toast, progress) {
        const progressFill = toast.querySelector('.progress-fill');
        const progressText = toast.querySelector('.progress-text');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;
    }

    hideProgressToast(toast) {
        if (toast && toast.parentElement) {
            toast.remove();
        }
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || 'Notificación';
    }

    // Modal system
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="reportsManager.hideModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    hideModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    // Loading overlay
    showLoadingOverlay(message = 'Cargando...') {
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>Cargando</h3>
                <p>${message}</p>
            </div>
        `;
        
        overlay.classList.add('active');
    }

    hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New report
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showGenerateModal();
            }
            
            // Ctrl/Cmd + R: Refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshReports();
            }
            
            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }
        });
    }

    // Tooltips
    initializeTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('title'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        let tooltip = document.querySelector('.tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Error details modal
    showErrorDetails(report) {
        const modal = this.createModal('Detalles del Error', `
            <div class="error-details">
                <div class="error-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error en ${report.name}</h4>
                </div>
                <div class="error-content">
                    <p><strong>Mensaje:</strong> ${report.error}</p>
                    <p><strong>Fecha:</strong> ${this.formatDate(report.createdAt)}</p>
                    <p><strong>Tipo:</strong> ${this.getTypeDisplayName(report.type)}</p>
                </div>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="reportsManager.retryReport(${JSON.stringify(report).replace(/"/g, '&quot;')}); reportsManager.hideModal();">
                        <i class="fas fa-redo"></i>
                        Reintentar
                    </button>
                    <button class="btn btn-secondary" onclick="reportsManager.hideModal()">
                        Cerrar
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    showStatusDetails(report) {
        const modal = this.createModal('Estado del Reporte', `
            <div class="status-details">
                <div class="status-header">
                    <i class="fas fa-info-circle"></i>
                    <h4>${report.name}</h4>
                </div>
                <div class="status-content">
                    <div class="status-item">
                        <span class="label">Estado:</span>
                        <span class="value">${this.getStatusText(report.status)}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Progreso:</span>
                        <span class="value">${report.progress || 0}%</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Iniciado:</span>
                        <span class="value">${this.formatDate(report.createdAt)}</span>
                    </div>
                    ${report.progress ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${report.progress}%"></div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    showScheduleDetails(report) {
        const modal = this.createModal('Programación del Reporte', `
            <div class="schedule-details">
                <div class="schedule-header">
                    <i class="fas fa-calendar"></i>
                    <h4>${report.name}</h4>
                </div>
                <div class="schedule-content">
                    <p><strong>Programado para:</strong> ${this.formatDate(report.scheduledFor)}</p>
                    <p><strong>Tipo:</strong> ${this.getTypeDisplayName(report.type)}</p>
                    <p><strong>Formato:</strong> ${report.format.toUpperCase()}</p>
                </div>
                <div class="schedule-actions">
                    <button class="btn btn-primary" onclick="reportsManager.hideModal()">
                        Entendido
                    </button>
                    <button class="btn btn-secondary" onclick="reportsManager.cancelReport(${JSON.stringify(report).replace(/"/g, '&quot;')}); reportsManager.hideModal();">
                        Cancelar Programación
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    showMoreOptions(report) {
        const modal = this.createModal('Opciones del Reporte', `
            <div class="more-options">
                <div class="options-header">
                    <h4>${report.name}</h4>
                </div>
                <div class="options-list">
                    <button class="option-btn" onclick="reportsManager.duplicateReport(${JSON.stringify(report).replace(/"/g, '&quot;')}); reportsManager.hideModal();">
                        <i class="fas fa-copy"></i>
                        Duplicar Reporte
                    </button>
                    <button class="option-btn" onclick="reportsManager.scheduleReport(${JSON.stringify(report).replace(/"/g, '&quot;')}); reportsManager.hideModal();">
                        <i class="fas fa-calendar-plus"></i>
                        Programar Recurrente
                    </button>
                                        <button class="option-btn" onclick="reportsManager.exportReport(${JSON.stringify(report).replace(/"/g, '&quot;')}); reportsManager.hideModal();">
                        <i class="fas fa-file-export"></i>
                        Exportar en Otro Formato
                    </button>
                    <button class="option-btn" onclick="reportsManager.archiveReport(${report.id}); reportsManager.hideModal();">
                        <i class="fas fa-archive"></i>
                        Archivar Reporte
                    </button>
                    <button class="option-btn danger" onclick="reportsManager.deleteReport(${report.id}); reportsManager.hideModal();">
                        <i class="fas fa-trash"></i>
                        Eliminar Reporte
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    duplicateReport(report) {
        const duplicatedReport = {
            ...report,
            id: this.reports.length + 1,
            name: `${report.name} (Copia)`,
            status: 'scheduled',
            createdAt: new Date(),
            completedAt: null,
            scheduledFor: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        };
        
        this.reports.unshift(duplicatedReport);
        this.filterReports();
        this.updateStats();
        this.showToast('Reporte duplicado exitosamente', 'success');
    }

    scheduleReport(report) {
        const modal = this.createModal('Programar Reporte Recurrente', `
            <div class="schedule-form">
                <div class="form-group">
                    <label for="scheduleFrequency">Frecuencia</label>
                    <select id="scheduleFrequency" class="form-control">
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="quarterly">Trimestral</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="scheduleTime">Hora de Ejecución</label>
                    <input type="time" id="scheduleTime" class="form-control" value="09:00">
                </div>
                <div class="form-group">
                    <label for="scheduleStartDate">Fecha de Inicio</label>
                    <input type="date" id="scheduleStartDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="scheduleEndDate">Fecha de Fin (Opcional)</label>
                    <input type="date" id="scheduleEndDate" class="form-control">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="reportsManager.hideModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="reportsManager.confirmSchedule('${report.id}')">Programar</button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    confirmSchedule(reportId) {
        const frequency = document.getElementById('scheduleFrequency').value;
        const time = document.getElementById('scheduleTime').value;
        const startDate = document.getElementById('scheduleStartDate').value;
        const endDate = document.getElementById('scheduleEndDate').value;
        
        // Here you would typically send this to your backend
        console.log('Scheduling report:', { reportId, frequency, time, startDate, endDate });
        
        this.hideModal();
        this.showToast('Reporte programado exitosamente', 'success');
    }

    exportReport(report) {
        const modal = this.createModal('Exportar Reporte', `
            <div class="export-form">
                <div class="form-group">
                    <label>Formato de Exportación</label>
                    <div class="format-options">
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="pdf" checked>
                            <div class="format-card">
                                <i class="fas fa-file-pdf"></i>
                                <span>PDF</span>
                            </div>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="excel">
                            <div class="format-card">
                                <i class="fas fa-file-excel"></i>
                                <span>Excel</span>
                            </div>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="csv">
                            <div class="format-card">
                                <i class="fas fa-file-csv"></i>
                                <span>CSV</span>
                            </div>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="json">
                            <div class="format-card">
                                <i class="fas fa-file-code"></i>
                                <span>JSON</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="includeCharts"> Incluir gráficos
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="includeRawData"> Incluir datos sin procesar
                    </label>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="reportsManager.hideModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="reportsManager.confirmExport(${report.id})">Exportar</button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    confirmExport(reportId) {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const includeCharts = document.getElementById('includeCharts').checked;
        const includeRawData = document.getElementById('includeRawData').checked;
        
        this.hideModal();
        this.showLoadingOverlay('Exportando reporte...');
        
        // Simulate export process
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.showToast(`Reporte exportado en formato ${format.toUpperCase()}`, 'success');
        }, 2000);
    }

    archiveReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            report.archived = true;
            this.filterReports();
            this.updateStats();
            this.showToast('Reporte archivado exitosamente', 'success');
        }
    }

    deleteReport(reportId) {
        if (confirm('¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.')) {
            this.reports = this.reports.filter(r => r.id !== reportId);
            this.filterReports();
            this.updateStats();
            this.showToast('Reporte eliminado exitosamente', 'success');
        }
    }

    // Utility methods for keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New report
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showGenerateModal();
            }
            
            // Ctrl/Cmd + R: Refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshReports();
            }
            
            // Escape: Close modal
            if (e.key === 'Escape') {
                this.hideModal();
            }
            
            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    // Initialize tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('title'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Real-time updates simulation
    setupRealTimeUpdates() {
        setInterval(() => {
            // Simulate report progress updates
            const processingReports = this.reports.filter(r => r.status === 'processing');
            processingReports.forEach(report => {
                if (report.progress < 100) {
                    report.progress += Math.floor(Math.random() * 10) + 1;
                    if (report.progress >= 100) {
                        report.status = 'completed';
                        report.completedAt = new Date();
                        report.size = `${(Math.random() * 10 + 1).toFixed(1)} MB`;
                        report.downloadUrl = `#download-${report.id}`;
                        this.showToast(`Reporte "${report.name}" completado`, 'success');
                    }
                }
            });
            
            // Update display if there are processing reports
            if (processingReports.length > 0) {
                this.renderRecentReports();
                this.updateStats();
            }
        }, 3000); // Update every 3 seconds
    }

    // Export all reports functionality
    exportAllReports() {
        const completedReports = this.reports.filter(r => r.status === 'completed');
        
        if (completedReports.length === 0) {
            this.showToast('No hay reportes completados para exportar', 'warning');
            return;
        }
        
        this.showLoadingOverlay(`Exportando ${completedReports.length} reportes...`);
        
        // Simulate bulk export
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.showToast(`${completedReports.length} reportes exportados exitosamente`, 'success');
        }, 3000);
    }
}

// Initialize the reports manager when the page loads
let reportsManager;

document.addEventListener('DOMContentLoaded', () => {
    reportsManager = new ReportsManager();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportsManager;
}