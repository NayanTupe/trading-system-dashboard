export const routes = [
  { path: '/overview', label: 'Overview', icon: 'OV' },
  { path: '/trades', label: 'Trade Logs', icon: 'TR' },
  { path: '/charts', label: 'Charts', icon: 'CH' },
  { path: '/walk-forward', label: 'Walk Forward', icon: 'WF' },
  { path: '/optimization', label: 'Optimization', icon: 'OP' },
  { path: '/live-signal', label: 'Live Signal', icon: 'LS' },
  { path: '/system-status', label: 'System Status', icon: 'SS' },
  { path: '/risk', label: 'Risk', icon: 'RK' },
];

export const pageTitles = Object.fromEntries(routes.map((route) => [route.path, route.label]));
