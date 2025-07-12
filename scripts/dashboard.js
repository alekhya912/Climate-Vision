// Dashboard page functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeDashboardCharts();
  setupEventListeners();
});

// Initialize all charts on the dashboard
function initializeDashboardCharts() {
  drawMainChart();
  drawAnomalyChart();
  drawEmissionsChart();
  drawCorrelationChart();
  drawScenariosChart();
  updateDataCards();
}

// Draw the main data chart
function drawMainChart() {
  const mainChart = document.getElementById('main-chart');
  if (!mainChart) return;
  
  // Get filter values
  const dataType = document.getElementById('data-type').value;
  const timeRange = document.getElementById('time-range').value;
  const [startYear, endYear] = timeRange.split('-').map(Number);
  
  // Get filtered data
  const data = window.climateData.getFilteredData(startYear, endYear, dataType);
  
  // Set chart title
  const chartTitle = document.getElementById('main-chart-title');
  if (chartTitle) {
    const metricName = getMetricName(dataType);
    chartTitle.textContent = `Global ${metricName} (${startYear}-${endYear})`;
  }
  
  // Draw chart
  window.chartUtils.drawLineChart(mainChart, data, {
    lineColor: getColorForMetric(dataType),
    fillArea: true,
    formatY: value => formatValueByType(value, dataType)
  });
}

// Draw temperature anomaly by decade chart
function drawAnomalyChart() {
  const anomalyChart = document.getElementById('anomaly-chart');
  if (!anomalyChart) return;
  
  const data = window.climateData.temperatureAnomalyByDecade;
  
  window.chartUtils.drawBarChart(anomalyChart, data, {
    xKey: 'decade',
    yKey: 'anomaly',
    barColor: window.chartUtils.CHART_COLORS.temperature,
    formatY: value => `${value > 0 ? '+' : ''}${value.toFixed(2)}°C`
  });
}

// Draw CO2 emissions by region chart
function drawEmissionsChart() {
  const emissionsChart = document.getElementById('emissions-chart');
  if (!emissionsChart) return;
  
  const data = window.climateData.co2EmissionsByRegion;
  
  window.chartUtils.drawPieChart(emissionsChart, data, {
    valueKey: 'value',
    labelKey: 'region',
    innerRadius: 0.4,
    showLabels: true,
    formatValue: value => `${value} Gt`
  });
}

// Draw correlation chart
function drawCorrelationChart() {
  const correlationChart = document.getElementById('correlation-chart');
  if (!correlationChart) return;
  
  // Get selected metrics
  const xMetric = document.getElementById('correlation-x').value;
  const yMetric = document.getElementById('correlation-y').value;
  
  // Prepare data for scatter plot
  const data = window.climateData.detailedTimelineData.map(item => ({
    x: item[xMetric],
    y: item[yMetric],
    year: item.year
  }));
  
  // Draw scatter plot
  window.chartUtils.drawScatterPlot(correlationChart, data, {
    xKey: 'x',
    yKey: 'y',
    pointColor: window.chartUtils.CHART_COLORS.accent,
    pointRadius: 6,
    showTrendline: true,
    xAxisLabel: getMetricName(xMetric),
    yAxisLabel: getMetricName(yMetric),
    formatX: value => formatValueByType(value, xMetric),
    formatY: value => formatValueByType(value, yMetric)
  });
}

// Draw future climate scenarios chart
function drawScenariosChart() {
  const scenariosChart = document.getElementById('scenarios-chart');
  if (!scenariosChart) return;
  
  const scenarios = window.climateData.climateScenarios;
  
  // Draw line for each scenario
  const canvas = document.createElement('canvas');
  canvas.width = scenariosChart.clientWidth;
  canvas.height = scenariosChart.clientHeight;
  scenariosChart.innerHTML = '';
  scenariosChart.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = {
    grid: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
    text: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark'
      ? '#FFFFFF'
      : '#212121'
  };
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Find min/max values
  const allData = scenarios.flatMap(s => s.data);
  const minYear = Math.min(...allData.map(d => d.year));
  const maxYear = Math.max(...allData.map(d => d.year));
  const minTemp = Math.min(...allData.map(d => d.temperature));
  const maxTemp = Math.max(...allData.map(d => d.temperature));
  
  // Add padding to temperature range
  const tempRange = maxTemp - minTemp;
  const paddedMinTemp = Math.max(0, minTemp - (tempRange * 0.1));
  const paddedMaxTemp = maxTemp + (tempRange * 0.1);
  
  // Draw grid
  ctx.strokeStyle = themeColors.grid;
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  const yearRange = maxYear - minYear;
  const yearStep = Math.ceil(yearRange / 8);
  for (let year = minYear; year <= maxYear; year += yearStep) {
    const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  const tempStep = 0.5;
  for (let temp = Math.ceil(paddedMinTemp); temp <= paddedMaxTemp; temp += tempStep) {
    const y = canvas.height - padding - ((temp - paddedMinTemp) / (paddedMaxTemp - paddedMinTemp)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }
  
  // Draw X and Y axis
  ctx.strokeStyle = themeColors.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw scenario lines
  const scenarioColors = {
    'Low Emission': window.chartUtils.CHART_COLORS.lowEmission,
    'Medium Emission': window.chartUtils.CHART_COLORS.mediumEmission,
    'High Emission': window.chartUtils.CHART_COLORS.highEmission
  };
  
  scenarios.forEach(scenario => {
    const points = scenario.data.map(d => ({
      x: padding + ((d.year - minYear) / (maxYear - minYear)) * chartWidth,
      y: canvas.height - padding - ((d.temperature - paddedMinTemp) / (paddedMaxTemp - paddedMinTemp)) * chartHeight
    }));
    
    // Draw line
    ctx.strokeStyle = scenarioColors[scenario.name];
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    
    // Fill area under line
    ctx.fillStyle = scenarioColors[scenario.name] + '33'; // 20% opacity
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw points
    ctx.fillStyle = scenarioColors[scenario.name];
    points.forEach((point, i) => {
      if (i % 2 === 0) { // Only draw every other point to avoid clutter
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });
  
  // Draw labels
  ctx.fillStyle = themeColors.text;
  ctx.font = '12px Inter, sans-serif';
  
  // X-axis labels
  ctx.textAlign = 'center';
  for (let year = minYear; year <= maxYear; year += yearStep) {
    const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    ctx.fillText(year.toString(), x, canvas.height - padding + 20);
  }
  
  // Y-axis labels
  ctx.textAlign = 'right';
  for (let temp = Math.ceil(paddedMinTemp); temp <= paddedMaxTemp; temp += tempStep) {
    const y = canvas.height - padding - ((temp - paddedMinTemp) / (paddedMaxTemp - paddedMinTemp)) * chartHeight;
    ctx.fillText(`${temp.toFixed(1)}°C`, padding - 10, y + 4);
  }
  
  // Axis titles
  ctx.textAlign = 'center';
  ctx.fillText('Year', canvas.width / 2, canvas.height - 10);
  
  ctx.save();
  ctx.translate(15, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Global Temperature (°C)', 0, 0);
  ctx.restore();
}

// Update data cards with latest values
function updateDataCards() {
  // Get latest data point
  const latestData = window.climateData.detailedTimelineData[window.climateData.detailedTimelineData.length - 1];
  
  // Update temperature anomaly
  const tempValue = document.getElementById('temp-value');
  if (tempValue) {
    tempValue.textContent = '+0.98°C';
  }
  
  // Update CO2 concentration
  const co2Value = document.getElementById('co2-value');
  if (co2Value) {
    co2Value.textContent = `${latestData.co2.toFixed(1)} ppm`;
  }
  
  // Update sea level rise
  const seaValue = document.getElementById('sea-value');
  if (seaValue) {
    seaValue.textContent = `+${latestData.seaLevel.toFixed(1)} cm`;
  }
  
  // Update arctic ice extent
  const iceValue = document.getElementById('ice-value');
  if (iceValue) {
    iceValue.textContent = `${latestData.arcticIce.toFixed(2)} M km²`;
  }
}

// Setup event listeners for interactive elements
function setupEventListeners() {
  // Data type selector
  const dataTypeSelect = document.getElementById('data-type');
  if (dataTypeSelect) {
    dataTypeSelect.addEventListener('change', drawMainChart);
  }
  
  // Time range selector
  const timeRangeSelect = document.getElementById('time-range');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', drawMainChart);
  }
  
  // Correlation chart selectors
  const correlationXSelect = document.getElementById('correlation-x');
  const correlationYSelect = document.getElementById('correlation-y');
  
  if (correlationXSelect && correlationYSelect) {
    correlationXSelect.addEventListener('change', drawCorrelationChart);
    correlationYSelect.addEventListener('change', drawCorrelationChart);
  }
  
  // Export data button
  const exportButton = document.getElementById('export-data');
  if (exportButton) {
    exportButton.addEventListener('click', exportData);
  }
  
  // Chart fullscreen button
  const fullscreenButton = document.getElementById('chart-fullscreen');
  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleChartFullscreen);
  }
}

// Export dashboard data as CSV
function exportData() {
  // Get current filter settings
  const dataType = document.getElementById('data-type').value;
  const timeRange = document.getElementById('time-range').value;
  const [startYear, endYear] = timeRange.split('-').map(Number);
  
  // Get filtered data
  const data = window.climateData.getFilteredData(startYear, endYear, dataType);
  
  // Convert to CSV
  const headers = ['Year', getMetricName(dataType)];
  const csvRows = [
    headers.join(','),
    ...data.map(item => `${item.year},${item.value}`)
  ];
  const csvContent = csvRows.join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `climate_${dataType}_${startYear}-${endYear}.csv`);
  a.click();
  
  // Clean up
  URL.revokeObjectURL(url);
}

// Toggle chart fullscreen view
function toggleChartFullscreen() {
  const mainChartCard = document.querySelector('.main-chart-card');
  if (!mainChartCard) return;
  
  mainChartCard.classList.toggle('fullscreen');
  
  if (mainChartCard.classList.contains('fullscreen')) {
    // Save original position
    mainChartCard.dataset.originalGridColumn = mainChartCard.style.gridColumn;
    mainChartCard.dataset.originalGridRow = mainChartCard.style.gridRow;
    
    // Apply fullscreen styles
    mainChartCard.style.position = 'fixed';
    mainChartCard.style.top = '0';
    mainChartCard.style.left = '0';
    mainChartCard.style.width = '100%';
    mainChartCard.style.height = '100%';
    mainChartCard.style.zIndex = '1000';
    mainChartCard.style.borderRadius = '0';
    
    // Update chart to use new dimensions
    drawMainChart();
  } else {
    // Restore original position
    mainChartCard.style.position = '';
    mainChartCard.style.top = '';
    mainChartCard.style.left = '';
    mainChartCard.style.width = '';
    mainChartCard.style.height = '';
    mainChartCard.style.zIndex = '';
    mainChartCard.style.borderRadius = '';
    
    // Update chart to use new dimensions
    drawMainChart();
  }
}

// Helper functions

// Get human-readable name for metric
function getMetricName(metricKey) {
  const metricNames = {
    'temperature': 'Temperature',
    'co2': 'CO₂ Concentration',
    'methane': 'Methane Concentration',
    'seaLevel': 'Sea Level Rise',
    'arcticIce': 'Arctic Ice Extent',
    'year': 'Year'
  };
  
  return metricNames[metricKey] || metricKey;
}

// Get color for metric
function getColorForMetric(metricKey) {
  const metricColors = {
    'temperature': window.chartUtils.CHART_COLORS.temperature,
    'co2': window.chartUtils.CHART_COLORS.co2,
    'methane': window.chartUtils.CHART_COLORS.methane,
    'seaLevel': window.chartUtils.CHART_COLORS.seaLevel,
    'arcticIce': window.chartUtils.CHART_COLORS.arcticIce
  };
  
  return metricColors[metricKey] || window.chartUtils.CHART_COLORS.primary;
}

// Format value based on data type
function formatValueByType(value, type) {
  switch (type) {
    case 'temperature':
      return `${value.toFixed(2)}°C`;
    case 'co2':
      return `${value.toFixed(1)} ppm`;
    case 'methane':
      return `${value.toFixed(0)} ppb`;
    case 'seaLevel':
      return `${value.toFixed(1)} cm`;
    case 'arcticIce':
      return `${value.toFixed(2)} M km²`;
    case 'year':
      return value.toString();
    default:
      return value.toString();
  }
}