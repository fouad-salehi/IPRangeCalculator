import { ipToInt, prefixToMask } from './ip.js';

export function calcBlocks(hosts) {
  const needed = hosts + 2;
  let bits = 0;
  while (Math.pow(2, bits) < needed) bits++;
  return { size: Math.pow(2, bits), prefix: 32 - bits };
}

export function parseBase(base) {
  if (!base) return { error: 'Invalid base network (example: 192.168.1.0/24)' };
  const parts = base.split('/');
  if (parts.length !== 2) return { error: 'Invalid base network (example: 192.168.1.0/24)' };
  const ip = parts[0].trim();
  const prefix = parseInt(parts[1], 10);
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return { error: 'Invalid base network (example: 192.168.1.0/24)' };
  if (ip.split('.').some(o => parseInt(o, 10) > 255)) return { error: 'Invalid base network (example: 192.168.1.0/24)' };
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return { error: 'Invalid prefix' };
  const baseIpInt = ipToInt(ip);
  const baseMask = prefixToMask(prefix);
  const baseNetworkInt = (baseIpInt & baseMask) >>> 0;
  const baseBroadcast = (baseNetworkInt | (~baseMask >>> 0)) >>> 0;
  return { baseNetworkInt, baseBroadcast, prefix };
}
