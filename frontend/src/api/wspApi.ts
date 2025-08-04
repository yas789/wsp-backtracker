import axios from 'axios';
import { WSPRequest, WSPResponse } from '../types/wsp';

const API_BASE_URL = 'http://localhost:8080/api';

const wspApi = {
  solveWSP: async (request: WSPRequest): Promise<WSPResponse> => {
    const response = await axios.post<WSPResponse>(`${API_BASE_URL}/wsp/solve`, request);
    return response.data;
  },
};

export { wspApi };
