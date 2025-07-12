// Home page functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeHomeCharts();
  animateFeaturesOnScroll();
});

// Initialize charts on the home page
function initializeHomeCharts() {
  const temperatureChart = document.getElementById('homeTemperatureChart');
  
  if (temperatureChart) {
    // Get global temperature data
    const data = window.climateData.globalTemperatureData;
    
    // Draw temperature chart
    window.chartUtils.drawLineChart(temperatureChart, data, {
      xKey: 'year',
      yKey: 'temperature',
      lineColor: window.chartUtils.CHART_COLORS.temperature,
      fillArea: true,
      formatY: value => `${value.toFixed(1)}°C`
    });
  }
  
  // Update stat values
  updateStatValues();
}

// Update stat display values
function updateStatValues() {
  const globalTempStat = document.getElementById('globalTempStat');
  const co2Stat = document.getElementById('co2Stat');
  const seaLevelStat = document.getElementById('seaLevelStat');
  const arcticIceStat = document.getElementById('arcticIceStat');
  
  // Get the most recent data
  const latestData = window.climateData.detailedTimelineData[window.climateData.detailedTimelineData.length - 1];
  
  if (globalTempStat) {
    globalTempStat.textContent = '+1.1°C';
  }
  
  if (co2Stat) {
    co2Stat.textContent = `${latestData.co2.toFixed(1)} ppm`;
  }
  
  if (seaLevelStat) {
    seaLevelStat.textContent = `+${latestData.seaLevel.toFixed(1)} cm`;
  }
  
  if (arcticIceStat) {
    arcticIceStat.textContent = '-13.1%';
  }
}

// Animate features when they scroll into view
function animateFeaturesOnScroll() {
  const featureCards = document.querySelectorAll('.feature-card');
  const statCards = document.querySelectorAll('.stat-card');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  });
  
  // Observe feature cards
  featureCards.forEach(card => {
    card.classList.remove('animate-fade-in');
    observer.observe(card);
  });
  
  // Observe stat cards
  statCards.forEach(card => {
    card.classList.remove('animate-fade-in');
    observer.observe(card);
  });
}