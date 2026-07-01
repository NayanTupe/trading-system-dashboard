import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ChartCard from '../components/ChartCard.jsx';
import KPICard from '../components/KPICard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TradeTable from '../components/TradeTable.jsx';
import { DrawdownChart, MonthlyProfitChart } from '../components/charts.jsx';
import { filePaths } from '../constants/filePaths.js';
import { useCsvData } from '../hooks/useCsvData.js';
import { calculateDrawdown, calculateTradeMetrics, dailyProfit, streaks } from '../utils/metricsCalculator.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

export default function Risk() {
  const { rows } = useCsvData(filePaths.fullBacktestTrades);
  const metrics = calculateTradeMetrics(rows);
  const daily = dailyProfit(rows);
  const streak = streaks(rows);
  const worstDay = daily.reduce((worst, day) => (day.profit < worst.profit ? day : worst), { profit: 0 });
  const bestDay = daily.reduce((best, day) => (day.profit > best.profit ? day : best), { profit: 0 });
  const brokerageImpact = metrics.grossProfit ? (metrics.totalBrokerage / Math.abs(metrics.grossProfit)) * 100 : 0;
  const riskStatus = Math.abs(metrics.maxDrawdown) > 10000 || streak.maxLoss > 8 ? 'error' : Math.abs(metrics.maxDrawdown) > 5000 ? 'warning' : 'success';

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><KPICard title="Max Drawdown" value={formatCurrency(metrics.maxDrawdown)} subtitle="Equity peak to trough" type="loss" /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Worst Day" value={formatCurrency(worstDay.profit)} subtitle={worstDay.date || '-'} type="loss" /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Best Day" value={formatCurrency(bestDay.profit)} subtitle={bestDay.date || '-'} type="profit" /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Brokerage Impact" value={`${formatNumber(brokerageImpact, 2)}%`} subtitle={formatCurrency(metrics.totalBrokerage)} type={brokerageImpact > 10 ? 'warning' : 'neutral'} /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Loss Streak" value={formatNumber(streak.maxLoss, 0)} subtitle="Max consecutive losses" type={streak.maxLoss > 8 ? 'loss' : 'warning'} /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Win Streak" value={formatNumber(streak.maxWin, 0)} subtitle="Max consecutive wins" type="profit" /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Risk Reward" value={formatNumber(metrics.riskRewardRatio, 2)} subtitle="Average win / loss" type={metrics.riskRewardRatio >= 1 ? 'profit' : 'loss'} /></Grid>
        <Grid item xs={12} md={3}><KPICard title="Profit Factor" value={formatNumber(metrics.profitFactor, 2)} subtitle="Gross wins / losses" type={metrics.profitFactor >= 1 ? 'profit' : 'loss'} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <ChartCard title="Drawdown Analysis" subtitle="Capital pressure during backtest">
            <DrawdownChart data={calculateDrawdown(rows)} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={5}>
          <ChartCard title="Daily P&L" subtitle="Grouped net profit by trading day">
            <MonthlyProfitChart data={daily.map((day) => ({ month: day.date, profit: day.profit }))} />
          </ChartCard>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <div>
              <Typography variant="h6">Risk Warnings</Typography>
              <Typography color="text.secondary">Uses drawdown, loss streak and brokerage impact from full backtest trades.</Typography>
            </div>
            <StatusBadge label={riskStatus === 'success' ? 'Moderate Risk' : riskStatus === 'warning' ? 'High Risk' : 'Critical'} status={riskStatus} />
          </Stack>
        </CardContent>
      </Card>

      <TradeTable rows={rows.slice(-12).reverse()} compact title="Recent Risk Events" />
    </Stack>
  );
}
