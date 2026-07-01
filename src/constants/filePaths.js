export const filePaths = {
  tradeLogs: 'trade_logs/trade_logs.csv',
  fullBacktestTrades: 'trade_logs/full_backtest_trades.csv',
  walkForward: 'data/processed/walk_forward_results.csv',
  optimization: 'data/processed/backtest_optimization_results.csv',
  modelPredictions: 'results/model_predictions.csv',
};

export const chartImages = {
  equity: new URL('../../results/performance_equity_curve.png', import.meta.url).href,
  monthly: new URL('../../results/monthly_profit_chart.png', import.meta.url).href,
  distribution: new URL('../../results/profit_distribution.png', import.meta.url).href,
  drawdown: new URL('../../results/drawdown_curve.png', import.meta.url).href,
};
