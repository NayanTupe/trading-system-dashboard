import { Box, Divider, Drawer, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes.js';
import StatusBadge from './StatusBadge.jsx';

export const drawerWidth = 248;

function SidebarContent({ apiOnline, lastUpdated }) {
  return (
    <Stack sx={{ height: '100%', p: 2 }} spacing={2}>
      <Box>
        <Typography variant="h6">QuantDesk</Typography>
        <Typography variant="caption" color="text.secondary">ML Trading Analytics</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {routes.map((route) => (
          <NavLink key={route.path} to={route.path}>
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                <Box sx={{ width: 32, fontWeight: 900, fontSize: 12 }}>{route.icon}</Box>
                <ListItemText primary={route.label} primaryTypographyProps={{ fontWeight: 750 }} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
      <Divider />
      <Stack spacing={1}>
        <StatusBadge label={apiOnline ? 'API Online' : 'API Offline'} status={apiOnline ? 'online' : 'offline'} />
        <Typography variant="caption" color="text.secondary">Last updated: {lastUpdated || '-'}</Typography>
      </Stack>
    </Stack>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose, apiOnline, lastUpdated }) {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' },
        }}
      >
        <SidebarContent apiOnline={apiOnline} lastUpdated={lastUpdated} />
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        <SidebarContent apiOnline={apiOnline} lastUpdated={lastUpdated} />
      </Drawer>
    </>
  );
}
