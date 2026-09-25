document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileNav.classList.add('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                mobileNav.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileNav.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all others
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 3. Scroll Reveal Animation using IntersectionObserver
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal');

        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only reveal once
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // If reduced motion is preferred, make all visible immediately
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});

// ============================================================
// ENHANCEMENTS: animated stat counters, meander line draw
// (organic motion - slow, graceful, ease-out)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Animated stat numbers (5.0 rating, 7 days...) ---
    if (!prefersReducedMotion) {
        const animateNumber = (el, target, decimals) => {
            const duration = 1400;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = (target * eased).toFixed(decimals);
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const match = el.textContent.match(/^(\d+(?:\.\d+)?)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const decimals = match[1].includes('.') ? 1 : 0;
                    animateNumber(el, value, decimals);
                }
                statObserver.unobserve(el);
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.stat-number').forEach(el => {
            statObserver.observe(el);
        });
    }

    // --- Decorative meander: vine draws itself when scrolled into view ---
    const meanders = document.querySelectorAll('.meander');
    if (meanders.length) {
        const meanderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    meanderObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        meanders.forEach(el => meanderObserver.observe(el));
    }
});
