import axios from 'axios';
import { getConstraints, solveWSP } from '../wspApi';
import { WSPRequest } from '../../types/wsp';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const request: WSPRequest = {
  numSteps: 2,
  numUsers: 2,
  authorized: [[1, 1], [1, 1]],
  mustSameConstraints: [],
  mustDifferentConstraints: [{ step1: 0, step2: 1 }],
  solverType: 'SAT',
};

describe('wspApi', () => {
  it('posts the request and returns the solution', async () => {
    const solution = {
      solutionFound: true,
      assignment: [0, 1],
      solvingTimeMs: 42,
      solverUsed: 'SAT',
      message: 'Solution found',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: solution });

    await expect(solveWSP(request)).resolves.toEqual(solution);
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/solve', request);
  });

  it('propagates API errors', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Request failed with status code 500'));

    await expect(solveWSP(request)).rejects.toThrow('Request failed with status code 500');
  });

  it('fetches constraints', async () => {
    const constraints = [{ type: 'SEPARATION', steps: [0, 1] }];
    mockedAxios.get.mockResolvedValueOnce({ data: constraints });

    await expect(getConstraints()).resolves.toEqual(constraints);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/constraints');
  });
});
