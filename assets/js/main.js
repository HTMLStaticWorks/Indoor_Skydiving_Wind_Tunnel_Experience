// Force page scroll to top on load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.glass-nav');
    
    const handleScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // keep it always glass, but maybe adjust padding
            if (window.scrollY === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    };
    
    if (navbar) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Init
    }

    // --- 2. Theme Switcher (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check local storage or fallback to current HTML attribute
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = htmlElement.getAttribute('data-theme') || 'light';
        localStorage.setItem('theme', savedTheme);
    }
    htmlElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
        } else {
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
        }
    }

    // --- 3. RTL Toggle ---
    const rtlToggleBtn = document.getElementById('rtl-toggle');
    
    let savedDir = localStorage.getItem('dir');
    if (savedDir === 'rtl') {
        htmlElement.setAttribute('dir', 'rtl');
        if (rtlToggleBtn) rtlToggleBtn.textContent = 'LTR';
    } else {
        htmlElement.removeAttribute('dir');
        if (rtlToggleBtn) rtlToggleBtn.textContent = 'RTL';
    }
    
    if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
            const isRtl = htmlElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                htmlElement.removeAttribute('dir');
                localStorage.setItem('dir', 'ltr');
                rtlToggleBtn.textContent = 'RTL';
            } else {
                htmlElement.setAttribute('dir', 'rtl');
                localStorage.setItem('dir', 'rtl');
                rtlToggleBtn.textContent = 'LTR';
            }
        });
    }

    // --- 4. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            });
        }, revealOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --- 5. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close offcanvas if open
                const offcanvasElement = document.getElementById('offcanvasNavbar');
                if (offcanvasElement) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) bsOffcanvas.hide();
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 6. Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 7. Lock page scroll when offcanvas menu opens ---
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    if (offcanvasElement) {
        offcanvasElement.addEventListener('show.bs.offcanvas', () => {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });
        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        });
    }

});
