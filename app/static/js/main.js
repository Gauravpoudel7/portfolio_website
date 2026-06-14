// Custom JavaScript for AI Engineer Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links (fallback for browsers that don't support smooth behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animations
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
                // Optional: hide if scrolled past
                // hideScrollElement(el);
            }
        });
    };

    // Listen for scroll and trigger animation
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
        updateActiveNavLink();
    });

    // Trigger animation on page load for elements already in view
    handleScrollAnimation();

    // Active Navbar Link based on scroll position
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNavLink = () => {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (
                pageYOffset >= sectionTop - 60 &&
                pageYOffset < sectionTop + sectionHeight - 60
            ) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    };

    // Mouse Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.tilt-card-js');
    const handleTilt = (e) => {
        tiltCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = ((y - centerY) / centerY) * 10; // tilt value
            const angleY = ((centerX - x) / centerX) * 10; // tilt value

            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
    };

    const resetTilt = (e) => {
        tiltCards.forEach((card) => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    };

    // Add event listeners for tilt
    document.addEventListener('mousemove', handleTilt);
    document.addEventListener('mouseleave', resetTilt);
});