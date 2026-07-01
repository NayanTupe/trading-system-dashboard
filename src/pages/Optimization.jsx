import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import ChartCard from '../components/ChartCard.jsx';
import KPICard from '../components/KPICard.jsx';
import { MonthlyProfitChart } from '../components/charts.jsx';
import { filePaths } from '../constants/filePaths.js';
import { useCsvData } from '../hooks/useCsvData.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters.js';
import { bestOptimization } from '../utils/metricsCalculator.js';

export default function Optimization() {
  const theme = useTheme();
  const { rows } = useCsvData(filePaths.optimization);
  const best = bestOptimization(rows);
  const top10 = [...rows].sort((a, b) => Number(b.totalProfit || 0) - Number(a.totalProfit || 0)).slice(0, 10);
  const chartData = top10.map((row, index) => ({ month: `#${index + 1}`, profit: Number(row.totalProfit || 0) }));

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}><KPICard title="Best Profit" value={formatCurrency(best?.totalProfit)} subtitle="Highest total profit config" type="profit" /></Grid>
        <Grid item xs={12} md={6} lg={3}><KPICard title="Best Win Rate" value={formatPercent(best?.winRate)} subtitle="For best profit config" type={Number(best?.winRate) > 50 ? 'profit' : 'warning'} /></Grid>
        <Grid item xs={12} md={6} lg={3}><KPICard title="Final Balance" value={formatCurrency(best?.finalBalance)} subtitle="Optimized ending capital" type="profit" /></Grid>
        <Grid item xs={12} md={6} lg={3}><KPICard title="Trades" value={formatNumber(best?.totalTrades, 0)} subtitle="Best config trade count" /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <ChartCard title="Top 10 Optimization Results" subtitle="Ranked by total profit">
            <MonthlyProfitChart data={chartData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Best Configuration</Typography>
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                <Typography>Confidence: <b>{formatNumber(best?.confidence, 3)}</b></Typography>
                <Typography>Stop Loss: <b>{formatPercent(Number(best?.stopLossPct || 0) * 100, 2)}</b></Typography>
                <Typography>Target: <b>{formatPercent(Number(best?.targetPct || 0) * 100, 2)}</b></Typography>
                <Typography>Hold Candles: <b>{best?.holdCandles || '-'}</b></Typography>
                <Typography color="text.secondary">Ranking uses highest total profit. Add drawdown/sharpe columns later for risk-adjusted ranking.</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer className="table-scroll" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Confidence', 'Stop Loss', 'Target', 'Hold', 'Final Balance', 'Profit', 'Trades', 'Wins', 'Losses', 'Win Rate'].map((cell) => <TableCell key={cell} sx={{ fontWeight: 850 }}>{cell}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {top10.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{formatNumber(row.confidence, 3)}</TableCell>
                <TableCell>{formatPercent(Number(row.stopLossPct || 0) * 100, 2)}</TableCell>
                <TableCell>{formatPercent(Number(row.targetPct || 0) * 100, 2)}</TableCell>
                <TableCell>{row.holdCandles}</TableCell>
                <TableCell>{formatCurrency(row.finalBalance)}</TableCell>
                <TableCell sx={{ color: Number(row.totalProfit) >= 0 ? 'success.main' : 'error.main', fontWeight: 850 }}>{formatCurrency(row.totalProfit)}</TableCell>
                <TableCell>{row.totalTrades}</TableCell>
                <TableCell>{row.wins}</TableCell>
                <TableCell>{row.losses}</TableCell>
                <TableCell>{formatPercent(row.winRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
