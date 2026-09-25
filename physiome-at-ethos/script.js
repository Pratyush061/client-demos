document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Scroll Effect ---
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
            });
        });
    }

    // --- FAQ Accordion Logic ---
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            // Close all other accordions (optional, but requested behavior implies clean state often)
            // If strictly standalone toggles desired, remove the below forEach
            faqHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- Booking Form Placeholder Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real scenario, we would submit this to an endpoint
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'ENQUIRY SENT!';
            btn.style.backgroundColor = 'var(--yellow)';
            btn.style.color = 'var(--ink)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = 'var(--red)';
                btn.style.color = 'var(--paper)';
                contactForm.reset();
            }, 3000);
        });
    }
});

// ============================================================
// ENHANCEMENTS: scroll progress, reveals, animated counters
// (mechanical motion - fast, decisive, ease-out)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll progress bar (colour segments) ---
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        let ticking = false;
        const updateProgress = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
        updateProgress();
    }

    // --- Scroll reveals with stagger (skip hero, which animates on load) ---
    if (!prefersReducedMotion) {
        const targets = document.querySelectorAll(
            '.card, .section-title, .process-step, .faq-item, .info-block, ' +
            '.pricing-row, .pricing-extra, .gallery-item, .about-image, ' +
            '.review-badge-large, .testimonial-avatar, .marquee'
        );
        const revealables = Array.from(targets).filter(el =>
            !el.closest('.hero') && !el.classList.contains('visible')
        );

        // Stagger siblings inside the same parent
        const seenParents = new Map();
        revealables.forEach(el => {
            const parent = el.parentElement;
            const idx = (seenParents.get(parent) || 0);
            seenParents.set(parent, idx + 1);
            el.classList.add('reveal');
            el.style.setProperty('--reveal-delay', Math.min(idx * 90, 450) + 'ms');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealables.forEach(el => observer.observe(el));
    }

    // --- Animated stat counters (5.0, 7, 219, 100%...) ---
    const animateCount = (el, target, decimals, suffix) => {
        const duration = 900;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const match = el.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const suffix = match[2] || '';
                    const decimals = (match[1].includes('.')) ? 1 : 0;
                    animateCount(el, value, decimals, suffix);
                }
                statObserver.unobserve(el);
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.stat-value, .review-score').forEach(el => {
            statObserver.observe(el);
        });
    }
});
