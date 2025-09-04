// Analytics Page JavaScript

class AnalyticsManager {
    constructor() {
        this.charts = {};
        this.currentTimeRange = '7d';
        this.init();
    }

    init() {
        this.initTimeRangeSelector();
        this.initCharts();
        this.initExportControls();
        this.animateMetrics();
        this.startRealTimeUpdates();
    }

    initTimeRangeSelector() {
        const timeButtons = document.querySelectorAll('.time-btn');
        
        timeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                timeButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current time range
                this.currentTimeRange = e.target.dataset.range;
                
                // Update charts with new data
                this.updateChartsData();
            });
        });
    }

    initCharts() {
        this.initRevenueChart();
        this.initUserGrowthChart();
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const data = this.getRevenueData();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Ingresos',
                    data: data.values,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4f46e5',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Ingresos: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(107, 114, 128, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Chart type selector
        const chartTypeSelector = document.querySelector('.chart-type-selector');
        if (chartTypeSelector) {
            chartTypeSelector.addEventListener('change', (e) => {
                this.charts.revenue.config.type = e.target.value;
                this.charts.revenue.update();
            });
        }
    }

    initUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        const data = this.getUserGrowthData();
        
        this.charts.userGrowth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Nuevos Usuarios',
                    data: data.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(107, 114, 128, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        });
    }

    getRevenueData() {
        const data = {
            '7d': {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                values: [12000, 15000, 18000, 14000, 22000, 25000, 20000]
            },
            '30d': {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                values: [45000, 52000, 48000, 58000]
            },
            '90d': {
                labels: ['Ene', 'Feb', 'Mar'],
                values: [180000, 195000, 210000]
            },
            '1y': {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [580000, 620000, 650000, 720000]
            }
        };
        
        return data[this.currentTimeRange] || data['7d'];
    }

    getUserGrowthData() {
        const data = {
            '7d': {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                values: [45, 52, 38, 67, 73, 89, 95]
            },
            '30d': {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                values: [280, 320, 290, 350]
            },
            '90d': {
                labels: ['Ene', 'Feb', 'Mar'],
                values: [850, 920, 1100]
            },
            '1y': {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [2800, 3200, 3600, 4100]
            }
        };
        
        return data[this.currentTimeRange] || data['7d'];
    }

    updateChartsData() {
        // Update revenue chart
        if (this.charts.revenue) {
            const revenueData = this.getRevenueData();
            this.charts.revenue.data.labels = revenueData.labels;
            this.charts.revenue.data.datasets[0].data = revenueData.values;
            this.charts.revenue.update('active');
        }

        // Update user growth chart
        if (this.charts.userGrowth) {
            const userGrowthData = this.getUserGrowthData();
            this.charts.userGrowth.data.labels = userGrowthData.labels;
            this.charts.userGrowth.data.datasets[0].data = userGrowthData.values;
            this.charts.userGrowth.update('active');
        }

        // Update metrics
        this.updateMetrics();
    }

    updateMetrics() {
        const metrics = {
            '7d': {
                revenue: '$35,890',
                users: 247,
                conversion: '3.4%',
                avgValue: '$89.50'
            },
            '30d': {
                revenue: '$145,890',
                users: 1247,
                conversion: '3.2%',
                avgValue: '$92.30'
            },
            '90d': {
                revenue: '$445,890',
                users: 3847,
                conversion: '3.6%',
                avgValue: '$87.20'
            },
            '1y': {
                revenue: '$1,245,890',
                users: 12847,
                conversion: '3.8%',
                avgValue: '$94.80'
            }
        };

        const currentMetrics = metrics[this.currentTimeRange] || metrics['7d'];
        const metricValues = document.querySelectorAll('.metric-value');
        
        if (metricValues.length >= 4) {
            metricValues[0].textContent = currentMetrics.revenue;
            metricValues[1].textContent = currentMetrics.users.toLocaleString();
            metricValues[2].textContent = currentMetrics.conversion;
            metricValues[3].textContent = currentMetrics.avgValue;
        }
    }

    animateMetrics() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach((card, index) => {
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

    initExportControls() {
        const exportBtn = document.querySelector('.export-controls .btn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }

    exportData() {
        // Simulate data export
        const data = {
            timeRange: this.currentTimeRange,
            revenue: this.getRevenueData(),
            userGrowth: this.getUserGrowthData(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-data-${this.currentTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showNotification('Datos exportados exitosamente', 'success');
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateTrafficSources();
            this.updateTopProducts();
        }, 30000);
    }

    updateTrafficSources() {
        const sources = document.querySelectorAll('.source-fill');
        
        sources.forEach(source => {
            const currentWidth = parseFloat(source.style.width);
            const variation = (Math.random() - 0.5) * 2; // ±1%
            const newWidth = Math.max(0, Math.min(100, currentWidth + variation));
            
            source.style.width = `${newWidth}%`;
            
            // Update percentage text
            const percentageElement = source.closest('.source-item').querySelector('.source-percentage');
            if (percentageElement) {
                percentageElement.textContent = `${newWidth.toFixed(1)}%`;
            }
        });
    }

    updateTopProducts() {
        const products = document.querySelectorAll('.product-item');
        
        products.forEach(product => {
            const salesElement = product.querySelector('.product-sales');
            const revenueElement = product.querySelector('.product-revenue');
            
            if (salesElement && revenueElement) {
                const currentSales = parseInt(salesElement.textContent.match(/\d+/)[0]);
                const newSales = currentSales + Math.floor(Math.random() * 3);
                
                salesElement.textContent = `${newSales} ventas`;
                
                // Update revenue based on new sales
                const pricePerSale = Math.floor(Math.random() * 100) + 50;
                const newRevenue = newSales * pricePerSale;
                revenueElement.textContent = `$${newRevenue.toLocaleString()}`;
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#4f46e5'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsManager();
});

// Handle theme changes for charts
document.addEventListener('themeChanged', (e) => {
    const isDark = e.detail.theme === 'dark';
    
    // Update chart colors based on theme
    Chart.defaults.color = isDark ? '#e5e7eb' : '#6b7280';
    Chart.defaults.borderColor = isDark ? 'rgba(229, 231, 235, 0.1)' : 'rgba(107, 114, 128, 0.1)';
    
    // Re-render charts if they exist
    Object.values(window.analyticsManager?.charts || {}).forEach(chart => {
        chart.update();
    });
});