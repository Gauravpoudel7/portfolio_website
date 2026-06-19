/* =========================================================================
   Gaurav Poudel — Portfolio
   Premium interactions: scroll reveals, magnetic buttons, theme toggle,
   parallax, smooth scroll, stat counters, skill bars, mobile menu
   ========================================================================= */

(function () {
    'use strict';

    // Helpers
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Theme toggle (persisted) ---------- */
    const themeToggle = $('#theme-toggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('gp-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        root.setAttribute('data-theme', savedTheme);
    } else {
        root.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('gp-theme', next);
        });
    }

    /* ---------- 2. Smooth scroll for in-page links ---------- */
    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 76;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
            window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            closeMobileMenu();
        });
    });

    /* ---------- 3. Mobile menu ---------- */
    const navToggle = $('#nav-toggle');
    const mobileMenu = $('#mobile-menu');

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (navToggle) {
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        $$('.mobile-link, .mobile-menu .btn', mobileMenu).forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* ---------- 4. Navbar scroll state ---------- */
    const navWrapper = $('#nav-wrapper');
    const scrollProgress = $('#scroll-progress');
    const backToTop = $('#back-to-top');

    function onScroll() {
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? (y / docH) * 100 : 0;

        if (navWrapper) navWrapper.classList.toggle('scrolled', y > 24);
        if (scrollProgress) scrollProgress.style.width = progress + '%';
        if (backToTop) backToTop.classList.toggle('visible', y > 600);

        updateActiveNav();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- 5. Active nav link ---------- */
    const navLinks = $$('.nav-menu .nav-link');
    const sections = $$('main section[id]');

    function updateActiveNav() {
        if (!sections.length) return;
        const navH = 100;
        let currentId = sections[0].id;
        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            if (rect.top - navH <= 0) currentId = sec.id;
        }
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + currentId);
        });
    }

    /* ---------- 6. Back to top ---------- */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- 7. Scroll reveal (IntersectionObserver) ---------- */
    const revealEls = $$('.reveal');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const delay = parseInt(el.dataset.revealDelay || '0', 10);
                        setTimeout(() => el.classList.add('in-view'), delay);
                        io.unobserve(el);
                    }
                });
            },
            { rootMargin: '0px 0px -80px 0px', threshold: 0.12 }
        );
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in-view'));
    }

    /* ---------- 8. Stat counters ---------- */
    const statValues = $$('.stat-value[data-count]');

    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        if (Number.isNaN(target)) return;
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + '+';
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + '+';
        }
        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        const statIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        statIO.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        statValues.forEach((el) => statIO.observe(el));
    }

    /* ---------- 9. Skill bars (animate when in view) ---------- */
    const skillFills = $$('.skill-fill[data-fill]');

    if ('IntersectionObserver' in window) {
        const skillIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const fill = el.dataset.fill;
                        el.style.width = fill + '%';
                        el.classList.add('in-view');
                        skillIO.unobserve(el);
                    }
                });
            },
            { threshold: 0.3 }
        );
        skillFills.forEach((el) => skillIO.observe(el));
    } else {
        skillFills.forEach((el) => {
            el.style.width = el.dataset.fill + '%';
        });
    }

    /* ---------- 10. Magnetic buttons (subtle Linear-style) ---------- */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        $$('.magnetic').forEach((btn) => {
            const strength = 0.25;

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ---------- 11. 3D tilt on project cards ---------- */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        $$('.tilt-card').forEach((card) => {
            const maxTilt = 6;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotY = (x - 0.5) * maxTilt * 2;
                const rotX = -(y - 0.5) * maxTilt * 2;
                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- 12. Subtle parallax on hero orbs (mouse) ---------- */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        const orbs = $$('.aurora-blob');
        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                orbs.forEach((orb, i) => {
                    const factor = (i + 1) * 10;
                    orb.style.translate = `${mouseX * factor}px ${mouseY * factor}px`;
                });
                rafId = null;
            });
        }, { passive: true });
    }

    /* ---------- 13. Initial calls ---------- */
    onScroll();

    /* ---------- 14. Keyboard escape closes mobile menu ---------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

})();
