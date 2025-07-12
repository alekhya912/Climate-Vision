// About page functionality for Climate Vision

document.addEventListener('DOMContentLoaded', function() {
  initializeFAQAccordion();
  setupContactForm();
});

// Initialize FAQ accordion functionality
function initializeFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Toggle current item
        item.classList.toggle('active');
        
        // Get answer element
        const answer = item.querySelector('.faq-answer');
        
        // Update styles based on active state
        if (item.classList.contains('active')) {
          answer.style.padding = 'var(--spacing-4)';
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.padding = '0 var(--spacing-4)';
          answer.style.maxHeight = '0';
        }
      });
    }
  });
  
  // Open first FAQ item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstAnswer = faqItems[0].querySelector('.faq-answer');
    if (firstAnswer) {
      firstAnswer.style.padding = 'var(--spacing-4)';
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }
}

// Setup contact form functionality
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = this.querySelector('#name').value;
      const email = this.querySelector('#email').value;
      const subject = this.querySelector('#subject').value;
      const message = this.querySelector('#message').value;
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      setTimeout(() => {
        // Simulate successful submission
        this.reset();
        submitButton.textContent = 'Message Sent!';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }, 3000);
      }, 1500);
    });
  }
}