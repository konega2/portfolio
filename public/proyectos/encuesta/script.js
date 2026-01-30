class SurveyManager {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 8;
        this.responses = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
    }

    setupEventListeners() {
        // Navegación
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.submitSurvey(e));

        // Sistema de estrellas
        this.setupStarRatings();

        // Opciones de selección múltiple
        this.setupOptionCards();

        // Opciones de precio
        this.setupPriceCards();

        // Escala NPS
        this.setupNPSScale();

        // Tags de sugerencias
        this.setupSuggestionTags();

        // Validación de campos
        this.setupFormValidation();
    }

    setupStarRatings() {
        const starRatings = document.querySelectorAll('.star-rating');
        
        starRatings.forEach(rating => {
            const stars = rating.querySelectorAll('i');
            const field = rating.dataset.field;
            
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const value = index + 1;
                    this.responses[field] = value;
                    
                    // Actualizar visual
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                    
                    // Efecto de animación
                    star.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        star.style.transform = 'scale(1.2)';
                    }, 150);
                    
                    this.enableNextButton();
                });

                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.style.color = '#ffc107';
                        } else {
                            s.style.color = '#ddd';
                        }
                    });
                });
            });

            rating.addEventListener('mouseleave', () => {
                this.restoreStarStates(stars, field);
            });
        });
    }

    restoreStarStates(stars, field) {
        const currentValue = this.responses[field] || 0;
        stars.forEach((star, index) => {
            if (index < currentValue) {
                star.style.color = '#ffc107';
                star.classList.add('active');
            } else {
                star.style.color = '#ddd';
                star.classList.remove('active');
            }
        });
    }

    setupOptionCards() {
        const optionCards = document.querySelectorAll('.option-card');
        
        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const field = card.dataset.field;
                const value = card.dataset.value;
                
                // Permitir selección múltiple
                if (!this.responses[field]) {
                    this.responses[field] = [];
                }
                
                if (this.responses[field].includes(value)) {
                    // Deseleccionar
                    this.responses[field] = this.responses[field].filter(v => v !== value);
                    card.classList.remove('selected');
                } else {
                    // Seleccionar
                    this.responses[field].push(value);
                    card.classList.add('selected');
                }
                
                // Efecto de animación
                card.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    card.style.transform = card.classList.contains('selected') ? 'scale(1.05)' : 'scale(1)';
                }, 150);
                
                this.enableNextButton();
            });
        });
    }

    setupPriceCards() {
        const priceCards = document.querySelectorAll('.price-card');
        
        priceCards.forEach(card => {
            card.addEventListener('click', () => {
                const field = card.dataset.field;
                const value = card.dataset.value;
                
                // Limpiar otras selecciones del mismo grupo
                priceCards.forEach(c => c.classList.remove('selected'));
                
                // Seleccionar esta opción
                card.classList.add('selected');
                this.responses[field] = value;
                
                // Efecto de animación
                card.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    card.style.transform = 'scale(1.05)';
                }, 150);
                
                this.enableNextButton();
            });
        });
    }

    setupNPSScale() {
        const npsNumbers = document.querySelectorAll('.nps-number');
        
        npsNumbers.forEach(number => {
            number.addEventListener('click', () => {
                const value = parseInt(number.dataset.value);
                const field = number.closest('.nps-scale').dataset.field;
                
                // Limpiar otras selecciones
                npsNumbers.forEach(n => n.classList.remove('selected'));
                
                // Seleccionar este número
                number.classList.add('selected');
                this.responses[field] = value;
                
                // Efecto de onda
                number.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    number.style.transform = 'scale(1.2)';
                }, 200);
                
                this.enableNextButton();
            });
        });
    }

    setupSuggestionTags() {
        const suggestionTags = document.querySelectorAll('.suggestion-tag');
        const textarea = document.getElementById('comentarios');
        
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const text = tag.dataset.text;
                const currentValue = textarea.value;
                
                if (currentValue) {
                    textarea.value = currentValue + ' ' + text;
                } else {
                    textarea.value = text;
                }
                
                // Efecto visual
                tag.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    tag.style.transform = 'scale(1)';
                }, 200);
                
                // Focus en textarea
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            });
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.responses[input.name] = input.value;
                
                if (input.type === 'checkbox') {
                    this.responses[input.name] = input.checked;
                }
            });
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.animateSlideTransition(this.currentQuestion, this.currentQuestion + 1);
            this.currentQuestion++;
            this.updateProgress();
            this.updateNavigation();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 1) {
            this.animateSlideTransition(this.currentQuestion, this.currentQuestion - 1, true);
            this.currentQuestion--;
            this.updateProgress();
            this.updateNavigation();
        }
    }

    animateSlideTransition(from, to, reverse = false) {
        const fromSlide = document.querySelector(`[data-question="${from}"]`);
        const toSlide = document.querySelector(`[data-question="${to}"]`);
        
        if (reverse) {
            // Animación hacia atrás
            fromSlide.style.transform = 'translateX(100%)';
            toSlide.style.transform = 'translateX(0)';
            toSlide.classList.add('active');
            
            setTimeout(() => {
                fromSlide.classList.remove('active');
                fromSlide.style.transform = 'translateX(100%)';
            }, 300);
        } else {
            // Animación hacia adelante
            fromSlide.style.transform = 'translateX(-100%)';
            toSlide.style.transform = 'translateX(0)';
            toSlide.classList.add('active');
            
            setTimeout(() => {
                fromSlide.classList.remove('active');
                fromSlide.style.transform = 'translateX(100%)';
            }, 300);
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (this.currentQuestion / this.totalQuestions) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${this.currentQuestion} de ${this.totalQuestions}`;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Botón anterior
        prevBtn.disabled = this.currentQuestion === 1;
        
        // Botón siguiente/enviar
        if (this.currentQuestion === this.totalQuestions) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
            
            // Verificar si puede avanzar
            if (this.canProceedToNext()) {
                this.enableNextButton();
            } else {
                this.disableNextButton();
            }
        }
    }

    canProceedToNext() {
        switch (this.currentQuestion) {
            case 1:
                return this.responses.calificacion_general !== undefined;
            case 2:
                return this.responses.calidad_comida !== undefined;
            case 3:
                return this.responses.calidad_servicio !== undefined;
            case 4:
                return this.responses.ambiente !== undefined;
            case 5:
                return this.responses.relacion_precio !== undefined;
            case 6:
                return this.responses.recomendacion !== undefined;
            case 7:
            case 8:
                return true; // Opcionales
            default:
                return false;
        }
    }

    enableNextButton() {
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.disabled = false;
    }

    disableNextButton() {
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.disabled = true;
    }

    async submitSurvey(e) {
        e.preventDefault();
        
        // Mostrar loading
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Preparar datos
            const surveyData = {
                ...this.responses,
                fecha_envio: new Date().toISOString(),
                id: this.generateId(),
                ip_address: await this.getClientIP()
            };
            
            // Enviar al servidor
            const response = await fetch('guardar_encuesta.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surveyData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showThankYou();
            } else {
                throw new Error(result.message || 'Error al enviar la encuesta');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar la encuesta. Por favor, inténtalo de nuevo.');
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showThankYou() {
        const thankYouScreen = document.getElementById('thankYouScreen');
        thankYouScreen.style.display = 'flex';
        
        // Confetti effect
        this.createConfetti();
        
        // Iniciar countdown de redirección
        setTimeout(() => {
            this.startRedirectCountdown();
        }, 1000);
    }

    startRedirectCountdown() {
        let seconds = 15;
        const countdownElement = document.getElementById('countdown');
        
        if (!countdownElement) {
            console.error('Elemento countdown no encontrado');
            return;
        }
        
        // Mostrar el valor inicial
        countdownElement.textContent = seconds;
        
        this.countdownTimer = setInterval(() => {
            seconds--;
            
            if (seconds >= 0) {
                countdownElement.textContent = seconds;
            }
            
            if (seconds <= 0) {
                clearInterval(this.countdownTimer);
                this.redirectToWebsite();
            }
        }, 1000);
        
        // Timer de respaldo por si acaso
        this.redirectTimer = setTimeout(() => {
            this.redirectToWebsite();
        }, 16000); // 16 segundos como respaldo
    }

    redirectToWebsite() {
        // Limpiar timers
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        if (this.redirectTimer) clearTimeout(this.redirectTimer);
        
        // Redirigir a la página principal
        window.location.href = 'https://lavisteta.com';
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#ffc107', '#28a745', '#dc3545'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confettiContainer.appendChild(confetti);
        }
        
        // Limpiar después de la animación
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }

    generateId() {
        return 'survey_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
}

// CSS para animación de confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.surveyManagerInstance = new SurveyManager();
});

// Prevenir salida accidental
window.addEventListener('beforeunload', (e) => {
    const surveyManager = window.surveyManager;
    if (surveyManager && surveyManager.currentQuestion > 1 && surveyManager.currentQuestion < surveyManager.totalQuestions) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir? Se perderán tus respuestas.';
    }
});

// Funciones adicionales para mejorar la experiencia
document.addEventListener('keydown', (e) => {
    // Navegación con teclado
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn.disabled && nextBtn.style.display !== 'none') {
            nextBtn.click();
        }
    }
    
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('prevBtn');
        if (!prevBtn.disabled) {
            prevBtn.click();
        }
    }
});

// Detectar dispositivo móvil y ajustar comportamiento
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Optimizaciones para móvil
    document.body.classList.add('mobile-device');
    
    // Prevenir zoom en focus de inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (input.offsetWidth < 768) {
                input.style.fontSize = '16px';
            }
        });
    });
}

// Función global para el botón de cerrar
function redirectToWebsite() {
    // Si hay una instancia del survey manager, limpiar sus timers
    if (window.surveyManagerInstance) {
        if (window.surveyManagerInstance.countdownTimer) {
            clearInterval(window.surveyManagerInstance.countdownTimer);
        }
        if (window.surveyManagerInstance.redirectTimer) {
            clearTimeout(window.surveyManagerInstance.redirectTimer);
        }
    }
    
    // Redirigir a la página principal
    window.location.href = 'https://lavisteta.com';
}
