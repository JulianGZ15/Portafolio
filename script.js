function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
class Carousel {
    constructor(element, images, autoplayDelay = 3000) {
        this.carousel = element;
        this.images = images;
        this.currentSlide = 0;
        this.autoplayDelay = autoplayDelay;
        this.autoplayInterval = null;
        this.isAutoplayPaused = false;
        
        this.init();
    }
    
    init() {
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        this.startAutoplay();
    }
    
    createSlides() {
        const track = this.carousel.querySelector('.carousel-track');
        track.innerHTML = '';
        
        this.images.forEach((imageSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Imagen ${index + 1}`;
            img.loading = 'lazy';
            
            img.onerror = () => {
                console.warn(`No se pudo cargar: ${imageSrc}`);
                slide.style.display = 'none';
            };
            
            slide.appendChild(img);
            track.appendChild(slide);
        });
    }
    
    createIndicators() {
        const indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        indicatorsContainer.innerHTML = '';
        
        this.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    bindEvents() {
        const prevBtn = this.carousel.querySelector('.carousel-prev');
        const nextBtn = this.carousel.querySelector('.carousel-next');
        
        prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Pausar autoplay al hacer hover
        this.carousel.addEventListener('mouseenter', () => {
            this.pauseAutoplay();
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            this.resumeAutoplay();
        });
        
        // Soporte para touch/swipe en móviles
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const diff = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlidePosition();
        this.updateIndicators();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.updateSlidePosition();
        this.updateIndicators();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
        this.updateSlidePosition();
        this.updateIndicators();
    }
    
    updateSlidePosition() {
        const track = this.carousel.querySelector('.carousel-track');
        const translateX = -this.currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
    }
    
    updateIndicators() {
        const indicators = this.carousel.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoplay() {
        if (this.images.length <= 1) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        this.isAutoplayPaused = true;
    }
    
    resumeAutoplay() {
        this.isAutoplayPaused = false;
    }
    
    destroy() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
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

     // ===== CONFIGURACIÓN DE CARRUSEL PERSONALIZADO =====
    console.log('Iniciando carruseles personalizados...');
    
    const proyectosConfig = {
        "FlavorFlow": 12,
        "NeoLearn": 9,
        "Ordenamiento": 3
    };
    
    const carousels = [];
    
    Object.keys(proyectosConfig).forEach(nombreProyecto => {
        const projectFolder = nombreProyecto.toLowerCase();
        const container = document.querySelector(`.carousel[data-project="${nombreProyecto}"]`);
        const totalImages = proyectosConfig[nombreProyecto];
        
        if (container) {
            // Generar array de imágenes
            const images = [];
            for (let i = 1; i <= totalImages; i++) {
                images.push(`assets/${projectFolder}/${i}.webp`);
            }
            
            // Crear carrusel
            const carousel = new Carousel(container, images, 3000);
            carousels.push(carousel);
            
            console.log(`✅ Carrusel creado para ${nombreProyecto}`);
        } else {
            console.error(`❌ No se encontró container para: ${nombreProyecto}`);
        }
    });
    
    // Limpiar carruseles al salir de la página
    window.addEventListener('beforeunload', () => {
        carousels.forEach(carousel => carousel.destroy());
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
