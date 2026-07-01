import { Button, Grid, Stack } from '@mui/material';
import { useState } from 'react';
import ChartCard from '../components/ChartCard.jsx';
import { DrawdownChart, EquityChart, MonthlyProfitChart, ProfitDistributionChart } from '../components/charts.jsx';
import { chartImages, filePaths } from '../constants/filePaths.js';
import { useCsvData } from '../hooks/useCsvData.js';
import { calculateDrawdown, calculateEquityCurve, monthlyProfit, profitDistribution } from '../utils/metricsCalculator.js';

export default function Charts() {
  const { rows } = useCsvData(filePaths.fullBacktestTrades);
  const [mode, setMode] = useState('chart');
  const actions = <Button size="small" variant="outlined" onClick={() => setMode(mode === 'chart' ? 'image' : 'chart')}>{mode === 'chart' ? 'Show PNG' : 'Show Live Chart'}</Button>;

  const image = (src) => <img src={src} alt="" style={{ width: '100%', borderRadius: 8 }} />;

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <ChartCard title="Equity Curve" subtitle="Cumulative strategy P&L" actions={actions}>
            {mode === 'chart' ? <EquityChart data={calculateEquityCurve(rows)} /> : image(chartImages.equity)}
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartCard title="Monthly Profit" subtitle="Positive bars green, losses red" actions={actions}>
            {mode === 'chart' ? <MonthlyProfitChart data={monthlyProfit(rows)} /> : image(chartImages.monthly)}
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartCard title="Profit Distribution" subtitle="Net profit bucket frequency" actions={actions}>
            {mode === 'chart' ? <ProfitDistributionChart data={profitDistribution(rows)} /> : image(chartImages.distribution)}
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartCard title="Drawdown Curve" subtitle="Peak-to-trough equity risk" actions={actions}>
            {mode === 'chart' ? <DrawdownChart data={calculateDrawdown(rows)} /> : image(chartImages.drawdown)}
          </ChartCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
