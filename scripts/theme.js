// Theme management for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
});

// Initialize theme based on user preference or localStorage
function initializeTheme() {
  // Check if user has previously set a theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // Check if user has a system preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');
  setTheme(initialTheme);
  
  // Add event listener to theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Only change theme automatically if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Set theme to either 'light' or 'dark'
function setTheme(theme) {
  const pageWrapper = document.querySelector('.page-wrapper');
  if (pageWrapper) {
    pageWrapper.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  const pageWrapper = document.querySelector('.page-wrapper');
  if (!pageWrapper) return;
  
  const currentTheme = pageWrapper.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  setTheme(newTheme);
}