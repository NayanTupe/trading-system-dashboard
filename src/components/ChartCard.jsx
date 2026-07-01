import { Card, CardContent, Stack, Typography } from '@mui/material';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';

export default function ChartCard({ title, subtitle, actions, loading, error, empty, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <div>
            <Typography variant="h6">{title}</Typography>
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          </div>
          {actions}
        </Stack>
        {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} /> : empty ? <EmptyState title="No chart data" /> : children}
      </CardContent>
    </Card>
  );
}
