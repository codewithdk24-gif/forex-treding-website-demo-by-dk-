/**
 * Core Trading Engine logic for PnL, SL/TP and Execution checks.
 * Separated from the UI/Store to allow for future server-side validation.
 */

export const calculatePnL = (trade, currentPrice) => {
  const entry = parseFloat(trade.entry);
  const price = parseFloat(currentPrice);
  const size = parseFloat(trade.size);
  
  const diff = trade.type === 'BUY' ? (price - entry) : (entry - price);
  // standard forex lot multiplier (100,000 units)
  return (diff * size * 100000).toFixed(2);
};

export const checkSLTP = (trade, currentPrice) => {
  const price = parseFloat(currentPrice);
  const tp = parseFloat(trade.tp);
  const sl = parseFloat(trade.sl);

  if (trade.type === 'BUY') {
    if (tp > 0 && price >= tp) return { triggered: true, reason: 'TP HIT' };
    if (sl > 0 && price <= sl) return { triggered: true, reason: 'SL HIT' };
  } else {
    if (tp > 0 && price <= tp) return { triggered: true, reason: 'TP HIT' };
    if (sl > 0 && price >= sl) return { triggered: true, reason: 'SL HIT' };
  }

  return { triggered: false };
};

export const validatePendingOrder = (order, currentPrice) => {
  const price = parseFloat(currentPrice);
  const entry = parseFloat(order.entry);

  if (order.type === 'BUY' && price <= entry) return true;
  if (order.type === 'SELL' && price >= entry) return true;

  return false;
};
