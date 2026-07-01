import { useEffect, useState } from 'react';
import { getPrediction } from '../utils/apiClient.js';

export function usePrediction(refreshKey = 0) {
  const [state, setState] = useState({ prediction: null, loading: true, error: null, checkedAt: null });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    getPrediction().then((result) => {
      if (!active) return;
      setState({
        prediction: result.prediction,
        loading: false,
        error: result.error,
        checkedAt: new Date(),
      });
    });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return state;
}
