import { Button, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { exportRowsToCsv } from '../utils/csvLoader.js';
import { formatCurrency, formatDate, getProfitLossColor } from '../utils/formatters.js';
import EmptyState from './EmptyState.jsx';

const columns = [
  ['date', 'Date'],
  ['stock', 'Stock'],
  ['entryPrice', 'Entry'],
  ['exitPrice', 'Exit'],
  ['quantity', 'Qty'],
  ['confidence', 'Confidence'],
  ['grossProfit', 'Gross'],
  ['brokerage', 'Brokerage'],
  ['netProfit', 'Net P&L'],
  ['exitReason', 'Exit Reason'],
];

function exitColor(reason) {
  const text = String(reason || '').toLowerCase();
  if (text.includes('target')) return 'success';
  if (text.includes('stop')) return 'error';
  if (text.includes('time')) return 'info';
  return 'default';
}

export default function TradeTable({ rows, compact = false, title = 'Trades' }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(compact ? 8 : 15);
  const visible = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [rows, page, rowsPerPage]);

  if (!rows.length) return <EmptyState title="No trades found" description="Adjust filters or generate trade logs first." />;

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={800}>{title}</Typography>
        <Button size="small" variant="outlined" onClick={() => exportRowsToCsv(rows, 'filtered-trades.csv')}>Export CSV</Button>
      </Stack>
      <TableContainer className="table-scroll" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(([, label]) => <TableCell key={label} sx={{ fontWeight: 850 }}>{label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell className="mono">{formatDate(row.date)}</TableCell>
                <TableCell>{row.stock || '-'}</TableCell>
                <TableCell className="mono">{formatCurrency(row.entryPrice)}</TableCell>
                <TableCell className="mono">{formatCurrency(row.exitPrice)}</TableCell>
                <TableCell className="mono">{row.quantity ?? '-'}</TableCell>
                <TableCell className="mono">{row.confidence != null ? Number(row.confidence).toFixed(4) : '-'}</TableCell>
                <TableCell className="mono">{formatCurrency(row.grossProfit)}</TableCell>
                <TableCell className="mono">{formatCurrency(row.brokerage)}</TableCell>
                <TableCell className="mono" sx={{ color: getProfitLossColor(row.netProfit, theme), fontWeight: 850 }}>{formatCurrency(row.netProfit)}</TableCell>
                <TableCell><Chip size="small" color={exitColor(row.exitReason)} variant="outlined" label={row.exitReason || 'other'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
      />
    </Stack>
  );
}
