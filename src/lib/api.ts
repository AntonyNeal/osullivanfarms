// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? '/api/v1' // Production: uses Azure Static Web Apps API
  : 'http://localhost:3001/api/v1'; // Development: local API server

// API client with error handling
export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },
};

// SheepSheet API endpoints
export const mobsApi = {
  getAllMobs: () => api.get('/mobs'),
  getMobById: (id: number) => api.get(`/mobs/${id}`),
  getMobHistory: (id: number) => api.get(`/mobs/${id}/history`),
  createMob: (data: any) => api.post('/mobs', data),
  updateMob: (id: number, data: any) => api.put(`/mobs/${id}`, data),
  getFarmStatistics: () => api.get('/farm/statistics'),
  recordBreedingEvent: (data: any) => api.post('/breeding-events', data),
};
