import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const baseOptions = (theme) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      titleColor: theme.palette.text.primary,
      bodyColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
    },
  },
  scales: {
    x: { grid: { color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary, maxRotation: 0 } },
    y: { grid: { color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary } },
  },
});

export function EquityChart({ data, height = 280 }) {
  const theme = useTheme();
  return (
    <div style={{ height }}>
      <Line
        options={baseOptions(theme)}
        data={{
          labels: data.map((point, index) => point.x || index + 1),
          datasets: [{
            data: data.map((point) => point.y),
            borderColor: theme.palette.success.main,
            backgroundColor: 'rgba(34,197,94,0.12)',
            fill: true,
            tension: 0.32,
            pointRadius: 0,
          }],
        }}
      />
    </div>
  );
}

export function DrawdownChart({ data, height = 280 }) {
  const theme = useTheme();
  return (
    <div style={{ height }}>
      <Line
        options={baseOptions(theme)}
        data={{
          labels: data.map((point, index) => point.x || index + 1),
          datasets: [{
            data: data.map((point) => point.y),
            borderColor: theme.palette.error.main,
            backgroundColor: 'rgba(239,68,68,0.14)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          }],
        }}
      />
    </div>
  );
}

export function MonthlyProfitChart({ data, height = 280 }) {
  const theme = useTheme();
  return (
    <div style={{ height }}>
      <Bar
        options={baseOptions(theme)}
        data={{
          labels: data.map((point) => point.month),
          datasets: [{
            data: data.map((point) => point.profit),
            backgroundColor: data.map((point) => point.profit >= 0 ? theme.palette.success.main : theme.palette.error.main),
            borderRadius: 4,
          }],
        }}
      />
    </div>
  );
}

export function ProfitDistributionChart({ data, height = 280 }) {
  const theme = useTheme();
  return (
    <div style={{ height }}>
      <Bar
        options={baseOptions(theme)}
        data={{
          labels: data.map((point) => point.label),
          datasets: [{ data: data.map((point) => point.count), backgroundColor: theme.palette.primary.main, borderRadius: 4 }],
        }}
      />
    </div>
  );
}
