import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import { getSystemStatus } from '../utils/apiClient.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

function Metric({ label, value, tone = 'text.primary' }) {
  return (
    <Stack spacing={0.3}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography className="mono" fontWeight={900} color={tone}>{value}</Typography>
    </Stack>
  );
}

function LaneCard({ title, lane }) {
  const enabled = lane?.enabled !== false;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography fontWeight={900}>{title}</Typography>
            <StatusBadge
              label={lane?.execution_mode || 'Not configured'}
              status={enabled && lane?.execution_mode !== 'LIVE' ? 'warning' : enabled ? 'success' : 'neutral'}
            />
          </Stack>
          {title === 'Options Paper' && (
            <>
              <Metric label="Underlyings" value={(lane?.underlyings || []).join(', ') || '-'} />
              <Metric label="Paper trades required" value={formatNumber(lane?.min_paper_trades || 0, 0)} />
              <Metric label="Profit factor target" value={formatNumber(lane?.min_profit_factor || 0, 2)} />
            </>
          )}
          {title === 'Equity Intraday' && (
            <>
              <Metric label="Max trades/day" value={formatNumber(lane?.max_trades_per_day || 0, 0)} />
              <Metric label="Paper trades required" value={formatNumber(lane?.min_paper_trades || 0, 0)} />
              <Metric label="Win-rate target" value={`${formatNumber(lane?.min_win_rate_pct || 0, 0)}%`} />
            </>
          )}
          {title === 'Investment Plan' && (
            <>
              <Metric label="Monthly budget" value={formatCurrency(lane?.monthly_budget_inr || 0)} />
              <Metric label="Budget status" value={lane?.budget_status || '-'} />
              <Metric label="Minimum horizon" value={`${formatNumber(lane?.minimum_horizon_years || 0, 0)} years`} />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const response = await getSystemStatus();
    setStatus(response.systemStatus);
    setError(response.error);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const validation = status?.validation || {};
  const safety = status?.safety || {};
  const replay = validation.options_historical_replay || {};
  const optionsWalkForward = validation.options_model_walk_forward || {};
  const forward = validation.options_forward_evidence || {};
  const candidateForward = validation.options_candidate_forward || {};
  const quality = validation.options_chain_quality || {};
  const parity = validation.feature_parity || {};
  const readiness = validation.live_readiness || {};
  const accelerated = validation.accelerated || {};
  const preflight = validation.live_preflight || {};
  const alerts = validation.operator_alerts || {};
  const investmentPlan = validation.investment_plan || {};
  const paperAccount = status?.paper_account || {};
  const paperPnl = Number(paperAccount.realized_pnl || 0) + Number(paperAccount.unrealized_pnl || 0);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <div>
                <Typography variant="h5" fontWeight={900}>Complete Trading System Status</Typography>
                <Typography color="text.secondary">
                  Backend evidence for equity paper trading, options research, investment planning, and safety controls.
                </Typography>
              </div>
              <Button variant="contained" onClick={refresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Status'}
              </Button>
            </Stack>
            {error && <Typography color="error" sx={{ mt: 2 }}>Backend unavailable: {error}</Typography>}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6} md={3}>
                <Metric label="Execution Mode" value={status?.mode || '-'} tone="warning.main" />
              </Grid>
              <Grid item xs={6} md={3}>
                <Metric label="Order API" value={status?.order_api_enabled ? 'ENABLED' : 'DISABLED'} tone={status?.order_api_enabled ? 'error.main' : 'success.main'} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Metric label="Live Readiness" value={readiness?.decision || '-'} tone={readiness?.approved ? 'success.main' : 'warning.main'} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Metric label="Fast Validation" value={accelerated?.status || '-'} tone={accelerated?.status === 'PASS' ? 'success.main' : 'warning.main'} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}><LaneCard title="Options Paper" lane={status?.lanes?.options_trading} /></Grid>
      <Grid item xs={12} md={4}><LaneCard title="Equity Intraday" lane={status?.lanes?.equity_intraday} /></Grid>
      <Grid item xs={12} md={4}><LaneCard title="Investment Plan" lane={status?.lanes?.long_term_investment} /></Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <div>
                  <Typography variant="h6">₹1 Lakh Options Paper Account</Typography>
                  <Typography color="text.secondary">Conservative bid/ask marks and costs; no broker orders.</Typography>
                </div>
                <StatusBadge
                  label={paperAccount.open_positions ? 'PAPER POSITION OPEN' : 'NO OPEN POSITION'}
                  status={paperAccount.open_positions ? 'warning' : 'neutral'}
                />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}><Metric label="Starting balance" value={formatCurrency(paperAccount.starting_balance || 0)} /></Grid>
                <Grid item xs={6} md={2}><Metric label="Current equity" value={formatCurrency(paperAccount.current_equity || 0)} tone={paperPnl >= 0 ? 'success.main' : 'error.main'} /></Grid>
                <Grid item xs={6} md={2}><Metric label="Realized P&L" value={formatCurrency(paperAccount.realized_pnl || 0)} tone={paperAccount.realized_pnl >= 0 ? 'success.main' : 'error.main'} /></Grid>
                <Grid item xs={6} md={2}><Metric label="Unrealized P&L" value={formatCurrency(paperAccount.unrealized_pnl || 0)} tone={paperAccount.unrealized_pnl >= 0 ? 'success.main' : 'error.main'} /></Grid>
                <Grid item xs={6} md={2}><Metric label="Closed trades" value={formatNumber(paperAccount.closed_trades || 0, 0)} /></Grid>
                <Grid item xs={6} md={2}><Metric label="Max risk/trade" value={formatCurrency(paperAccount.max_risk_per_trade || 0)} /></Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">
                Last action: {paperAccount.last_action?.type || 'Unavailable'} · {paperAccount.last_action?.reason || 'No blocker'} · Updated {paperAccount.generated_at || '-'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography variant="h6">Safety Controller</Typography>
                <StatusBadge
                  label={safety.feed_connected ? 'Feed connected' : safety.disconnect_reason || 'Feed disconnected'}
                  status={safety.feed_connected ? 'success' : 'warning'}
                />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6}><Metric label="Kill switch" value={safety.kill_switch_active ? 'ACTIVE' : 'Inactive'} tone={safety.kill_switch_active ? 'error.main' : 'success.main'} /></Grid>
                <Grid item xs={6}><Metric label="Schema" value={safety.schema_valid ? 'PASS' : 'FAIL'} tone={safety.schema_valid ? 'success.main' : 'error.main'} /></Grid>
                <Grid item xs={6}><Metric label="Equity parity" value={safety.parity_by_lane?.equity_intraday ? 'PASS' : 'FAIL'} /></Grid>
                <Grid item xs={6}><Metric label="Options parity" value={safety.parity_by_lane?.options_trading ? 'PASS' : 'FAIL'} /></Grid>
                <Grid item xs={6}><Metric label="Daily paper P&L" value={formatCurrency(safety.daily_pnl || 0)} /></Grid>
                <Grid item xs={6}><Metric label="Loss streak" value={formatNumber(safety.consecutive_losses || 0, 0)} /></Grid>
                <Grid item xs={12}><Metric label="Loss-streak reset" value={safety.loss_streak_reset_required ? 'REVIEW REQUIRED' : 'Clear'} tone={safety.loss_streak_reset_required ? 'error.main' : 'success.main'} /></Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">State updated: {safety.updated_at || '-'}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={7}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <div>
                  <Typography variant="h6">Options Historical Replay</Typography>
                  <Typography color="text.secondary">{formatNumber(replay.rows_loaded || 0, 0)} rows · {formatNumber(replay.signals || 0, 0)} signals · research only</Typography>
                </div>
                <StatusBadge label={replay.live_approval ? 'Live approved' : 'Rejected for live'} status={replay.live_approval ? 'success' : 'warning'} />
              </Stack>
              <Grid container spacing={2}>
                {(replay.horizons || []).map((horizon) => (
                  <Grid item xs={12} sm={4} key={horizon.horizon_minutes}>
                    <Stack spacing={0.7} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography fontWeight={900}>{horizon.horizon_minutes}-minute</Typography>
                      <Metric label="Direction accuracy" value={`${formatNumber(horizon.direction_accuracy_pct || 0, 2)}%`} />
                      <Metric label="Net option return" value={`${formatNumber(horizon.average_net_option_return_pct || 0, 2)}%`} tone={horizon.average_net_option_return_pct > 0 ? 'success.main' : 'error.main'} />
                      <Metric label="Observations" value={formatNumber(horizon.observations || 0, 0)} />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <div>
                  <Typography fontWeight={900}>Feature Walk-Forward Candidate</Typography>
                  <Typography color="text.secondary">
                    {formatNumber(optionsWalkForward.trading_days || 0, 0)} days · {formatNumber(optionsWalkForward.summary?.total_test_trades || 0, 0)} unseen trades · {formatNumber(optionsWalkForward.summary?.fold_count || 0, 0)} folds
                  </Typography>
                </div>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <StatusBadge label={`${formatNumber(optionsWalkForward.summary?.weighted_direction_accuracy_pct || 0, 2)}% accuracy`} status={optionsWalkForward.summary?.weighted_direction_accuracy_pct >= 55 ? 'success' : 'warning'} />
                  <StatusBadge label={`${formatNumber(optionsWalkForward.summary?.weighted_average_net_option_return_pct || 0, 3)}% avg net`} status={optionsWalkForward.summary?.weighted_average_net_option_return_pct > 0 ? 'success' : 'warning'} />
                  <StatusBadge label={`PF ${formatNumber(optionsWalkForward.summary?.aggregate_profit_factor || 0, 2)}`} status={optionsWalkForward.summary?.aggregate_profit_factor >= 1.3 ? 'success' : 'warning'} />
                  <StatusBadge label={`25bps PF ${formatNumber(optionsWalkForward.summary?.cost_scenarios?.['25bps']?.aggregate_profit_factor || 0, 2)}`} status={optionsWalkForward.summary?.cost_scenarios?.['25bps']?.aggregate_profit_factor >= 1.2 ? 'success' : 'warning'} />
                  <StatusBadge label={optionsWalkForward.historical_candidate_passed ? 'Historical gates pass' : 'Historical gates fail'} status={optionsWalkForward.historical_candidate_passed ? 'success' : 'warning'} />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Options Data & Forward Evidence</Typography>
                <StatusBadge label={quality.status || 'Unavailable'} status={quality.passed ? 'success' : 'warning'} />
              </Stack>
              {(quality.underlyings || []).map((item) => (
                <Stack key={item.underlying} direction="row" justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={800}>{item.underlying}</Typography>
                  <Typography className="mono">{item.near_money_contracts} contracts · IV {formatNumber(item.iv_coverage * 100, 1)}%</Typography>
                </Stack>
              ))}
              <StatusBadge label={forward.status || 'Forward evidence unavailable'} status={forward.mature_observations > 0 ? 'success' : 'warning'} />
              <Typography color="text.secondary">Mature forward observations: {formatNumber(forward.mature_observations || 0, 0)}</Typography>
              <Stack spacing={1} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={900}>Walk-Forward Candidate Progress</Typography>
                  <StatusBadge
                    label={candidateForward.forward_candidate_passed ? 'Forward gates pass' : candidateForward.status || 'Not started'}
                    status={candidateForward.forward_candidate_passed ? 'success' : 'warning'}
                  />
                </Stack>
                <Metric label="Journaled signals" value={formatNumber(candidateForward.progress?.journaled_signals || 0, 0)} />
                <Metric label="Eligible 15m evidence" value={`${formatNumber(candidateForward.progress?.eligible_15m_observations || 0, 0)} / ${formatNumber(candidateForward.progress?.required_eligible_15m_observations || 60, 0)}`} />
                {(candidateForward.candidates || []).map((candidate) => (
                  <Typography key={candidate.underlying} variant="caption" color="text.secondary">
                    {candidate.underlying}: {candidate.live_features?.available_snapshots || 0}/{candidate.live_features?.required_snapshots || 16} contiguous snapshots
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Live Feature Parity</Typography>
                <StatusBadge label={parity.status || 'Unavailable'} status={parity.status === 'PASS' ? 'success' : 'warning'} />
              </Stack>
              {(parity.comparisons || []).map((item) => (
                <Stack key={item.symbol} direction="row" justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={800}>{item.symbol}</Typography>
                  <StatusBadge label={item.status} status={item.status === 'PASS' ? 'success' : 'neutral'} />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <div>
                  <Typography variant="h6">Final Live Preflight</Typography>
                  <Typography color="text.secondary">Offline engineering is separated from evidence that requires a live market or user approval.</Typography>
                </div>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <StatusBadge label={preflight.status || 'Not generated'} status={preflight.approved ? 'success' : 'warning'} />
                  {preflight.only_live_or_user_inputs_remaining && <StatusBadge label="Only live/user inputs remain" status="success" />}
                </Stack>
              </Stack>
              <Grid container spacing={1.5}>
                {(preflight.checks || []).map((check) => (
                  <Grid item xs={12} md={6} key={check.name}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <div>
                        <Typography fontWeight={850}>{check.name.replaceAll('_', ' ')}</Typography>
                        <Typography variant="caption" color="text.secondary">{check.detail}</Typography>
                      </div>
                      <StatusBadge label={check.passed ? 'PASS' : check.category} status={check.passed ? 'success' : 'warning'} />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Operator Alerts</Typography>
                <StatusBadge label={alerts.status || 'Not generated'} status={alerts.status === 'CLEAR' ? 'success' : 'warning'} />
              </Stack>
              <Metric label="Unacknowledged" value={formatNumber(alerts.unacknowledged_alerts || 0, 0)} />
              {(alerts.recent || []).slice(0, 4).map((alert) => (
                <Stack key={alert.id} spacing={0.3} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography fontWeight={850}>{alert.severity}: {alert.message}</Typography>
                  <Typography variant="caption" color="text.secondary">{alert.created_at}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Investment Readiness</Typography>
                <StatusBadge label={investmentPlan.status || 'Not generated'} status={investmentPlan.status === 'PLAN_READY_FOR_USER_REVIEW' ? 'success' : 'warning'} />
              </Stack>
              <Typography color="text.secondary">Plan-only lane. Automatic orders, leverage, and derivatives remain disabled.</Typography>
              {(investmentPlan.missing_inputs || []).map((item) => (
                <Typography key={item} variant="body2">• {item.replaceAll('_', ' ')}</Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
