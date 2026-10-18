import { getState, setTheme } from '../state/store.js';

const KEY = 'theme';

export function initTheme() {
  const saved = localStorage.getItem(KEY) || 'light';
  applyTheme(saved);
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(KEY, next);
    setTheme(next);
  });
}

function applyTheme(theme) {
  const btn = document.getElementById('themeToggle');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (btn) btn.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (btn) btn.textContent = '☀️';
  }
}
