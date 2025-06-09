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

// Enterprise-specific billing toggle
const billingOptions = document.querySelectorAll('input[name="billing"]');
const subtotalElement = document.querySelector('.subtotal');
const totalAmountElement = document.querySelector('.total-amount');
const setupFee = 5000; // Setup fee in cents

billingOptions.forEach(option => {
    option.addEventListener('change', function() {
        const monthlyPrice = this.value === 'monthly' ? 899900 : 719900; // Prices in cents
        subtotalElement.textContent = formatCurrency(monthlyPrice / 100);
        totalAmountElement.textContent = formatCurrency((monthlyPrice + setupFee) / 100);
        updateAddonPrices(this.value);
    });
});

// Format currency for display
function formatCurrency(amount) {
    return 'R' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Update add-on prices based on billing cycle
function updateAddonPrices(billingCycle) {
    const addons = {
        'dedicatedTeam': { monthly: 15000, annual: 12000 },
        'enterpriseSeo': { monthly: 8000, annual: 6400 },
        'contentStudio': { monthly: 12000, annual: 9600 },
        'trainingSessions': { monthly: 5000, annual: 5000 } // No discount
    };

    Object.keys(addons).forEach(id => {
        const price = billingCycle === 'monthly' ? addons[id].monthly : addons[id].annual;
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
            label.innerHTML = label.innerHTML.replace(/\(\+R[\d,]+\)/, `(+R${(price/100).toFixed(2)}`);
        }
    });
}

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

// VAT Number validation
const vatNumberInput = document.getElementById('vatNumber');
if (vatNumberInput) {
    vatNumberInput.addEventListener('blur', function() {
        const vatRegex = /^[0-9]{10}$/; // Basic 10-digit validation for South Africa
        if (this.value && !vatRegex.test(this.value)) {
            this.setCustomValidity('Please enter a valid 10-digit VAT number');
            this.reportValidity();
        } else {
            this.setCustomValidity('');
        }
    });
}

// Enterprise Form Submission
const checkoutForm = document.getElementById('checkoutForm');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate project description
        const projectDesc = document.getElementById('projectDescription');
        if (projectDesc.value.length < 50) {
            alert('Please provide a more detailed project description (minimum 50 characters)');
            projectDesc.focus();
            return;
        }

        // Validate company size selection
        const companySize = document.getElementById('companySize');
        if (!companySize.value) {
            alert('Please select your company size');
            companySize.focus();
            return;
        }

        // Show loading state
        checkoutForm.classList.add('form-submitting');
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(function() {
            // Hide loading state
            checkoutForm.classList.remove('form-submitting');
            
            // Show confirmation modal
            showEnterpriseConfirmation();
        }, 2000);
    });
}

// Enterprise Confirmation Modal
function showEnterpriseConfirmation() {
    const modal = document.createElement('div');
    modal.className = 'enterprise-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle"></i> Enterprise Request Received</h3>
            </div>
            <div class="modal-body">
                <p>Thank you for your enterprise inquiry! Our solutions team will contact you within 24 hours to discuss your requirements and finalize your custom package.</p>
                <div class="next-steps">
                    <h4>What happens next:</h4>
                    <ol>
                        <li>Account manager assignment</li>
                        <li>Discovery call scheduling</li>
                        <li>Custom proposal preparation</li>
                        <li>Contract finalization</li>
                    </ol>
                </div>
            </div>
            <div class="modal-footer">
                <button id="modalClose" class="btn btn-primary">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal handler
    document.getElementById('modalClose').addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        window.location.href = 'thank-you-enterprise.html';
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

// Add modal styles dynamically
const enterpriseModalCSS = `
.enterprise-modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.8);
display: flex;
align-items: center;
justify-content: center;
z-index: 9999;
padding: 2rem;
box-sizing: border-box;
}

.enterprise-modal .modal-content {
background-color: white;
border-radius: var(--border-radius-lg);
max-width: 600px;
width: 100%;
overflow: hidden;
box-shadow: var(--shadow-xl);
animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}

.enterprise-modal .modal-header {
background-color: var(--primary-color);
color: white;
padding: 2rem;
}

.enterprise-modal .modal-header h3 {
margin: 0;
font-size: 2rem;
display: flex;
align-items: center;
gap: 1rem;
}

.enterprise-modal .modal-body {
padding: 2rem;
color: var(--text-dark);
}

.enterprise-modal .next-steps {
margin-top: 2rem;
padding: 1.5rem;
background-color: var(--background-tertiary);
border-radius: var(--border-radius-md);
}

.enterprise-modal .next-steps ol {
padding-left: 2rem;
margin: 1rem 0 0;
}

.enterprise-modal .next-steps li {
margin-bottom: 0.8rem;
}

.enterprise-modal .modal-footer {
padding: 1.5rem 2rem;
text-align: right;
border-top: 1px solid var(--border-color);
}
`;

// Inject modal styles
const styleElement = document.createElement('style');
styleElement.textContent = enterpriseModalCSS;
document.head.appendChild(styleElement);