// ========== INK SOUL STUDIO - INTERACTIVE JAVASCRIPT ========== //

// Global Variables
let isLoading = true;
let galleryItems = [];
let currentFilter = 'all';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========== APP INITIALIZATION ========== //
function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize all components after loading
    setTimeout(() => {
        hideLoadingScreen();
        initCustomCursor();
        initNavigation();
        initGallery();
        initBookingForm();
        initScrollEffects();
        initBackToTop();
        initInkSplatter();
        initAOS();
    }, 3000);
}

// ========== LOADING SCREEN ========== //
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('fade-out');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

// ========== CUSTOM CURSOR ========== //
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower has delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .gallery-card, .artist-card, .pricing-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
            follower.style.borderColor = '#fbbf24';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = '#dc2626';
        });
    });
}

// ========== INK SPLATTER EFFECT ========== //
function initInkSplatter() {
    document.addEventListener('click', createInkSplatter);
}

function createInkSplatter(e) {
    if (isLoading) return;
    
    const splatter = document.getElementById('inkSplatter');
    if (!splatter) return;
    
    // Position at click location
    splatter.style.left = e.clientX - 15 + 'px';
    splatter.style.top = e.clientY - 15 + 'px';
    
    // Reset animation
    splatter.style.opacity = '0';
    splatter.style.transform = 'scale(0)';
    
    // Trigger animation
    setTimeout(() => {
        splatter.style.opacity = '0.8';
        splatter.style.transform = 'scale(1)';
    }, 10);
}

// ========== NAVIGATION ========== //
function initNavigation() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.ink-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.ink-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// ========== GALLERY ========== //
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter);
        });
    });
    
    // Gallery modal
    const galleryButtons = document.querySelectorAll('[data-bs-target="#galleryModal"]');
    const modalImage = document.getElementById('modalImage');
    
    galleryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const imgSrc = btn.getAttribute('data-img');
            if (modalImage && imgSrc) {
                modalImage.src = imgSrc;
            }
        });
    });
}

function filterGalleryItems(filter) {
    currentFilter = filter;
    
    galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.classList.remove('hidden');
            // Stagger animation
            setTimeout(() => {
                item.style.transform = 'scale(1)';
                item.style.opacity = '1';
            }, index * 100);
        } else {
            item.classList.add('hidden');
            item.style.transform = 'scale(0.8)';
            item.style.opacity = '0';
        }
    });
}

// ========== BOOKING FORM ========== //
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmission();
    });
    
    // Form validation styling
    const inputs = bookingForm.querySelectorAll('.ink-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
}

function validateInput(e) {
    const input = e.target;
    const isValid = input.checkValidity();
    
    if (!isValid) {
        input.style.borderColor = '#dc2626';
        input.style.boxShadow = '0 0 0 0.2rem rgba(220, 38, 38, 0.25)';
    } else {
        input.style.borderColor = '#10b981';
        input.style.boxShadow = '0 0 0 0.2rem rgba(16, 185, 129, 0.25)';
    }
}

function clearValidation(e) {
    const input = e.target;
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

function handleBookingSubmission() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const bookingData = {};
    
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Show success message with animation
    showBookingSuccess();
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
    console.log('Booking submitted:', bookingData);
}

function showBookingSuccess() {
    // Create success modal
    const successHTML = `
        <div class="modal fade" id="successModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content ink-modal">
                    <div class="modal-body text-center p-4">
                        <div class="success-icon mb-3">
                            <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981;"></i>
                        </div>
                        <h3 class="text-white mb-3">¡Solicitud Enviada!</h3>
                        <p class="text-light mb-4">
                            Gracias por tu interés. Nos pondremos en contacto contigo 
                            en las próximas 24 horas para confirmar tu cita.
                        </p>
                        <button type="button" class="btn btn-ink-primary" data-bs-dismiss="modal">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to body if not exists
    if (!document.getElementById('successModal')) {
        document.body.insertAdjacentHTML('beforeend', successHTML);
    }
    
    // Show modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Clean up after hidden
    document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// ========== SCROLL EFFECTS ========== //
function initScrollEffects() {
    // Parallax effect for hero video
    const heroVideo = document.querySelector('.hero-video-bg video');
    
    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroVideo.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Fade in animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ========== BACK TO TOP ========== //
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== AOS INITIALIZATION ========== //
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ========== UTILITY FUNCTIONS ========== //

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========== ADDITIONAL EFFECTS ========== //

// Glitch effect for text
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                el.classList.add('glitch-active');
                setTimeout(() => {
                    el.classList.remove('glitch-active');
                }, 200);
            }
        }, 100);
    });
}

// Blood drip effect (optional)
function createBloodDrip() {
    const bloodDrip = document.createElement('div');
    bloodDrip.classList.add('blood-drip');
    bloodDrip.style.left = Math.random() * 100 + '%';
    document.body.appendChild(bloodDrip);
    
    setTimeout(() => {
        bloodDrip.remove();
    }, 3000);
}

// Random ink splashes
function randomInkSplashes() {
    setInterval(() => {
        if (!isLoading && Math.random() > 0.98) {
            createRandomSplash();
        }
    }, 500);
}

function createRandomSplash() {
    const splash = document.createElement('div');
    splash.classList.add('random-splash');
    splash.style.left = Math.random() * window.innerWidth + 'px';
    splash.style.top = Math.random() * window.innerHeight + 'px';
    splash.style.position = 'fixed';
    splash.style.width = '10px';
    splash.style.height = '10px';
    splash.style.background = '#dc2626';
    splash.style.borderRadius = '50%';
    splash.style.pointerEvents = 'none';
    splash.style.zIndex = '9990';
    splash.style.opacity = '0.6';
    splash.style.animation = 'splash-fade 2s ease-out forwards';
    
    document.body.appendChild(splash);
    
    setTimeout(() => {
        splash.remove();
    }, 2000);
}

// Typing effect for hero title
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeText(line, text, 100);
        }, index * 1000);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
        }
    }, speed);
}

// ========== EVENT LISTENERS ========== //

// Window resize handler
window.addEventListener('resize', debounce(() => {
    // Recalculate layouts if needed
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
    
    // Ctrl + K for quick booking
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }
});

// ========== PERFORMANCE OPTIMIZATIONS ========== //

// Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize additional effects after main load
setTimeout(() => {
    addGlitchEffect();
    randomInkSplashes();
    initLazyLoading();
}, 4000);

// Console art
console.log(`
 ██▓ ███▄    █  ██ ▄█▀  ██████  ▒█████   █    ██  ██▓    
▓██▒ ██ ▀█   █  ██▄█▒ ▒██    ▒ ▒██▒  ██▒ ██  ▓██▒▓██▒    
▒██▒▓██  ▀█ ██▒▓███▄░ ░ ▓██▄   ▒██░  ██▒▓██  ▒██░▒██░    
░██░▓██▒  ▐▌██▒▓██ █▄   ▒   ██▒▒██   ██░▓▓█  ░██░▒██░    
░██░▒██░   ▓██░▒██▒ █▄▒██████▒▒░ ████▓▒░▒▒█████▓ ░██████▒
░▓  ░ ▒░   ▒ ▒ ▒ ▒▒ ▓▒▒ ▒▓▒ ▒ ░░ ▒░▒░▒░ ░▒▓▒ ▒ ▒ ░ ▒░▓  ░
 ▒ ░░ ░░   ░ ▒░░ ░▒ ▒░░ ░▒  ░ ░  ░ ▒ ▒░ ░░▒░ ░ ░ ░ ░ ▒  ░
 ▒ ░   ░   ░ ░ ░ ░░ ░ ░  ░  ░  ░ ░ ░ ▒   ░░░ ░ ░   ░ ░   
 ░           ░ ░  ░         ░      ░ ░     ░         ░  ░

    Donde el arte cobra vida permanente
    © 2024 InkSoul Studio
`);

console.log('🎨 Welcome to InkSoul Studio - Your skin is our canvas! 🎨');
