import { Box } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar, { drawerWidth } from '../components/Sidebar.jsx';
import { useApiHealth } from '../hooks/useApiHealth.js';

export default function DashboardLayout({ mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const health = useApiHealth(refreshKey);
  const lastUpdated = health.checkedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box className={mode === 'dark' ? 'terminal-bg' : ''} sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        apiOnline={health.online}
        lastUpdated={lastUpdated}
      />
      <Box sx={{ flex: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
        <Header
          apiOnline={health.online}
          mode={mode}
          onToggleMode={onToggleMode}
          onRefresh={() => setRefreshKey((key) => key + 1)}
          lastUpdated={lastUpdated}
          onMenu={() => setMobileOpen(true)}
        />
        <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
