# Trading System Dashboard

React/Vite dashboard for the paper-only trading research backend.

## Run locally

```bash
npm install
npm run dev
```

The dashboard runs at `http://127.0.0.1:5174` and uses
`http://127.0.0.1:8000` by default. Override the backend with
`VITE_TRADING_API_URL` when required.

## System Status

The **System Status** sidebar page reads `GET /system/status` and displays:

- Options paper, equity intraday paper, and long-term investment-plan lanes.
- ₹1 lakh options paper-account equity, realized/unrealized P&L, trade count,
  maximum risk per trade, open-position state, and latest action/block reason.
- Broker order-API and static-IP execution state.
- Kill switch, feed, schema, lane parity, daily paper P&L, and loss streak.
- Option-chain quality and genuine forward-evidence status.
- Historical options replay and time-ordered feature walk-forward results.
- Automated candidate snapshot warm-up, journal count, and eligible 15-minute
  forward-evidence progress toward the configured 60-observation gate.
- Historical options aggregate profit factor and 10/25/50 bps cost-stress evidence.
- Final preflight checklist with offline, historical, live-market, external-review,
  and user-input blockers.
- Local operator-alert summary and investment-plan readiness/missing inputs.
- Loss-streak cooldown and manual-reset requirement.
- Final live-readiness decision; broker orders remain disabled while blocked.

The backend payload is sanitized and does not expose credentials, access tokens,
or token-expiry details. A passing data check is not the same as live approval.

## Verify production build

```bash
npm run build
```
