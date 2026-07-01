import { Chip } from '@mui/material';

export default function StatusBadge({ label, status = 'neutral', size = 'small' }) {
  const color = status === 'online' || status === 'profit' || status === 'success'
    ? 'success'
    : status === 'offline' || status === 'loss' || status === 'error'
      ? 'error'
      : status === 'warning'
        ? 'warning'
        : 'default';

  return <Chip size={size} label={label} color={color} variant="outlined" sx={{ fontWeight: 700 }} />;
}
