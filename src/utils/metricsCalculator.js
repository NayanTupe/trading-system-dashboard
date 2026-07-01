const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);
const average = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

export function sortByDate(rows) {
  return [...rows].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
}

export function calculateEquityCurve(rows, initialCapital = 0) {
  let equity = initialCapital;
  return sortByDate(rows).map((row, index) => {
    equity += Number(row.netProfit || row.totalProfit || 0);
    return { x: row.date || index + 1, y: Number(equity.toFixed(2)), profit: Number(row.netProfit || 0) };
  });
}

export function calculateDrawdown(rows) {
  let peak = -Infinity;
  return calculateEquityCurve(rows).map((point) => {
    peak = Math.max(peak, point.y);
    return { x: point.x, y: Number((point.y - peak).toFixed(2)) };
  });
}

export function monthlyProfit(rows) {
  const grouped = {};
  rows.forEach((row) => {
    const date = row.date ? new Date(row.date) : null;
    const key = date && !Number.isNaN(date.getTime())
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : 'Unknown';
    grouped[key] = (grouped[key] || 0) + Number(row.netProfit || 0);
  });
  return Object.entries(grouped).map(([month, profit]) => ({ month, profit: Number(profit.toFixed(2)) }));
}

export function stockWiseProfit(rows) {
  const grouped = {};
  rows.forEach((row) => {
    const key = row.stock || 'Unknown';
    grouped[key] = (grouped[key] || 0) + Number(row.netProfit || 0);
  });
  return Object.entries(grouped)
    .map(([stock, profit]) => ({ stock, profit: Number(profit.toFixed(2)) }))
    .sort((a, b) => b.profit - a.profit);
}

export function exitReasonDistribution(rows) {
  const grouped = {};
  rows.forEach((row) => {
    const key = row.exitReason || 'other';
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([reason, count]) => ({ reason, count }));
}

export function profitDistribution(rows, bucketCount = 10) {
  const values = rows.map((row) => Number(row.netProfit || 0));
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const size = Math.max((max - min) / bucketCount, 1);
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    label: `${Math.round(min + index * size)} to ${Math.round(min + (index + 1) * size)}`,
    count: 0,
  }));
  values.forEach((value) => {
    const index = Math.min(Math.floor((value - min) / size), bucketCount - 1);
    buckets[index].count += 1;
  });
  return buckets;
}

export function calculateTradeMetrics(rows, initialCapital = 100000) {
  const totalTrades = rows.length;
  const profits = rows.map((row) => Number(row.netProfit || 0));
  const wins = profits.filter((value) => value > 0);
  const losses = profits.filter((value) => value <= 0);
  const netProfit = sum(rows, 'netProfit');
  const grossProfit = sum(rows, 'grossProfit');
  const totalBrokerage = sum(rows, 'brokerage');
  const equity = calculateEquityCurve(rows, initialCapital);
  const drawdown = calculateDrawdown(rows);
  const std = Math.sqrt(average(profits.map((value) => (value - average(profits)) ** 2)));
  const totalWins = wins.reduce((a, b) => a + b, 0);
  const totalLosses = Math.abs(losses.reduce((a, b) => a + b, 0));

  return {
    totalTrades,
    netProfit,
    grossProfit,
    totalBrokerage,
    winRate: totalTrades ? (wins.length / totalTrades) * 100 : 0,
    averageProfit: totalTrades ? netProfit / totalTrades : 0,
    bestTrade: totalTrades ? Math.max(...profits) : 0,
    worstTrade: totalTrades ? Math.min(...profits) : 0,
    finalEquity: equity.length ? equity[equity.length - 1].y : initialCapital,
    maxDrawdown: drawdown.length ? Math.min(...drawdown.map((point) => point.y)) : 0,
    sharpeRatio: std ? average(profits) / std : 0,
    riskRewardRatio: average(wins) / Math.abs(average(losses) || 1),
    profitFactor: totalLosses ? totalWins / totalLosses : totalWins ? totalWins : 0,
    averageWin: average(wins),
    averageLoss: average(losses),
    targetHits: rows.filter((row) => String(row.exitReason || '').toLowerCase().includes('target')).length,
    stopLosses: rows.filter((row) => String(row.exitReason || '').toLowerCase().includes('stop')).length,
  };
}

export function dailyProfit(rows) {
  const grouped = {};
  rows.forEach((row) => {
    const key = row.date ? String(row.date).slice(0, 10) : 'Unknown';
    grouped[key] = (grouped[key] || 0) + Number(row.netProfit || 0);
  });
  return Object.entries(grouped).map(([date, profit]) => ({ date, profit: Number(profit.toFixed(2)) }));
}

export function streaks(rows) {
  let win = 0;
  let loss = 0;
  let maxWin = 0;
  let maxLoss = 0;
  sortByDate(rows).forEach((row) => {
    if (Number(row.netProfit || 0) > 0) {
      win += 1;
      loss = 0;
    } else {
      loss += 1;
      win = 0;
    }
    maxWin = Math.max(maxWin, win);
    maxLoss = Math.max(maxLoss, loss);
  });
  return { maxWin, maxLoss };
}

export function summarizeWalkForward(rows) {
  const profits = rows.map((row) => Number(row.totalProfit || 0));
  const winRates = rows.map((row) => Number(row.winRate || 0));
  return {
    totalFolds: rows.length,
    averageFoldProfit: average(profits),
    bestFold: rows[profits.indexOf(Math.max(...profits))],
    worstFold: rows[profits.indexOf(Math.min(...profits))],
    averageWinRate: average(winRates),
    totalTrades: sum(rows, 'totalTrades'),
    stabilityScore: profits.length ? Math.max(0, 100 - Math.abs(Math.min(...profits)) / Math.max(Math.max(...profits), 1) * 100) : 0,
  };
}

export function bestOptimization(rows) {
  return [...rows].sort((a, b) => Number(b.totalProfit || 0) - Number(a.totalProfit || 0))[0] || null;
}
