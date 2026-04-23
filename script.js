/* ============================================
   PORTFOLIO INTERACTIONS — FOLIO ENHANCED
   ============================================ */

/* ── Apply saved theme IMMEDIATELY to prevent flash ── */
(function () {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

/* ── Page Loader ── */
(function () {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader__inner">
      <div class="loader__logo">&lt;AB/&gt;</div>
      <div class="loader__bar"><div class="loader__fill"></div></div>
      <div class="loader__count">0%</div>
    </div>`;
  document.body.appendChild(loader);

  let progress = 0;
  const fill = loader.querySelector('.loader__fill');
  const count = loader.querySelector('.loader__count');

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      count.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('loader--done');
        setTimeout(() => loader.remove(), 700);
        document.dispatchEvent(new Event('loaderDone'));
      }, 350);
    } else {
      fill.style.width = progress + '%';
      count.textContent = Math.floor(progress) + '%';
    }
  }, 60);
})();

/* ── Falling Stars Particle System ── */
(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, stars = [];
  const STAR_COUNT = 220;

  function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
  function createStar() {
    return {
      x: Math.random() * width, y: Math.random() * height,
      size: Math.random() * 2.2 + 0.3, speedY: Math.random() * 0.6 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005, twinklePhase: Math.random() * Math.PI * 2,
    };
  }
  function initStars() { stars = []; for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar()); }
  function drawStar(s, isLightMode) {
    const twinkle = Math.sin(s.twinklePhase) * 0.3 + 0.7;
    const alpha = s.opacity * twinkle;
    const glowColor = isLightMode ? `rgba(91,33,182,${alpha * 0.14})` : `rgba(200,200,255,${alpha * 0.08})`;
    const midColor = isLightMode ? `rgba(109,40,217,${alpha * 0.24})` : `rgba(220,220,255,${alpha * 0.15})`;
    const coreColor = isLightMode ? `rgba(79,70,229,${alpha * 0.75})` : `rgba(255,255,255,${alpha})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = glowColor; ctx.fill();
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = midColor; ctx.fill();
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = coreColor; ctx.fill();
  }
  function update() {
    for (let s of stars) {
      s.y += s.speedY; s.x += s.speedX; s.twinklePhase += s.twinkleSpeed;
      if (s.y > height + 5) { s.y = -5; s.x = Math.random() * width; }
      if (s.x > width + 5) s.x = -5; if (s.x < -5) s.x = width + 5;
    }
  }
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const theme = document.documentElement.getAttribute('data-theme');
    const isLightMode = theme === 'light';
    update();
    for (let s of stars) drawStar(s, isLightMode);
    requestAnimationFrame(animate);
  }
  function spawnShootingStar() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') return;
    const startX = Math.random() * width * 0.8, startY = Math.random() * height * 0.4;
    const length = Math.random() * 80 + 60, angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 6 + Math.random() * 4; let progress = 0;
    const totalFrames = Math.ceil(length / speed) + 20;
    function drawShoot() {
      if (progress > totalFrames) return; progress++;
      const headX = startX + Math.cos(angle) * speed * progress;
      const headY = startY + Math.sin(angle) * speed * progress;
      const fade = Math.max(0, 1 - progress / totalFrames);
      const trailLen = Math.min(progress * speed, length);
      const tailX = headX - Math.cos(angle) * trailLen, tailY = headY - Math.sin(angle) * trailLen;
      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, `rgba(255,255,255,0)`); grad.addColorStop(1, `rgba(255,255,255,${fade * 0.8})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(headX, headY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${fade})`; ctx.fill();
      requestAnimationFrame(drawShoot);
    }
    drawShoot();
  }
  function scheduleShootingStar() {
    setTimeout(() => { spawnShootingStar(); scheduleShootingStar(); }, 3000 + Math.random() * 5000);
  }
  resize(); initStars(); animate(); scheduleShootingStar();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

/* ── Text Split & Animate ── */
function splitAndAnimate(el, type = 'chars') {
  if (!el || el.dataset.split) return;
  el.dataset.split = true;
  const text = el.textContent;
  el.innerHTML = '';
  const units = type === 'words' ? text.split(' ') : text.split('');
  units.forEach((unit, i) => {
    const span = document.createElement('span');
    span.className = 'char-unit';
    span.textContent = type === 'words' ? unit + '\u00A0' : unit === ' ' ? '\u00A0' : unit;
    span.style.cssText = `
      display: inline-block;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(60px) rotateX(-40deg);
      transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
      transition-delay: ${i * 0.03}s;
    `;
    el.appendChild(span);
  });
}

function revealSplit(el) {
  el.querySelectorAll('.char-unit').forEach(span => {
    span.style.opacity = '1';
    span.style.transform = 'translateY(0) rotateX(0)';
  });
}

/* ── Magnetic Button Effect ── */
function initMagnetic() {
  document.querySelectorAll('.btn, .project__link, .footer__socials a').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* ── Smooth Number Counter ── */
function animateCounter(el, target, decimals = 0) {
  const duration = 1800;
  const start = performance.now();
  const num = parseFloat(target);
  const suffix = target.replace(/[\d.]/g, '');
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = (num * eased).toFixed(decimals);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Keep hero static on scroll ── */
function initParallax() {}

/* ── Card 3D tilt ── */
function initTilt() {
  document.querySelectorAll('.project, .achievement, .education__card, .skill').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Scroll progress bar ── */
function initScrollProgress() {
  return;
}

/* ── Cursor morphing dot ── */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = `
    position: fixed; width: 8px; height: 8px; border-radius: 50%;
    background: #a855f7; pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%); transition: transform 0.15s, width 0.3s, height 0.3s, background 0.3s;
    mix-blend-mode: difference;
  `;
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position: fixed; width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid rgba(168,85,247,0.5); pointer-events: none; z-index: 99998;
    transform: translate(-50%,-50%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
      width 0.3s, height 0.3s, opacity 0.3s;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  function followRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  document.querySelectorAll('a, button, .project, .skill, .achievement').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px'; ring.style.height = '56px';
      ring.style.borderColor = 'rgba(168,85,247,0.8)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px'; ring.style.height = '32px';
      ring.style.borderColor = 'rgba(168,85,247,0.5)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ── Staggered section reveals with sliding underline ── */
function initRevealObserver() {
  // Keep hero title markup intact (gradient span, no awkward wrapping).
  // We'll rely on the existing CSS fadeUp animations for the hero instead of text-splitting.
  const heroTitle = document.querySelector('.hero__title');
  const heroSubtitle = document.querySelector('.hero__subtitle');
  if (heroTitle) heroTitle.classList.add('reveal');
  if (heroSubtitle) heroSubtitle.classList.add('reveal');

  // Stat counters
  document.querySelectorAll('.stat__number').forEach(el => {
    el.dataset.target = el.textContent.trim();
    const num = parseFloat(el.dataset.target);
    if (!isNaN(num)) el.textContent = '0'; // Only zero out numeric ones
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('reveal')) {
        el.classList.add('visible');
      }

      if (el.classList.contains('stat__number')) {
        const raw = el.dataset.target;
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          const isDecimal = raw.includes('.') && !isNaN(parseFloat(raw));
          animateCounter(el, raw, isDecimal ? 2 : 0);
        } else {
          // Non-numeric stat (e.g. "B.E.") — just reveal it directly
          el.textContent = raw;
        }
      }

      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .hero__title, .hero__subtitle, .stat__number').forEach(el => io.observe(el));

  // Staggered skills
  const skillsGrid = document.querySelector('.skills__grid');
  if (skillsGrid) {
    const skillItems = skillsGrid.querySelectorAll('.skill');
    skillItems.forEach(s => {
      s.style.cssText += 'opacity:0; transform: translateY(24px) scale(0.95); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1);';
    });
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        skillItems.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, i * 60);
        });
        skillObs.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    skillObs.observe(skillsGrid);
  }
}

/* ── Typewriter effect for hero badge ── */
function initTypewriter() {
  const badge = document.querySelector('.hero__badge');
  if (!badge) return;
  const phrases = ['Available for opportunities', 'Open to collaborations', 'Ready to build'];
  let pi = 0, ci = 0, deleting = false;
  const textNode = badge.childNodes[badge.childNodes.length - 1];
  if (!textNode) return;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      textNode.textContent = ' ' + phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; return setTimeout(type, 1800); }
    } else {
      textNode.textContent = ' ' + phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 2500);
}

/* ── Horizontal scroll snap for project cards on mobile ── */
function initProjectDrag() {
  const grid = document.querySelector('.projects__grid');
  if (!grid || window.innerWidth > 768) return;
  let isDown = false, startX, scrollLeft;
  grid.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - grid.offsetLeft; scrollLeft = grid.scrollLeft; grid.style.cursor = 'grabbing'; });
  grid.addEventListener('mouseleave', () => { isDown = false; grid.style.cursor = ''; });
  grid.addEventListener('mouseup', () => { isDown = false; grid.style.cursor = ''; });
  grid.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - grid.offsetLeft; grid.scrollLeft = scrollLeft - (x - startX) * 1.5; });
}

/* ── Glitch effect on logo hover ── */
function initLogoGlitch() {
  const logo = document.querySelector('.nav__logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'glitch 0.4s steps(2) forwards';
  });
  logo.addEventListener('animationend', () => { logo.style.animation = ''; });
}

/* ── Inject CSS for loader, glitch, char-unit ── */
(function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    /* Loader */
    #page-loader {
      position: fixed; inset: 0; background: #0a0a0f; z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    [data-theme="light"] #page-loader { background: #fafafc; }
    #page-loader.loader--done { opacity: 0; transform: scale(1.04); pointer-events: none; }
    .loader__inner { text-align: center; width: 260px; }
    .loader__logo {
      font-family: 'JetBrains Mono', monospace; font-size: 2.5rem; font-weight: 700;
      background: linear-gradient(135deg,#6c5ce7,#a855f7,#ec4899);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 2rem; animation: pulse 1.2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .loader__bar {
      height: 3px; background: rgba(255,255,255,0.08); border-radius: 99px;
      overflow: hidden; margin-bottom: 1rem;
    }
    [data-theme="light"] .loader__bar { background: rgba(0,0,0,0.08); }
    .loader__fill {
      height: 100%; width: 0%; border-radius: 99px;
      background: linear-gradient(90deg,#6c5ce7,#a855f7,#ec4899);
      transition: width 0.15s linear;
      box-shadow: 0 0 12px rgba(168,85,247,0.6);
    }
    .loader__count {
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
      color: rgba(255,255,255,0.4); letter-spacing: 0.1em;
    }
    [data-theme="light"] .loader__count { color: rgba(0,0,0,0.35); }

    /* Reveal */
    .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Glitch */
    @keyframes glitch {
      0%   { clip-path: inset(20% 0 60% 0); transform: translate(-3px,0); }
      20%  { clip-path: inset(60% 0 10% 0); transform: translate(3px,0); }
      40%  { clip-path: inset(10% 0 80% 0); transform: translate(-1px,0); }
      60%  { clip-path: inset(80% 0 5% 0);  transform: translate(2px,0); }
      80%  { clip-path: inset(40% 0 40% 0); transform: translate(-2px,0); }
      100% { clip-path: none; transform: translate(0); }
    }

    /* Skill visible */
    .skill.visible { opacity:1!important; transform:translateY(0) scale(1)!important; }

    /* Smooth hero entry */
    .hero__badge { opacity:0; animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
    .hero__desc  { opacity:0; animation: fadeUp 0.8s 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .hero__cta   { opacity:0; animation: fadeUp 0.8s 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
    .hero__visual{ opacity:0; animation: fadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
    .hero__desc, .hero__cta { transform: translateY(24px); }
    .hero__visual { transform: translateY(32px); }

    /* Section tag animated underline */
    .section__tag {
      position: relative; display: inline-block;
    }
    .section__tag::after {
      content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px;
      background: linear-gradient(90deg,#6c5ce7,#ec4899);
      transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
      border-radius: 2px;
    }
    .section__tag.visible::after { width: 100%; }

    /* Project card shimmer */
    .project::before {
      content:''; position:absolute; inset:0; border-radius: inherit;
      background: linear-gradient(105deg, transparent 40%, rgba(168,85,247,0.06) 50%, transparent 60%);
      background-size: 200% 100%; background-position: 200% 0;
      transition: background-position 0.6s ease; pointer-events:none;
    }
    .project:hover::before { background-position: -100% 0; }

    /* Floating animation for photo wrapper */
    .hero__photo-wrapper {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-12px); }
    }

    /* Scroll progress */
    #scroll-progress { border-radius: 0 2px 2px 0; }

    /* Achievement & education entry */
    .achievement, .education__card {
      opacity: 0; transform: translateX(-24px);
      transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .achievement.visible, .education__card.visible {
      opacity: 1; transform: translateX(0);
    }

    /* Tag pop on hover */
    .project__tags span {
      transition: transform 0.2s, background 0.2s;
    }
    .project__tags span:hover {
      transform: scale(1.1);
    }

    /* Perspective container for hero */
    .hero { perspective: 1000px; }
  `;
  document.head.appendChild(s);
})();

/* ── Main DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {

  const header     = document.getElementById('header');
  const navMenu    = document.getElementById('navMenu');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.querySelectorAll('.nav__link');
  const sections   = document.querySelectorAll('section[id]');
  const cursorGlow = document.getElementById('cursorGlow');
  const themeToggle = document.getElementById('themeToggle');
  const navClose   = document.getElementById('navClose');

  /* Theme Toggle */
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* Cursor Glow disabled for stable static header */
  if (cursorGlow) cursorGlow.style.display = 'none';

  /* Mobile Menu */
  const toggleMenu = () => { navMenu.classList.toggle('show'); navToggle.classList.toggle('open'); document.body.classList.toggle('lock-scroll'); };
  const closeMenu  = () => { navMenu.classList.remove('show'); navToggle.classList.remove('open'); document.body.classList.remove('lock-scroll'); };
  navToggle.addEventListener('click', toggleMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  navMenu.addEventListener('click', (e) => { if (e.target === navMenu) closeMenu(); });

  /* Keep Header Static (no scroll-based movement or animation) */
  header.classList.remove('scrolled');

  /* Active Nav on Scroll */
  const activateLink = () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop - 100, bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      document.querySelectorAll(`.nav__link[data-section="${id}"]`).forEach(link => {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      });
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();

  /* Init all enhancements */
  initRevealObserver();
  initParallax();
  initTilt();
  initScrollProgress();
  // initCustomCursor(); // disabled to avoid moving overlay near header
  initTypewriter();
  initProjectDrag();
  initLogoGlitch();

  /* Delay magnetic until after loader */
  document.addEventListener('loaderDone', () => {
    initMagnetic();
  });

  /* Achievement & education slide-in observer */
  const slideObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); slideObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.achievement, .education__card').forEach(el => slideObs.observe(el));
});