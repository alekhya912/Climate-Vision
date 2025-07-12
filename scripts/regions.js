// Regions page functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeRegionsMap();
  generateRegionCards();
  setupEventListeners();
  
  // Hide region detail section initially
  const detailSection = document.getElementById('selected-region-section');
  if (detailSection) {
    detailSection.style.display = 'none';
  }
});

// Initialize the world map visualization
function initializeRegionsMap() {
  const mapContainer = document.getElementById('regions-map');
  if (!mapContainer) return;
  
  // Get regions data
  const regions = window.climateData.getMapRegions();
  
  // Draw map
  window.chartUtils.drawWorldMap(mapContainer, regions);
  
  // Setup tooltip functionality
  setupMapTooltip();
}

// Generate region cards from data
function generateRegionCards() {
  const regionsGrid = document.getElementById('regions-grid');
  if (!regionsGrid) return;
  
  // Get regions data
  const regions = window.climateData.regionsData;
  
  // Clear existing content
  regionsGrid.innerHTML = '';
  
  // Generate cards
  regions.forEach(region => {
    const card = document.createElement('div');
    card.className = 'region-card';
    card.dataset.regionId = region.id;
    
    card.innerHTML = `
      <div class="region-card-header">
        <h3>${region.name}</h3>
        <div class="region-risk-badge risk-${region.riskLevel}">${capitalizeFirstLetter(region.riskLevel)} Risk</div>
      </div>
      <div class="region-card-content">
        <div class="region-metrics">
          <div class="region-metric">
            <div class="region-metric-label">Temperature Change</div>
            <div class="region-metric-value">+${region.temperature.toFixed(1)}°C</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">Rainfall Change</div>
            <div class="region-metric-value">${region.rainfall > 0 ? '+' : ''}${region.rainfall.toFixed(1)}%</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">Natural Disasters</div>
            <div class="region-metric-value">${region.naturalDisasters || 0}</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">${region.seaLevel ? 'Sea Level Rise' : 'Impact Score'}</div>
            <div class="region-metric-value">${region.seaLevel ? `+${region.seaLevel.toFixed(1)} cm` : (region.vulnerabilityScore.toFixed(1))}</div>
          </div>
        </div>
      </div>
      <div class="region-card-footer">
        <div class="vulnerability-label">Vulnerability Score: <span class="vulnerability-score">${region.vulnerabilityScore.toFixed(1)}</span></div>
        <div class="view-details">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </div>
    `;
    
    // Add click event to view region details
    card.addEventListener('click', () => {
      showRegionDetails(region.id);
    });
    
    regionsGrid.appendChild(card);
  });
}

// Setup tooltip interaction for the map
function setupMapTooltip() {
  const mapContainer = document.getElementById('regions-map');
  const tooltip = document.getElementById('region-tooltip');
  
  if (!mapContainer || !tooltip) return;
  
  // Get regions data
  const regions = window.climateData.getMapRegions();
  
  // Create region hitboxes
  regions.forEach(region => {
    const regionData = window.climateData.getRegionById(region.id);
    
    // Create hitbox element
    const hitbox = document.createElement('div');
    hitbox.className = 'region-hitbox';
    hitbox.dataset.regionId = region.id;
    
    // Style the hitbox (invisible)
    hitbox.style.position = 'absolute';
    const x = 50 + ((region.coordinates[0] + 180) / 360) * (mapContainer.clientWidth - 100);
    const y = 50 + ((90 - region.coordinates[1]) / 180) * (mapContainer.clientHeight - 100);
    hitbox.style.left = `${x - 15}px`;
    hitbox.style.top = `${y - 15}px`;
    hitbox.style.width = '30px';
    hitbox.style.height = '30px';
    hitbox.style.borderRadius = '50%';
    hitbox.style.cursor = 'pointer';
    
    // Mouse events
    hitbox.addEventListener('mouseover', (e) => {
      // Show tooltip
      tooltip.style.display = 'block';
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y - 10}px`;
      
      // Update tooltip content
      document.getElementById('tooltip-title').textContent = regionData.name;
      document.getElementById('tooltip-risk').textContent = `${capitalizeFirstLetter(regionData.riskLevel)} Risk`;
      document.getElementById('tooltip-risk').className = `tooltip-risk-badge risk-${regionData.riskLevel}`;
      document.getElementById('tooltip-temp').textContent = `+${regionData.temperature.toFixed(1)}°C`;
      document.getElementById('tooltip-rain').textContent = `${regionData.rainfall > 0 ? '+' : ''}${regionData.rainfall.toFixed(1)}%`;
      document.getElementById('tooltip-disasters').textContent = `${regionData.naturalDisasters || 0} events`;
      document.getElementById('tooltip-score').textContent = regionData.vulnerabilityScore.toFixed(1);
    });
    
    hitbox.addEventListener('mouseout', () => {
      // Hide tooltip
      tooltip.style.display = 'none';
    });
    
    hitbox.addEventListener('click', () => {
      // Show region details
      showRegionDetails(region.id);
    });
    
    mapContainer.appendChild(hitbox);
  });
}

// Show detailed view for a selected region
function showRegionDetails(regionId) {
  // Get region data
  const region = window.climateData.getRegionById(regionId);
  if (!region) return;
  
  // Get container elements
  const gridSection = document.querySelector('.regions-grid-section');
  const detailSection = document.getElementById('selected-region-section');
  
  if (!gridSection || !detailSection) return;
  
  // Hide grid, show details
  gridSection.style.display = 'none';
  detailSection.style.display = 'block';
  
  // Scroll to top of details
  window.scrollTo({
    top: detailSection.offsetTop - 80,
    behavior: 'smooth'
  });
  
  // Update region details
  document.getElementById('region-detail-name').textContent = region.name;
  
  const riskBadge = document.getElementById('region-detail-risk');
  riskBadge.textContent = `${capitalizeFirstLetter(region.riskLevel)} Risk`;
  riskBadge.className = `region-detail-risk-badge risk-${region.riskLevel}`;
  
  // Update metrics
  document.getElementById('detail-temp').textContent = `+${region.temperature.toFixed(1)}°C`;
  document.getElementById('detail-rain').textContent = `${region.rainfall > 0 ? '+' : ''}${region.rainfall.toFixed(1)}%`;
  document.getElementById('detail-disasters').textContent = region.naturalDisasters || 0;
  document.getElementById('detail-vulnerability').textContent = region.vulnerabilityScore.toFixed(1);
  
  // Generate region-specific impacts
  generateRegionImpacts(region);
  
  // Draw vulnerability chart
  drawVulnerabilityChart(region);
}

// Generate impact descriptions for a specific region
function generateRegionImpacts(region) {
  const impactsContainer = document.getElementById('region-impacts');
  if (!impactsContainer) return;
  
  // Clear existing content
  impactsContainer.innerHTML = '';
  
  // Create impact items based on region data
  const impacts = [];
  
  // Temperature impact
  if (region.temperature > 2.0) {
    impacts.push({
      icon: 'temperature-icon',
      title: 'Severe Heat Stress',
      description: `With a projected temperature increase of +${region.temperature.toFixed(1)}°C, ${region.name} faces significant heat stress affecting agriculture, public health, and energy demand.`
    });
  } else {
    impacts.push({
      icon: 'temperature-icon',
      title: 'Rising Temperatures',
      description: `A temperature increase of +${region.temperature.toFixed(1)}°C will lead to longer and more frequent heat waves, affecting ecosystems and human health.`
    });
  }
  
  // Rainfall impact
  if (region.rainfall < -10) {
    impacts.push({
      icon: 'rain-icon',
      title: 'Severe Drought Risk',
      description: `Projected rainfall decrease of ${region.rainfall.toFixed(1)}% puts ${region.name} at high risk for prolonged droughts, water scarcity, and agricultural challenges.`
    });
  } else if (region.rainfall < 0) {
    impacts.push({
      icon: 'rain-icon',
      title: 'Reduced Precipitation',
      description: `Rainfall decrease of ${region.rainfall.toFixed(1)}% will impact water resources and agriculture, requiring adaptation measures.`
    });
  } else {
    impacts.push({
      icon: 'rain-icon',
      title: 'Increased Precipitation',
      description: `Rainfall increase of +${region.rainfall.toFixed(1)}% may lead to more flooding events and challenges in water management infrastructure.`
    });
  }
  
  // Sea level impact if applicable
  if (region.seaLevel) {
    impacts.push({
      icon: 'sea-icon',
      title: 'Coastal Vulnerability',
      description: `Sea level rise of +${region.seaLevel.toFixed(1)} cm threatens coastal communities in ${region.name}, requiring significant adaptation and protection measures.`
    });
  } else {
    // Natural disasters impact as alternative
    impacts.push({
      icon: 'disaster-icon',
      title: 'Natural Disaster Exposure',
      description: `With ${region.naturalDisasters} climate-related disaster events in recent years, ${region.name} faces increasing challenges in disaster preparedness and response.`
    });
  }
  
  // Generate HTML for impacts
  impacts.forEach(impact => {
    const impactElement = document.createElement('div');
    impactElement.className = 'impact-item';
    
    impactElement.innerHTML = `
      <div class="impact-icon ${impact.icon}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getIconPath(impact.icon)}
        </svg>
      </div>
      <div class="impact-content">
        <h4>${impact.title}</h4>
        <p>${impact.description}</p>
      </div>
    `;
    
    impactsContainer.appendChild(impactElement);
  });
}

// Draw vulnerability radar chart for region
function drawVulnerabilityChart(region) {
  const chartContainer = document.getElementById('vulnerability-chart');
  if (!chartContainer) return;
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = chartContainer.clientWidth;
  canvas.height = chartContainer.clientHeight;
  chartContainer.innerHTML = '';
  chartContainer.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const themeColors = {
    grid: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
    text: document.querySelector('.page-wrapper').getAttribute('data-theme') === 'dark'
      ? '#FFFFFF'
      : '#212121'
  };
  
  // Define radar chart categories and values
  const categories = [
    'Temperature Exposure',
    'Precipitation Change',
    'Natural Disasters',
    'Adaptive Capacity',
    'Population Exposure'
  ];
  
  // Calculate values based on region data
  const values = [
    region.temperature / 3 * 10, // Temperature (scale 0-10)
    Math.abs(region.rainfall) / 25 * 10, // Precipitation (scale 0-10)
    region.naturalDisasters / 30 * 10, // Natural disasters (scale 0-10)
    10 - (region.vulnerabilityScore / 10 * 10), // Adaptive capacity (inverse of vulnerability)
    region.vulnerabilityScore / 10 * 10 // Population exposure (based on vulnerability score)
  ];
  
  // Calculate radar chart parameters
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;
  
  // Draw radar grid
  const levels = 5; // Number of concentric circles
  ctx.strokeStyle = themeColors.grid;
  ctx.fillStyle = themeColors.text;
  
  for (let i = 1; i <= levels; i++) {
    const levelRadius = radius * (i / levels);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw level label on the left side
    ctx.textAlign = 'right';
    ctx.fillText((i * 2).toString(), centerX - levelRadius - 5, centerY);
  }
  
  // Draw axes
  const angleStep = (Math.PI * 2) / categories.length;
  
  categories.forEach((category, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    
    // Draw axis line
    ctx.strokeStyle = themeColors.grid;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    );
    ctx.stroke();
    
    // Draw category label
    ctx.fillStyle = themeColors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelDistance = radius + 20;
    const labelX = centerX + labelDistance * Math.cos(angle);
    const labelY = centerY + labelDistance * Math.sin(angle);
    
    // Adjust vertical alignment based on position
    if (angle === -Math.PI / 2) { // Top
      ctx.textBaseline = 'bottom';
    } else if (angle === Math.PI / 2) { // Bottom
      ctx.textBaseline = 'top';
    }
    
    // Adjust horizontal alignment based on position
    if (angle === 0) { // Right
      ctx.textAlign = 'left';
    } else if (angle === Math.PI) { // Left
      ctx.textAlign = 'right';
    }
    
    // Draw wrapped text for better appearance
    const words = category.split(' ');
    if (words.length > 1) {
      ctx.fillText(words[0], labelX, labelY - 10);
      ctx.fillText(words.slice(1).join(' '), labelX, labelY + 10);
    } else {
      ctx.fillText(category, labelX, labelY);
    }
  });
  
  // Draw data
  ctx.fillStyle = window.chartUtils.CHART_COLORS.primary + '33'; // Transparent fill
  ctx.strokeStyle = window.chartUtils.CHART_COLORS.primary;
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  values.forEach((value, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const distance = (value / 10) * radius;
    
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  // Close the path by connecting back to the first point
  const firstAngle = -Math.PI / 2;
  const firstDistance = (values[0] / 10) * radius;
  ctx.lineTo(
    centerX + firstDistance * Math.cos(firstAngle),
    centerY + firstDistance * Math.sin(firstAngle)
  );
  
  ctx.fill();
  ctx.stroke();
  
  // Draw data points
  ctx.fillStyle = window.chartUtils.CHART_COLORS.primary;
  values.forEach((value, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const distance = (value / 10) * radius;
    
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Setup event listeners
function setupEventListeners() {
  // Back button for region detail view
  const backButton = document.getElementById('back-to-regions');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Hide detail section, show grid
      document.getElementById('selected-region-section').style.display = 'none';
      document.querySelector('.regions-grid-section').style.display = 'block';
    });
  }
  
  // Risk level filter
  const riskLevelSelect = document.getElementById('risk-level');
  if (riskLevelSelect) {
    riskLevelSelect.addEventListener('change', () => {
      filterRegions();
    });
  }
  
  // Impact type filter
  const impactTypeSelect = document.getElementById('impact-type');
  if (impactTypeSelect) {
    impactTypeSelect.addEventListener('change', () => {
      filterRegions();
    });
  }
}

// Filter regions based on selected filters
function filterRegions() {
  const riskLevel = document.getElementById('risk-level').value;
  const impactType = document.getElementById('impact-type').value;
  
  // Get filtered regions
  let regions = window.climateData.regionsData;
  
  // Filter by risk level if not "all"
  if (riskLevel !== 'all') {
    regions = regions.filter(region => region.riskLevel === riskLevel);
  }
  
  // Sort by the selected impact type
  regions.sort((a, b) => b[impactType] - a[impactType]);
  
  // Regenerate region cards with filtered data
  const regionsGrid = document.getElementById('regions-grid');
  if (!regionsGrid) return;
  
  // Clear existing content
  regionsGrid.innerHTML = '';
  
  // Generate cards
  regions.forEach(region => {
    const card = document.createElement('div');
    card.className = 'region-card';
    card.dataset.regionId = region.id;
    
    card.innerHTML = `
      <div class="region-card-header">
        <h3>${region.name}</h3>
        <div class="region-risk-badge risk-${region.riskLevel}">${capitalizeFirstLetter(region.riskLevel)} Risk</div>
      </div>
      <div class="region-card-content">
        <div class="region-metrics">
          <div class="region-metric">
            <div class="region-metric-label">Temperature Change</div>
            <div class="region-metric-value">+${region.temperature.toFixed(1)}°C</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">Rainfall Change</div>
            <div class="region-metric-value">${region.rainfall > 0 ? '+' : ''}${region.rainfall.toFixed(1)}%</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">Natural Disasters</div>
            <div class="region-metric-value">${region.naturalDisasters || 0}</div>
          </div>
          <div class="region-metric">
            <div class="region-metric-label">${region.seaLevel ? 'Sea Level Rise' : 'Impact Score'}</div>
            <div class="region-metric-value">${region.seaLevel ? `+${region.seaLevel.toFixed(1)} cm` : (region.vulnerabilityScore.toFixed(1))}</div>
          </div>
        </div>
      </div>
      <div class="region-card-footer">
        <div class="vulnerability-label">Vulnerability Score: <span class="vulnerability-score">${region.vulnerabilityScore.toFixed(1)}</span></div>
        <div class="view-details">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </div>
    `;
    
    // Add click event to view region details
    card.addEventListener('click', () => {
      showRegionDetails(region.id);
    });
    
    regionsGrid.appendChild(card);
  });
}

// Helper functions

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get SVG path for icon
function getIconPath(iconClass) {
  const iconPaths = {
    'temperature-icon': '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>',
    'rain-icon': '<path d="M4 14.8991C4 8.99758 12 3.09606 12 3.09606C12 3.09606 20 8.99758 20 14.8991C20 19.1009 16.4183 22.6007 12 22.6007C7.58172 22.6007 4 19.1009 4 14.8991Z"></path><path d="M12 17.1C12.6213 17.1 13.2174 16.8629 13.6575 16.4412C14.0976 16.0195 14.3478 15.4468 14.3478 14.85C14.3478 14.2532 14.0976 13.6805 13.6575 13.2588C13.2174 12.8371 12.6213 12.6 12 12.6C11.3787 12.6 10.7826 12.8371 10.3425 13.2588C9.90237 13.6805 9.65217 14.2532 9.65217 14.85C9.65217 15.4468 9.90237 16.0195 10.3425 16.4412C10.7826 16.8629 11.3787 17.1 12 17.1Z"></path>',
    'sea-icon': '<path d="M3 16.5v.5"></path><path d="M7 19.5c3.5 0 3.5-3 7-3s3.5 3 7 3c3.5 0 3.5-3 7-3"></path><path d="M3 7v1"></path><path d="M3 11v1"></path><path d="M7 15.5c3.5 0 3.5-3 7-3s3.5 3 7 3c3.5 0 3.5-3 7-3"></path><path d="M7 11.5c3.5 0 3.5-3 7-3s3.5 3 7 3"></path>',
    'disaster-icon': '<path d="M10.5 21h3.5"></path><path d="M5 3v4"></path><path d="M19 3v4"></path><path d="M12 12h.01"></path><rect width="16" height="16" x="4" y="3" rx="5"></rect><path d="M12 8v4"></path><path d="M12 16v.01"></path>'
  };
  
  return iconPaths[iconClass] || '';
}