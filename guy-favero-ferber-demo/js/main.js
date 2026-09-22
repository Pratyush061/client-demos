document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.contains('is-open');
            mainNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', !isOpen);
        });
    }

    // Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for no intersection observer or reduced motion
        revealElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // Before/After Slider Logic
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const handle = baSlider.querySelector('.ba-handle');
        const beforeDiv = baSlider.querySelector('.ba-before');
        const beforeImg = beforeDiv.querySelector('img');

        let isSliding = false;

        const updateSliderWidth = () => {
            if (beforeImg) {
                // Ensure the image inside the clipping div is exactly the width of the full container
                beforeImg.style.width = baSlider.offsetWidth + 'px';
            }
        };

        // Initialize sizing
        updateSliderWidth();
        window.addEventListener('resize', updateSliderWidth);

        const moveSlider = (e) => {
            if (!isSliding) return;

            let clientX = e.clientX;
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            }

            const rect = baSlider.getBoundingClientRect();
            let xPos = clientX - rect.left;

            // Constrain
            if (xPos < 0) xPos = 0;
            if (xPos > rect.width) xPos = rect.width;

            const percentage = (xPos / rect.width) * 100;

            handle.style.left = `${percentage}%`;
            beforeDiv.style.width = `${percentage}%`;
        };

        handle.addEventListener('mousedown', () => { isSliding = true; });
        handle.addEventListener('touchstart', () => { isSliding = true; });

        window.addEventListener('mouseup', () => { isSliding = false; });
        window.addEventListener('touchend', () => { isSliding = false; });

        window.addEventListener('mousemove', moveSlider);
        window.addEventListener('touchmove', moveSlider);
    }
});
