import { render, screen, waitFor } from '../../test-utils';
import AlgorithmPage from '../AlgorithmPage';
import { solveWSP } from '../../api/wspApi';

jest.mock('../../api/wspApi');
const mockedSolve = solveWSP as jest.MockedFunction<typeof solveWSP>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const savedState = {
  config: { steps: 2, users: 2 },
  constraints: [],
  authMatrix: [[1, 1], [1, 1]],
  solutions: [],
};

const solveButton = () => screen.getByRole('button', { name: /solve/i });

describe('AlgorithmPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('wspAppState', JSON.stringify(savedState));
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('offers all four solvers', () => {
    render(<AlgorithmPage />);

    const options = Array.from(screen.getByRole('combobox').querySelectorAll('option'));
    expect(options.map((option) => option.getAttribute('value'))).toEqual([
      'CSP',
      'BACKTRACKING',
      'PBT',
      'SAT',
    ]);
  });

  it('sends the selected solver and shows the assignment', async () => {
    mockedSolve.mockResolvedValueOnce({
      solutionFound: true,
      assignment: [0, 1],
      solvingTimeMs: 42,
      solverUsed: 'PBT',
      message: 'Solution found',
      timestamp: '2025-01-01T00:00:00Z',
    });
    const { user } = render(<AlgorithmPage />);

    await user.selectOptions(screen.getByRole('combobox'), 'PBT');
    await user.click(solveButton());

    await waitFor(() => expect(mockedSolve).toHaveBeenCalledTimes(1));
    expect(mockedSolve.mock.calls[0][0]).toMatchObject({
      numSteps: 2,
      numUsers: 2,
      solverType: 'PBT',
    });
    expect((await screen.findAllByText(/PBT found a solution in 42ms/i)).length).toBeGreaterThan(0);
  });

  it('shows the backend message when no solution exists', async () => {
    mockedSolve.mockResolvedValueOnce({
      solutionFound: false,
      assignment: [],
      solvingTimeMs: 1,
      solverUsed: 'CSP',
      message: 'No valid assignment found that satisfies all constraints',
      timestamp: '2025-01-01T00:00:00Z',
    });
    const { user } = render(<AlgorithmPage />);

    await user.click(solveButton());

    expect(
      (await screen.findAllByText('No valid assignment found that satisfies all constraints')).length,
    ).toBeGreaterThan(0);
  });

  it('shows an error when the API call fails', async () => {
    mockedSolve.mockRejectedValueOnce(new Error('Request failed with status code 500'));
    const { user } = render(<AlgorithmPage />);

    await user.click(solveButton());

    expect(await screen.findByText('Request failed with status code 500')).toBeInTheDocument();
  });

  it('redirects to configuration when none exists', async () => {
    localStorage.clear();
    render(<AlgorithmPage />);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/config'));
  });
});
