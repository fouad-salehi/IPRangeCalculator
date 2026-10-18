import { ipToInt, intToIp, prefixToMask } from './ip.js';
import { calcBlocks, parseBase } from './subnet.js';

export function calculateVLSM(baseStr, networks) {
  const parsed = parseBase(baseStr);
  if (parsed.error) return { error: parsed.error };
  const { baseNetworkInt, baseBroadcast } = parsed;

  const sorted = networks
    .map((n, i) => ({ ...n, ...calcBlocks(n.hosts), originalIndex: i }))
    .sort((a, b) => b.size - a.size || a.originalIndex - b.originalIndex);

  let current = baseNetworkInt;
  const results = [];

  for (const net of sorted) {
    if (current + net.size - 1 > baseBroadcast) {
      return { error: 'Not enough space in ' + baseStr + ' for "' + net.name + '"' };
    }
    const networkAddr = current;
    const broadcastAddr = current + net.size - 1;
    results.push({
      originalIndex: net.originalIndex,
      name: net.name,
      network: intToIp(networkAddr) + '/' + net.prefix,
      mask: intToIp(prefixToMask(net.prefix)),
      range: intToIp(networkAddr + 1) + ' - ' + intToIp(broadcastAddr - 1),
      broadcast: intToIp(broadcastAddr)
    });
    current += net.size;
  }

  results.sort((a, b) => a.originalIndex - b.originalIndex);

  const totalUsed = current - baseNetworkInt;
  const totalAvailable = baseBroadcast - baseNetworkInt + 1;
  const efficiency = Math.round((totalUsed / totalAvailable) * 100);

  return {
    results,
    stats: {
      count: networks.length,
      used: totalUsed,
      free: totalAvailable - totalUsed,
      efficiency
    }
  };
}
