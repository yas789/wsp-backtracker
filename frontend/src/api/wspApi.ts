import axios from 'axios';
import { WSPRequest, WSPResponse, Constraint } from '../types/wsp';

const API_BASE_URL = 'http://localhost:8080/api';

// Individual API functions
export const solveWSP = async (request: WSPRequest): Promise<WSPResponse> => {
  const response = await axios.post<WSPResponse>(`${API_BASE_URL}/wsp/solve`, request);
  return response.data;
};

export const getConstraints = async (): Promise<Constraint[]> => {
  const response = await axios.get<Constraint[]>(`${API_BASE_URL}/constraints`);
  return response.data;
};

// Legacy object export for backward compatibility
const wspApi = {
  solveWSP,
  getConstraints,
};

export { wspApi };
