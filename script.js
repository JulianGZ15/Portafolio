function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Menú hamburguesa
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('fade-in')) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 500);
                    });
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(el => observer.observe(el));

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });

    // Navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Ripple effect
    const projectButtons = document.querySelectorAll('.btn');
    projectButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.floating-element');

        parallax.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Typewriter effect
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    const heroTitle = document.querySelector('.title-name');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // ===== CONFIGURACIÓN DE SWIPER =====
    console.log('Iniciando configuración de Swiper...');

    const proyectosConfig = {
        "FlavorFlow": 12,
        "NeoLearn": 9,
        "Ordenamiento": 3
    };

    Object.keys(proyectosConfig).forEach(nombreProyecto => {
        console.log(`Procesando proyecto: ${nombreProyecto}`);

        const projectFolder = nombreProyecto.toLowerCase();
        const container = document.querySelector(`.swiper[data-project="${nombreProyecto}"]`);
        const totalImages = proyectosConfig[nombreProyecto];

        if (container) {
            // Limpiar container
            container.innerHTML = '';

            const wrapper = document.createElement("div");
            wrapper.className = "swiper-wrapper";

            for (let i = 1; i <= totalImages; i++) {
                const slide = document.createElement("div");
                slide.className = "swiper-slide";

                const img = document.createElement("img");
                img.src = `assets/${projectFolder}/${i}.png`;
                img.alt = `${nombreProyecto} imagen ${i}`;
                img.loading = "lazy"; // Carga perezosa

                img.onerror = function () {
                    console.warn(`No se pudo cargar: ${this.src}`);
                    this.style.display = 'none';
                };

                slide.appendChild(img);
                wrapper.appendChild(slide);
            }

            container.appendChild(wrapper);

            // Controles
            const next = document.createElement("div");
            next.className = "swiper-button-next";
            const prev = document.createElement("div");
            prev.className = "swiper-button-prev";
            const pagination = document.createElement("div");
            pagination.className = "swiper-pagination";

            container.appendChild(next);
            container.appendChild(prev);
            container.appendChild(pagination);

            // Inicializar Swiper
            try {
                // Inicializar Swiper con configuración anti-zoom
                const swiper = new Swiper(container, {
                    loop: totalImages > 1,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    },
                    pagination: {
                        el: pagination,
                        clickable: true,
                        dynamicBullets: true,
                    },
                    navigation: {
                        nextEl: next,
                        prevEl: prev,
                    },
                    slidesPerView: 1,
                    spaceBetween: 0,
                    speed: 500,
                    effect: 'slide',
                    grabCursor: true,
                    preventClicks: true,
                    preventClicksPropagation: true,
                    // ✅ Configuraciones para evitar zoom automático
                    zoom: false,
                    freeMode: false,
                    watchSlidesProgress: false,
                    watchSlidesVisibility: false,
                });

                // ✅ Desactivar cualquier evento de zoom
                swiper.on('touchStart', function () {
                    this.allowTouchMove = true;
                });

                swiper.on('touchEnd', function () {
                    this.allowTouchMove = true;
                });

            } catch (error) {
                console.error(`❌ Error inicializando Swiper:`, error);
            }
        }
    });

}); // ✅ CIERRE CORRECTO DEL DOMContentLoaded

// Estilos CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: #3B82F6;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;

document.head.appendChild(style);
