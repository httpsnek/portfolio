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

  // Burger menu — slide-in drawer from right
  const burger = document.getElementById('navBurger');
  const navCenter = document.querySelector('.nav-center');

  // Backdrop element
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function closeMenu() {
    if (!burger.classList.contains('active')) return;
    // Play slide-out, then hide
    navCenter.classList.add('closing');
    backdrop.classList.remove('visible');
    setTimeout(() => {
      navCenter.classList.remove('open', 'closing');
      burger.classList.remove('active');
      document.body.style.overflow = '';
    }, 260); // matches drawerSlideOut duration
  }

  function openMenu() {
    burger.classList.add('active');
    navCenter.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  if (burger && navCenter) {
    burger.addEventListener('click', () => {
      if (burger.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when nav link is tapped
    navCenter.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on backdrop click
    backdrop.addEventListener('click', closeMenu);

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    }, { passive: true });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }
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
