const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const header = document.querySelector(".header");

// Counter animation for hero metrics
const animateCounter = (element) => {
  const target = parseFloat(element.dataset.target);
  const suffix = element.dataset.suffix || "";
  const decimals = parseInt(element.dataset.decimals) || 0;
  const format = element.dataset.format || "";
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      let display = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
      if (format === "k" && current >= 1000) {
        display = (current / 1000).toFixed(1) + "k";
      }
      element.textContent = display + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      let display = decimals > 0 ? target.toFixed(decimals) : target;
      if (format === "k" && target >= 1000) {
        display = (target / 1000).toFixed(0) + "k";
      }
      element.textContent = display + suffix;
    }
  };

  updateCounter();
};

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Toast welcome message
const welcomeToast = document.getElementById("welcomeToast");
if (welcomeToast) {
  const toast = new bootstrap.Toast(welcomeToast, { delay: 7500 });
  setTimeout(() => toast.show(), 1500);
}

// Universal scroll reveal animation
const revealElements = document.querySelectorAll(".section, .service-card, .team-card, .pricing-card, .testimonial-card, .experience-card, .gallery-item, .hero-content, .hero-visual, .photo-card, .accordion-item");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

revealElements.forEach((el) => {
  el.classList.add("reveal-on-scroll");
  revealObserver.observe(el);
});

// Mouse trail effect (Volta Athletics style)
const cursorCanvas = document.getElementById("cursor-canvas");
const cursorCtx = cursorCanvas.getContext("2d");
const cursorPoints = [];
const maxPoints = 60;
let lastX = 0;
let lastY = 0;

const resizeCursorCanvas = () => {
  const scale = window.devicePixelRatio || 1;
  cursorCanvas.width = window.innerWidth * scale;
  cursorCanvas.height = window.innerHeight * scale;
  cursorCanvas.style.width = `${window.innerWidth}px`;
  cursorCanvas.style.height = `${window.innerHeight}px`;
  cursorCtx.scale(scale, scale);
};

resizeCursorCanvas();
window.addEventListener("resize", resizeCursorCanvas);

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  lastX = clientX;
  lastY = clientY;
  cursorPoints.push({ x: clientX, y: clientY, life: 1 });
  if (cursorPoints.length > maxPoints) cursorPoints.shift();
});

document.addEventListener("mouseleave", () => {
  cursorPoints.length = 0;
});

const drawCursorTrail = () => {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorCtx.globalCompositeOperation = "lighter";

  cursorPoints.forEach((point, index) => {
    point.life -= 0.015;
    const size = 60 * point.life + 6;
    const alpha = Math.max(point.life, 0);

    const gradient = cursorCtx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      size
    );
    gradient.addColorStop(0, `rgba(215, 168, 110, ${alpha * 0.6})`);
    gradient.addColorStop(0.4, `rgba(244, 228, 211, ${alpha * 0.4})`);
    gradient.addColorStop(1, "rgba(215, 168, 110, 0)");

    cursorCtx.fillStyle = gradient;
    cursorCtx.beginPath();
    cursorCtx.arc(point.x, point.y, size, 0, Math.PI * 2);
    cursorCtx.fill();
  });

  for (let i = cursorPoints.length - 1; i >= 0; i--) {
    if (cursorPoints[i].life <= 0) cursorPoints.splice(i, 1);
  }

  requestAnimationFrame(drawCursorTrail);
};

drawCursorTrail();

// Scroll progress bar
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / height) * 100;
  header.style.setProperty("--scroll-progress", progress + "%");
  if (header.querySelector("::after")) {
    header.style.setProperty("width", progress + "%", "important");
  }
  // Update via pseudo-element
  document.documentElement.style.setProperty("--scroll-width", progress + "%");
});

// 3D tilt effect on cards
document.querySelectorAll(".service-card, .team-card, .pricing-card, .testimonial-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty("--mouse-x", x + "%");
    card.style.setProperty("--mouse-y", y + "%");
    
    const tiltX = ((y - 50) / 50) * 5;
    const tiltY = ((x - 50) / 50) * -5;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Gallery reveal animation
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("revealed");
      }, index * 100);
      galleryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".gallery-item").forEach((item) => {
  galleryObserver.observe(item);
});

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  lastScroll = currentScroll;
});

// Parallax effect for hero
const hero = document.querySelector(".hero");
if (hero) {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = hero.querySelectorAll(".hero-visual, .glow");
    parallaxElements.forEach((el) => {
      const speed = 0.3;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Magnetic button effect
const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "slide-in 0.6s ease-out forwards";
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".service-card, .team-card, .pricing-card, .testimonial-card, .gallery-item").forEach((el) => {
  animateOnScroll.observe(el);
});

const sections = Array.from(document.querySelectorAll("main section"));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting && link) {
        navItems.forEach((nav) => nav.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-40% 0px -50% 0px",
  }
);

sections.forEach((section) => observer.observe(section));

const form = document.querySelector(".contact-form");

const activateChoice = (containerSelector, inputName, activeClass) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const buttons = container.querySelectorAll("button");
  const hiddenInput = form.querySelector(`input[name="${inputName}"]`);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove(activeClass));
      btn.classList.add(activeClass);
      hiddenInput.value = btn.dataset.value || btn.textContent.trim();
    });
  });
};

activateChoice(".choice-grid", "service", "active");
activateChoice(".slot-grid", "slot", "active");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.textContent = "Enviando...";
  button.disabled = true;

  setTimeout(() => {
    form.reset();
    document.querySelectorAll(".choice-card.active, .slot.active").forEach((el) =>
      el.classList.remove("active")
    );
    button.textContent = "Solicitud enviada";
    setTimeout(() => {
      button.textContent = "Confirmar diagnóstico";
      button.disabled = false;
    }, 2000);
  }, 1200);
});
