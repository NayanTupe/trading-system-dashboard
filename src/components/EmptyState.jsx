import { Box, Button, Typography } from '@mui/material';

export default function EmptyState({ title = 'No data', description, action }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="h6" color="text.primary">{title}</Typography>
      {description && <Typography sx={{ mt: 1 }}>{description}</Typography>}
      {action && <Button sx={{ mt: 2 }} variant="outlined" onClick={action.onClick}>{action.label}</Button>}
    </Box>
  );
}
