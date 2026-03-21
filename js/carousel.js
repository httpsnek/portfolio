/* ============================================
   3D THEME CAROUSEL
   ============================================ */

class ThemeCarousel {
  constructor() {
    this.themes = ['light', 'dark', 'terminal', 'retro'];
    this.currentIndex = 0;
    this.cards = document.querySelectorAll('.theme-card');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Arrow buttons by ID
    document.getElementById('carouselPrev').addEventListener('click', () => this.prev());
    document.getElementById('carouselNext').addEventListener('click', () => this.next());

    // Dot indicators
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      const welcome = document.getElementById('welcomeScreen');
      if (welcome && !welcome.classList.contains('hidden') && welcome.style.display !== 'none') {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'Enter') this.enterPortfolio();
      }
    });

    // Touch swipe on carousel
    this.initSwipe();

    // Mouse wheel on carousel
    const wrapper = document.querySelector('.carousel-wrapper');
    let wheelCooldown = false;
    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 700);

      if (e.deltaX > 30 || e.deltaY > 30) this.next();
      else if (e.deltaX < -30 || e.deltaY < -30) this.prev();
    }, { passive: false });

    // Click on side cards to navigate
    this.cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
          this.enterPortfolio();
        } else {
          this.goTo(i);
        }
      });
    });

    // Enter button
    document.getElementById('welcomeEnter').addEventListener('click', () => this.enterPortfolio());

    // Initial layout
    this.updateLayout();
  }

  initSwipe() {
    const wrapper = document.querySelector('.carousel-wrapper');
    let startX = 0;
    let isDragging = false;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
      }
    });
  }

  prev() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex - 1 + this.themes.length) % this.themes.length;
    this.updateLayout();
  }

  next() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.themes.length;
    this.updateLayout();
  }

  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateLayout();
  }

  updateLayout() {
    this.isAnimating = true;
    const total = this.themes.length;

    this.cards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next', 'far');

      if (i === this.currentIndex) {
        card.classList.add('active');
      } else if (i === (this.currentIndex - 1 + total) % total) {
        card.classList.add('prev');
      } else if (i === (this.currentIndex + 1) % total) {
        card.classList.add('next');
      } else {
        card.classList.add('far');
      }
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });

    // Live theme preview — switch theme as user scrolls cards
    const previewTheme = this.themes[this.currentIndex];
    document.documentElement.setAttribute('data-theme', previewTheme);

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  enterPortfolio() {
    const selectedTheme = this.themes[this.currentIndex];
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('portfolio-theme', selectedTheme);

    // Update nav theme dots
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === selectedTheme);
    });

    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.classList.add('hidden');
    document.body.style.overflow = '';

    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      if (typeof initScrollReveal === 'function') initScrollReveal();
    }, 700);
  }
}

// Initialize on load — always show welcome screen
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);

    // Update nav theme dots
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === saved);
    });
  }

  // Always show carousel
  document.body.style.overflow = 'hidden';
  const carousel = new ThemeCarousel();

  // If user had a saved theme, pre-select that card
  if (saved) {
    const idx = carousel.themes.indexOf(saved);
    if (idx !== -1) {
      carousel.currentIndex = idx;
      carousel.updateLayout();
    }
  }
});
