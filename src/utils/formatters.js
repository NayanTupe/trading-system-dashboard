export function formatCurrency(value, compact = false) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: compact ? 0 : 2,
    notation: compact && Math.abs(number) >= 100000 ? 'compact' : 'standard',
  }).format(number);
}

export function formatNumber(value, digits = 2) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(number);
}

export function formatPercent(value, digits = 2) {
  return `${formatNumber(value, digits)}%`;
}

export function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function getProfitLossColor(value, theme) {
  const number = Number(value || 0);
  if (number > 0) return theme.palette.success.main;
  if (number < 0) return theme.palette.error.main;
  return theme.palette.text.secondary;
}

export function getSignalColor(signal, theme) {
  const normalized = String(signal || '').toLowerCase();
  if (normalized.includes('buy')) return theme.palette.success.main;
  if (normalized.includes('sell')) return theme.palette.error.main;
  if (normalized.includes('no') || normalized.includes('hold')) return theme.palette.warning.main;
  return theme.palette.text.secondary;
}

export function formatPnL(value) {
  const number = Number(value || 0);
  const sign = number > 0 ? '+' : '';
  return `${sign}${formatCurrency(number)}`;
}
