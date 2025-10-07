import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image analysis
});

export interface AnalysisResponse {
  success: boolean;
  analysis: string;
  filename: string;
  content_type: string;
}

export const analyzeImage = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Get API key and model from localStorage
  const apiKey = localStorage.getItem('gemini_api_key');
  const model = localStorage.getItem('gemini_model');
  
  if (apiKey) {
    formData.append('api_key', apiKey);
  }
  
  if (model) {
    formData.append('model', model);
  }

  try {
    const response = await api.post('/analyze-calories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data.detail || 'Analysis failed');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to the server. Please check your connection.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

export const checkHealth = async (): Promise<{ status: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};

export default api;
