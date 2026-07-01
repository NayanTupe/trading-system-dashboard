import { rawCsvFiles } from '../data/rawData.js';

const aliases = {
  date: ['date', 'trade_date', 'trade date', 'entry_time', 'entry time'],
  stock: ['stock', 'symbol', 'ticker', 'instrument'],
  entryPrice: ['entry_price', 'entry price', 'entry', 'entryprice'],
  exitPrice: ['exit_price', 'exit price', 'exit', 'exitprice'],
  quantity: ['quantity', 'qty'],
  confidence: ['confidence', 'probability', 'prob'],
  grossProfit: ['gross_profit', 'gross profit', 'grossprofit'],
  brokerage: ['brokerage', 'charges', 'fee'],
  netProfit: ['net_profit', 'net profit', 'netprofit', 'pnl', 'p&l'],
  exitReason: ['exit_reason', 'exit reason', 'reason', 'action'],
  prediction: ['prediction', 'pred'],
  signal: ['signal'],
  close: ['close', 'close_price', 'close price'],
  finalBalance: ['final_balance', 'final balance', 'balance'],
  fold: ['fold'],
  totalProfit: ['total_profit', 'total profit', 'profit'],
  totalTrades: ['total_trades', 'total trades', 'trades'],
  wins: ['wins', 'winning_trades'],
  losses: ['losses', 'losing_trades'],
  winRate: ['win_rate', 'win rate'],
  avgProfit: ['avg_profit', 'average profit', 'average_profit'],
  targetHits: ['target_hits', 'target hits'],
  stopLosses: ['stop_losses', 'stop losses'],
  stopLossPct: ['stop_loss_pct', 'stop loss pct', 'stop_loss'],
  targetPct: ['target_pct', 'target pct', 'target'],
  holdCandles: ['hold_candles', 'hold candles'],
  finalBalance: ['final_balance', 'final balance'],
};

const numericFields = new Set([
  'entryPrice',
  'exitPrice',
  'quantity',
  'confidence',
  'grossProfit',
  'brokerage',
  'netProfit',
  'prediction',
  'close',
  'finalBalance',
  'fold',
  'totalProfit',
  'totalTrades',
  'wins',
  'losses',
  'winRate',
  'avgProfit',
  'targetHits',
  'stopLosses',
  'stopLossPct',
  'targetPct',
  'holdCandles',
]);

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function canonicalKey(header) {
  const normalized = String(header || '').trim().toLowerCase().replace(/[_-]+/g, ' ');
  const compact = normalized.replace(/\s+/g, '');
  const match = Object.entries(aliases).find(([, values]) =>
    values.some((value) => value === normalized || value.replace(/\s+/g, '') === compact)
  );
  return match ? match[0] : compact;
}

function parseValue(key, value) {
  if (value === '' || value == null) return null;
  if (numericFields.has(key)) {
    const number = Number(String(value).replace(/[₹,%]/g, ''));
    return Number.isFinite(number) ? number : 0;
  }
  return value;
}

export function parseCsv(raw = '') {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map(canonicalKey);

  return lines.slice(1).map((line, rowIndex) => {
    const cells = splitCsvLine(line);
    const row = { id: rowIndex + 1 };
    headers.forEach((key, index) => {
      row[key] = parseValue(key, cells[index]);
    });
    return row;
  });
}

export function loadCsv(path) {
  try {
    const raw = rawCsvFiles[path];
    if (!raw) return { rows: [], error: `CSV not registered: ${path}` };
    return { rows: parseCsv(raw), error: null };
  } catch (error) {
    console.error(`Unable to load CSV: ${path}`, error);
    return { rows: [], error: error.message };
  }
}

export function exportRowsToCsv(rows, filename = 'export.csv') {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]).filter((key) => key !== 'id');
  const body = rows.map((row) =>
    headers.map((key) => `"${String(row[key] ?? '').replaceAll('"', '""')}"`).join(',')
  );
  const blob = new Blob([[headers.join(','), ...body].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
