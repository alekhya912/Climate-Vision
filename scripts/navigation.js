// Navigation functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeMobileMenu();
  handleActiveNavLink();
});

// Initialize mobile menu toggle functionality
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      // Toggle active class for menu button animation
      this.classList.toggle('active');
      
      // Toggle mobile menu visibility
      if (navLinks.style.display === 'flex') {
        // Close menu
        navLinks.style.opacity = '0';
        setTimeout(() => {
          navLinks.style.display = 'none';
        }, 300);
      } else {
        // Open menu
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.padding = '16px';
        navLinks.style.backgroundColor = 'var(--color-bg-primary)';
        navLinks.style.boxShadow = '0 4px 8px var(--color-shadow)';
        navLinks.style.transition = 'opacity 0.3s ease';
        navLinks.style.opacity = '0';
        
        // Add spacing to menu items
        const menuItems = navLinks.querySelectorAll('li');
        menuItems.forEach(item => {
          item.style.margin = '8px 0';
        });
        
        // Trigger reflow for animation
        navLinks.offsetHeight;
        navLinks.style.opacity = '1';
      }
    });
    
    // Handle window resize - reset mobile menu on larger screens
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) {
        mobileMenuToggle.classList.remove('active');
        navLinks.style = '';
      }
    });
  }
}

// Highlight current page in navigation
function handleActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Check if current page matches the link path
    if (currentPath.endsWith(linkPath)) {
      link.classList.add('active');
    } else if (currentPath === '/' && linkPath === 'index.html') {
      link.classList.add('active');
    }
  });
}

// Smooth scroll to elements when clicking on anchor links
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.hash) {
    const targetElement = document.querySelector(e.target.hash);
    if (targetElement) {
      e.preventDefault();
      
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Account for fixed header
        behavior: 'smooth'
      });
      
      // Update URL without causing page jump
      history.pushState(null, null, e.target.hash);
    }
  }
});