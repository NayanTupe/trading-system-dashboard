import { Alert, Button, Stack } from '@mui/material';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <Stack spacing={2}>
      <Alert severity="error">{title}{message ? `: ${message}` : ''}</Alert>
      {onRetry && <Button variant="outlined" onClick={onRetry}>Retry</Button>}
    </Stack>
  );
}
