// checkout.js
document.addEventListener('DOMContentLoaded', function() {
// Mobile navigation toggle (consistent with other pages)
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

hamburgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

closeMenuBtn.addEventListener('click', function() {
    hamburgerBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking on a link
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Billing cycle toggle
const billingOptions = document.querySelectorAll('input[name="billing"]');
const subtotalElement = document.querySelector('.subtotal');
const totalAmountElement = document.querySelector('.total-amount');

billingOptions.forEach(option => {
    option.addEventListener('change', function() {
        if (this.value === 'monthly') {
            subtotalElement.textContent = 'R2,499';
            totalAmountElement.textContent = 'R3,999';
        } else {
            subtotalElement.textContent = 'R1,999';
            totalAmountElement.textContent = 'R3,499';
        }
    });
});

// Payment method tabs
const paymentTabs = document.querySelectorAll('.payment-tab');

paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and content
        paymentTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form submission
const checkoutForm = document.getElementById('checkoutForm');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        checkoutForm.classList.add('form-submitting');
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(function() {
            // Hide loading state
            checkoutForm.classList.remove('form-submitting');
            
            // Redirect to thank you page
            window.location.href = 'thank-you.html';
        }, 2000);
    });
}

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll reveal animations
const revealElements = document.querySelectorAll('[class*="reveal-"]');

function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Initial check
checkReveal();

// Check on scroll
window.addEventListener('scroll', checkReveal);
});