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
