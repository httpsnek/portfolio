/* ============================================
   SCROLL REVEAL ANIMATIONS + TYPEWRITER
   ============================================ */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

class Typewriter {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.currentWord = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.typeSpeed = options.typeSpeed || 80;
    this.deleteSpeed = options.deleteSpeed || 40;
    this.pauseDuration = options.pauseDuration || 2000;

    this.type();
  }

  type() {
    const word = this.words[this.currentWord];
    let displayText;

    if (this.isDeleting) {
      displayText = word.substring(0, this.currentChar - 1);
      this.currentChar--;
    } else {
      displayText = word.substring(0, this.currentChar + 1);
      this.currentChar++;
    }

    this.element.textContent = displayText;

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentChar === word.length) {
      speed = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentWord = (this.currentWord + 1) % this.words.length;
      speed = 500;
    }

    setTimeout(() => this.type(), speed);
  }
}

/* ============================================
   3D TILT EFFECT for Project Cards
   ============================================ */

function initTiltCards() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none';

      // Light following cursor
      const shine = card.querySelector('.card-shine');
      if (shine) {
        shine.style.left = 'auto';
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 500ms ease';
      const shine = card.querySelector('.card-shine');
      if (shine) shine.style.background = 'transparent';
    });
  });
}

/* ============================================
   NAV — scroll behavior + burger
   ============================================ */

function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Scroll — add shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth scroll handled by effects.js SmoothPageTransitions

  // ── Drawer menu (completely separate from desktop nav-center) ──
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('drawerPanel');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!burger || !drawer || !backdrop) return;

  let drawerOpen = false;

  function openDrawer() {
    if (drawerOpen) return;
    drawerOpen = true;
    burger.classList.add('active');
    drawer.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Sync active theme dot
    syncDrawerDots();
  }

  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    burger.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function syncDrawerDots() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    drawer.querySelectorAll('.drawer-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === current);
    });
  }

  // Burger toggle
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    drawerOpen ? closeDrawer() : openDrawer();
  });

  // Backdrop click → close
  backdrop.addEventListener('click', closeDrawer);

  // Drawer links → close
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Theme dots in drawer — switch theme AND close drawer
  drawer.querySelectorAll('.drawer-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const theme = dot.dataset.theme;
      if (!theme) return;

      // Apply theme
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);

      // Sync all dots — drawer + nav desktop
      syncDrawerDots();
      document.querySelectorAll('.theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.theme === theme);
      });

      closeDrawer();
    });
  });

  // Resize to desktop → close instantly
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawerOpen) {
      drawerOpen = false;
      burger.classList.remove('active');
      drawer.classList.remove('open');
      backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }, { passive: true });

  // Escape → close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

/* ============================================
   INIT ALL
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();

  // Typewriter
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    new Typewriter(typeEl, [
      'websites',
      'automation tools',
      'AI solutions',
      'web platforms'
    ]);
  }

  initTiltCards();
});
