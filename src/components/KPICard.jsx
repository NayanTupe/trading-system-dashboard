import { Card, CardContent, Stack, Tooltip, Typography, useTheme } from '@mui/material';

export default function KPICard({ title, value, subtitle, icon, type = 'neutral', tooltip, trend }) {
  const theme = useTheme();
  const color = type === 'profit'
    ? theme.palette.success.main
    : type === 'loss'
      ? theme.palette.error.main
      : type === 'warning'
        ? theme.palette.warning.main
        : theme.palette.primary.main;

  const content = (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography>
          <Typography sx={{ color, fontWeight: 900, fontSize: 13 }}>{icon || '•'}</Typography>
        </Stack>
        <Typography className="mono" variant="h5" sx={{ mt: 1, color, fontWeight: 850 }}>
          {value}
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          {trend && <Typography variant="caption" sx={{ color, fontWeight: 800 }}>{trend}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
}
