/**
 * ===================================
 * SETTINGS MANAGER - ENHANCED VERSION
 * ===================================
 * Advanced settings management with comprehensive notifications,
 * validation, error handling, and modern features
 */

class SettingsManager {
    constructor() {
        this.settings = {
            general: {
                siteName: 'DSG Admin',
                siteDescription: 'Digital Solutions Group Administration Panel',
                timezone: 'UTC',
                language: 'es',
                dateFormat: 'DD/MM/YYYY',
                currency: 'USD',
                companyName: 'Fixture Company',
                contactEmail: 'contact@fixture.com',
                phone: '+1 234 567 8900',
                address: '',
                logo: '',
                favicon: '',
                maintenanceMode: false,
                debugMode: false
            },
            security: {
                twoFactorAuth: true,
                sessionTimeout: 30,
                passwordExpiry: 90,
                loginAttempts: 5,
                requireStrongPassword: true,
                minPasswordLength: 8,
                forcePasswordChange: false,
                ipWhitelist: [],
                sslRequired: true,
                bruteForceProtection: true,
                accountLockoutDuration: 15,
                passwordHistory: 5
            },
            notifications: {
                emailNotifications: true,
                pushNotifications: false,
                smsNotifications: false,
                orderUpdates: true,
                systemAlerts: true,
                marketingEmails: false,
                emailNewOrders: true,
                emailPayments: true,
                emailNewUsers: false,
                pushSystemAlerts: true,
                pushReminders: true,
                weeklyReports: true,
                monthlyReports: true,
                criticalAlerts: true
            },
            integrations: {
                stripe: { connected: true, status: 'active', apiKey: '', webhookUrl: '' },
                paypal: { connected: false, status: 'inactive', clientId: '', clientSecret: '' },
                mailchimp: { connected: false, status: 'inactive', apiKey: '', listId: '' },
                slack: { connected: false, status: 'inactive', webhookUrl: '', channel: '' },
                analytics: { connected: true, status: 'active', trackingId: '', propertyId: '' },
                zapier: { connected: false, status: 'inactive', apiKey: '' },
                twilio: { connected: false, status: 'inactive', accountSid: '', authToken: '' },
                aws: { connected: false, status: 'inactive', accessKey: '', secretKey: '', region: '' }
            },
            backup: {
                frequency: 'daily',
                retention: 30,
                autoBackup: true,
                cloudStorage: false,
                encryptBackups: true,
                lastBackup: null,
                backupSize: '0 MB',
                backupLocation: '/backups'
            },
            performance: {
                cacheEnabled: true,
                compressionEnabled: true,
                minifyAssets: true,
                lazyLoading: true,
                cdnEnabled: false,
                maxFileSize: 10,
                sessionStorage: 'database',
                logLevel: 'info'
            }
        };
        
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/,
            url: /^https?:\/\/.+/,
            strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        };
        
        this.unsavedChanges = false;
        this.autoSaveInterval = null;
        this.currentTab = 'general';
        this.loadingStates = new Set();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSettings();
        this.initPasswordStrength();
        this.renderIntegrations();
        this.initAutoSave();
        this.initKeyboardShortcuts();
        this.initTooltips();
        this.checkSystemStatus();
        this.showWelcomeNotification();
    }

    bindEvents() {
        // Navigation tabs with enhanced functionality
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.dataset.tab;
                this.switchSection(target);
            });
        });

        // Form submissions with validation
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings(form);
            });
            
            // Track changes for unsaved warning
            form.addEventListener('input', () => {
                this.markUnsavedChanges();
            });
        });

        // Enhanced toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleToggleChange(e.target);
            });
        });

        // Password strength checker
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value, e.target);
            });
        });

        // Integration management
        document.addEventListener('click', (e) => {
            if (e.target.closest('.integration-card')) {
                const card = e.target.closest('.integration-card');
                const integration = card.dataset.integration;
                
                if (e.target.classList.contains('btn-primary')) {
                    this.connectIntegration(integration);
                } else if (e.target.classList.contains('btn-outline')) {
                    this.configureIntegration(integration);
                }
            }
        });

        // Backup management
        const backupBtn = document.getElementById('createBackupBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }

        // File uploads
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('settingsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchSettings(e.target.value);
            });
        }

        // Prevent accidental navigation
        window.addEventListener('beforeunload', (e) => {
            if (this.unsavedChanges) {
                e.preventDefault();
                e.returnValue = '¿Estás seguro de que quieres salir? Tienes cambios sin guardar.';
                return e.returnValue;
            }
        });
    }

    switchSection(sectionName) {
        if (this.unsavedChanges) {
            if (!confirm('Tienes cambios sin guardar. ¿Quieres continuar sin guardar?')) {
                return;
            }
        }

        // Update navigation with animation
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${sectionName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            this.showNotification(`Sección ${this.formatSectionName(sectionName)} activada`, 'info', 2000);
        }

        // Update content with fade effect
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const activePanel = document.getElementById(sectionName);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        this.currentTab = sectionName;
        this.unsavedChanges = false;
        
        // Track analytics
        this.trackEvent('section_switch', { section: sectionName });
    }

    loadSettings() {
        this.showLoadingState('Cargando configuraciones...');
        
        try {
            // Simulate API call
            setTimeout(() => {
                // Load general settings
                Object.keys(this.settings.general).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = this.settings.general[key];
                        } else {
                            input.value = this.settings.general[key];
                        }
                    }
                });

                // Load security settings
                Object.keys(this.settings.security).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = this.settings.security[key];
                        } else {
                            input.value = this.settings.security[key];
                        }
                    }
                });

                // Load notification settings
                Object.keys(this.settings.notifications).forEach(key => {
                    const input = document.getElementById(key);
                    if (input && input.type === 'checkbox') {
                        input.checked = this.settings.notifications[key];
                    }
                });

                // Load backup settings
                Object.keys(this.settings.backup).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = this.settings.backup[key];
                        } else {
                            input.value = this.settings.backup[key];
                        }
                    }
                });

                this.hideLoadingState();
                this.showNotification('Configuraciones cargadas exitosamente', 'success');
                this.updateLastSyncTime();
            }, 1000);
        } catch (error) {
            this.hideLoadingState();
            this.showNotification('Error al cargar las configuraciones', 'error');
            console.error('Settings load error:', error);
        }
    }

    saveSettings(form) {
        const formData = new FormData(form);
        const sectionName = this.currentTab;
        
        // Validate form data
        if (!this.validateForm(form)) {
            this.showNotification('Por favor corrige los errores antes de guardar', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        this.setButtonLoading(submitBtn, 'Guardando...');
        
        this.showLoadingState('Guardando configuraciones...');

        // Simulate API call with error handling
        setTimeout(() => {
            try {
                // Update settings object
                if (this.settings[sectionName]) {
                    for (const [key, value] of formData.entries()) {
                        if (this.settings[sectionName].hasOwnProperty(key)) {
                            this.settings[sectionName][key] = value === 'on' ? true : value;
                        }
                    }
                }

                this.resetButtonLoading(submitBtn, originalText);
                this.hideLoadingState();
                this.unsavedChanges = false;
                
                this.showNotification(
                    `Configuraciones de ${this.formatSectionName(sectionName)} guardadas exitosamente`, 
                    'success'
                );
                
                this.updateLastSyncTime();
                this.trackEvent('settings_saved', { section: sectionName });
                
                // Show specific success messages
                this.showSectionSpecificNotifications(sectionName);
                
            } catch (error) {
                this.resetButtonLoading(submitBtn, originalText);
                this.hideLoadingState();
                this.showNotification('Error al guardar las configuraciones', 'error');
                console.error('Settings save error:', error);
            }
        }, 1500);
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const value = input.value.trim();
            let fieldValid = true;
            
            // Required field validation
            if (input.hasAttribute('required') && !value) {
                this.showFieldError(input, 'Este campo es requerido');
                fieldValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && value && !this.validationRules.email.test(value)) {
                this.showFieldError(input, 'Formato de email inválido');
                fieldValid = false;
            }
            
            // Phone validation
            if (input.type === 'tel' && value && !this.validationRules.phone.test(value)) {
                this.showFieldError(input, 'Formato de teléfono inválido');
                fieldValid = false;
            }
            
            // URL validation
            if (input.type === 'url' && value && !this.validationRules.url.test(value)) {
                this.showFieldError(input, 'Formato de URL inválido');
                fieldValid = false;
            }
            
            // Password validation
            if (input.type === 'password' && value && !this.validationRules.strongPassword.test(value)) {
                this.showFieldError(input, 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos');
                fieldValid = false;
            }
            
            if (fieldValid) {
                this.clearFieldError(input);
            } else {
                isValid = false;
            }
        });
        
        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleToggleChange(toggle) {
        const settingName = toggle.id;
        const isChecked = toggle.checked;
        const settingLabel = toggle.closest('.toggle-item')?.querySelector('label')?.textContent || settingName;
        
        // Find which section this setting belongs to
        let section = null;
        Object.keys(this.settings).forEach(sectionKey => {
            if (this.settings[sectionKey].hasOwnProperty(settingName)) {
                section = sectionKey;
            }
        });

        if (section) {
            this.settings[section][settingName] = isChecked;
            
            // Show detailed notification
            const action = isChecked ? 'activado' : 'desactivado';
            this.showNotification(
                `${settingLabel} ${action} exitosamente`, 
                isChecked ? 'success' : 'info',
                3000
            );
            
            // Handle special cases
            this.handleSpecialToggleActions(settingName, isChecked);
            
            this.markUnsavedChanges();
            this.trackEvent('toggle_changed', { setting: settingName, value: isChecked });
        }
    }

    handleSpecialToggleActions(settingName, isChecked) {
        switch (settingName) {
            case 'twoFactorAuth':
                if (isChecked) {
                    this.showNotification('Se enviará un código de verificación a tu email', 'info', 5000);
                    this.simulateTwoFactorSetup();
                }
                break;
                
            case 'maintenanceMode':
                if (isChecked) {
                    this.showNotification('⚠️ Modo de mantenimiento activado. Los usuarios verán una página de mantenimiento', 'warning', 7000);
                } else {
                    this.showNotification('✅ Modo de mantenimiento desactivado. El sitio está disponible para usuarios', 'success', 5000);
                }
                break;
                
            case 'debugMode':
                if (isChecked) {
                    this.showNotification('🐛 Modo debug activado. Se mostrarán errores detallados', 'warning', 5000);
                } else {
                    this.showNotification('Modo debug desactivado', 'info');
                }
                break;
                
            case 'autoBackup':
                if (isChecked) {
                    this.showNotification('📦 Respaldos automáticos activados', 'success');
                    this.scheduleNextBackup();
                } else {
                    this.showNotification('Respaldos automáticos desactivados', 'info');
                }
                break;
        }
    }

    initPasswordStrength() {
        const strengthBars = document.querySelectorAll('.strength-fill');
        const strengthTexts = document.querySelectorAll('.strength-text');
        
        strengthBars.forEach((bar, index) => {
            bar.className = 'strength-fill';
            if (strengthTexts[index]) {
                strengthTexts[index].textContent = 'Ingresa una contraseña';
            }
        });
    }

    checkPasswordStrength(password, inputElement) {
        const container = inputElement.closest('.form-group');
        const strengthBar = container?.querySelector('.strength-fill');
        const strengthText = container?.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        let score = 0;
        let feedback = [];
        let requirements = {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false
        };

        // Length check
        if (password.length >= 8) {
            score += 1;
            requirements.length = true;
        } else {
            feedback.push('al menos 8 caracteres');
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 1;
            requirements.uppercase = true;
        } else {
            feedback.push('una mayúscula');
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 1;
            requirements.lowercase = true;
        } else {
            feedback.push('una minúscula');
        }

        // Number check
        if (/\d/.test(password)) {
            score += 1;
            requirements.number = true;
        } else {
            feedback.push('un número');
        }

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1;
            requirements.special = true;
        } else {
            feedback.push('un carácter especial');
        }

        // Update strength indicator
        const strengthLevels = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong', 'strength-very-strong'];
        const strengthTexts = ['Muy Débil', 'Débil', 'Regular', 'Buena', 'Muy Fuerte'];
        const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        
        strengthBar.className = `strength-fill ${strengthLevels[score] || 'strength-weak'}`;
        strengthBar.style.backgroundColor = strengthColors[score] || strengthColors[0];
        strengthText.textContent = strengthTexts[score] || 'Muy Débil';
        
        if (feedback.length > 0 && password.length > 0) {
            strengthText.textContent += ` - Falta: ${feedback.join(', ')}`;
        }
        
        // Show requirements checklist
        this.updatePasswordRequirements(container, requirements);
    }

    updatePasswordRequirements(container, requirements) {
        let requirementsList = container.querySelector('.password-requirements');
        
        if (!requirementsList) {
            requirementsList = document.createElement('div');
            requirementsList.className = 'password-requirements';
            container.appendChild(requirementsList);
        }
        
        const requirementItems = [
            { key: 'length', text: 'Al menos 8 caracteres' },
            { key: 'uppercase', text: 'Una letra mayúscula' },
            { key: 'lowercase', text: 'Una letra minúscula' },
            { key: 'number', text: 'Un número' },
            { key: 'special', text: 'Un carácter especial' }
        ];
        
        requirementsList.innerHTML = requirementItems.map(item => 
            `<div class="requirement-item ${requirements[item.key] ? 'met' : 'unmet'}">
                <i class="fas ${requirements[item.key] ? 'fa-check' : 'fa-times'}"></i>
                ${item.text}
            </div>`
        ).join('');
    }

    renderIntegrations() {
        const integrationsContainer = document.querySelector('.integrations-grid');
        if (!integrationsContainer) return;

        Object.keys(this.settings.integrations).forEach(key => {
            const integration = this.settings.integrations[key];
            let card = integrationsContainer.querySelector(`[data-integration="${key}"]`);
            
            if (!card) {
                card = this.createIntegrationCard(key, integration);
                integrationsContainer.appendChild(card);
            }
            
            this.updateIntegrationCard(card, integration);
        });
    }

    createIntegrationCard(key, integration) {
        const card = document.createElement('div');
        card.className = 'integration-card';
        card.dataset.integration = key;
        
        const icons = {
            stripe: 'fab fa-stripe',
            paypal: 'fab fa-paypal',
            mailchimp: 'fab fa-mailchimp',
            slack: 'fab fa-slack',
            analytics: 'fab fa-google',
            zapier: 'fas fa-bolt',
            twilio: 'fas fa-sms',
            aws: 'fab fa-aws'
        };
        
        const names = {
            stripe: 'Stripe',
            paypal: 'PayPal',
            mailchimp: 'Mailchimp',
            slack: 'Slack',
            analytics: 'Google Analytics',
            zapier: 'Zapier',
            twilio: 'Twilio SMS',
            aws: 'Amazon AWS'
        };
        
        const descriptions = {
            stripe: 'Procesamiento de pagos',
            paypal: 'Pagos con PayPal',
            mailchimp: 'Email marketing',
            slack: 'Notificaciones de equipo',
            analytics: 'Análisis web',
            zapier: 'Automatización',
            twilio: 'Mensajes SMS',
            aws: 'Servicios en la nube'
        };
        
        card.innerHTML = `
            <div class="integration-icon">
                <i class="${icons[key] || 'fas fa-plug'}"></i>
            </div>
            <div class="integration-info">
                <h4>${names[key] || key}</h4>
                <p>${descriptions[key] || 'Integración externa'}</p>
                <span class="status"></span>
            </div>
            <div class="integration-actions">
                <button class="btn btn-primary">Conectar</button>
                <button class="btn btn-outline">Configurar</button>
            </div>
        `;
        
        return card;
    }

    updateIntegrationCard(card, integration) {
        const statusElement = card.querySelector('.status');
        const connectBtn = card.querySelector('.btn-primary');
        const configBtn = card.querySelector('.btn-outline');
        
        if (statusElement) {
            statusElement.className = `status ${integration.connected ? 'connected' : 'disconnected'}`;
            statusElement.textContent = integration.connected ? 'Conectado' : 'Desconectado';
        }
        
        if (connectBtn) {
            connectBtn.textContent = integration.connected ? 'Desconectar' : 'Conectar';
            connectBtn.className = `btn ${integration.connected ? 'btn-outline' : 'btn-primary'}`;
        }
        
        if (configBtn) {
            configBtn.style.display = integration.connected ? 'block' : 'none';
        }
    }

    connectIntegration(integrationName) {
        if (!this.settings.integrations[integrationName]) return;
        
        const integration = this.settings.integrations[integrationName];
        const wasConnected = integration.connected;
        
        this.showLoadingState(`${wasConnected ? 'Desconectando' : 'Conectando'} ${this.formatIntegrationName(integrationName)}...`);
        
        // Simulate API call
        setTimeout(() => {
            integration.connected = !integration.connected;
            integration.status = integration.connected ? 'active' : 'inactive';
            
            this.renderIntegrations();
            this.hideLoadingState();
            
            const action = integration.connected ? 'conectado' : 'desconectado';
            this.showNotification(
                `${this.formatIntegrationName(integrationName)} ${action} exitosamente`,
                integration.connected ? 'success' : 'info',
                4000
            );
            
            // Show specific integration messages
            if (integration.connected) {
                this.showIntegrationConnectedMessage(integrationName);
            }
            
            this.trackEvent('integration_toggled', { 
                integration: integrationName, 
                connected: integration.connected 
            });
        }, 2000);
    }

    showIntegrationConnectedMessage(integrationName) {
        const messages = {
            stripe: '💳 Stripe conectado. Ya puedes procesar pagos con tarjeta.',
            paypal: '🏦 PayPal conectado. Los usuarios pueden pagar con PayPal.',
            mailchimp: '📧 Mailchimp conectado. Las campañas de email están activas.',
            slack: '💬 Slack conectado. Recibirás notificaciones en tu canal.',
            analytics: '📊 Google Analytics conectado. El seguimiento está activo.',
            zapier: '⚡ Zapier conectado. Las automatizaciones están funcionando.',
            twilio: '📱 Twilio conectado. Los SMS están habilitados.',
            aws: '☁️ AWS conectado. Los servicios en la nube están disponibles.'
        };
        
        if (messages[integrationName]) {
            setTimeout(() => {
                this.showNotification(messages[integrationName], 'info', 6000);
            }, 1000);
        }
    }

    configureIntegration(integrationName) {
        this.showNotification(`Abriendo configuración de ${this.formatIntegrationName(integrationName)}...`, 'info');
        
        // Here you would typically open a modal or redirect to configuration page
        setTimeout(() => {
            this.showNotification('Función de configuración en desarrollo', 'info');
        }, 1000);
    }

    createBackup() {
        this.showLoadingState('Creando respaldo del sistema...');
        
        const backupBtn = document.getElementById('createBackupBtn');
        if (backupBtn) {
            this.setButtonLoading(backupBtn, 'Creando respaldo...');
        }
        
        // Simulate backup creation
        setTimeout(() => {
            const now = new Date();
            const backupSize = (Math.random() * 5 + 1).toFixed(1) + ' GB';
            
            this.settings.backup.lastBackup = now.toISOString();
            this.settings.backup.backupSize = backupSize;
            
            this.hideLoadingState();
            
            if (backupBtn) {
                this.resetButtonLoading(backupBtn, 'Crear Respaldo Ahora');
            }
            
            this.showNotification(
                `✅ Respaldo creado exitosamente (${backupSize})`,
                'success',
                5000
            );
            
            this.updateBackupInfo();
            this.trackEvent('backup_created', { size: backupSize });
        }, 3000);
    }

    updateBackupInfo() {
        const backupInfo = document.querySelector('.backup-info');
        if (!backupInfo || !this.settings.backup.lastBackup) return;
        
        const lastBackup = new Date(this.settings.backup.lastBackup);
        const formattedDate = lastBackup.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const detailsElement = backupInfo.querySelector('.backup-details');
        if (detailsElement) {
            detailsElement.innerHTML = `
                <p>Fecha: ${formattedDate}</p>
                <p>Tamaño: ${this.settings.backup.backupSize}</p>
            `;
        }
    }

    initAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.unsavedChanges) {
                this.autoSave();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    autoSave() {
        this.showNotification('💾 Guardado automático...', 'info', 2000);
        
        // Simulate auto-save
        setTimeout(() => {
            this.unsavedChanges = false;
            this.showNotification('✅ Cambios guardados automáticamente', 'success', 2000);
        }, 1000);
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                const activeForm = document.querySelector('.settings-panel.active .settings-form');
                if (activeForm) {
                    this.saveSettings(activeForm);
                }
            }
            
            // Ctrl+Shift+B to create backup
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                e.preventDefault();
                this.createBackup();
            }
            
            // Escape to close notifications
            if (e.key === 'Escape') {
                this.closeAllNotifications();
            }
        });
    }

    initTooltips() {
        // Add tooltips to important elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
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
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        setTimeout(() => tooltip.classList.add('show'), 100);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    checkSystemStatus() {
        this.showNotification('🔍 Verificando estado del sistema...', 'info', 3000);
        
        // Simulate system check
        setTimeout(() => {
            const issues = [];
            
            // Check for potential issues
            if (!this.settings.security.twoFactorAuth) {
                issues.push('Autenticación de dos factores desactivada');
            }
            
            if (!this.settings.backup.autoBackup) {
                issues.push('Respaldos automáticos desactivados');
            }
            
            if (issues.length > 0) {
                this.showNotification(
                    `⚠️ Se encontraron ${issues.length} recomendaciones de seguridad`,
                    'warning',
                    7000
                );
            } else {
                this.showNotification('✅ Sistema funcionando correctamente', 'success');
            }
        }, 2000);
    }

    searchSettings(query) {
        const searchTerm = query.toLowerCase();
        const allSettings = document.querySelectorAll('.form-group, .toggle-item, .integration-card');
        
        allSettings.forEach(element => {
            const text = element.textContent.toLowerCase();
            const matches = text.includes(searchTerm);
            
            element.style.display = matches || !query ? 'block' : 'none';
            
            if (matches && query) {
                element.classList.add('search-highlight');
            } else {
                element.classList.remove('search-highlight');
            }
        });
        
        if (query) {
            this.showNotification(`🔍 Mostrando resultados para: "${query}"`, 'info', 3000);
        }
    }

    handleFileUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (file.size > maxSize) {
            this.showNotification('El archivo es demasiado grande. Máximo 5MB.', 'error');
            input.value = '';
            return;
        }
        
        this.showLoadingState(`Subiendo ${file.name}...`);
        
        // Simulate file upload
        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification(`📁 ${file.name} subido exitosamente`, 'success');
            
            // Update UI based on file type
            if (input.id === 'logoUpload') {
                this.showNotification('🎨 Logo actualizado. Los cambios se verán en toda la aplicación.', 'info', 5000);
            }
        }, 2000);
    }

    simulateTwoFactorSetup() {
        setTimeout(() => {
            this.showNotification('📧 Código de verificación enviado a tu email', 'info', 4000);
            
            setTimeout(() => {
                this.showNotification('✅ Autenticación de dos factores configurada correctamente', 'success', 4000);
            }, 3000);
        }, 1000);
    }

    scheduleNextBackup() {
        const frequency = this.settings.backup.frequency;
        const nextBackup = new Date();
        
        switch (frequency) {
            case 'daily':
                nextBackup.setDate(nextBackup.getDate() + 1);
                break;
            case 'weekly':
                nextBackup.setDate(nextBackup.getDate() + 7);
                break;
            case 'monthly':
                nextBackup.setMonth(nextBackup.getMonth() + 1);
                break;
        }
        
        this.showNotification(
            `📅 Próximo respaldo programado: ${nextBackup.toLocaleDateString('es-ES')}`,
            'info',
            5000
        );
    }

    showSectionSpecificNotifications(sectionName) {
        const messages = {
            general: '⚙️ Configuración general actualizada. Los cambios se aplicarán en toda la aplicación.',
            security: '🔒 Configuración de seguridad actualizada. Tu cuenta está más protegida.',
            notifications: '🔔 Preferencias de notificaciones actualizadas.',
            integrations: '🔗 Configuración de integraciones actualizada.',
            backup: '💾 Configuración de respaldos actualizada.',
            performance: '⚡ Configuración de rendimiento actualizada. El sistema funcionará más eficientemente.'
        };
        
        if (messages[sectionName]) {
            setTimeout(() => {
                this.showNotification(messages[sectionName], 'info', 6000);
            }, 1000);
        }
    }

    showWelcomeNotification() {
        setTimeout(() => {
            this.showNotification(
                '👋 Bienvenido al panel de configuraciones. Usa Ctrl+S para guardar rápidamente.',
                'info',
                5000
            );
        }, 1000);
    }

    markUnsavedChanges() {
        this.unsavedChanges = true;
        
        // Visual indicator
        const saveButtons = document.querySelectorAll('.btn-primary');
        saveButtons.forEach(btn => {
            if (btn.textContent.includes('Guardar')) {
                btn.classList.add('unsaved-changes');
            }
        });
    }

    updateLastSyncTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES');
        
        const syncIndicators = document.querySelectorAll('.last-sync');
        syncIndicators.forEach(indicator => {
            indicator.textContent = `Última sincronización: ${timeString}`;
        });
    }

    showLoadingState(message = 'Cargando...') {
        this.loadingStates.add(message);
        
        let loader = document.querySelector('.global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'global-loader';
            document.body.appendChild(loader);
        }
        
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        loader.classList.add('show');
    }

    hideLoadingState() {
        const loader = document.querySelector('.global-loader');
        if (loader) {
            loader.classList.remove('show');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 300);
        }
        
        this.loadingStates.clear();
    }

    setButtonLoading(button, text) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<span class="spinner"></span> ${text}`;
        button.classList.add('loading');
    }

    resetButtonLoading(button, originalText) {
        button.disabled = false;
        button.innerHTML = originalText || button.dataset.originalText || 'Guardar';
        button.classList.remove('loading');
    }

    showNotification(message, type = 'info', duration = 4000) {
        // Remove existing notifications of the same type
        const existingNotifications = document.querySelectorAll(`.notification.${type}`);
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-progress"></div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add entrance animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Progress bar animation
        const progressBar = notification.querySelector('.notification-progress');
        if (progressBar && duration > 0) {
            progressBar.style.animationDuration = `${duration}ms`;
        }

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.classList.add('hide');
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, duration);
        }
        
        // Play notification sound
        this.playNotificationSound(type);
    }

    closeAllNotifications() {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        });
    }

    playNotificationSound(type) {
        if (!this.settings.notifications.pushNotifications) return;
        
        // Create audio context for notification sounds
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different notification types
            const frequencies = {
                success: 800,
                error: 400,
                warning: 600,
                info: 500
            };
            
            oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Notification sound not supported');
        }
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (this.settings.integrations.analytics?.connected) {
            console.log(`Analytics Event: ${eventName}`, data);
            
            // Here you would integrate with your analytics service
            // gtag('event', eventName, data);
        }
    }

    formatSectionName(sectionName) {
        const names = {
            general: 'General',
            security: 'Seguridad',
            notifications: 'Notificaciones',
            integrations: 'Integraciones',
            backup: 'Respaldos',
            performance: 'Rendimiento'
        };
        
        return names[sectionName] || sectionName;
    }

    formatIntegrationName(integrationName) {
        const names = {
            stripe: 'Stripe',
            paypal: 'PayPal',
            mailchimp: 'Mailchimp',
            slack: 'Slack',
            analytics: 'Google Analytics',
            zapier: 'Zapier',
            twilio: 'Twilio',
            aws: 'Amazon AWS'
        };
        
        return names[integrationName] || integrationName;
    }

    exportSettings() {
        this.showLoadingState('Exportando configuraciones...');
        
        setTimeout(() => {
            const dataStr = JSON.stringify(this.settings, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            this.hideLoadingState();
            this.showNotification('📥 Configuraciones exportadas exitosamente', 'success');
            this.trackEvent('settings_exported');
        }, 1000);
    }

    importSettings(file) {
        this.showLoadingState('Importando configuraciones...');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                
                // Validate imported settings
                if (this.validateImportedSettings(importedSettings)) {
                    this.settings = { ...this.settings, ...importedSettings };
                    this.loadSettings();
                    this.renderIntegrations();
                    
                    this.hideLoadingState();
                    this.showNotification('📤 Configuraciones importadas exitosamente', 'success');
                    this.trackEvent('settings_imported');
                } else {
                    throw new Error('Formato de archivo inválido');
                }
            } catch (error) {
                this.hideLoadingState();
                this.showNotification('❌ Error al importar configuraciones. Verifica el formato del archivo.', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.onerror = () => {
            this.hideLoadingState();
            this.showNotification('❌ Error al leer el archivo', 'error');
        };
        
        reader.readAsText(file);
    }

    validateImportedSettings(settings) {
        // Basic validation of imported settings structure
        const requiredSections = ['general', 'security', 'notifications', 'integrations'];
        
        return requiredSections.every(section => 
            settings.hasOwnProperty(section) && 
            typeof settings[section] === 'object'
        );
    }

    resetToDefaults() {
        if (!confirm('¿Estás seguro de que quieres restablecer todas las configuraciones a los valores predeterminados? Esta acción no se puede deshacer.')) {
            return;
        }
        
        this.showLoadingState('Restableciendo configuraciones...');
        
        setTimeout(() => {
            // Reset to default values
            this.settings = {
                general: {
                    siteName: 'DSG Admin',
                    siteDescription: 'Digital Solutions Group Administration Panel',
                    timezone: 'UTC',
                    language: 'es',
                    dateFormat: 'DD/MM/YYYY',
                    currency: 'USD',
                    companyName: 'Fixture Company',
                    contactEmail: 'contact@fixture.com',
                    phone: '+1 234 567 8900',
                    address: '',
                    logo: '',
                    favicon: '',
                    maintenanceMode: false,
                    debugMode: false
                },
                security: {
                    twoFactorAuth: false,
                    sessionTimeout: 30,
                    passwordExpiry: 90,
                    loginAttempts: 5,
                    requireStrongPassword: true,
                    minPasswordLength: 8,
                    forcePasswordChange: false,
                    ipWhitelist: [],
                    sslRequired: true,
                    bruteForceProtection: true,
                    accountLockoutDuration: 15,
                    passwordHistory: 5
                },
                notifications: {
                    emailNotifications: true,
                    pushNotifications: false,
                    smsNotifications: false,
                    orderUpdates: true,
                    systemAlerts: true,
                    marketingEmails: false,
                    emailNewOrders: true,
                    emailPayments: true,
                    emailNewUsers: false,
                    pushSystemAlerts: true,
                    pushReminders: true,
                    weeklyReports: true,
                    monthlyReports: true,
                    criticalAlerts: true
                },
                integrations: {
                    stripe: { connected: false, status: 'inactive', apiKey: '', webhookUrl: '' },
                    paypal: { connected: false, status: 'inactive', clientId: '', clientSecret: '' },
                    mailchimp: { connected: false, status: 'inactive', apiKey: '', listId: '' },
                    slack: { connected: false, status: 'inactive', webhookUrl: '', channel: '' },
                    analytics: { connected: false, status: 'inactive', trackingId: '', propertyId: '' },
                    zapier: { connected: false, status: 'inactive', apiKey: '' },
                    twilio: { connected: false, status: 'inactive', accountSid: '', authToken: '' },
                    aws: { connected: false, status: 'inactive', accessKey: '', secretKey: '', region: '' }
                },
                backup: {
                    frequency: 'daily',
                    retention: 30,
                    autoBackup: true,
                    cloudStorage: false,
                    encryptBackups: true,
                    lastBackup: null,
                    backupSize: '0 MB',
                    backupLocation: '/backups'
                },
                performance: {
                    cacheEnabled: true,
                    compressionEnabled: true,
                    minifyAssets: true,
                    lazyLoading: true,
                    cdnEnabled: false,
                    maxFileSize: 10,
                    sessionStorage: 'database',
                    logLevel: 'info'
                }
            };
            
            this.loadSettings();
            this.renderIntegrations();
            this.hideLoadingState();
            
            this.showNotification('🔄 Configuraciones restablecidas a valores predeterminados', 'success');
            this.trackEvent('settings_reset');
        }, 2000);
    }

    // Cleanup method
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.closeAllNotifications();
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
    
    // Add export/import event listeners
    const exportBtn = document.getElementById('exportSettings');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.settingsManager.exportSettings();
        });
    }
    
    const importBtn = document.getElementById('importSettings');
    const importFile = document.getElementById('importFile');
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => {
            importFile.click();
        });
        
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                window.settingsManager.importSettings(file);
            }
        });
    }
    
    const resetBtn = document.getElementById('resetSettings');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.settingsManager.resetToDefaults();
        });
    }
    
    // Add search functionality
    const searchInput = document.getElementById('settingsSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            window.settingsManager.searchSettings(e.target.value);
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.settingsManager) {
            window.settingsManager.destroy();
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}