import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { filePaths } from '../constants/filePaths.js';
import ChartCard from '../components/ChartCard.jsx';
import KPICard from '../components/KPICard.jsx';
import SignalCard from '../components/SignalCard.jsx';
import TradeTable from '../components/TradeTable.jsx';
import { EquityChart, MonthlyProfitChart } from '../components/charts.jsx';
import { useCsvData } from '../hooks/useCsvData.js';
import { usePrediction } from '../hooks/usePrediction.js';
import { calculateEquityCurve, calculateTradeMetrics, monthlyProfit, stockWiseProfit } from '../utils/metricsCalculator.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters.js';

export default function Overview() {
  const { rows } = useCsvData(filePaths.fullBacktestTrades);
  const recent = useCsvData(filePaths.tradeLogs).rows;
  const prediction = usePrediction(0);
  const metrics = calculateTradeMetrics(rows);
  const stocks = stockWiseProfit(rows).slice(0, 6);

  const cards = [
    ['Total Trades', formatNumber(metrics.totalTrades, 0), 'Executed backtest trades', 'neutral'],
    ['Net Profit', formatCurrency(metrics.netProfit), 'Full backtest P&L', metrics.netProfit >= 0 ? 'profit' : 'loss'],
    ['Win Rate', formatPercent(metrics.winRate), 'Profitable trade ratio', metrics.winRate >= 50 ? 'profit' : 'warning'],
    ['Avg Profit', formatCurrency(metrics.averageProfit), 'Per trade expectancy', metrics.averageProfit >= 0 ? 'profit' : 'loss'],
    ['Best Trade', formatCurrency(metrics.bestTrade), 'Largest single win', 'profit'],
    ['Worst Trade', formatCurrency(metrics.worstTrade), 'Largest single loss', 'loss'],
    ['Final Equity', formatCurrency(metrics.finalEquity), 'Initial capital plus P&L', metrics.finalEquity >= 100000 ? 'profit' : 'loss'],
    ['Max Drawdown', formatCurrency(metrics.maxDrawdown), 'Peak to trough risk', metrics.maxDrawdown < 0 ? 'loss' : 'neutral'],
    ['Sharpe', formatNumber(metrics.sharpeRatio, 3), 'Return stability proxy', metrics.sharpeRatio > 0 ? 'profit' : 'loss'],
    ['Risk Reward', formatNumber(metrics.riskRewardRatio, 2), 'Average win / average loss', metrics.riskRewardRatio >= 1 ? 'profit' : 'warning'],
  ];

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {cards.map(([title, value, subtitle, type]) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={title}>
            <KPICard title={title} value={value} subtitle={subtitle} type={type} icon={title.slice(0, 2).toUpperCase()} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <ChartCard title="Equity Curve" subtitle="Cumulative net profit from full backtest">
            <EquityChart data={calculateEquityCurve(rows)} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <SignalCard prediction={prediction.prediction} error={prediction.error} onRefresh={() => window.location.reload()} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartCard title="Monthly Profit" subtitle="P&L grouped by month">
            <MonthlyProfitChart data={monthlyProfit(rows)} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Stock Performance</Typography>
              <Stack spacing={1.4}>
                {stocks.map((stock) => (
                  <Stack key={stock.stock} direction="row" justifyContent="space-between">
                    <Typography fontWeight={800}>{stock.stock}</Typography>
                    <Typography className="mono" color={stock.profit >= 0 ? 'success.main' : 'error.main'} fontWeight={900}>
                      {formatCurrency(stock.profit)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TradeTable rows={recent.slice(-10).reverse()} compact title="Recent Trade Logs" />
    </Stack>
  );
}
