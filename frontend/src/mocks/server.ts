import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { WSPResponse } from '../types/wsp';

// Mock data
const mockSolution: WSPResponse = {
  solutionFound: true,
  assignment: [0, 1, 0],
  solvingTimeMs: 42,
  solverUsed: 'SAT',
  message: 'Solution found',
  timestamp: new Date().toISOString()
};

// Define request handlers
const handlers = [
  http.post('/api/solve', () => {
    return HttpResponse.json(mockSolution);
  }),
  
  http.get('/api/constraints', () => {
    return HttpResponse.json([
      { id: 1, type: 'SEPARATION', steps: [0, 1] },
      { id: 2, type: 'BINDING', steps: [1, 2] }
    ]);
  })
];

// Set up the mock server for Node.js (Jest)
export const server = setupServer(...handlers);

// Export http for individual tests
export { http };
