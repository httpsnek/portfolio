/* ============================================
   CUSTOM CURSOR — Theme-aware
   ============================================ */

class CustomCursor {
  constructor() {
    // Don't init on touch devices
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    this.trails = document.querySelectorAll('.cursor-trail');

    this.mouse = { x: 0, y: 0 };
    this.dotPos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.trailPositions = Array.from({ length: 6 }, () => ({ x: 0, y: 0 }));

    this.matrixChars = '01アイウエオカキクケコサシスセソ';
    this.lastMatrixTime = 0;
    this.isMoving = false;
    this.moveTimeout = null;

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
    const interactives = 'a, button, .btn, .theme-card, .carousel-arrow, input, textarea, .project-card';
    document.querySelectorAll(interactives).forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.ring?.classList.add('hover');
        this.dot?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        this.ring?.classList.remove('hover');
        this.dot?.classList.remove('hover');
      });
    });

    // Re-bind on DOM changes (for dynamic elements)
    const observer = new MutationObserver(() => {
      document.querySelectorAll(interactives).forEach(el => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = 'true';
          el.addEventListener('mouseenter', () => {
            this.ring?.classList.add('hover');
            this.dot?.classList.add('hover');
          });
          el.addEventListener('mouseleave', () => {
            this.ring?.classList.remove('hover');
            this.dot?.classList.remove('hover');
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    this.animate();
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

    // Animate and remove
    requestAnimationFrame(() => {
      char.style.transition = 'opacity 400ms ease, transform 400ms ease';
      char.style.opacity = '0';
      char.style.transform = `translate(-50%, -50%) translateY(${20 + Math.random() * 20}px)`;
    });

    setTimeout(() => char.remove(), 500);
  }

  animate() {
    // Dot follows instantly
    this.dotPos.x = this.mouse.x;
    this.dotPos.y = this.mouse.y;

    // Ring follows with lag
    const lag = 0.15;
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * lag;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * lag;

    if (this.dot) {
      this.dot.style.transform = `translate(${this.dotPos.x}px, ${this.dotPos.y}px) translate(-50%, -50%)`;
    }

    if (this.ring) {
      this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px) translate(-50%, -50%)`;
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
        trail.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
        trail.style.opacity = this.isMoving ? (1 - i / this.trails.length) * 0.4 : 0;
        trail.style.width = (6 - i * 0.8) + 'px';
        trail.style.height = (6 - i * 0.8) + 'px';
      });
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
});
