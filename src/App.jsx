import { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout.jsx';
import Overview from './pages/Overview.jsx';
import TradeLogs from './pages/TradeLogs.jsx';
import Charts from './pages/Charts.jsx';
import WalkForward from './pages/WalkForward.jsx';
import Optimization from './pages/Optimization.jsx';
import LiveSignal from './pages/LiveSignal.jsx';
import Risk from './pages/Risk.jsx';
import { buildTheme } from './theme/theme.js';

export default function App() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<DashboardLayout mode={mode} onToggleMode={toggleMode} />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/trades" element={<TradeLogs />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/walk-forward" element={<WalkForward />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/live-signal" element={<LiveSignal />} />
          <Route path="/risk" element={<Risk />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
