/* ============================================
   THEME SWITCHER — Runtime switching (Nav dots)
   ============================================ */

class ThemeSwitcher {
  constructor() {
    this.themes = ['light', 'dark', 'terminal', 'retro'];
    this.init();
  }

  init() {
    document.querySelectorAll('.theme-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        if (theme) this.setTheme(theme);
      });
    });
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) return;

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    // Update active dot in nav (desktop)
    document.querySelectorAll('.theme-dot').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    // Sync drawer dots (mobile)
    document.querySelectorAll('.drawer-dot').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
});
