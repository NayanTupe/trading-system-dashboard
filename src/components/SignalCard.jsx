import { Button, Card, CardContent, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import { formatDate, formatNumber, getSignalColor } from '../utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';

export default function SignalCard({ prediction, error, onRefresh }) {
  const theme = useTheme();
  const signal = prediction?.signal || 'NO TRADE';
  const confidence = Number(prediction?.confidence || 0);
  const color = getSignalColor(signal, theme);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <StatusBadge label={error ? 'API Offline' : 'Live Prediction'} status={error ? 'offline' : 'online'} />
            <Button variant="outlined" onClick={onRefresh}>Refresh</Button>
          </Stack>
          <div>
            <Typography variant="body2" color="text.secondary">Current Signal</Typography>
            <Typography variant="h3" sx={{ color, fontWeight: 900, letterSpacing: 0 }}>{signal}</Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={Math.min(confidence * 100, 100)}
            sx={{ height: 10, borderRadius: 1, bgcolor: 'divider', '& .MuiLinearProgress-bar': { bgcolor: color } }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <div>
              <Typography variant="caption" color="text.secondary">Stock</Typography>
              <Typography fontWeight={800}>{prediction?.stock || '-'}</Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">Close</Typography>
              <Typography className="mono" fontWeight={800}>{prediction?.close ?? '-'}</Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">Confidence</Typography>
              <Typography className="mono" fontWeight={800}>{formatNumber(confidence * 100, 2)}%</Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography className="mono" fontWeight={800}>{formatDate(prediction?.date)}</Typography>
            </div>
          </Stack>
          {error && <Typography color="error">API not reachable. Start FastAPI with trading_api.py to enable live predictions.</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
