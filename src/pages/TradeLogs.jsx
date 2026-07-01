import { Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import TradeTable from '../components/TradeTable.jsx';
import { filePaths } from '../constants/filePaths.js';
import { useCsvData } from '../hooks/useCsvData.js';

function applyFilters(rows, filters) {
  return rows.filter((row) => {
    const search = String(filters.search || '').toLowerCase();
    const text = JSON.stringify(row).toLowerCase();
    if (search && !text.includes(search)) return false;
    if (filters.stock && filters.stock !== 'all' && row.stock !== filters.stock) return false;
    if (filters.exitReason && filters.exitReason !== 'all' && row.exitReason !== filters.exitReason) return false;
    if (filters.pnl === 'profit' && Number(row.netProfit || 0) <= 0) return false;
    if (filters.pnl === 'loss' && Number(row.netProfit || 0) > 0) return false;
    if (filters.minProfit && Number(row.netProfit || 0) < Number(filters.minProfit)) return false;
    if (filters.maxProfit && Number(row.netProfit || 0) > Number(filters.maxProfit)) return false;
    return true;
  });
}

export default function TradeLogs() {
  const { rows } = useCsvData(filePaths.fullBacktestTrades);
  const [filters, setFilters] = useState({});
  const stocks = useMemo(() => [...new Set(rows.map((row) => row.stock).filter(Boolean))], [rows]);
  const exitReasons = useMemo(() => [...new Set(rows.map((row) => row.exitReason).filter(Boolean))], [rows]);
  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  return (
    <Stack spacing={2}>
      <FilterBar filters={filters} onChange={setFilters} stocks={stocks} exitReasons={exitReasons} />
      <TradeTable rows={filtered} title={`Trade Logs (${filtered.length})`} />
    </Stack>
  );
}
