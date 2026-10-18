import { initTheme } from './ui/theme.js';
import { initNetworkList } from './ui/networkList.js';
import { initResults } from './ui/results.js';
import { subscribe } from './state/store.js';

initTheme();
initNetworkList();
initResults();

subscribe(() => {
  window.dispatchEvent(new CustomEvent('state:networks'));
});
