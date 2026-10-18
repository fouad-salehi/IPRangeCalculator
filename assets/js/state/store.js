const state = {
  networks: [],
  editingIndex: -1,
  baseNetwork: '192.168.1.0/24',
  theme: 'light'
};

const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notify() {
  for (const fn of listeners) fn(state);
}

export function setBaseNetwork(value) {
  state.baseNetwork = value;
  notify();
}

export function addNetwork(net) {
  if (state.editingIndex >= 0) {
    state.networks[state.editingIndex] = net;
    state.editingIndex = -1;
  } else {
    state.networks.push(net);
  }
  notify();
}

export function startEdit(index) {
  state.editingIndex = index;
  notify();
}

export function cancelEdit() {
  state.editingIndex = -1;
  notify();
}

export function removeNetwork(index) {
  if (state.editingIndex === index) state.editingIndex = -1;
  else if (state.editingIndex > index) state.editingIndex--;
  state.networks.splice(index, 1);
  notify();
}

export function moveUp(index) {
  if (index === 0) return;
  [state.networks[index - 1], state.networks[index]] = [state.networks[index], state.networks[index - 1]];
  if (state.editingIndex === index) state.editingIndex--;
  else if (state.editingIndex === index - 1) state.editingIndex++;
  notify();
}

export function moveDown(index) {
  if (index === state.networks.length - 1) return;
  [state.networks[index + 1], state.networks[index]] = [state.networks[index], state.networks[index + 1]];
  if (state.editingIndex === index) state.editingIndex++;
  else if (state.editingIndex === index + 1) state.editingIndex--;
  notify();
}

export function setTheme(theme) {
  state.theme = theme;
  notify();
}
