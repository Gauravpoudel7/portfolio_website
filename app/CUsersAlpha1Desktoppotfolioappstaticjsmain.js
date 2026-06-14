// Custom JavaScript for AI Engineer Portfolio
// Handles scroll reveal animations and mobile-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Scroll Reveal Animations
    initScrollReveal();

    // Initialize Navbar Behavior
    initNavbar();

    // Initialize Form Validation
    initFormValidation();

    // Handle Mobile Menu Clicks
    initMobileMenu();
});

function initScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('active');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('active');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // Listen for scroll and resize events
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Run on initial load
    handleScrollAnimation();
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add active class to current nav link based on scroll position
    const setActiveNavLink = () => {
        let current = '';

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (
                pageYOffset >= sectionTop - 100 &&
                pageYOffset < sectionTop + sectionHeight - 100
            ) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('load', setActiveNavLink);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for navbar
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (
                        navbarToggler &&
                        navbarCollapse &&
                        navbarCollapse.classList.contains('show')
                    ) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });
}

function initFormValidation() {
    const form = document.querySelector('form[action="/submit_contact"]');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        // Basic client-side validation
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const messageInput = form.querySelector('#message');

        let isValid = true;

        // Name validation
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.classList.add('is-invalid');
        } else {
            nameInput.classList.remove('is-invalid');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.remove('is-invalid');
        }

        // Message validation
        if (!messageInput.value.trim()) {
            isValid = false;
            messageInput.classList.add('is-invalid');
        } else {
            messageInput.classList.remove('is-invalid');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Add Bootstrap validation styles
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach((input) => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (
                navbarCollapse.classList.contains('show') &&
                !navbarToggler.contains(e.target) &&
                !navbarCollapse.contains(e.target)
            ) {
                navbarToggler.click();
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

// Add touch-friendly adjustments for mobile
document.addEventListener('touchstart', function() {
    // Enable touch-friendly hover states
    document.body.classList.add('touch-device');
});

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    // Force redraw to fix potential issues on orientation change
    document.body.style.height = '100vh';
    setTimeout(() => {
        document.body.style.height = '';
    }, 100);
});
