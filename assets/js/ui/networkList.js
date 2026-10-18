import { getState, addNetwork, removeNetwork, moveUp, moveDown, startEdit, cancelEdit } from '../state/store.js';
import { escapeHtml } from '../utils/dom.js';

export function initNetworkList() {
  const nameInput = document.getElementById('netName');
  const hostInput = document.getElementById('hostCount');
  const addBtn = document.querySelector('.add-row .btn-primary');

  const submit = () => {
    const name = nameInput.value.trim();
    const hosts = parseInt(hostInput.value, 10);
    if (!name || !hosts || hosts < 1) {
      showError('Please enter a valid name and host count');
      return;
    }
    addNetwork({ name, hosts });
    nameInput.value = '';
    hostInput.value = '';
    clearError();
    updateButtonLabel();
  };

  addBtn.addEventListener('click', submit);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  hostInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  window.addEventListener('state:networks', render);
  render();
}

function updateButtonLabel() {
  const btn = document.querySelector('.add-row .btn-primary');
  const st = getState();
  if (btn) btn.textContent = st.editingIndex >= 0 ? '✓ Save' : '+ Add';
}

function render() {
  const tbody = document.getElementById('netList');
  const st = getState();
  updateButtonLabel();

  if (st.networks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">No networks added yet</td></tr>';
    return;
  }

  tbody.innerHTML = st.networks.map((n, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(n.name)}</td>
      <td><span class="result-badge">${n.hosts}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-icon" data-action="up" data-index="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn-icon" data-action="down" data-index="${i}" ${i === st.networks.length - 1 ? 'disabled' : ''}>↓</button>
        </div>
      </td>
      <td>
        <div class="row-actions">
          <button class="btn-icon" data-action="edit" data-index="${i}">Edit</button>
          <button class="btn-danger btn" data-action="del" data-index="${i}">Del</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const index = parseInt(btn.dataset.index, 10);
      if (action === 'up') moveUp(index);
      if (action === 'down') moveDown(index);
      if (action === 'del') removeNetwork(index);
      if (action === 'edit') {
        const net = getState().networks[index];
        document.getElementById('netName').value = net.name;
        document.getElementById('hostCount').value = net.hosts;
        startEdit(index);
        document.getElementById('netName').focus();
      }
    });
  });
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('show');
}

function clearError() {
  const el = document.getElementById('errorMsg');
  el.textContent = '';
  el.classList.remove('show');
}
