import { useMemo } from 'react';
import { loadCsv } from '../utils/csvLoader.js';

export function useCsvData(path) {
  return useMemo(() => {
    const { rows, error } = loadCsv(path);
    return { rows, error, loading: false };
  }, [path]);
}
