// Trends page functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeTimelineSlider();
  initializeTimelineChart();
  initializeComparisonChart();
  initializeScenariosChart();
  setupEventListeners();
});

// Initialize the timeline slider interaction
function initializeTimelineSlider() {
  const slider = document.getElementById('year-slider');
  if (!slider) return;
  
  const leftHandle = slider.querySelector('.year-slider-handle.left');
  const rightHandle = slider.querySelector('.year-slider-handle.right');
  const sliderFill = slider.querySelector('.year-slider-fill');
  
  if (!leftHandle || !rightHandle || !sliderFill) return;
  
  // Initialize slider values
  const startYear = parseInt(leftHandle.dataset.value);
  const endYear = parseInt(rightHandle.dataset.value);
  updateSliderFill(startYear, endYear);
  
  // Update display values
  document.getElementById('start-year').textContent = startYear;
  document.getElementById('end-year').textContent = endYear;
  
  // Function to handle slider drag
  function handleSliderDrag(handle, event) {
    event.preventDefault();
    
    const slider = document.getElementById('year-slider');
    const sliderRect = slider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    
    // Calculate years range
    const minYear = 1980;
    const maxYear = 2023;
    const yearRange = maxYear - minYear;
    
    function onMouseMove(moveEvent) {
      // Calculate position percentage
      let posX = moveEvent.clientX - sliderRect.left;
      posX = Math.max(0, Math.min(posX, sliderWidth));
      const percentage = posX / sliderWidth;
      
      // Calculate year value
      let year = Math.round(minYear + (percentage * yearRange));
      
      // Enforce constraints based on which handle
      if (handle.classList.contains('left')) {
        // Left handle can't go past right handle
        const rightYear = parseInt(rightHandle.dataset.value);
        year = Math.min(year, rightYear - 1);
        leftHandle.dataset.value = year;
        document.getElementById('start-year').textContent = year;
      } else {
        // Right handle can't go before left handle
        const leftYear = parseInt(leftHandle.dataset.value);
        year = Math.max(year, leftYear + 1);
        rightHandle.dataset.value = year;
        document.getElementById('end-year').textContent = year;
      }
      
      // Update handle position
      handle.style.left = `${((year - minYear) / yearRange) * 100}%`;
      
      // Update slider fill
      updateSliderFill(
        parseInt(leftHandle.dataset.value),
        parseInt(rightHandle.dataset.value)
      );
      
      // Update chart based on selected years
      updateTimelineChart();
    }
    
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  
  // Add event listeners to handles
  leftHandle.addEventListener('mousedown', (e) => handleSliderDrag(leftHandle, e));
  rightHandle.addEventListener('mousedown', (e) => handleSliderDrag(rightHandle, e));
}

// Update the slider fill element
function updateSliderFill(startYear, endYear) {
  const sliderFill = document.querySelector('.year-slider-fill');
  if (!sliderFill) return;
  
  const minYear = 1980;
  const maxYear = 2023;
  const yearRange = maxYear - minYear;
  
  const leftPercent = ((startYear - minYear) / yearRange) * 100;
  const rightPercent = 100 - ((endYear - minYear) / yearRange) * 100;
  
  sliderFill.style.left = `${leftPercent}%`;
  sliderFill.style.right = `${rightPercent}%`;
}

// Initialize the timeline chart
function initializeTimelineChart() {
  const timelineChart = document.getElementById('timeline-chart');
  if (!timelineChart) return;
  
  // Get selected metrics and years
  const primaryMetric = document.getElementById('primary-metric').value;
  const secondaryMetric = document.getElementById('secondary-metric').value;
  const startYear = parseInt(document.querySelector('.year-slider-handle.left').dataset.value);
  const endYear = parseInt(document.querySelector('.year-slider-handle.right').dataset.value);
  
  // Get comparison data
  const data = window.climateData.getComparisonData(startYear, endYear, primaryMetric, secondaryMetric);
  
  // Draw chart based on whether we have a secondary metric
  if (secondaryMetric === 'none') {
    // Single metric chart
    window.chartUtils.drawLineChart(timelineChart, data, {
      lineColor: getColorForMetric(primaryMetric),
      fillArea: true,
      formatY: value => formatValueByType(value, primaryMetric),
      yAxisLabel: getMetricName(primaryMetric)
    });
  } else {
    // Dual axis chart (draw custom chart)
    const canvas = document.createElement('canvas');
    canvas.width = timelineChart.clientWidth;
    canvas.height = timelineChart.clientHeight;
    timelineChart.innerHTML = '';
    timelineChart.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const themeColors = {
      grid: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)',
      text: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark'
        ? '#FFFFFF'
        : '#212121'
    };
    
    // Calculate chart dimensions
    const padding = 50; // Extra padding for dual Y-axes
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    // Find min/max values
    const years = data.map(d => d.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const primaryValues = data.map(d => d[primaryMetric]);
    const minPrimary = Math.min(...primaryValues) * 0.9; // Add 10% padding
    const maxPrimary = Math.max(...primaryValues) * 1.1;
    
    const secondaryValues = data.map(d => d[secondaryMetric]);
    const minSecondary = Math.min(...secondaryValues) * 0.9;
    const maxSecondary = Math.max(...secondaryValues) * 1.1;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1;
    
    // Vertical grid lines (years)
    const yearStep = Math.ceil((maxYear - minYear) / 8);
    for (let year = minYear; year <= maxYear; year += yearStep) {
      const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines (for primary metric)
    const primaryStep = (maxPrimary - minPrimary) / 5;
    for (let i = 0; i <= 5; i++) {
      const value = minPrimary + (i * primaryStep);
      const y = canvas.height - padding - ((value - minPrimary) / (maxPrimary - minPrimary)) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw X and Y axes
    ctx.strokeStyle = themeColors.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw secondary Y-axis
    ctx.beginPath();
    ctx.moveTo(canvas.width - padding, padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw primary metric line
    const primaryColor = getColorForMetric(primaryMetric);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((item, i) => {
      const x = padding + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y = canvas.height - padding - ((item[primaryMetric] - minPrimary) / (maxPrimary - minPrimary)) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Fill area under primary line
    ctx.fillStyle = primaryColor + '33'; // 20% opacity
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    
    data.forEach(item => {
      const x = padding + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y = canvas.height - padding - ((item[primaryMetric] - minPrimary) / (maxPrimary - minPrimary)) * chartHeight;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + chartWidth, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw secondary metric line
    const secondaryColor = getColorForMetric(secondaryMetric);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]); // Dashed line for secondary metric
    ctx.beginPath();
    
    data.forEach((item, i) => {
      const x = padding + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y = canvas.height - padding - ((item[secondaryMetric] - minSecondary) / (maxSecondary - minSecondary)) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash style
    
    // Draw data points
    data.forEach(item => {
      // Primary metric points
      ctx.fillStyle = primaryColor;
      const x1 = padding + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y1 = canvas.height - padding - ((item[primaryMetric] - minPrimary) / (maxPrimary - minPrimary)) * chartHeight;
      ctx.beginPath();
      ctx.arc(x1, y1, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Secondary metric points
      ctx.fillStyle = secondaryColor;
      const x2 = padding + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y2 = canvas.height - padding - ((item[secondaryMetric] - minSecondary) / (maxSecondary - minSecondary)) * chartHeight;
      ctx.beginPath();
      ctx.arc(x2, y2, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = themeColors.text;
    ctx.font = '12px Inter, sans-serif';
    
    // X-axis labels (years)
    ctx.textAlign = 'center';
    for (let year = minYear; year <= maxYear; year += yearStep) {
      const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
      ctx.fillText(year.toString(), x, canvas.height - padding + 20);
    }
    
    // Left Y-axis labels (primary metric)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minPrimary + (i * primaryStep);
      const y = canvas.height - padding - ((value - minPrimary) / (maxPrimary - minPrimary)) * chartHeight;
      ctx.fillStyle = primaryColor;
      ctx.fillText(formatValueByType(value, primaryMetric), padding - 10, y + 4);
    }
    
    // Right Y-axis labels (secondary metric)
    ctx.textAlign = 'left';
    const secondaryStep = (maxSecondary - minSecondary) / 5;
    for (let i = 0; i <= 5; i++) {
      const value = minSecondary + (i * secondaryStep);
      const y = canvas.height - padding - ((value - minSecondary) / (maxSecondary - minSecondary)) * chartHeight;
      ctx.fillStyle = secondaryColor;
      ctx.fillText(formatValueByType(value, secondaryMetric), canvas.width - padding + 10, y + 4);
    }
    
    // Draw legend
    const legendY = padding / 2;
    
    // Primary metric
    ctx.fillStyle = primaryColor;
    ctx.textAlign = 'left';
    ctx.fillRect(padding, legendY - 6, 20, 3);
    ctx.fillText(getMetricName(primaryMetric), padding + 30, legendY);
    
    // Secondary metric
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = 'right';
    ctx.fillRect(canvas.width - padding - 50, legendY - 6, 20, 3);
    ctx.fillText(getMetricName(secondaryMetric), canvas.width - padding, legendY);
  }
}

// Update timeline chart when parameters change
function updateTimelineChart() {
  initializeTimelineChart();
}

// Initialize comparison chart
function initializeComparisonChart() {
  const comparisonChart = document.getElementById('comparison-chart');
  if (!comparisonChart) return;
  
  // Get selected metrics
  const xAxis = document.getElementById('x-axis').value;
  const yAxis = document.getElementById('y-axis').value;
  const dataPeriod = document.getElementById('data-period').value;
  const [startYear, endYear] = dataPeriod.split('-').map(Number);
  
  // Get data for the selected period
  const filteredData = window.climateData.detailedTimelineData.filter(
    item => item.year >= startYear && item.year <= endYear
  );
  
  // Prepare data for scatter plot
  const data = filteredData.map(item => ({
    x: item[xAxis],
    y: item[yAxis],
    year: item.year
  }));
  
  // Draw scatter plot
  window.chartUtils.drawScatterPlot(comparisonChart, data, {
    xKey: 'x',
    yKey: 'y',
    pointColor: window.chartUtils.CHART_COLORS.secondary,
    pointRadius: 6,
    showTrendline: true,
    xAxisLabel: getMetricName(xAxis),
    yAxisLabel: getMetricName(yAxis),
    formatX: value => formatValueByType(value, xAxis),
    formatY: value => formatValueByType(value, yAxis)
  });
  
  // Calculate and display correlation
  updateCorrelationStats(data, xAxis, yAxis);
}

// Calculate and update correlation statistics
function updateCorrelationStats(data, xKey, yKey) {
  const correlationValueEl = document.getElementById('correlation-value');
  const rateValueEl = document.getElementById('rate-value');
  
  if (!correlationValueEl || !rateValueEl) return;
  
  // Calculate correlation coefficient
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;
  
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  
  for (let i = 0; i < data.length; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    denomX += xDiff * xDiff;
    denomY += yDiff * yDiff;
  }
  
  const correlation = numerator / Math.sqrt(denomX * denomY);
  correlationValueEl.textContent = correlation.toFixed(2);
  
  // Determine correlation strength description
  let correlationDesc = document.querySelector('.stat-description');
  if (correlationDesc) {
    if (correlation > 0.8) {
      correlationDesc.textContent = 'Strong positive correlation';
    } else if (correlation > 0.5) {
      correlationDesc.textContent = 'Moderate positive correlation';
    } else if (correlation > 0.2) {
      correlationDesc.textContent = 'Weak positive correlation';
    } else if (correlation > -0.2) {
      correlationDesc.textContent = 'No significant correlation';
    } else if (correlation > -0.5) {
      correlationDesc.textContent = 'Weak negative correlation';
    } else if (correlation > -0.8) {
      correlationDesc.textContent = 'Moderate negative correlation';
    } else {
      correlationDesc.textContent = 'Strong negative correlation';
    }
  }
  
  // Calculate rate of change for temperature over time if applicable
  if ((xKey === 'year' && yKey === 'temperature') || (yKey === 'year' && xKey === 'temperature')) {
    // Sort data by year
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    const firstYear = sortedData[0].year;
    const lastYear = sortedData[sortedData.length - 1].year;
    const yearDiff = lastYear - firstYear;
    
    // Find temperatures
    const firstTemp = xKey === 'temperature' ? sortedData[0].x : sortedData[0].y;
    const lastTemp = xKey === 'temperature' ? sortedData[sortedData.length - 1].x : sortedData[sortedData.length - 1].y;
    const tempDiff = lastTemp - firstTemp;
    
    // Calculate rate per decade
    const ratePerDecade = (tempDiff / yearDiff) * 10;
    rateValueEl.textContent = `${ratePerDecade > 0 ? '+' : ''}${ratePerDecade.toFixed(2)}°C per decade`;
  } else {
    rateValueEl.textContent = 'N/A for selected metrics';
  }
}

// Initialize future scenarios chart
function initializeScenariosChart() {
  const scenariosChart = document.getElementById('scenarios-projection-chart');
  if (!scenariosChart) return;
  
  // Get scenario data
  const scenarios = window.climateData.climateScenarios;
  
  // Get the projection end year
  const projectionEnd = parseInt(document.getElementById('projection-end').value);
  
  // Filter scenarios to show only up to the selected end year
  const filteredScenarios = scenarios.map(scenario => ({
    name: scenario.name,
    data: scenario.data.filter(d => d.year <= projectionEnd)
  }));
  
  // Draw multi-line chart
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
  
  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Find min/max values across all scenarios
  const allData = filteredScenarios.flatMap(s => s.data);
  const minYear = Math.min(...allData.map(d => d.year));
  const maxYear = Math.max(...allData.map(d => d.year));
  const minTemp = Math.min(...allData.map(d => d.temperature));
  const maxTemp = Math.max(...allData.map(d => d.temperature));
  
  // Add padding to temperature range
  const tempRange = maxTemp - minTemp;
  const paddedMinTemp = Math.max(0, minTemp - (tempRange * 0.1));
  const paddedMaxTemp = maxTemp + (tempRange * 0.1);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = themeColors.grid;
  ctx.lineWidth = 1;
  
  // Vertical grid lines (years)
  const yearRange = maxYear - minYear;
  const yearStep = Math.ceil(yearRange / 8);
  for (let year = minYear; year <= maxYear; year += yearStep) {
    const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.stroke();
  }
  
  // Horizontal grid lines (temperature)
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
  
  // Check which scenarios are active
  const activeScenarios = {};
  document.querySelectorAll('.scenario-toggle').forEach(toggle => {
    const scenario = toggle.dataset.scenario;
    activeScenarios[scenario] = toggle.classList.contains('active');
  });
  
  filteredScenarios.forEach(scenario => {
    // Skip inactive scenarios
    const scenarioKey = scenario.name.split(' ')[0].toLowerCase();
    if (!activeScenarios[scenarioKey]) return;
    
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
  
  // X-axis labels (years)
  ctx.textAlign = 'center';
  for (let year = minYear; year <= maxYear; year += yearStep) {
    const x = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    ctx.fillText(year.toString(), x, canvas.height - padding + 20);
  }
  
  // Y-axis labels (temperature)
  ctx.textAlign = 'right';
  for (let temp = Math.ceil(paddedMinTemp); temp <= paddedMaxTemp; temp += tempStep) {
    const y = canvas.height - padding - ((temp - paddedMinTemp) / (paddedMaxTemp - paddedMinTemp)) * chartHeight;
    ctx.fillText(`${temp.toFixed(1)}°C`, padding - 10, y + 4);
  }
  
  // Add vertical line for current year
  const currentYear = 2023;
  const currentX = padding + ((currentYear - minYear) / (maxYear - minYear)) * chartWidth;
  
  ctx.strokeStyle = themeColors.text;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.moveTo(currentX, padding);
  ctx.lineTo(currentX, canvas.height - padding);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Label for current year line
  ctx.fillStyle = themeColors.text;
  ctx.textAlign = 'center';
  ctx.fillText('Current', currentX, padding - 10);
  
  // Draw 1.5°C and 2°C threshold lines
  const thresholds = [1.5, 2.0];
  const baselineTemp = 13.9; // Pre-industrial baseline
  
  thresholds.forEach(threshold => {
    const thresholdTemp = baselineTemp + threshold;
    const thresholdY = canvas.height - padding - ((thresholdTemp - paddedMinTemp) / (paddedMaxTemp - paddedMinTemp)) * chartHeight;
    
    ctx.strokeStyle = threshold === 1.5 ? '#FFB300' : '#F44336';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(padding, thresholdY);
    ctx.lineTo(canvas.width - padding, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Label for threshold
    ctx.fillStyle = threshold === 1.5 ? '#FFB300' : '#F44336';
    ctx.textAlign = 'left';
    ctx.fillText(`+${threshold}°C threshold`, padding + 5, thresholdY - 5);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Timeline chart controls
  const primaryMetricSelect = document.getElementById('primary-metric');
  const secondaryMetricSelect = document.getElementById('secondary-metric');
  
  if (primaryMetricSelect && secondaryMetricSelect) {
    primaryMetricSelect.addEventListener('change', updateTimelineChart);
    secondaryMetricSelect.addEventListener('change', updateTimelineChart);
  }
  
  // Comparison chart controls
  const xAxisSelect = document.getElementById('x-axis');
  const yAxisSelect = document.getElementById('y-axis');
  const dataPeriodSelect = document.getElementById('data-period');
  
  if (xAxisSelect && yAxisSelect && dataPeriodSelect) {
    xAxisSelect.addEventListener('change', initializeComparisonChart);
    yAxisSelect.addEventListener('change', initializeComparisonChart);
    dataPeriodSelect.addEventListener('change', initializeComparisonChart);
  }
  
  // Scenarios controls
  const scenarioToggles = document.querySelectorAll('.scenario-toggle');
  const projectionEndSelect = document.getElementById('projection-end');
  
  if (scenarioToggles.length && projectionEndSelect) {
    scenarioToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        initializeScenariosChart();
      });
    });
    
    projectionEndSelect.addEventListener('change', initializeScenariosChart);
  }
  
  // Scenario tabs
  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  if (scenarioTabs.length) {
    scenarioTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        scenarioTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Hide all scenario details
        document.querySelectorAll('.scenario-detail-content').forEach(content => {
          content.classList.add('hidden');
        });
        
        // Show selected scenario detail
        const scenarioId = this.dataset.scenario;
        document.getElementById(`${scenarioId}-emissions-detail`).classList.remove('hidden');
      });
    });
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
    'arcticIce': window.chartUtils.CHART_COLORS.arcticIce,
    'year': window.chartUtils.CHART_COLORS.text
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