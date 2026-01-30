const cursorGlow = document.querySelector('.cursor-glow');
const canvas = document.getElementById('hair-canvas');
const ctx = canvas.getContext('2d');
const slotsList = document.getElementById('slots');
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navPanelLinks = document.querySelectorAll('.nav-panel a');

const strands = [];
const strandCount = 70;
const maxLength = 140;
let width = window.innerWidth;
let height = window.innerHeight;
let pointer = { x: width / 2, y: height / 2 };

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function createStrands() {
  strands.length = 0;
  for (let index = 0; index < strandCount; index += 1) {
    strands.push({
      originX: Math.random() * width,
      originY: Math.random() * height,
      length: 80 + Math.random() * maxLength,
      sway: Math.random() * 0.6 + 0.2,
      offset: Math.random() * Math.PI * 2,
      hue: 35 + Math.random() * 20,
    });
  }
}

function drawStrands(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1.2;
  strands.forEach((strand, index) => {
    const wave = Math.sin(time * 0.001 + strand.offset + index) * strand.sway;
    const dx = pointer.x - strand.originX;
    const dy = pointer.y - strand.originY;
    const distance = Math.min(Math.hypot(dx, dy), 240);
    const pull = (1 - distance / 240) * 20;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${strand.hue}, 80%, 70%, 0.35)`;
    ctx.moveTo(strand.originX, strand.originY);
    ctx.quadraticCurveTo(
      strand.originX + wave * 40 + dx * 0.02,
      strand.originY + wave * 20 + dy * 0.02,
      strand.originX + wave * 10 + pull,
      strand.originY + strand.length + pull
    );
    ctx.stroke();
  });
  requestAnimationFrame(drawStrands);
}

function updateCursor(event) {
  pointer = { x: event.clientX, y: event.clientY };
  cursorGlow.style.left = `${pointer.x}px`;
  cursorGlow.style.top = `${pointer.y}px`;
}

function buildSlots() {
  const now = new Date();
  const slots = [];
  for (let i = 1; i <= 6; i += 1) {
    const slotDate = new Date(now.getTime() + i * 45 * 60000);
    const hour = slotDate.getHours().toString().padStart(2, '0');
    const minute = slotDate.getMinutes().toString().padStart(2, '0');
    slots.push({
      time: `${hour}:${minute}`,
      label: i % 2 === 0 ? 'Disponible' : 'Confirmación rápida',
    });
  }

  slotsList.innerHTML = '';
  slots.forEach((slot) => {
    const item = document.createElement('li');
    item.innerHTML = `<span>${slot.time}</span><span>${slot.label}</span>`;
    slotsList.appendChild(item);
  });
}

function initReveal() {
  const targets = document.querySelectorAll('section, .footer');
  targets.forEach((element) => element.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((element) => observer.observe(element));
}

resizeCanvas();
createStrands();
requestAnimationFrame(drawStrands);
buildSlots();
initReveal();

window.addEventListener('mousemove', updateCursor);
window.addEventListener('resize', () => {
  resizeCanvas();
  createStrands();
});

document.querySelector('.booking').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.target.querySelector('button');
  button.textContent = 'Solicitud enviada ✨';
  button.disabled = true;
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navPanelLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
