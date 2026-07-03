import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_TRADING_API_URL || 'http://127.0.0.1:8000',
  timeout: 3500,
});

export async function checkHealth() {
  try {
    const response = await client.get('/health');
    return { online: true, data: response.data, error: null };
  } catch (error) {
    return { online: false, data: null, error: error.message };
  }
}

export async function getPrediction() {
  try {
    const response = await client.get('/predict');
    return { prediction: response.data, error: null };
  } catch (error) {
    return { prediction: null, error: error.message };
  }
}

export async function getPaperStatus() {
  try {
    const response = await client.get('/paper/status');
    return { status: response.data, error: null };
  } catch (error) {
    return { status: null, error: error.message };
  }
}

export async function getPaperComparison() {
  try {
    const response = await client.get('/paper/compare');
    return { comparison: response.data, error: null };
  } catch (error) {
    return { comparison: null, error: error.message };
  }
}

export async function getLiveReadinessAudit() {
  try {
    const response = await client.get('/validation/live-readiness-audit');
    return { audit: response.data, error: null };
  } catch (error) {
    return { audit: null, error: error.message };
  }
}

export async function runPaperTrading(maxRows = 5000) {
  try {
    const response = await client.post(`/paper/run?max_rows=${maxRows}`);
    return { result: response.data, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
}

export async function runCandidatePaperTrading(maxRows = 5000) {
  try {
    const response = await client.post(`/paper/run-candidate?max_rows=${maxRows}`);
    return { result: response.data, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
}
