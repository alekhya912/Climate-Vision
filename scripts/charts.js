// Chart drawing utilities for Climate Vision

// Chart color constants
const CHART_COLORS = {
  temperature: '#F44336',
  co2: '#1E88E5',
  methane: '#7B1FA2',
  seaLevel: '#0097A7',
  arcticIce: '#90CAF9',
  primary: '#43A047',
  secondary: '#1E88E5',
  accent: '#FFB300',
  lowEmission: '#43A047',
  mediumEmission: '#FFB300',
  highEmission: '#F44336',
  grid: 'rgba(0, 0, 0, 0.1)',
  gridDark: 'rgba(255, 255, 255, 0.1)',
  text: '#212121',
  textDark: '#FFFFFF',
  background: '#FFFFFF',
  backgroundDark: '#121212'
};

// Get theme-aware colors
function getThemeColors() {
  const isDarkTheme = document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark';
  
  return {
    grid: isDarkTheme ? CHART_COLORS.gridDark : CHART_COLORS.grid,
    text: isDarkTheme ? CHART_COLORS.textDark : CHART_COLORS.text,
    background: isDarkTheme ? CHART_COLORS.backgroundDark : CHART_COLORS.background
  };
}

// Draw a line chart in the specified container
function drawLineChart(container, data, options = {}) {
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = getThemeColors();
  
  // Default options
  const defaultOptions = {
    xKey: 'year',
    yKey: 'value',
    lineColor: CHART_COLORS.primary,
    lineWidth: 3,
    pointRadius: 4,
    fillArea: false,
    showGrid: true,
    showLabels: true,
    xAxisLabel: '',
    yAxisLabel: '',
    formatX: x => x,
    formatY: y => y
  };
  
  // Merge options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Find min/max values
  let minX = Math.min(...data.map(d => d[chartOptions.xKey]));
  let maxX = Math.max(...data.map(d => d[chartOptions.xKey]));
  let minY = Math.min(...data.map(d => d[chartOptions.yKey]));
  let maxY = Math.max(...data.map(d => d[chartOptions.yKey]));
  
  // Add some padding to Y axis
  const yRange = maxY - minY;
  minY = Math.max(0, minY - (yRange * 0.1));
  maxY = maxY + (yRange * 0.1);
  
  // Convert data points to pixels
  const points = data.map(d => ({
    x: padding + ((d[chartOptions.xKey] - minX) / (maxX - minX)) * chartWidth,
    y: canvas.height - padding - ((d[chartOptions.yKey] - minY) / (maxY - minY)) * chartHeight
  }));
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  if (chartOptions.showGrid) {
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    const xGridCount = Math.min(10, maxX - minX);
    for (let i = 0; i <= xGridCount; i++) {
      const x = padding + (i / xGridCount) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding + (i / yGridCount) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  }
  
  // Draw X and Y axis
  ctx.strokeStyle = themeColors.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw line
  ctx.strokeStyle = chartOptions.lineColor;
  ctx.lineWidth = chartOptions.lineWidth;
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  
  // Fill area under line if specified
  if (chartOptions.fillArea) {
    ctx.fillStyle = chartOptions.lineColor + '33'; // 20% opacity
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw points
  ctx.fillStyle = chartOptions.lineColor;
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, chartOptions.pointRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw labels
  if (chartOptions.showLabels) {
    ctx.fillStyle = themeColors.text;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    const xLabelCount = Math.min(6, data.length);
    for (let i = 0; i < data.length; i += Math.ceil(data.length / xLabelCount)) {
      const point = points[i];
      const value = data[i][chartOptions.xKey];
      ctx.fillText(chartOptions.formatX(value), point.x, canvas.height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    const yLabelCount = 5;
    for (let i = 0; i <= yLabelCount; i++) {
      const y = padding + (i / yLabelCount) * chartHeight;
      const value = maxY - (i / yLabelCount) * (maxY - minY);
      ctx.fillText(chartOptions.formatY(value), padding - 10, y + 4);
    }
    
    // Axis titles
    if (chartOptions.xAxisLabel) {
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.xAxisLabel, canvas.width / 2, canvas.height - 10);
    }
    
    if (chartOptions.yAxisLabel) {
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.yAxisLabel, 0, 0);
      ctx.restore();
    }
  }
}

// Draw a bar chart in the specified container
function drawBarChart(container, data, options = {}) {
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = getThemeColors();
  
  // Default options
  const defaultOptions = {
    xKey: 'label',
    yKey: 'value',
    barColor: CHART_COLORS.primary,
    barWidth: 0.6, // Percentage of available space
    showGrid: true,
    showLabels: true,
    xAxisLabel: '',
    yAxisLabel: '',
    formatX: x => x,
    formatY: y => y
  };
  
  // Merge options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Find min/max values
  const minY = 0; // Usually start from zero for bar charts
  const maxY = Math.max(...data.map(d => d[chartOptions.yKey])) * 1.1; // Add 10% padding
  
  // Calculate bar width and spacing
  const barCount = data.length;
  const totalBarWidth = chartWidth / barCount;
  const barWidth = totalBarWidth * chartOptions.barWidth;
  const barSpacing = totalBarWidth - barWidth;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  if (chartOptions.showGrid) {
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding + (i / yGridCount) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  }
  
  // Draw X and Y axis
  ctx.strokeStyle = themeColors.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw bars
  data.forEach((item, i) => {
    const x = padding + (i * totalBarWidth) + (barSpacing / 2);
    const barHeight = (item[chartOptions.yKey] / maxY) * chartHeight;
    const y = canvas.height - padding - barHeight;
    
    ctx.fillStyle = Array.isArray(chartOptions.barColor) 
      ? chartOptions.barColor[i % chartOptions.barColor.length] 
      : chartOptions.barColor;
    
    ctx.beginPath();
    ctx.rect(x, y, barWidth, barHeight);
    ctx.fill();
  });
  
  // Draw labels
  if (chartOptions.showLabels) {
    ctx.fillStyle = themeColors.text;
    ctx.font = '12px Inter, sans-serif';
    
    // X-axis labels
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
      const x = padding + (i * totalBarWidth) + (totalBarWidth / 2);
      ctx.fillText(
        chartOptions.formatX(item[chartOptions.xKey]), 
        x, 
        canvas.height - padding + 20
      );
    });
    
    // Y-axis labels
    ctx.textAlign = 'right';
    const yLabelCount = 5;
    for (let i = 0; i <= yLabelCount; i++) {
      const y = padding + (i / yLabelCount) * chartHeight;
      const value = maxY - (i / yLabelCount) * maxY;
      ctx.fillText(chartOptions.formatY(value), padding - 10, y + 4);
    }
    
    // Axis titles
    if (chartOptions.xAxisLabel) {
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.xAxisLabel, canvas.width / 2, canvas.height - 10);
    }
    
    if (chartOptions.yAxisLabel) {
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.yAxisLabel, 0, 0);
      ctx.restore();
    }
  }
}

// Draw a pie/donut chart
function drawPieChart(container, data, options = {}) {
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = getThemeColors();
  
  // Default options
  const defaultOptions = {
    valueKey: 'value',
    labelKey: 'label',
    colors: [
      '#43A047', '#1E88E5', '#FFB300', '#E53935', '#5E35B1', 
      '#00ACC1', '#F4511E', '#546E7A', '#8E24AA', '#3949AB'
    ],
    innerRadius: 0, // 0 for pie, >0 for donut
    showLabels: true,
    showLegend: false,
    formatValue: v => v,
    formatLabel: l => l
  };
  
  // Merge options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item[chartOptions.valueKey], 0);
  
  // Calculate center and radius
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 40;
  const innerRadius = radius * chartOptions.innerRadius;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw slices
  let startAngle = -Math.PI / 2; // Start from top
  
  data.forEach((item, i) => {
    const sliceAngle = (item[chartOptions.valueKey] / total) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;
    
    // Draw slice
    ctx.fillStyle = chartOptions.colors[i % chartOptions.colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    
    // If it's a donut chart, cut out the center
    if (innerRadius > 0) {
      ctx.fillStyle = themeColors.background;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw labels if enabled
    if (chartOptions.showLabels) {
      // Calculate position for label
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Only show percentage if there's enough space
      const percentage = Math.round((item[chartOptions.valueKey] / total) * 100);
      if (percentage > 5) {
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
    }
    
    startAngle = endAngle;
  });
  
  // Draw legend if enabled
  if (chartOptions.showLegend) {
    const legendX = canvas.width - 150;
    const legendY = 40;
    const itemHeight = 25;
    
    data.forEach((item, i) => {
      const y = legendY + (i * itemHeight);
      
      // Draw color box
      ctx.fillStyle = chartOptions.colors[i % chartOptions.colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = themeColors.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        chartOptions.formatLabel(item[chartOptions.labelKey]), 
        legendX + 25, 
        y + 12
      );
    });
  }
}

// Draw a scatter plot
function drawScatterPlot(container, data, options = {}) {
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = getThemeColors();
  
  // Default options
  const defaultOptions = {
    xKey: 'x',
    yKey: 'y',
    pointColor: CHART_COLORS.primary,
    pointRadius: 5,
    showGrid: true,
    showLabels: true,
    showTrendline: false,
    xAxisLabel: '',
    yAxisLabel: '',
    formatX: x => x,
    formatY: y => y
  };
  
  // Merge options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Find min/max values
  let minX = Math.min(...data.map(d => d[chartOptions.xKey]));
  let maxX = Math.max(...data.map(d => d[chartOptions.xKey]));
  let minY = Math.min(...data.map(d => d[chartOptions.yKey]));
  let maxY = Math.max(...data.map(d => d[chartOptions.yKey]));
  
  // Add some padding
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  minX = Math.max(0, minX - (xRange * 0.1));
  maxX = maxX + (xRange * 0.1);
  minY = Math.max(0, minY - (yRange * 0.1));
  maxY = maxY + (yRange * 0.1);
  
  // Convert data points to pixels
  const points = data.map(d => ({
    x: padding + ((d[chartOptions.xKey] - minX) / (maxX - minX)) * chartWidth,
    y: canvas.height - padding - ((d[chartOptions.yKey] - minY) / (maxY - minY)) * chartHeight,
    originalX: d[chartOptions.xKey],
    originalY: d[chartOptions.yKey]
  }));
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  if (chartOptions.showGrid) {
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    const xGridCount = 5;
    for (let i = 0; i <= xGridCount; i++) {
      const x = padding + (i / xGridCount) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding + (i / yGridCount) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  }
  
  // Draw X and Y axis
  ctx.strokeStyle = themeColors.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw trendline if enabled
  if (chartOptions.showTrendline && data.length > 1) {
    // Simple linear regression
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    
    data.forEach(d => {
      const x = d[chartOptions.xKey];
      const y = d[chartOptions.yKey];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const n = data.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Draw trendline
    const startX = minX;
    const startY = slope * startX + intercept;
    const endX = maxX;
    const endY = slope * endX + intercept;
    
    // Convert to pixels
    const startPixelX = padding;
    const startPixelY = canvas.height - padding - ((startY - minY) / (maxY - minY)) * chartHeight;
    const endPixelX = canvas.width - padding;
    const endPixelY = canvas.height - padding - ((endY - minY) / (maxY - minY)) * chartHeight;
    
    // Draw line
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(startPixelX, startPixelY);
    ctx.lineTo(endPixelX, endPixelY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  // Draw points
  points.forEach(point => {
    ctx.fillStyle = chartOptions.pointColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, chartOptions.pointRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw labels
  if (chartOptions.showLabels) {
    ctx.fillStyle = themeColors.text;
    ctx.font = '12px Inter, sans-serif';
    
    // X-axis labels
    ctx.textAlign = 'center';
    const xLabelCount = 5;
    for (let i = 0; i <= xLabelCount; i++) {
      const x = padding + (i / xLabelCount) * chartWidth;
      const value = minX + (i / xLabelCount) * (maxX - minX);
      ctx.fillText(chartOptions.formatX(value), x, canvas.height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    const yLabelCount = 5;
    for (let i = 0; i <= yLabelCount; i++) {
      const y = padding + (i / yLabelCount) * chartHeight;
      const value = maxY - (i / yLabelCount) * (maxY - minY);
      ctx.fillText(chartOptions.formatY(value), padding - 10, y + 4);
    }
    
    // Axis titles
    if (chartOptions.xAxisLabel) {
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.xAxisLabel, canvas.width / 2, canvas.height - 10);
    }
    
    if (chartOptions.yAxisLabel) {
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(chartOptions.yAxisLabel, 0, 0);
      ctx.restore();
    }
  }
}

// Draw a simple world map for region visualization
function drawWorldMap(container, regions, options = {}) {
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = getThemeColors();
  
  // Default options
  const defaultOptions = {
    backgroundColor: themeColors.background,
    mapColor: themeColors.grid,
    regionColors: {
      low: '#8BC34A',
      medium: '#FFEB3B',
      high: '#FF9800',
      extreme: '#F44336'
    },
    showLabels: true
  };
  
  // Merge options
  const mapOptions = { ...defaultOptions, ...options };
  
  // Clear canvas
  ctx.fillStyle = mapOptions.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw simplified world map (just a placeholder)
  ctx.fillStyle = mapOptions.mapColor;
  ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
  
  // Draw regions as circles
  regions.forEach(region => {
    // Scale coordinates to canvas
    const x = 50 + ((region.coordinates[0] + 180) / 360) * (canvas.width - 100);
    const y = 50 + ((90 - region.coordinates[1]) / 180) * (canvas.height - 100);
    
    // Draw region circle
    const radius = Math.max(5, Math.min(15, region.value * 2));
    ctx.fillStyle = mapOptions.regionColors[region.riskLevel];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw label if enabled
    if (mapOptions.showLabels) {
      ctx.fillStyle = themeColors.text;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(region.name, x, y + radius + 12);
    }
  });
}

// Export chart functions
window.chartUtils = {
  drawLineChart,
  drawBarChart,
  drawPieChart,
  drawScatterPlot,
  drawWorldMap,
  CHART_COLORS
};