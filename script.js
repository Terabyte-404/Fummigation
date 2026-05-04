// Bravo Fumigation Website JavaScript
// Main functionality for booking system, interactions, and animations

// Global Variables
let currentBookingStep = 1;
let bookingData = {};
let testimonialIndex = 0;

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const bookingForm = document.getElementById('bookingForm');
const emergencyForm = document.getElementById('emergencyForm');
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const scrollTopBtn = document.querySelector('.scroll-top');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBookingSystem();
    initializeEmergencySystem();
    initializeContactForm();
    initializeTestimonials();
    initializeAnimations();
    initializeScrollEffects();
    initializeServiceCards();
    setMinDate();
});


// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Booking System
function initializeBookingSystem() {
    if (!bookingForm) return;

    // Step navigation
    const nextButtons = bookingForm.querySelectorAll('.next-step');
    const prevButtons = bookingForm.querySelectorAll('.prev-step');

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateCurrentStep()) {
                saveStepData();
                goToStep(currentBookingStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            goToStep(currentBookingStep - 1);
        });
    });

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveStepData();
        submitBooking();
    });

    // Service type selection
    const serviceOptions = document.querySelectorAll('input[name="serviceType"]');
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateServiceSelection();
        });
    });
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentBookingStep}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message if not exists
            let errorMsg = field.parentNode.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.appendChild(errorMsg);
            }
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });

    // Special validation for pest types (at least one must be selected)
    if (currentBookingStep === 1) {
        const pestTypes = document.querySelectorAll('input[name="pestType"]:checked');
        if (pestTypes.length === 0) {
            isValid = false;
            showNotification('Please select at least one pest type', 'error');
        }
    }

    return isValid;
}

function saveStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentBookingStep}"]`);
    
    switch(currentBookingStep) {
        case 1:
            bookingData.serviceType = document.querySelector('input[name="serviceType"]:checked')?.value;
            bookingData.pestTypes = Array.from(document.querySelectorAll('input[name="pestType"]:checked'))
                .map(cb => cb.value);
            break;
        case 2:
            bookingData.propertyType = document.getElementById('propertyType').value;
            bookingData.propertySize = document.getElementById('propertySize').value;
            bookingData.infestationLevel = document.getElementById('infestationLevel').value;
            bookingData.additionalInfo = document.getElementById('additionalInfo').value;
            break;
        case 3:
            bookingData.serviceDate = document.getElementById('serviceDate').value;
            bookingData.serviceTime = document.querySelector('input[name="serviceTime"]:checked')?.value;
            bookingData.flexibility = document.getElementById('flexibility').value;
            break;
        case 4:
            bookingData.firstName = document.getElementById('firstName').value;
            bookingData.lastName = document.getElementById('lastName').value;
            bookingData.email = document.getElementById('email').value;
            bookingData.phone = document.getElementById('phone').value;
            bookingData.address = document.getElementById('address').value;
            bookingData.city = document.getElementById('city').value;
            bookingData.zipCode = document.getElementById('zipCode').value;
            break;
    }
}

function goToStep(step) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentBookingStep}"]`).classList.remove('active');
    
    // Show new step
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    
    // Update progress indicators
    document.querySelector(`.progress-step[data-step="${currentBookingStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentBookingStep}"]`).classList.add('completed');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
    
    // Update current step
    currentBookingStep = step;
    
    // If going to confirmation step, generate summary
    if (step === 5) {
        generateBookingSummary();
    }
    
    // Scroll to top of form
    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateBookingSummary() {
    // Service Summary
    const serviceSummary = document.getElementById('serviceSummary');
    serviceSummary.innerHTML = `
        <p><strong>Service Type:</strong> ${capitalizeFirst(bookingData.serviceType)}</p>
        <p><strong>Pest Types:</strong> ${bookingData.pestTypes.map(capitalizeFirst).join(', ')}</p>
    `;
    
    // Property Summary
    const propertySummary = document.getElementById('propertySummary');
    propertySummary.innerHTML = `
        <p><strong>Property Type:</strong> ${capitalizeFirst(bookingData.propertyType)}</p>
        <p><strong>Property Size:</strong> ${bookingData.propertySize} sq ft</p>
        <p><strong>Infestation Level:</strong> ${capitalizeFirst(bookingData.infestationLevel)}</p>
        ${bookingData.additionalInfo ? `<p><strong>Additional Info:</strong> ${bookingData.additionalInfo}</p>` : ''}
    `;
    
    // Schedule Summary
    const scheduleSummary = document.getElementById('scheduleSummary');
    const date = new Date(bookingData.serviceDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    scheduleSummary.innerHTML = `
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${getTimeSlotLabel(bookingData.serviceTime)}</p>
        <p><strong>Flexibility:</strong> ${capitalizeFirst(bookingData.flexibility)}</p>
    `;
    
    // Contact Summary
    const contactSummary = document.getElementById('contactSummary');
    contactSummary.innerHTML = `
        <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Address:</strong> ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}</p>
    `;
}

function getTimeSlotLabel(timeSlot) {
    const labels = {
        'morning': 'Morning (8AM - 12PM)',
        'afternoon': 'Afternoon (12PM - 4PM)',
        'evening': 'Evening (4PM - 8PM)'
    };
    return labels[timeSlot] || timeSlot;
}

function submitBooking() {
    // Show loading state
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Processing...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store booking in localStorage (in real app, this would be sent to server)
        const bookings = JSON.parse(localStorage.getItem('bravoBookings') || '[]');
        const newBooking = {
            ...bookingData,
            id: Date.now(),
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            bookingNumber: 'BRV' + Date.now().toString().slice(-6)
        };
        bookings.push(newBooking);
        localStorage.setItem('bravoBookings', JSON.stringify(bookings));

        // Reset form
        bookingForm.reset();
        currentBookingStep = 1;
        bookingData = {};
        
        // Reset progress indicators
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.querySelector('.progress-step[data-step="1"]').classList.add('active');
        
        // Reset form steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.form-step[data-step="1"]').classList.add('active');

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showModal(
            'Booking Confirmed!',
            `Your booking has been confirmed. Your booking number is ${newBooking.bookingNumber}. We'll send a confirmation email to ${newBooking.email} shortly.`
        );
    }, 2000);
}

// Emergency System
function initializeEmergencySystem() {
    if (!emergencyForm) return;

    emergencyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('emergencyName').value,
            phone: document.getElementById('emergencyPhone').value,
            issue: document.getElementById('emergencyIssue').value,
            description: document.getElementById('emergencyDescription').value,
            timestamp: new Date().toISOString(),
            status: 'urgent'
        };

        // Store emergency request
        const emergencies = JSON.parse(localStorage.getItem('bravoEmergencies') || '[]');
        emergencies.push(formData);
        localStorage.setItem('bravoEmergencies', JSON.stringify(emergencies));

        // Reset form
        emergencyForm.reset();

        // Show success message
        showModal(
            'Emergency Request Sent!',
            'We\'ve received your emergency request and will contact you within 5 minutes. Our team is being dispatched to your location.'
        );
    });

    // Emergency booking button
    const emergencyBookingBtn = document.getElementById('emergencyBooking');
    if (emergencyBookingBtn) {
        emergencyBookingBtn.addEventListener('click', function() {
            // Jump to booking section and pre-select emergency service
            document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const emergencyRadio = document.querySelector('input[name="serviceType"][value="emergency"]');
                if (emergencyRadio) {
                    emergencyRadio.checked = true;
                    updateServiceSelection();
                }
            }, 500);
        });
    }
}

// Contact Form
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            timestamp: new Date().toISOString()
        };

        // Store contact message
        const messages = JSON.parse(localStorage.getItem('bravoMessages') || '[]');
        messages.push(formData);
        localStorage.setItem('bravoMessages', JSON.stringify(messages));

        // Reset form
        contactForm.reset();

        // Show success message
        showModal(
            'Message Sent!',
            'Thank you for contacting us. We\'ll respond to your inquiry within 24 hours.'
        );
    });
}

// Testimonials Carousel
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (!testimonialCards.length) return;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
        showTestimonial(testimonialIndex);
    }

    function prevTestimonial() {
        testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(testimonialIndex);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
}

// Animations
function initializeAnimations() {
    // Hero stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
                statsObserver.unobserve(stat);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // Scroll animations for elements
    const animatedElements = document.querySelectorAll('.service-card, .value-item, .stat-card');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => animationObserver.observe(element));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

// Scroll Effects
function initializeScrollEffects() {
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // Scroll to top button
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Service Cards
function initializeServiceCards() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            // Jump to booking section and pre-select service
            document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const serviceRadio = document.querySelector(`input[name="serviceType"][value="${service}"]`);
                if (serviceRadio) {
                    serviceRadio.checked = true;
                    updateServiceSelection();
                }
            }, 500);
        });
    });
}

function updateServiceSelection() {
    const selectedService = document.querySelector('input[name="serviceType"]:checked');
    if (selectedService) {
        // Update UI based on selected service
        const serviceCards = document.querySelectorAll('.service-option-card');
        serviceCards.forEach(card => {
            const input = card.previousElementSibling;
            if (input && input.checked) {
                card.style.borderColor = 'var(--primary-color)';
                card.style.background = 'rgba(37, 99, 235, 0.05)';
            } else {
                card.style.borderColor = 'var(--border-color)';
                card.style.background = 'white';
            }
        });
    }
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setMinDate() {
    const dateInput = document.getElementById('serviceDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function showModal(title, message) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('show');
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    const okBtn = modal.querySelector('.modal-ok');
    
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    closeBtn.onclick = closeModal;
    okBtn.onclick = closeModal;
    
    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

function validateZip(zip) {
    const re = /^\d{5}(-\d{4})?$/;
    return re.test(zip);
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('error');
                showNotification('Please enter a valid email address', 'error');
            } else {
                this.classList.remove('error');
            }
        });
    });

    // Phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.classList.add('error');
                showNotification('Please enter a valid phone number', 'error');
            } else {
                this.classList.remove('error');
            }
        });
    });

    // ZIP code validation
    const zipInputs = document.querySelectorAll('input[name="zipCode"]');
    zipInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateZip(this.value)) {
                this.classList.add('error');
                showNotification('Please enter a valid ZIP code', 'error');
            } else {
                this.classList.remove('error');
            }
        });
    });
});

// Local Storage Management (for demo purposes)
const BravoStorage = {
    getBookings: () => JSON.parse(localStorage.getItem('bravoBookings') || '[]'),
    getEmergencies: () => JSON.parse(localStorage.getItem('bravoEmergencies') || '[]'),
    getMessages: () => JSON.parse(localStorage.getItem('bravoMessages') || '[]'),
    
    clearAll: () => {
        localStorage.removeItem('bravoBookings');
        localStorage.removeItem('bravoEmergencies');
        localStorage.removeItem('bravoMessages');
    },
    
    exportData: () => {
        const data = {
            bookings: BravoStorage.getBookings(),
            emergencies: BravoStorage.getEmergencies(),
            messages: BravoStorage.getMessages()
        };
        console.log('Bravo Fumigation Data:', data);
        return data;
    }
};

// Make storage available in console for debugging
window.BravoStorage = BravoStorage;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bravo Fumigation Website Loaded Successfully');
    console.log('Bookings:', BravoStorage.getBookings().length);
    console.log('Emergencies:', BravoStorage.getEmergencies().length);
    console.log('Messages:', BravoStorage.getMessages().length);
});
