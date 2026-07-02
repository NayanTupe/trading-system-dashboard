import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SignalCard from '../components/SignalCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiHealth } from '../hooks/useApiHealth.js';
import { usePrediction } from '../hooks/usePrediction.js';
import { getPaperStatus, runPaperTrading } from '../utils/apiClient.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

export default function LiveSignal() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [paperStatus, setPaperStatus] = useState(null);
  const [paperError, setPaperError] = useState(null);
  const [runningPaper, setRunningPaper] = useState(false);
  const health = useApiHealth(refreshKey);
  const prediction = usePrediction(refreshKey);

  useEffect(() => {
    getPaperStatus().then((response) => {
      setPaperStatus(response.status);
      setPaperError(response.error);
    });
  }, [refreshKey]);

  const handleRunPaper = async () => {
    setRunningPaper(true);
    const response = await runPaperTrading(5000);
    setRunningPaper(false);
    if (response.error) {
      setPaperError(response.error);
      return;
    }
    setPaperStatus({
      metrics: response.result.metrics,
      latest_signal: response.result.metrics.latest_signal,
    });
    setPaperError(null);
  };

  const metrics = paperStatus?.metrics || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={7}>
        <SignalCard prediction={prediction.prediction} error={prediction.error} onRefresh={() => setRefreshKey((key) => key + 1)} />
      </Grid>
      <Grid item xs={12} lg={5}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6">API Monitor</Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <StatusBadge label={health.online ? 'Health OK' : 'Health Failed'} status={health.online ? 'online' : 'offline'} />
              <Typography color="text.secondary">Base URL: {import.meta.env.VITE_TRADING_API_URL || 'http://127.0.0.1:8000'}</Typography>
              <Typography color="text.secondary">Endpoint flow: /health then /predict.</Typography>
              <Typography color="text.secondary">Start backend with FastAPI to enable live prediction cards.</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <div>
                <Typography variant="h6">Paper Trading Forward Test</Typography>
                <Typography color="text.secondary">No real orders. Uses latest feature stream to create paper signals, trades, metrics, and risk warnings.</Typography>
              </div>
              <Button variant="contained" onClick={handleRunPaper} disabled={runningPaper || !health.online}>
                {runningPaper ? 'Running...' : 'Run Paper Test'}
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={2}><StatusBadge label={metrics.status || (paperError ? 'Offline' : 'Ready')} status={paperError ? 'offline' : metrics.status === 'WARN' ? 'warning' : 'online'} /></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Trades</Typography><Typography fontWeight={900}>{formatNumber(metrics.total_trades || 0, 0)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Net Profit</Typography><Typography fontWeight={900}>{formatCurrency(metrics.net_profit || 0)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Win Rate</Typography><Typography fontWeight={900}>{formatNumber(metrics.win_rate || 0, 2)}%</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Profit Factor</Typography><Typography fontWeight={900}>{formatNumber(metrics.profit_factor || 0, 2)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Max DD</Typography><Typography fontWeight={900}>{formatCurrency(metrics.max_drawdown || 0)}</Typography></Grid>
            </Grid>
            {paperError && <Typography color="error" sx={{ mt: 2 }}>{paperError}</Typography>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
