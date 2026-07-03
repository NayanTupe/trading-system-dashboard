import { Button, Card, CardContent, Divider, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SignalCard from '../components/SignalCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiHealth } from '../hooks/useApiHealth.js';
import { usePrediction } from '../hooks/usePrediction.js';
import { getPaperComparison, getPaperStatus, runCandidatePaperTrading, runPaperTrading } from '../utils/apiClient.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

const warningLabels = {
  LOSS_STREAK_HIGH: 'Loss streak high',
  MAX_DRAWDOWN_LIMIT_HIT: 'Drawdown limit hit',
  MIN_LIVE_TRADES_NOT_MET: 'Need more paper trades',
  NET_PROFIT_NOT_POSITIVE: 'Net profit not positive',
  PROFIT_FACTOR_BELOW_LIVE_TARGET: 'Profit factor below 1.20',
  WIN_RATE_BELOW_LIVE_TARGET: 'Win rate below 60%',
};

function gateProgress(value, target) {
  if (!target) return 0;
  return Math.max(0, Math.min((Number(value || 0) / target) * 100, 100));
}

function GateRow({ label, value, target, suffix = '', inverse = false }) {
  const complete = inverse ? Number(value || 0) <= target : Number(value || 0) >= target;
  return (
    <Stack spacing={0.7}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography variant="body2" fontWeight={800}>{label}</Typography>
        <Typography className="mono" variant="body2" color={complete ? 'success.main' : 'warning.main'} fontWeight={900}>
          {formatNumber(value || 0, 2)}{suffix} / {formatNumber(target, 2)}{suffix}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={inverse ? (complete ? 100 : Math.max(0, 100 - gateProgress(value, target))) : gateProgress(value, target)}
        color={complete ? 'success' : 'warning'}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Stack>
  );
}

function ModelMetric({ label, value }) {
  return (
    <Stack spacing={0.3}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography className="mono" fontWeight={900}>{value}</Typography>
    </Stack>
  );
}

function ModelComparisonColumn({ title, metrics }) {
  const warnings = metrics?.warnings || [];
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography fontWeight={900}>{title}</Typography>
        <StatusBadge
          label={metrics?.live_ready ? 'Live Ready' : metrics?.status || 'No Data'}
          status={metrics?.live_ready ? 'success' : metrics?.status === 'WARN' ? 'warning' : 'neutral'}
        />
      </Stack>
      <Grid container spacing={1.5}>
        <Grid item xs={6}><ModelMetric label="Trades" value={formatNumber(metrics?.total_trades || 0, 0)} /></Grid>
        <Grid item xs={6}><ModelMetric label="Net P&L" value={formatCurrency(metrics?.net_profit || 0)} /></Grid>
        <Grid item xs={6}><ModelMetric label="Win Rate" value={`${formatNumber(metrics?.win_rate || 0, 2)}%`} /></Grid>
        <Grid item xs={6}><ModelMetric label="Profit Factor" value={formatNumber(metrics?.profit_factor || 0, 3)} /></Grid>
      </Grid>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {warnings.length ? warnings.slice(0, 3).map((warning) => (
          <StatusBadge key={warning} label={warningLabels[warning] || warning} status="warning" />
        )) : <StatusBadge label="No warnings" status="success" />}
      </Stack>
    </Stack>
  );
}

export default function LiveSignal() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [paperStatus, setPaperStatus] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [paperError, setPaperError] = useState(null);
  const [runningPaper, setRunningPaper] = useState(false);
  const [runningCandidate, setRunningCandidate] = useState(false);
  const health = useApiHealth(refreshKey);
  const prediction = usePrediction(refreshKey);

  useEffect(() => {
    getPaperStatus().then((response) => {
      setPaperStatus(response.status);
      setPaperError(response.error);
    });
    getPaperComparison().then((response) => {
      setComparison(response.comparison);
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
    setRefreshKey((key) => key + 1);
  };

  const handleRunCandidate = async () => {
    setRunningCandidate(true);
    const response = await runCandidatePaperTrading(5000);
    setRunningCandidate(false);
    if (response.error) {
      setPaperError(response.error);
      return;
    }
    setPaperError(null);
    setRefreshKey((key) => key + 1);
  };

  const metrics = paperStatus?.metrics || {};
  const warnings = metrics.warnings || [];
  const settings = metrics.settings || {};

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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="contained" onClick={handleRunPaper} disabled={runningPaper || !health.online}>
                  {runningPaper ? 'Running...' : 'Run Production'}
                </Button>
                <Button variant="outlined" onClick={handleRunCandidate} disabled={runningCandidate || !health.online}>
                  {runningCandidate ? 'Running...' : 'Run Candidate'}
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={2}><StatusBadge label={metrics.status || (paperError ? 'Offline' : 'Ready')} status={paperError ? 'offline' : metrics.status === 'WARN' ? 'warning' : 'online'} /></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Trades</Typography><Typography fontWeight={900}>{formatNumber(metrics.total_trades || 0, 0)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Net Profit</Typography><Typography fontWeight={900}>{formatCurrency(metrics.net_profit || 0)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Win Rate</Typography><Typography fontWeight={900}>{formatNumber(metrics.win_rate || 0, 2)}%</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Profit Factor</Typography><Typography fontWeight={900}>{formatNumber(metrics.profit_factor || 0, 2)}</Typography></Grid>
              <Grid item xs={12} md={2}><Typography color="text.secondary">Max DD</Typography><Typography fontWeight={900}>{formatCurrency(metrics.max_drawdown || 0)}</Typography></Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={900}>Live-Readiness Gates</Typography>
                    <StatusBadge label={metrics.live_ready ? 'Approved' : 'Blocked'} status={metrics.live_ready ? 'success' : 'warning'} />
                  </Stack>
                  <GateRow label="Paper Trades" value={metrics.total_trades} target={settings.min_live_trades || 30} />
                  <GateRow label="Win Rate" value={metrics.win_rate} target={settings.min_live_win_rate || 60} suffix="%" />
                  <GateRow label="Profit Factor" value={metrics.profit_factor} target={settings.min_live_profit_factor || 1.2} />
                  <GateRow label="Max Drawdown" value={metrics.max_drawdown_pct} target={(settings.max_drawdown_pct || 0.10) * 100} suffix="%" inverse />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.2}>
                  <Typography fontWeight={900}>Why Not Live Ready?</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {warnings.length ? warnings.map((warning) => (
                      <StatusBadge key={warning} label={warningLabels[warning] || warning} status="warning" />
                    )) : <StatusBadge label="All gates passed" status="success" />}
                  </Stack>
                  <Typography color="text.secondary">
                    Current decision keeps real-money trading blocked until enough trades, win rate, profit factor, net P&L and risk limits all pass together.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            {paperError && <Typography color="error" sx={{ mt: 2 }}>{paperError}</Typography>}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <div>
                  <Typography variant="h6">Production vs Candidate Model</Typography>
                  <Typography color="text.secondary">Candidate stays research-only unless it passes every live-readiness gate.</Typography>
                </div>
                <StatusBadge
                  label={comparison?.decision?.recommended_model === 'candidate' ? 'Candidate can promote' : 'Keep production'}
                  status={comparison?.decision?.recommended_model === 'candidate' ? 'success' : 'warning'}
                />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ModelComparisonColumn title="Production" metrics={comparison?.production || metrics} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModelComparisonColumn title="Candidate" metrics={comparison?.candidate || {}} />
                </Grid>
              </Grid>
              {comparison?.decision?.reason && (
                <Typography color="text.secondary">{comparison.decision.reason}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
