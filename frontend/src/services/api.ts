import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

// Extend the existing ImportMeta interface to include our env variables
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

// Extend the existing ImportMeta interface
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  } as AxiosRequestHeaders,
  timeout: 10000, // 10 seconds
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        // Redirect to login or show unauthorized message
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    // Return a rejected promise with the error
    return Promise.reject(error);
  }
);

// Matches backend's WSPRequest.Constraint class
export interface Constraint {
  step1: number;
  step2: number;
}

// Matches backend's WSPRequest class
export interface WSPRequest {
  numSteps: number;
  numUsers: number;
  authorized: number[][];
  mustSameConstraints: Constraint[];      // For BOD (Binding of Duty)
  mustDifferentConstraints: Constraint[]; // For SOD (Separation of Duty)
  solverType: 'SAT' | 'CSP' | 'BACKTRACKING' | 'PBT';
}

// Matches backend's WSPResponse class
export interface WSPResponse {
  solutionFound: boolean;
  assignment: number[];
  solvingTimeMs: number;
  solverUsed: string;
  message: string;
}

export const wspApi = {
  async solveWSP(request: WSPRequest): Promise<WSPResponse> {
    const response = await apiClient.post<WSPResponse>('/solve', request);
    return response.data;
  },

  async getSupportedSolvers(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/solvers');
    return response.data;
  },

  async checkHealth(): Promise<string> {
    const response = await apiClient.get<string>('/health');
    return response.data;
  },

  // Add more API methods as needed
};

// Export the API client as both default and named export
export default apiClient;
