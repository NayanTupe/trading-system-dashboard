import tradeLogs from '../../trade_logs/trade_logs.csv?raw';
import fullBacktestTrades from '../../trade_logs/full_backtest_trades.csv?raw';
import walkForward from '../../data/processed/walk_forward_results.csv?raw';
import optimization from '../../data/processed/backtest_optimization_results.csv?raw';
import modelPredictions from '../../results/model_predictions.csv?raw';
import { filePaths } from '../constants/filePaths.js';

export const rawCsvFiles = {
  [filePaths.tradeLogs]: tradeLogs,
  [filePaths.fullBacktestTrades]: fullBacktestTrades,
  [filePaths.walkForward]: walkForward,
  [filePaths.optimization]: optimization,
  [filePaths.modelPredictions]: modelPredictions,
};
