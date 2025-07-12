// Data utility functions and climate data for visualization

// Global Temperature Data (1900-2023)
const globalTemperatureData = [
  { year: 1900, temperature: 13.72, co2: 295.7 },
  { year: 1910, temperature: 13.73, co2: 299.2 },
  { year: 1920, temperature: 13.78, co2: 303.4 },
  { year: 1930, temperature: 13.84, co2: 307.2 },
  { year: 1940, temperature: 13.98, co2: 310.3 },
  { year: 1950, temperature: 13.92, co2: 311.9 },
  { year: 1960, temperature: 13.98, co2: 316.9 },
  { year: 1970, temperature: 14.02, co2: 325.7 },
  { year: 1980, temperature: 14.18, co2: 338.7 },
  { year: 1990, temperature: 14.32, co2: 354.2 },
  { year: 2000, temperature: 14.40, co2: 369.5 },
  { year: 2010, temperature: 14.57, co2: 389.9 },
  { year: 2020, temperature: 14.78, co2: 412.5 },
  { year: 2023, temperature: 14.98, co2: 418.3 }
];

// Detailed timeline data with multiple metrics
const detailedTimelineData = [
  { year: 1980, temperature: 14.18, co2: 338.7, methane: 1570, seaLevel: 0, arcticIce: 7.85 },
  { year: 1985, temperature: 14.22, co2: 346.1, methane: 1630, seaLevel: 1.2, arcticIce: 7.64 },
  { year: 1990, temperature: 14.32, co2: 354.2, methane: 1714, seaLevel: 2.4, arcticIce: 7.49 },
  { year: 1995, temperature: 14.37, co2: 360.9, methane: 1760, seaLevel: 3.5, arcticIce: 7.35 },
  { year: 2000, temperature: 14.40, co2: 369.5, methane: 1774, seaLevel: 4.8, arcticIce: 7.10 },
  { year: 2005, temperature: 14.48, co2: 379.8, methane: 1774, seaLevel: 6.2, arcticIce: 6.82 },
  { year: 2010, temperature: 14.57, co2: 389.9, methane: 1795, seaLevel: 7.8, arcticIce: 6.45 },
  { year: 2015, temperature: 14.68, co2: 400.8, methane: 1840, seaLevel: 9.4, arcticIce: 6.10 },
  { year: 2020, temperature: 14.78, co2: 412.5, methane: 1879, seaLevel: 10.9, arcticIce: 5.82 },
  { year: 2023, temperature: 14.98, co2: 418.3, methane: 1912, seaLevel: 11.8, arcticIce: 5.65 }
];

// Temperature anomaly by decade
const temperatureAnomalyByDecade = [
  { decade: "1880s", anomaly: -0.27 },
  { decade: "1890s", anomaly: -0.25 },
  { decade: "1900s", anomaly: -0.23 },
  { decade: "1910s", anomaly: -0.22 },
  { decade: "1920s", anomaly: -0.17 },
  { decade: "1930s", anomaly: -0.06 },
  { decade: "1940s", anomaly: 0.02 },
  { decade: "1950s", anomaly: -0.02 },
  { decade: "1960s", anomaly: -0.02 },
  { decade: "1970s", anomaly: 0.00 },
  { decade: "1980s", anomaly: 0.18 },
  { decade: "1990s", anomaly: 0.32 },
  { decade: "2000s", anomaly: 0.52 },
  { decade: "2010s", anomaly: 0.75 },
  { decade: "2020s", anomaly: 0.98 }
];

// CO2 emissions by region
const co2EmissionsByRegion = [
  { region: "North America", value: 5.3 },
  { region: "South America", value: 1.9 },
  { region: "Europe", value: 5.9 },
  { region: "Africa", value: 1.2 },
  { region: "Asia", value: 16.8 },
  { region: "Oceania", value: 1.3 }
];

// Climate scenarios
const climateScenarios = [
  {
    name: "Low Emission",
    data: [
      { year: 2020, temperature: 14.78 },
      { year: 2030, temperature: 15.02 },
      { year: 2040, temperature: 15.18 },
      { year: 2050, temperature: 15.31 },
      { year: 2060, temperature: 15.38 },
      { year: 2070, temperature: 15.42 },
      { year: 2080, temperature: 15.45 },
      { year: 2090, temperature: 15.47 },
      { year: 2100, temperature: 15.48 }
    ]
  },
  {
    name: "Medium Emission",
    data: [
      { year: 2020, temperature: 14.78 },
      { year: 2030, temperature: 15.08 },
      { year: 2040, temperature: 15.35 },
      { year: 2050, temperature: 15.62 },
      { year: 2060, temperature: 15.88 },
      { year: 2070, temperature: 16.12 },
      { year: 2080, temperature: 16.32 },
      { year: 2090, temperature: 16.48 },
      { year: 2100, temperature: 16.60 }
    ]
  },
  {
    name: "High Emission",
    data: [
      { year: 2020, temperature: 14.78 },
      { year: 2030, temperature: 15.15 },
      { year: 2040, temperature: 15.55 },
      { year: 2050, temperature: 16.02 },
      { year: 2060, temperature: 16.58 },
      { year: 2070, temperature: 17.12 },
      { year: 2080, temperature: 17.65 },
      { year: 2090, temperature: 18.08 },
      { year: 2100, temperature: 18.42 }
    ]
  }
];

// Regions data
const regionsData = [
  {
    id: "us",
    name: "United States",
    code: "USA",
    riskLevel: "medium",
    temperature: 1.8,
    rainfall: -5.2,
    naturalDisasters: 22,
    vulnerabilityScore: 3.2
  },
  {
    id: "ca",
    name: "Canada",
    code: "CAN",
    riskLevel: "medium",
    temperature: 2.3,
    rainfall: 4.2,
    naturalDisasters: 8,
    vulnerabilityScore: 2.8
  },
  {
    id: "br",
    name: "Brazil",
    code: "BRA",
    riskLevel: "high",
    temperature: 1.5,
    rainfall: -8.3,
    naturalDisasters: 14,
    vulnerabilityScore: 4.6
  },
  {
    id: "de",
    name: "Germany",
    code: "DEU",
    riskLevel: "medium",
    temperature: 1.9,
    rainfall: 3.1,
    naturalDisasters: 5,
    vulnerabilityScore: 2.5
  },
  {
    id: "in",
    name: "India",
    code: "IND",
    riskLevel: "extreme",
    temperature: 2.2,
    rainfall: -12.5,
    seaLevel: 3.2,
    naturalDisasters: 29,
    vulnerabilityScore: 7.8
  },
  {
    id: "cn",
    name: "China",
    code: "CHN",
    riskLevel: "high",
    temperature: 2.0,
    rainfall: -7.3,
    naturalDisasters: 21,
    vulnerabilityScore: 5.4
  },
  {
    id: "au",
    name: "Australia",
    code: "AUS",
    riskLevel: "high",
    temperature: 2.5,
    rainfall: -14.8,
    naturalDisasters: 18,
    vulnerabilityScore: 6.2
  },
  {
    id: "za",
    name: "South Africa",
    code: "ZAF",
    riskLevel: "high",
    temperature: 2.1,
    rainfall: -18.2,
    naturalDisasters: 9,
    vulnerabilityScore: 5.8
  },
  {
    id: "ru",
    name: "Russia",
    code: "RUS",
    riskLevel: "medium",
    temperature: 2.8,
    rainfall: 6.4,
    naturalDisasters: 6,
    vulnerabilityScore: 3.3
  },
  {
    id: "jp",
    name: "Japan",
    code: "JPN",
    riskLevel: "high",
    temperature: 1.7,
    rainfall: 5.3,
    seaLevel: 2.8,
    naturalDisasters: 11,
    vulnerabilityScore: 4.9
  },
  {
    id: "id",
    name: "Indonesia",
    code: "IDN",
    riskLevel: "extreme",
    temperature: 1.3,
    rainfall: 3.8,
    seaLevel: 4.1,
    naturalDisasters: 24,
    vulnerabilityScore: 7.2
  },
  {
    id: "eg",
    name: "Egypt",
    code: "EGY",
    riskLevel: "extreme",
    temperature: 2.4,
    rainfall: -22.5,
    seaLevel: 3.6,
    naturalDisasters: 4,
    vulnerabilityScore: 6.9
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "GBR",
    riskLevel: "medium",
    temperature: 1.6,
    rainfall: 7.2,
    seaLevel: 2.3,
    naturalDisasters: 5,
    vulnerabilityScore: 3.5
  },
  {
    id: "mx",
    name: "Mexico",
    code: "MEX",
    riskLevel: "high",
    temperature: 1.9,
    rainfall: -10.6,
    naturalDisasters: 12,
    vulnerabilityScore: 5.1
  }
];

// Approximate coordinates for regions (for map visualization)
const regionCoordinates = {
  "us": [-95.7129, 37.0902],
  "ca": [-106.3468, 56.1304],
  "br": [-51.9253, -14.2350],
  "de": [10.4515, 51.1657],
  "in": [78.9629, 20.5937],
  "cn": [104.1954, 35.8617],
  "au": [133.7751, -25.2744],
  "za": [22.9375, -30.5595],
  "ru": [105.3188, 61.5240],
  "jp": [138.2529, 36.2048],
  "id": [113.9213, -0.7893],
  "eg": [30.8025, 26.8206],
  "uk": [-3.4360, 55.3781],
  "mx": [-102.5528, 23.6345]
};

// Utility functions for data manipulation

// Get filtered data for a specific time range and data type
function getFilteredData(startYear, endYear, dataType = 'temperature') {
  return detailedTimelineData.filter(item => item.year >= startYear && item.year <= endYear)
    .map(item => ({
      year: item.year,
      value: item[dataType]
    }));
}

// Get comparison data for two metrics
function getComparisonData(startYear, endYear, primaryType, secondaryType) {
  if (!secondaryType || secondaryType === 'none') {
    return getFilteredData(startYear, endYear, primaryType);
  }
  
  return detailedTimelineData
    .filter(item => item.year >= startYear && item.year <= endYear)
    .map(item => ({
      year: item.year,
      [primaryType]: item[primaryType],
      [secondaryType]: item[secondaryType]
    }));
}

// Get data for a specific region by ID
function getRegionById(id) {
  return regionsData.find(region => region.id === id);
}

// Get regions filtered by risk level
function getRegionsByRiskLevel(level) {
  if (level === 'all') {
    return regionsData;
  }
  return regionsData.filter(region => region.riskLevel === level);
}

// Format data for map visualization
function getMapRegions() {
  return regionsData.map(region => ({
    id: region.id,
    name: region.name,
    coordinates: regionCoordinates[region.id] || [0, 0],
    value: region.vulnerabilityScore,
    riskLevel: region.riskLevel
  }));
}

// Export functions and data
window.climateData = {
  globalTemperatureData,
  detailedTimelineData,
  temperatureAnomalyByDecade,
  co2EmissionsByRegion,
  climateScenarios,
  regionsData,
  getFilteredData,
  getComparisonData,
  getRegionById,
  getRegionsByRiskLevel,
  getMapRegions
};