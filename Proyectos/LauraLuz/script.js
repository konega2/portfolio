// Variables globales
let currentImageIndex = 0;
let galleryImages = [];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader después de 2 segundos
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('fade-out');
    }, 2000);

    // Inicializar funcionalidades
    initNavigation();
    initGallery();
    initContactForm();
    initBackToTop();
    initScrollEffects();
});

// Navegación
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú móvil
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer click en enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scroll activo en navegación
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Galería
function initGallery() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Recopilar todas las imágenes para el lightbox
    galleryImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.overlay-content');
        return {
            src: img.src,
            title: overlay.querySelector('h3').textContent,
            description: overlay.querySelector('p').textContent,
            category: item.dataset.category
        };
    });

    // Filtros de categoría
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Actualizar botón activo
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar imágenes
            filterGallery(category);
        });
    });

    // Lazy loading para imágenes
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        imageObserver.observe(img);
    });
}

function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            if (category === 'todas' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.remove('hidden');
                }, 10);
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        }, index * 50);
    });
}

// Lightbox
function openLightbox(button) {
    const galleryItem = button.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const overlay = galleryItem.querySelector('.overlay-content');
    
    // Encontrar índice de la imagen actual
    currentImageIndex = Array.from(document.querySelectorAll('.gallery-item')).indexOf(galleryItem);
    
    // Actualizar lightbox
    updateLightbox();
    
    // Mostrar lightbox
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightbox() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
        !item.classList.contains('hidden') && item.style.display !== 'none'
    );
    
    if (currentImageIndex < 0) currentImageIndex = visibleItems.length - 1;
    if (currentImageIndex >= visibleItems.length) currentImageIndex = 0;
    
    const currentItem = visibleItems[currentImageIndex];
    const img = currentItem.querySelector('img');
    const overlay = currentItem.querySelector('.overlay-content');
    
    lightboxImage.src = img.src;
    lightboxTitle.textContent = overlay.querySelector('h3').textContent;
    lightboxDescription.textContent = overlay.querySelector('p').textContent;
}

function previousImage() {
    currentImageIndex--;
    updateLightbox();
}

function nextImage() {
    currentImageIndex++;
    updateLightbox();
}

// Cerrar lightbox con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
    if (e.key === 'ArrowLeft') {
        previousImage();
    }
    if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Formulario de contacto
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validar campos requeridos
        if (validateForm(data)) {
            // Simular envío
            simulateFormSubmission();
        }
    });
}

function validateForm(data) {
    let isValid = true;
    const requiredFields = ['nombre', 'email', 'servicio', 'mensaje'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'Este campo es requerido');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Validar email
    if (data.email && !isValidEmail(data.email)) {
        showFieldError(document.getElementById('email'), 'Email no válido');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    input.style.borderColor = '#ff4444';
    
    // Remover mensaje de error anterior
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function simulateFormSubmission() {
    const submitBtn = document.querySelector('.btn-full');
    const originalText = submitBtn.innerHTML;
    
    // Cambiar texto del botón
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Resetear formulario
        document.getElementById('contactForm').reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = 'auto';
    }, 2000);
}

function showSuccessMessage() {
    // Crear mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.5s ease;
    `;
    successDiv.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado con éxito! Te contactaré pronto.';
    
    document.body.appendChild(successDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 5000);
}

// Back to top
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Efectos de scroll
function initScrollEffects() {
    // Parallax sutil en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroOverlay = document.querySelector('.hero-overlay');
        
        if (heroOverlay) {
            heroOverlay.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.gallery-item, .pricing-card, .bio-text, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
