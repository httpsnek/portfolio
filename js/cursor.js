/* ============================================
   CUSTOM CURSOR — Theme-aware
   All positioning via left/top (never transform).
   CSS handles visual effects (rotate, scale, animation).
   ============================================ */

class CustomCursor {
  constructor() {
    // Don't init on touch devices
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    this.trails = document.querySelectorAll('.cursor-trail');

    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.trailPositions = Array.from({ length: 6 }, () => ({ x: -100, y: -100 }));

    this.matrixChars = '01アイウエオカキクケコサシスセソ';
    this.lastMatrixTime = 0;
    this.isMoving = false;
    this.moveTimeout = null;
    this.rafId = null;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      this.isMoving = true;
      clearTimeout(this.moveTimeout);
      this.moveTimeout = setTimeout(() => {
        this.isMoving = false;
      }, 100);

      // Matrix characters for terminal theme
      this.spawnMatrixChar(e.clientX, e.clientY);
    });

    document.addEventListener('mousedown', () => {
      this.dot?.classList.add('click');
      this.ring?.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      this.dot?.classList.remove('click');
      this.ring?.classList.remove('click');
    });

    // Hover interactive elements
    this.bindHoverEvents();

    // Re-bind on DOM changes (for dynamic elements)
    const observer = new MutationObserver(() => this.bindHoverEvents());
    observer.observe(document.body, { childList: true, subtree: true });

    this.animate();
  }

  bindHoverEvents() {
    const interactives = 'a, button, .btn, .theme-card, .carousel-arrow, input, textarea, .project-card';
    document.querySelectorAll(interactives).forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';
      el.addEventListener('mouseenter', () => {
        this.ring?.classList.add('hover');
        this.dot?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        this.ring?.classList.remove('hover');
        this.dot?.classList.remove('hover');
      });
    });
  }

  spawnMatrixChar(x, y) {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme !== 'terminal') return;

    const now = Date.now();
    if (now - this.lastMatrixTime < 60) return;
    this.lastMatrixTime = now;

    const char = document.createElement('div');
    char.className = 'cursor-matrix-char';
    char.textContent = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
    char.style.left = x + (Math.random() - 0.5) * 20 + 'px';
    char.style.top = y + (Math.random() - 0.5) * 20 + 'px';
    char.style.opacity = '0.8';
    document.body.appendChild(char);

    requestAnimationFrame(() => {
      char.style.transition = 'opacity 400ms ease, transform 400ms ease';
      char.style.opacity = '0';
      char.style.transform = `translateY(${20 + Math.random() * 20}px)`;
    });

    setTimeout(() => char.remove(), 500);
  }

  animate() {
    // Dot — instant position via left/top
    if (this.dot) {
      this.dot.style.left = this.mouse.x + 'px';
      this.dot.style.top = this.mouse.y + 'px';
    }

    // Ring — follows with lag, also via left/top
    if (this.ring) {
      const lag = 0.15;
      this.ringPos.x += (this.mouse.x - this.ringPos.x) * lag;
      this.ringPos.y += (this.mouse.y - this.ringPos.y) * lag;
      this.ring.style.left = this.ringPos.x + 'px';
      this.ring.style.top = this.ringPos.y + 'px';
    }

    // Trail for dark theme
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark' && this.trails.length > 0) {
      for (let i = this.trails.length - 1; i > 0; i--) {
        this.trailPositions[i].x = this.trailPositions[i - 1].x;
        this.trailPositions[i].y = this.trailPositions[i - 1].y;
      }
      this.trailPositions[0].x = this.mouse.x;
      this.trailPositions[0].y = this.mouse.y;

      this.trails.forEach((trail, i) => {
        const pos = this.trailPositions[i];
        trail.style.left = pos.x + 'px';
        trail.style.top = pos.y + 'px';
        trail.style.opacity = this.isMoving ? (1 - i / this.trails.length) * 0.4 : 0;
        const size = (6 - i * 0.8);
        trail.style.width = size + 'px';
        trail.style.height = size + 'px';
        trail.style.marginLeft = -(size / 2) + 'px';
        trail.style.marginTop = -(size / 2) + 'px';
      });
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
});
