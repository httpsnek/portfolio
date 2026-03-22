/* ============================================
   EFFECTS — All new interactive features
   ============================================ */

/* ============================================
   1. INK DROP CURSOR (Light theme)
   ============================================ */
class InkDropCursor {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme !== 'light') return;
      this.createSplash(e.clientX, e.clientY);
    });
  }

  createSplash(x, y) {
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const splash = document.createElement('div');
      splash.className = 'ink-splash';
      const size = 4 + Math.random() * 12;
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      const distance = 10 + Math.random() * 25;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      splash.style.width = size + 'px';
      splash.style.height = size + 'px';
      splash.style.left = (x + offsetX) + 'px';
      splash.style.top = (y + offsetY) + 'px';
      document.body.appendChild(splash);
      setTimeout(() => splash.remove(), 450);
    }
  }
}

/* ============================================
   2. SMOOTH PAGE TRANSITIONS (Nav clicks)
   ============================================ */
class SmoothPageTransitions {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        // Add transition animation to target section
        target.classList.remove('section-transitioning');
        void target.offsetWidth; // force reflow
        target.classList.add('section-transitioning');

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile drawer if open
        const drawerPanel = document.getElementById('drawerPanel');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const burger = document.getElementById('navBurger');
        if (drawerPanel) drawerPanel.classList.remove('open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('visible');
        if (burger) burger.classList.remove('active');
        document.body.style.overflow = '';

        // Remove animation class after done
        setTimeout(() => {
          target.classList.remove('section-transitioning');
        }, 700);
      });
    });

    // Track active section in nav
    this.initActiveSection();
  }

  initActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active-section', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
  }
}

/* ============================================
   3. MAGNETIC BUTTONS (Light theme only)
   ============================================ */
class MagneticButtons {
  constructor() {
    this.buttons = [];
    this.init();
  }

  init() {
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
      btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
    });
  }

  handleMove(e, btn) {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme !== 'light') return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  }

  handleLeave(e, btn) {
    btn.style.transform = '';
  }
}

/* ============================================
   4. SKILL BARS — Animated on scroll
   ============================================ */
class SkillBars {
  constructor() {
    this.animated = false;
    this.init();
  }

  init() {
    const section = document.querySelector('.skills-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateBars();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  animateBars() {
    const bars = document.querySelectorAll('.skill-fill');
    const percents = document.querySelectorAll('.skill-percent');

    bars.forEach((bar, i) => {
      const target = parseInt(bar.dataset.level, 10);
      setTimeout(() => {
        bar.style.width = target + '%';
        // Animate counter
        this.animateCounter(percents[i], target);
      }, i * 150);
    });
  }

  animateCounter(el, target) {
    if (!el) return;
    let current = 0;
    const duration = 1200;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

/* ============================================
   5. TEXT SCRAMBLE (Terminal theme)
   ============================================ */
class TextScramble {
  constructor() {
    this.chars = '!<>-_\\/[]{}—=+*^?#________01';
    this.init();
  }

  init() {
    // Apply to section titles and hero name in terminal theme
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = document.documentElement.getAttribute('data-theme');
          if (theme === 'terminal') {
            this.scramble(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section-title, .hero-name').forEach(el => {
      observer.observe(el);
    });

    // Re-scramble on theme switch to terminal
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          if (theme === 'terminal') {
            document.querySelectorAll('.section-title').forEach(el => {
              if (this.isInViewport(el)) this.scramble(el);
            });
          }
        }
      });
    });
    mutObs.observe(document.documentElement, { attributes: true });
  }

  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  scramble(el) {
    const originalText = el.dataset.originalText || el.textContent;
    el.dataset.originalText = originalText;

    let frame = 0;
    const totalFrames = 20;

    const update = () => {
      let output = '';
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') {
          output += ' ';
        } else if (frame / totalFrames > i / originalText.length) {
          output += originalText[i];
        } else {
          output += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }
      el.textContent = output;
      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(update);
      } else {
        el.textContent = originalText;
      }
    };

    requestAnimationFrame(update);
  }
}

/* ============================================
   6. TERMINAL LINE-BY-LINE PRINT
   ============================================ */
class TerminalPrint {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = document.documentElement.getAttribute('data-theme');
          if (theme === 'terminal') {
            this.printSection(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Observe paragraphs and descriptions inside sections
    document.querySelectorAll('.section p, .service-description, .project-description').forEach(el => {
      observer.observe(el);
    });
  }

  printSection(el) {
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--accent)';
    let i = 0;

    const type = () => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        // Fast terminal typing speed
        const speed = 1 + Math.random() * 3;
        setTimeout(type, speed);
      } else {
        el.style.borderRight = 'none';
      }
    };

    type();
  }
}

/* ============================================
   7. RETRO CHANNEL-SWITCH EFFECT
   ============================================ */
class RetroChannelSwitch {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    // Create overlay element
    this.overlay = document.createElement('div');
    this.overlay.className = 'retro-static-overlay';
    document.body.appendChild(this.overlay);

    // Trigger on section scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = document.documentElement.getAttribute('data-theme');
          if (theme === 'retro') {
            this.triggerStatic();
          }
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section').forEach(s => observer.observe(s));

    // Also trigger on theme switch to retro
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          if (theme === 'retro') {
            this.triggerStatic();
          }
        }
      });
    });
    mutObs.observe(document.documentElement, { attributes: true });
  }

  triggerStatic() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    void this.overlay.offsetWidth;
    this.overlay.classList.add('active');
    setTimeout(() => this.overlay.classList.remove('active'), 350);
  }
}

/* ============================================
   8. DARK THEME — FLOATING PARTICLES
   ============================================ */
class FloatingParticles {
  constructor() {
    this.container = null;
    this.particles = [];
    this.animId = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'particles-container';
    document.body.insertBefore(this.container, document.body.firstChild);

    this.createParticles(40);
    this.animate();

    // Watch theme changes
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        this.container.style.display = 'block';
      } else {
        this.container.style.display = 'none';
      }
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  createParticles(count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 1.5 + Math.random() * 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';

      const data = {
        el: p,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 0.1 + Math.random() * 0.3,
        size: size
      };

      p.style.left = data.x + 'px';
      p.style.top = data.y + 'px';
      p.style.opacity = data.alpha;
      p.style.background = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';

      this.container.appendChild(p);
      this.particles.push(data);
    }
  }

  animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

/* ============================================
   COUNTER ANIMATION (About section)
   ============================================ */
class CounterAnimation {
  constructor() {
    this.init();
  }

  init() {
    const counters = document.querySelectorAll('.counter-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const countersContainer = document.querySelector('.counters');
    if (countersContainer) observer.observe(countersContainer);
  }

  animateCounters() {
    document.querySelectorAll('.counter-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1500;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }
}

/* ============================================
   INIT ALL EFFECTS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  new InkDropCursor();
  new SmoothPageTransitions();
  new MagneticButtons();
  new SkillBars();
  new TextScramble();
  new TerminalPrint();
  new RetroChannelSwitch();
  new FloatingParticles();
  new CounterAnimation();
});
