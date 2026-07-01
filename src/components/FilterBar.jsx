import { Button, MenuItem, Stack, TextField } from '@mui/material';

export default function FilterBar({ filters, onChange, stocks = [], exitReasons = [], showProfitFilter = true }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
      <TextField size="small" label="Search" value={filters.search || ''} onChange={(event) => set('search', event.target.value)} />
      <TextField select size="small" label="Stock" value={filters.stock || 'all'} onChange={(event) => set('stock', event.target.value)} sx={{ minWidth: 130 }}>
        <MenuItem value="all">All</MenuItem>
        {stocks.map((stock) => <MenuItem key={stock} value={stock}>{stock}</MenuItem>)}
      </TextField>
      <TextField select size="small" label="Exit" value={filters.exitReason || 'all'} onChange={(event) => set('exitReason', event.target.value)} sx={{ minWidth: 140 }}>
        <MenuItem value="all">All</MenuItem>
        {exitReasons.map((reason) => <MenuItem key={reason} value={reason}>{reason}</MenuItem>)}
      </TextField>
      {showProfitFilter && (
        <TextField select size="small" label="P&L" value={filters.pnl || 'all'} onChange={(event) => set('pnl', event.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="profit">Profit</MenuItem>
          <MenuItem value="loss">Loss</MenuItem>
        </TextField>
      )}
      <TextField size="small" label="Min P&L" type="number" value={filters.minProfit || ''} onChange={(event) => set('minProfit', event.target.value)} />
      <TextField size="small" label="Max P&L" type="number" value={filters.maxProfit || ''} onChange={(event) => set('maxProfit', event.target.value)} />
      <Button variant="outlined" onClick={() => onChange({})}>Reset</Button>
    </Stack>
  );
}
