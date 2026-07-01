import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import SignalCard from '../components/SignalCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiHealth } from '../hooks/useApiHealth.js';
import { usePrediction } from '../hooks/usePrediction.js';

export default function LiveSignal() {
  const [refreshKey, setRefreshKey] = useState(0);
  const health = useApiHealth(refreshKey);
  const prediction = usePrediction(refreshKey);

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
    </Grid>
  );
}
