import { createTheme } from '@mui/material/styles';

export function buildTheme(mode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      background: {
        default: dark ? '#070B12' : '#F6F8FB',
        paper: dark ? '#111827' : '#FFFFFF',
      },
      primary: { main: dark ? '#38BDF8' : '#2563EB' },
      success: { main: dark ? '#22C55E' : '#16A34A' },
      error: { main: dark ? '#EF4444' : '#DC2626' },
      warning: { main: '#F59E0B' },
      text: {
        primary: dark ? '#E5E7EB' : '#111827',
        secondary: dark ? '#9CA3AF' : '#6B7280',
      },
      divider: dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif',
      h4: { fontWeight: 800, letterSpacing: 0 },
      h6: { fontWeight: 760, letterSpacing: 0 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
            boxShadow: dark ? '0 18px 50px rgba(0,0,0,0.28)' : '0 10px 24px rgba(15,23,42,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
    },
  });
}
