import { useEffect, useState } from 'react';
import { checkHealth } from '../utils/apiClient.js';

export function useApiHealth(refreshKey = 0) {
  const [state, setState] = useState({ online: false, loading: true, error: null, checkedAt: null });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    checkHealth().then((result) => {
      if (!active) return;
      setState({ online: result.online, loading: false, error: result.error, checkedAt: new Date() });
    });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return state;
}
