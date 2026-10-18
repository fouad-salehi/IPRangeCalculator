import { getState } from '../state/store.js';
import { calculateVLSM } from '../core/vlsm.js';
import { escapeHtml } from '../utils/dom.js';

export function initResults() {
  const baseInput = document.getElementById('baseNetwork');
  baseInput.addEventListener('input', render);
  window.addEventListener('state:networks', render);
  render();
}

function render() {
  const st = getState();
  const baseInput = document.getElementById('baseNetwork');
  const resultList = document.getElementById('resultList');
  const statsEl = document.getElementById('resultStats');
  const errorEl = document.getElementById('errorMsg');

  const base = (baseInput.value || '').trim();

  if (st.networks.length === 0) {
    resultList.innerHTML = '<tr><td colspan="5" class="empty">Results will appear here</td></tr>';
    statsEl.innerHTML = '';
    errorEl.classList.remove('show');
    return;
  }

  const out = calculateVLSM(base, st.networks);

  if (out.error) {
    errorEl.textContent = out.error;
    errorEl.classList.add('show');
    resultList.innerHTML = '<tr><td colspan="5" class="empty">Invalid input</td></tr>';
    statsEl.innerHTML = '';
    return;
  }

  errorEl.classList.remove('show');

  statsEl.innerHTML = `
    <div class="stat"><div class="stat-value">${out.stats.count}</div><div class="stat-label">Networks</div></div>
    <div class="stat"><div class="stat-value">${out.stats.used}</div><div class="stat-label">IPs Used</div></div>
    <div class="stat"><div class="stat-value">${out.stats.free}</div><div class="stat-label">IPs Free</div></div>
    <div class="stat"><div class="stat-value">${out.stats.efficiency}%</div><div class="stat-label">Efficiency</div></div>
  `;

  resultList.innerHTML = out.results.map(r => `
    <tr>
      <td>${escapeHtml(r.name)}</td>
      <td class="mono-cell">${r.network}</td>
      <td class="mono-cell">${r.mask}</td>
      <td class="mono-cell">${r.range}</td>
      <td class="mono-cell">${r.broadcast}</td>
    </tr>
  `).join('');
}
