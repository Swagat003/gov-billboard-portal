class AdminApiService {
  constructor() {
    this.baseUrl = '/api/admin';
  }

  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data
        });
        
        throw new Error(data.error || `HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      return data;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response status:', response.status);
      console.error('Response statusText:', response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      throw new Error('Failed to parse response');
    }
  }

  async getReports(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.status && params.status !== 'all') {
        searchParams.append('status', params.status);
      }
      if (params.search) {
        searchParams.append('search', params.search);
      }
      if (params.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params.limit) {
        searchParams.append('limit', params.limit.toString());
      }

      const response = await fetch(`${this.baseUrl}/reports?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReport(id) {
    try {
      const response = await fetch(`${this.baseUrl}/reports/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async updateReport(id, data) {
    try {
      const response = await fetch(`${this.baseUrl}/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id) {
    try {
      const response = await fetch(`${this.baseUrl}/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  async exportReports(params = {}) {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/reports/export?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting reports:', error);
      throw error;
    }
  }
}

const adminApiService = new AdminApiService();
export default adminApiService;
