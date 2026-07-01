import { AppBar, Box, Button, IconButton, MenuItem, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { pageTitles } from '../constants/routes.js';
import StatusBadge from './StatusBadge.jsx';

export default function Header({ apiOnline, mode, onToggleMode, onRefresh, lastUpdated, onMenu }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{ backdropFilter: 'blur(16px)', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 72 }}>
        <IconButton sx={{ display: { md: 'none' } }} onClick={onMenu}>☰</IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" noWrap>{title}</Typography>
          <Typography variant="caption" color="text.secondary">Institutional ML trading dashboard</Typography>
        </Box>
        <TextField
          select
          size="small"
          defaultValue="ALL"
          sx={{ minWidth: 132, display: { xs: 'none', sm: 'block' } }}
        >
          {['ALL', 'TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'ICICIBANK', 'NIFTY50', 'NIFTYBANK'].map((item) => (
            <MenuItem value={item} key={item}>{item}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <StatusBadge label={apiOnline ? 'Online' : 'Offline'} status={apiOnline ? 'online' : 'offline'} />
          <StatusBadge label={lastUpdated || 'No sync'} status="neutral" />
        </Stack>
        <Button variant="outlined" onClick={onRefresh}>Refresh</Button>
        <Button variant="contained" onClick={onToggleMode}>{mode === 'dark' ? 'Light' : 'Dark'}</Button>
      </Toolbar>
    </AppBar>
  );
}
