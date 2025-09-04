// Chart.js wrapper and configuration
// This assumes Chart.js is loaded via CDN or npm

class ChartManager {
  constructor() {
    this.charts = new Map();
    this.defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        }
      }
    };
  }

  // Create line chart
  createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const config = {
      type: 'line',
      data: data,
      options: { ...this.defaultOptions, ...options }
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  // Create bar chart
  createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const config = {
      type: 'bar',
      data: data,
      options: { ...this.defaultOptions, ...options }
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  // Create doughnut chart
  createDoughnutChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const config = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        },
        ...options
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  // Update chart data
  updateChart(canvasId, newData) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.data = newData;
      chart.update();
    }
  }

  // Destroy chart
  destroyChart(canvasId) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }

  // Get chart instance
  getChart(canvasId) {
    return this.charts.get(canvasId);
  }
}

// Global chart manager instance
window.chartManager = new ChartManager();