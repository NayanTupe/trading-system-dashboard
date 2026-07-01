import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import ChartCard from '../components/ChartCard.jsx';
import KPICard from '../components/KPICard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { MonthlyProfitChart } from '../components/charts.jsx';
import { filePaths } from '../constants/filePaths.js';
import { useCsvData } from '../hooks/useCsvData.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters.js';
import { summarizeWalkForward } from '../utils/metricsCalculator.js';

export default function WalkForward() {
  const theme = useTheme();
  const { rows } = useCsvData(filePaths.walkForward);
  const summary = summarizeWalkForward(rows);
  const chartData = rows.map((row) => ({ month: `Fold ${row.fold}`, profit: Number(row.totalProfit || 0) }));

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}><KPICard title="Total Folds" value={formatNumber(summary.totalFolds, 0)} subtitle="Walk-forward windows" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KPICard title="Avg Fold Profit" value={formatCurrency(summary.averageFoldProfit)} subtitle="Mean validation P&L" type={summary.averageFoldProfit >= 0 ? 'profit' : 'loss'} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KPICard title="Best Fold" value={formatCurrency(summary.bestFold?.totalProfit)} subtitle={`Fold ${summary.bestFold?.fold || '-'}`} type="profit" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KPICard title="Worst Fold" value={formatCurrency(summary.worstFold?.totalProfit)} subtitle={`Fold ${summary.worstFold?.fold || '-'}`} type="loss" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KPICard title="Avg Win Rate" value={formatPercent(summary.averageWinRate)} subtitle="Across folds" type={summary.averageWinRate >= 50 ? 'profit' : 'warning'} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <ChartCard title="Fold-wise Profit" subtitle="Profit by validation fold">
            <MonthlyProfitChart data={chartData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Interpretation</Typography>
              <Stack spacing={1.4} sx={{ mt: 2 }}>
                <StatusBadge label={`Stability ${formatNumber(summary.stabilityScore, 1)}`} status={summary.stabilityScore > 55 ? 'success' : 'warning'} />
                <Typography color="text.secondary">Best performing fold: Fold {summary.bestFold?.fold || '-'}.</Typography>
                <Typography color="text.secondary">Weakest fold: Fold {summary.worstFold?.fold || '-'}.</Typography>
                <Typography color="text.secondary">
                  Large gap between best and worst folds can indicate changing market regime or overfitting risk.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer className="table-scroll" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Fold', 'Train End', 'Test End', 'Profit', 'Trades', 'Win Rate', 'Avg Profit', 'Targets', 'Stops'].map((cell) => <TableCell key={cell} sx={{ fontWeight: 850 }}>{cell}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.fold}</TableCell>
                <TableCell>{row.trainend || '-'}</TableCell>
                <TableCell>{row.testend || '-'}</TableCell>
                <TableCell className="mono" sx={{ color: Number(row.totalProfit) >= 0 ? 'success.main' : 'error.main', fontWeight: 850 }}>{formatCurrency(row.totalProfit)}</TableCell>
                <TableCell>{row.totalTrades}</TableCell>
                <TableCell>{formatPercent(row.winRate)}</TableCell>
                <TableCell>{formatCurrency(row.avgProfit)}</TableCell>
                <TableCell>{row.targetHits}</TableCell>
                <TableCell>{row.stopLosses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
