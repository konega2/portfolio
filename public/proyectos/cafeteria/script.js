// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000);
});

// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparente en scroll
const header = document.querySelector('.header');
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Animaciones en scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Elementos para animar
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .menu-item, .gallery-item, .about-text, .about-image, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.classList.add('scroll-animation');
        observer.observe(el);
    });
});

// Filtros del menú
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        // Filtrar items del menú
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hide');
                item.classList.add('show');
                item.style.display = 'block';
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
                setTimeout(() => {
                    if (item.classList.contains('hide')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

// Galería modal (lightbox simple)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="modal-close">&times;</button>
            </div>
        `;
        
        // Estilos del modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const modalImg = modal.querySelector('img');
        modalImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 10px;
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(modal);
        
        // Animación de entrada
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Cerrar modal
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    });
});

// Formulario de contacto
const contactForm = document.querySelector('.contact-form form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animación de envío
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulación de envío
    setTimeout(() => {
        submitBtn.textContent = '¡Mensaje Enviado!';
        submitBtn.style.background = '#28a745';
        
        // Limpiar formulario
        contactForm.reset();
        
        // Restaurar botón después de 3 segundos
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
});

// Efecto parallax suave en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-image');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Contador animado para estadísticas
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 20);
};

// Observar estadísticas para animarlas
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            statNumber.textContent = '0';
            animateCounter(statNumber, number);
            
            statsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Efecto de escritura para el título del hero
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const words = heroTitle.querySelectorAll('.word');
    words.forEach((word, index) => {
        word.style.animationDelay = `${0.2 + (index * 0.2)}s`;
    });
}

// Floating coffee bean action
const floatingBean = document.querySelector('.floating-bean');
if (floatingBean) {
    floatingBean.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            floatingBean.style.opacity = '1';
            floatingBean.style.pointerEvents = 'all';
        } else {
            floatingBean.style.opacity = '0';
            floatingBean.style.pointerEvents = 'none';
        }
    });
}

// Efecto hover para las tarjetas del menú
menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Animación de scroll para el indicador
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('.features');
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

// Efecto de partículas flotantes (opcional)
function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(139, 69, 19, 0.3);
            border-radius: 50%;
            animation: float-particle ${Math.random() * 10 + 5}s linear infinite;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// CSS para las partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Inicializar partículas después de que se cargue la página
window.addEventListener('load', () => {
    setTimeout(createFloatingParticles, 3000);
});

// Efecto de hover para los enlaces de navegación
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Animación de entrada para las características
window.addEventListener('scroll', () => {
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
        const rect = feature.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
});

console.log('🍵 Konega Cafetería - Web cargada exitosamente!');
