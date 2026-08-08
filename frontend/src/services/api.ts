export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://coastguard-sgwc.onrender.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
export const API_URL = `${API_BASE_URL}/api`;

export class ApiService {
  static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  static async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: any) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Reports
  static async getReports(filters: { status?: string; userId?: string } = {}) {
    console.log('ApiService.getReports called with filters:', filters);
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    
    const query = params.toString();
    const url = `/api/reports${query ? `?${query}` : ''}`;
    console.log('ApiService: Making request to:', url);
    
    try {
      const result = await this.request(url);
      console.log('ApiService.getReports result:', result);
      return result;
    } catch (error) {
      console.error('ApiService.getReports error:', error);
      throw error;
    }
  }

  static async createReport(reportData: any) {
    return this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  static async updateReport(id: string, updates: any) {
    return this.request(`/api/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Analytics
  static async getAnalytics(timeRange: string = '7d') {
    return this.request(`/api/analytics?timeRange=${timeRange}`);
  }

  // Health check
  static async healthCheck() {
    return this.request('/health');
  }
}
