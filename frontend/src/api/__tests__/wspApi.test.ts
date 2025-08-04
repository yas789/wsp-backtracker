import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { solveWSP, getConstraints } from '../wspApi';

describe('wspApi', () => {
  it('sends correct request and returns solution', async () => {
    const request = {
      numSteps: 3,
      numUsers: 2,
      authorized: [[true, true], [true, true], [true, true]],
      mustSameConstraints: [],
      mustDifferentConstraints: [[0, 1]],
      solverType: 'SAT' as const
    };

    const response = await solveWSP(request);
    
    expect(response).toEqual({
      solutionFound: true,
      assignment: [0, 1, 0],
      solvingTimeMs: 42,
      solverUsed: 'SAT',
      message: 'Solution found'
    });
  });

  it('handles API errors', async () => {
    server.use(
      http.post('/api/solve', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const request = {
      numSteps: 3,
      numUsers: 2,
      authorized: [[true, true], [true, true], [true, true]],
      mustSameConstraints: [],
      mustDifferentConstraints: [[0, 1]],
      solverType: 'SAT' as const
    };

    await expect(solveWSP(request)).rejects.toThrow('Request failed with status code 500');
  });

  it('fetches constraints', async () => {
    const constraints = await getConstraints();
    
    expect(constraints).toEqual([
      { id: 1, type: 'SEPARATION', steps: [0, 1] },
      { id: 2, type: 'BINDING', steps: [1, 2] }
    ]);
  });
});
